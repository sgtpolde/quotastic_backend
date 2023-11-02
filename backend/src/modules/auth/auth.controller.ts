import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './models/register.dto';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt/dist';
import { Response, Request } from 'express';
import { Get, Req, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from './auth.guard';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { AuthService } from './auth.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
  //Constructor
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  //Register Controller (/signup)
  @Post('register')
  async register(@Body() body: RegisterDto) {
    //Check if passwords match
    if (body.password !== body.password_confirm) {
      throw new BadRequestException('Passwords do not match!');
    }
    // Hash password
    const hashed = await bcrypt.hash(body.password, 12);
    //Register user
    return this.userService.create({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      image: body.image,
      password: hashed,
    });
  }

  //Login Controller
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    //Get user email
    const user = await this.userService.findOne({ where: { email } });
    //If user does not exist, throw error
    if (!user) {
      throw new NotFoundException('user not found');
    }
    //If passwords don't match, throw error
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials (password)');
    }
    //JwtToken for user id
    const jwtToken = await this.jwtService.signAsync({ id: user.id });
    response.cookie('jwt', jwtToken, { httpOnly: true });

    return user;
  }

  //Get logged in user (/me)
  @UseGuards(AuthGuard)
  @Get('me')
  async user(@Req() request: Request) {
    const id = await this.authService.userId(request);
    //Return user data by jwtToken (Search by userId)
    return this.userService.findOne({ where: { id } });
  }

  //Logout
  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'success (Logged out)',
    };
  }
}
