import { IsNotEmpty } from 'class-validator';

export class QuoteUpdateDto {
  content?: string;
  date_time?: Date;
}
