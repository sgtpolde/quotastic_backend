import { QuoteSortScoreDto } from "src/modules/quote/models/quote-sort-score.dto";
import { Quote } from "src/modules/quote/models/quote.entity";

export class QuotePaginateResult {
    data: QuoteSortScoreDto[];
    meta: { total: number; page: number; last_page: number };
}
