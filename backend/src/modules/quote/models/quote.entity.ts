import { User } from 'src/modules/user/models/user.entity';
import { Vote } from 'src/modules/vote/models/vote.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('quotes')
export class Quote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  date_time: Date;

  @Column({ default: 0 })
  karma: number;

  //1 quote is on a specific vote
  @OneToOne(() => Vote, (vote) => vote.quote)
  vote: Vote;

  //wich user is author of the quote
  @ManyToOne(() => User, (user) => user.quotes)
  author: User;
}
