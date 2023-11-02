import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule, CommonModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
