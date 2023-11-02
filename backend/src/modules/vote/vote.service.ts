import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vote } from './models/vote.entity';
import { In, Repository } from 'typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { UserVote } from './models/user-vote.entity';
import { User } from '../user/models/user.entity';

@Injectable()
export class VoteService extends AbstractService {
  constructor(
    @InjectRepository(Vote) private readonly votesRepository: Repository<Vote>,
    @InjectRepository(UserVote)
    private readonly votesUsersRepository: Repository<UserVote>,
    @InjectRepository(Vote)
    private readonly usersRepository: Repository<User>,
  ) {
    super(votesRepository);
  }

  async findOne(condition): Promise<Vote> {
    return this.votesRepository.findOne({
      where: condition,
      relations: ['userVote'],
    });
  }

  async findUserVoteData(id: number): Promise<{}> {
    //get user info
    const data = await this.votesUsersRepository.find({
      relations: ['user', 'vote', 'vote.quote'],
      where: { user: { id: id } },
    });

    return { data };
  }

  async findUserVotes(id: number): Promise<{ quotes: any[] }> {
    //get user and vote
    const data = await this.votesUsersRepository.find({
      relations: ['user', 'vote'],
      where: { user: { id: id } },
    });
    //console.log(data);
    //get vote data
    const votesData = await Promise.all(
      data.map(async (data) => {
        const votes = await this.votesRepository.find({
          relations: ['quote', 'quote.author'],
          where: { id: data.vote.id },
        });
        return { votes, voteType: data.voteType }; // return both votes and voteType
      }),
    );

    const quotes = votesData.reduce((quotes, { votes, voteType }) => {
      const filteredVotes = voteType === 'upvote' ? votes : [];

      return [...quotes, ...filteredVotes.map((vote) => vote.quote)];
    }, []);

    return { quotes };
  }
}
