import { ParsedUrlQuery } from "querystring";
import { Question } from "src/models";

export interface GetQuestionRequestResponse {
  questions: Question[];
  total: number;
}

export interface GetPaginatedQuestionRequestQuery extends ParsedUrlQuery {
  page: string;
  pageSize: string;
}
