import { ParsedUrlQuery } from "querystring";
import { Question } from "src/models";
import { VOTE_CMD } from "..";

export interface GetQuestionRequestResponse {
  questions: Question[];
  total: number;
}

export interface GetPaginatedQuestionRequestQuery extends ParsedUrlQuery {
  page: string;
  pageSize: string;
}

export interface UpvoteQuestionRequestBody {
  command: VOTE_CMD;
}

export interface DownvoteQuestionRequestBody {
  command: VOTE_CMD;
}

export interface UpvoteDownvoteIncObject {
  upvotes: number;
  downvotes: number;
}
