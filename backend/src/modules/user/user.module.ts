import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from '../auth/auth.module';
import { UploadController } from './upload.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CommonModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UploadController, UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
