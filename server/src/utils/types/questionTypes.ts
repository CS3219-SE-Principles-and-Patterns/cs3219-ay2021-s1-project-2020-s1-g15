import { Question, User } from "src/models";
import { VoteCommand, Level, Subject } from "src/utils";

// API REQUEST RESPONSE //

export type GetSingleQuestionResponse = Omit<Question, "userId"> & {
  user: Pick<User, "_id" | "email" | "username">;
};

export type GetPaginatedQuestionsRequest = {
  page?: string | undefined;
  pageSize?: string | undefined;
  searchText?: string | undefined;
  level?: string | undefined;
  subject?: string | undefined;
  sortBy?: "recent" | "trending" | "controversial" | "top" | undefined;
};

export type GetPaginatedQuestionsResponse = {
  questions: GetSingleQuestionResponse[];
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
