import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from '../auth/auth.module';
import { Vote } from './models/vote.entity';
import { QuoteModule } from '../quote/quote.module';
import { UserVote } from './models/user-vote.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vote, UserVote]),
    CommonModule,
    forwardRef(() => QuoteModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [VoteController],
  providers: [VoteService],
  exports: [VoteService],
})
export class VoteModule {}
