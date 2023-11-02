import { User } from 'src/modules/user/models/user.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Vote } from './vote.entity';

@Entity('user_vote')
export class UserVote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userVote)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Vote, (vote) => vote.userVote)
  @JoinColumn({ name: 'vote_id' })
  vote: Vote;

  @Column({ type: 'enum', enum: ['upvote', 'downvote'] })
  voteType: string;
}
