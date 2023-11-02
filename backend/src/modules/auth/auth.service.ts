import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt/dist';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async userId(request: Request): Promise<number> {
    //Get cookie = jwt token
    const cookie = request.cookies['jwt'];
    //Verify jwt token
    const data = await this.jwtService.verifyAsync(cookie);
    //Return user data by jwtToken (Search by userId)
    return data['id'];
  }
}
