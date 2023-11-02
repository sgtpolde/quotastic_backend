import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QuoteService } from './quote.service';
import { AuthGuard } from '../auth/auth.guard';
import { QuoteUpdateDto } from './models/quote-update.dto';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { Quote } from './models/quote.entity';
import { QuotePaginateResult } from 'src/common/quote-result.interface';

@Controller()
export class QuoteController {
  constructor(
    private quoteService: QuoteService,
    private authService: AuthService,
  ) {}

  @Get('/random-quote')
  async getRandomQuote() {
    return this.quoteService.getRandomQuoteForToday();
  }

  //Get number of quotes
  @Get('quotes/no/:id')
  async getQuoteNumber(@Param('id') id: number) {
    return this.quoteService.findNumberQuote(id);
  }

  //get all quotes from user sorted by DATE
  @UseGuards(AuthGuard)
  @Get('/quotes/recent/:id')
  async UserQuoteDate(
    @Param('id') id: number,
    @Query('page') page = 1,
    @Query('limit') limit = 9,
  ) {
    return this.quoteService.findAllUserSortedByDate(page, limit, id);
  }

  //get all quotes from user sorted by Likes
  @UseGuards(AuthGuard)
  @Get('/quotes/mostliked/:id')
  async UserQuoteLikes(
    @Param('id') id: number,
    @Query('page') page = 1,
    @Query('limit') limit = 9,
  ) {
    return this.quoteService.findAllUserSortedByUpvotes(page, limit, id);
  }

  // List users and quotes in a most upvoted to least liked quotes
  @Get('/quotes')
  async listQuotes(
    @Query('page') page = 1,
    @Query('limit') limit = 9,
  ): Promise<QuotePaginateResult> {
    return this.quoteService.findAllSortedByUpvotes(page, limit);
  }

  //Get most recent quotes
  @Get('/quotes/recent')
  async listRecentQuotes(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 9,
  ): Promise<QuotePaginateResult> {
    return this.quoteService.findAllSortedByDate(page, limit);
  }

  //get specific quote
  @Get('quote/:id')
  async get(@Param('id') id: number) {
    return this.quoteService.findOne(id);
  }

  // post Quote + create vote
  @UseGuards(AuthGuard)
  @Post('/me/myquote')
  async create(@Body() quote: Quote, @Req() req: Request): Promise<Quote> {
    const userId = await this.authService.userId(req);
    //vstavimo podatke v bazo (quote)
    const postQuote = await this.quoteService.createQuote(quote, userId);
    //Prikažemo podatke
    return postQuote;
  }

  //upvote
  @UseGuards(AuthGuard)
  @Post('quotes/:id/upvote')
  async upvote(@Param('id') id: number, @Req() req: Request): Promise<string> {
    const userId = await this.authService.userId(req);
    const result = await this.quoteService.Vote(id, userId, 'upvote');
    if (result === 'Vote changed successfully') {
      return 'Upvote successful';
    }
    return result;
  }

  //downvote
  @UseGuards(AuthGuard)
  @Post('quotes/:id/downvote')
  async downvote(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<string> {
    const userId = await this.authService.userId(req);
    const result = await this.quoteService.Vote(id, userId, 'downvote');
    if (result === 'Vote changed successfully') {
      return 'Downvote successful';
    }
    return result;
  }

  //update quote
  @UseGuards(AuthGuard)
  @Put('/me/myquote/:id')
  async update(
    @Param('id') id: number,
    @Body() quoteData: QuoteUpdateDto,
    @Req() req: Request,
  ) {
    //Get currently logged in userId
    const userId = await this.authService.userId(req);
    //Get quoteId you want to delete
    const quote = await this.quoteService.findOne(id);
    //Check if its the same account that posted it
    if (userId !== quote.author.id) {
      return {
        message: 'Update not permitted: You are not the author of this quote',
      };
    } else {
      return this.quoteService.update(id, quoteData);
    }
  }

  //delete quote by id
  @UseGuards(AuthGuard)
  @Delete('/me/myquote/:id/')
  async deleteQuote(@Param('id') id: number, @Req() req: Request) {
    //Get currently logged in userId
    const userId = await this.authService.userId(req);
    //Get quoteId you want to delete
    const quote = await this.quoteService.findOne(id);
    //console.log(quote);
    //Check if its the same account that posted it
    if (userId !== quote.author.id) {
      return {
        message: 'Delete not permitted: You are not the author of this quote',
      };
    } else {
      return await this.quoteService.deleteQuote(id);
    }
  }

  //get karma for user
  @UseGuards(AuthGuard)
  @Get('/me/karma')
  async userKarma(@Req() req: Request) {
    const userId = await this.authService.userId(req);
    return this.quoteService.getUserKarma(userId);
  }
}
