import { IsInt, Min, Max, IsNotEmpty, IsBoolean } from 'class-validator';

export class VoteDto {
  @IsNotEmpty()
  @IsInt()
  quoteId: number;

  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsBoolean()
  isUpvote: boolean;
}

