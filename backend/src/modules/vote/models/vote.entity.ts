import { Quote } from 'src/modules/quote/models/quote.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserVote } from './user-vote.entity';

@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  upvote: number;

  @Column({ default: 0 })
  downvote: number;

  /*
  @ManyToMany(() => User, (user) => user.votes, { cascade: true })
  users: User[];
  */

  @OneToMany((type) => UserVote, (userVote) => userVote.vote)
  userVote: UserVote[];

  @OneToOne(() => Quote, (quote) => quote.vote)
  @JoinColumn()
  quote: Quote;
}
