import { Controller, Get, Param, Query } from '@nestjs/common';
import { VoteService } from './vote.service';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { QuoteService } from '../quote/quote.service';
import { Vote } from './models/vote.entity';
import { VoteUpdateDto } from './models/vote-update.dto';

@Controller()
export class VoteController {
  constructor(private readonly votesService: VoteService) {}

  //get all votes
  @Get('votes')
  async all(@Query('page') page = 1) {
    return this.votesService.paginate(page);
  }

  //Get liked posts of user
  @Get('votes/:id')
  async get(@Param('id') id: number) {
    return this.votesService.findUserVotes(id);
  }

  @Get('votes/me/:id')
  async getVote(@Param('id') id: number) {
    return this.votesService.findUserVoteData(id);
  }
}
