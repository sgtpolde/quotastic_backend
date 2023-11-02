import { Quote } from 'src/modules/quote/models/quote.entity';
import { UserVote } from 'src/modules/vote/models/user-vote.entity';
import { Vote } from 'src/modules/vote/models/vote.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  image: string;

  //Which user is author of the quote
  @OneToMany(() => Quote, (quote) => quote.author)
  quotes: Quote[];

  //Manual many to many relation
  @OneToMany(() => UserVote, (userVote) => userVote.user)
  userVote: UserVote[];
}
