import { TypeHelpOptions } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/modules/user/models/user.entity';
import { ManyToOne } from 'typeorm';

export class QuoteCreateDto {
  @IsNotEmpty()
  content: string;

}
