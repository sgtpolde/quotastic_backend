import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quote } from './models/quote.entity';
import { Between, Repository } from 'typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { User } from '../user/models/user.entity';
import { Vote } from '../vote/models/vote.entity';
import { QuotePaginateResult } from 'src/common/quote-result.interface';
import { UserVote } from '../vote/models/user-vote.entity';

@Injectable()
export class QuoteService extends AbstractService {
  constructor(
    @InjectRepository(Quote)
    private readonly quoteRepository: Repository<Quote>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @InjectRepository(UserVote)
    private readonly userVoteRepository: Repository<UserVote>,
  ) {
    super(quoteRepository);
  }

  async getRandomQuoteForToday() {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

    const quotes = await this.quoteRepository.find({
      where: [{ date_time: Between(startOfToday, endOfToday) }],
      relations: ['author'],
    });
    if (quotes.length === 0) {
      return 'no quote for today';
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    //console.log(quotes);
    return quotes[randomIndex];
  }

  async findNumberQuote(userId: number): Promise<number> {
    return await this.repository.count({
      where: { author: { id: userId } },
    });
  }

  //most liked to least liked with user enity
  async findAllSortedByUpvotes(
    page: number,
    limit: number,
  ): Promise<QuotePaginateResult> {
    const [quotes, total] = await this.repository.findAndCount({
      order: { vote: { upvote: { direction: 'DESC' } } },
      relations: ['author', 'vote'],
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: quotes.map((quote) => {
        return {
          id: quote.id,
          content: quote.content,
          date_time: quote.date_time,
          karma: quote.karma,
          author_id: quote.author.id,
          author: {
            id: quote.author.id,
            first_name: quote.author.first_name,
            last_name: quote.author.last_name,
            email: quote.author.email,
            image: quote.author.image,
          },
          vote: quote.vote,
        };
      }),
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  //most liked to least liked with user enity
  async findAllUserSortedByUpvotes(
    page: number,
    limit: number,
    id: number,
  ): Promise<QuotePaginateResult> {
    const [quotes, total] = await this.repository.findAndCount({
      order: { vote: { upvote: { direction: 'DESC' } } },
      where: { author: { id: id } },
      relations: ['author', 'vote'],
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: quotes.map((quote) => {
        return {
          id: quote.id,
          content: quote.content,
          date_time: quote.date_time,
          karma: quote.karma,
          author_id: quote.author.id,
          author: {
            id: quote.author.id,
            first_name: quote.author.first_name,
            last_name: quote.author.last_name,
            email: quote.author.email,
            image: quote.author.image,
          },
          vote: quote.vote,
        };
      }),
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  //Most recent quotes
  async findAllSortedByDate(
    page: number,
    limit: number,
  ): Promise<QuotePaginateResult> {
    const [quotes, total] = await this.quoteRepository.findAndCount({
      relations: ['author', 'vote'],
      order: { date_time: { direction: 'DESC' } },
      take: limit,
      skip: (page - 1) * limit,
    });
    return {
      data: quotes.map((quote) => {
        return {
          id: quote.id,
          content: quote.content,
          date_time: quote.date_time,
          karma: quote.karma,
          author_id: quote.author.id,
          author: {
            id: quote.author.id,
            first_name: quote.author.first_name,
            last_name: quote.author.last_name,
            email: quote.author.email,
            image: quote.author.image,
          },
          vote: quote.vote,
        };
      }),
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  //get all quotes of user sorted by date
  async findAllUserSortedByDate(
    page: number,
    limit: number,
    id: number,
  ): Promise<QuotePaginateResult> {
    const [quotes, total] = await this.quoteRepository.findAndCount({
      relations: ['author', 'vote'],
      where: { author: { id: id } },
      order: { date_time: { direction: 'DESC' } },
      take: limit,
      skip: (page - 1) * limit,
    });
    return {
      data: quotes.map((quote) => {
        return {
          id: quote.id,
          content: quote.content,
          date_time: quote.date_time,
          karma: quote.karma,
          author_id: quote.author.id,
          author: {
            id: quote.author.id,
            first_name: quote.author.first_name,
            last_name: quote.author.last_name,
            email: quote.author.email,
            image: quote.author.image,
          },
          vote: quote.vote,
        };
      }),
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  //Get quote by id with vote, users relation
  async findOne(id: number): Promise<Quote> {
    return this.quoteRepository.findOne({
      where: { id },
      relations: ['vote', 'author'],
    });
  }

  //Create quote and create vote + connect
  async createQuote(quote: Quote, userId: number): Promise<Quote> {
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    // Assign user(author)
    quote.author = user;
    //Assign new Vote to quote.vote
    quote.vote = new Vote();

    // Save quote to database
    await this.voteRepository.save(quote.vote);
    await this.quoteRepository.save(quote);
    return quote;
  }

  //Vote
  async Vote(
    quoteId: number,
    userId: number,
    newVoteType: string,
  ): Promise<string> {
    // Check if quote exists
    const quote = await this.quoteRepository.findOne({
      where: { id: quoteId },
      relations: ['vote', 'author'],
    });
    if (!quote) {
      return 'Quote not found';
    }
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return 'User not found';
    }
    /*
    // Check if user is the author of the quote
    if (quote.author.id !== userId) {
      return 'You cannot vote on other peoples quotes';
    }
    */
    //get vote relation users
    const vote = await this.voteRepository.findOne({
      where: { quote: { id: quoteId } },
    });
    //Check if new vote type is valid
    if (newVoteType !== 'upvote' && newVoteType !== 'downvote') {
      return 'Invalid vote type';
    }
    // Check if user has already voted
    const userVote = await this.userVoteRepository.findOne({
      where: { user: { id: userId }, vote: { id: quote.vote.id } },
    });
    if (userVote) {
      //Check if user already downvoted and change the vote
      if (newVoteType === 'upvote' && userVote.voteType === 'downvote') {
        quote.vote.upvote++;
        quote.vote.downvote--;
        quote.karma++;
        userVote.voteType = newVoteType;
        await this.voteRepository.save(quote.vote);
        await this.quoteRepository.save(quote);
        await this.userVoteRepository.save(userVote);
        return 'Vote changed';
        //Check if user already upvoted and change the vote
      } else if (newVoteType === 'downvote' && userVote.voteType === 'upvote') {
        quote.vote.downvote++;
        quote.vote.upvote--;
        quote.karma--;
        userVote.voteType = newVoteType;
        await this.voteRepository.save(quote.vote);
        await this.quoteRepository.save(quote);
        await this.userVoteRepository.save(userVote);
        return 'Vote changed';
      } else {
        return 'User has already voted this way';
      }
    } else {
      //create new user vote
      const newUserVote = new UserVote();
      newUserVote.voteType = newVoteType;
      //check what to incriment
      if (newUserVote.voteType === 'upvote') {
        quote.vote.upvote++;
        quote.karma++;
      } else if (newUserVote.voteType === 'downvote') {
        quote.vote.downvote++;
        quote.karma--;
      } else {
        return 'error: type not correct';
      }
      newUserVote.user = user;
      newUserVote.vote = vote;
      await this.voteRepository.save(quote.vote);
      await this.quoteRepository.save(quote);
      await this.userVoteRepository.save(newUserVote);
      return 'vote succesfull';
    }
  }

  //Get total karma for user
  async getUserKarma(userId: number): Promise<number> {
    // Find all quotes that the user has posted
    const quotes = await this.quoteRepository.find({
      where: { author: { id: userId } },
      relations: ['vote'],
    });

    let totalKarmaVote = 0;

    let totalKarmaQuote = 0;

    // Iterate through the quotes and add up the karma
    for (const quote of quotes) {
      //2 options, use karma in quote
      totalKarmaQuote += quote.karma;
      //or we get it as a result of up - down from vote
      totalKarmaVote += quote.vote.upvote - quote.vote.downvote;
    }

    return totalKarmaVote;
  }

  //update quote
  async update(id: number, quoteData: Partial<Quote>): Promise<string> {
    const quote = await this.quoteRepository.findOne({
      where: { id },
      relations: ['vote', 'author'],
    });
    if (!quote) {
      return 'Quote not found';
    }
    this.quoteRepository.merge(quote, quoteData);
    await this.quoteRepository.save(quote);
    return 'Quote updated successfully';
  }

  //delete quote
  async deleteQuote(id: number): Promise<any> {
    const quote = await this.quoteRepository.findOne({
      where: { id },
      relations: ['vote', 'author'],
    });
    console.log(quote);
    if (!quote) {
      return 'Quote not found';
    }
    // console.log(quote.vote);
    await this.voteRepository.remove(quote.vote);
    await this.quoteRepository.remove(quote);
    return 'Quote deleted successfully';
  }
}
