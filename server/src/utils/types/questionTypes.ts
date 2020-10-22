import { Question } from "src/models";
import { VOTE_CMD, Level, Subject } from "src/utils";

// API REQUEST RESPONSE //

export type GetPaginatedQuestionsRequest = {
  page?: string | undefined;
  pageSize?: string | undefined;
};

export type GetPaginatedQuestionsResponse = {
  questions: Question[];
  total: number;
};

export type CreateQuestionRequest = {
  title?: string | undefined;
  markdown?: string | undefined;
  level?: Level | undefined;
  subject?: Subject | undefined;
};

export type UpdateQuestionRequest = CreateQuestionRequest;

export type UpvoteQuestionRequest = {
  command: VOTE_CMD;
};

export type DownvoteQuestionRequest = {
  command: VOTE_CMD;
};

// UTILS //

export type UpvoteDownvoteIncObject = {
  upvotes: number;
  downvotes: number;
};
