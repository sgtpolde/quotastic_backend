import { QuoteService } from './quote.service';
import { QuoteController } from './quote.controller';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from './models/quote.entity';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from '../auth/auth.module';
import { Vote } from '../vote/models/vote.entity';
import { User } from '../user/models/user.entity';
import { UserModule } from '../user/user.module';
import { UserVote } from '../vote/models/user-vote.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quote, Vote, User, UserVote]),
    CommonModule,
    forwardRef(() => AuthModule),
    UserModule,
  
  ],
  controllers: [QuoteController],
  providers: [QuoteService],
  exports: [QuoteService],
})
export class QuoteModule {}
