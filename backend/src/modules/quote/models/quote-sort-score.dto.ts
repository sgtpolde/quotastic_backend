export class QuoteSortScoreDto {
  id: number;
  content: string;
  date_time: Date;
  author_id: number;
  author: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    image: string;
  };
  vote: {
    id: number;
    upvote: number;
    downvote: number;
  };
}
