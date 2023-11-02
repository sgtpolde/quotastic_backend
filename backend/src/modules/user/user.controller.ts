import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import { userCreateDto } from './models/user_create.dto';
import { AuthGuard } from '../auth/auth.guard';
import {
  Param,
  Query,
  Req,
} from '@nestjs/common/decorators/http/route-params.decorator';
import {
  Delete,
  Put,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { userUpdateDto } from './models/user_update.dto';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  //Get all users
  @Get()
  async all(@Query('page') page = 1) {
    return this.userService.paginate(page);
  }

  //Create user save password to 123
  /*Not needed in app */
  @Post()
  async create(@Body() body: userCreateDto): Promise<User> {
    const password = await bcrypt.hash('1234', 12);
    return this.userService.create({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      image: body.image,
      password,
    });
  }

  //Get user by id
  @Get(':id')
  async get(@Param('id') id: number) {
    return this.userService.findOne({ where: { id } });
  }

  // update your information
  @Put('info')
  async updateInfo(@Req() request: Request, @Body() body: userUpdateDto) {
    const id = await this.authService.userId(request);
    await this.userService.update(id, body);
    return this.userService.findOne({ where: { id } });
  }

  //change your password
  @Put('me/update-password')
  async changePassword(
    @Req() request: Request,
    @Body('password') password: string,
    @Body('password_confirm') password_confirm: string,
  ) {
    if (password !== password_confirm) {
      throw new BadRequestException('Passwords do not match!');
    }
    const id = await this.authService.userId(request);
    const hashed = await bcrypt.hash(password, 12);
    await this.userService.update(id, { password: hashed });
    return this.userService.findOne({ where: { id } });
  }

  //update user

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: userUpdateDto,
    @Req() req: Request,
  ) {
    //Get currently logged in userId
    const userId = await this.authService.userId(req);
    //Get quoteId you want to delete
    const user = await this.userService.findOne({ where: { id } });
    //Check if its the same account that posted it
    if (userId !== user.id) {
      return {
        message: 'Update not permitted: You cant change Users',
      };
    } else {
      await this.userService.update(id, body);
      return this.userService.findOne({ where: { id } });
    }
  }

  //delete user
  @Delete(':id')
  async delete(@Param('id') id: number, @Req() req: Request) {
    //Get currently logged in userId
    const userId = await this.authService.userId(req);
    //Get userId you want to delete
    const user = await this.userService.findOne({ where: { id } });
    //Check if its the same account that posted it
    if (userId !== user.id) {
      return {
        message: 'Delete not permitted: You cant delete other Users',
      };
    } else {
      return this.userService.delete(id);
    }
  }
}
