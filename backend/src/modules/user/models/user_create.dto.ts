import { IsEmail, IsNotEmpty } from 'class-validator';

export class userCreateDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;
  
  image: string;

  @IsEmail()
  email: string;
}
