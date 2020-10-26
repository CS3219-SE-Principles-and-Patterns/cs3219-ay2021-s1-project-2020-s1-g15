import { Question } from "src/models";
import { VoteCommand, Level, Subject } from "src/utils";

// API REQUEST RESPONSE //

export type GetPaginatedQuestionsRequest = {
  page?: string | undefined;
  pageSize?: string | undefined;
};

export type GetPaginatedSearchQuestionsRequest = {
  page?: string | undefined;
  pageSize?: string | undefined;
  search?: string;
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
  command?: VoteCommand.INSERT | VoteCommand.REMOVE;
};

export type DownvoteQuestionRequest = UpvoteQuestionRequest;
