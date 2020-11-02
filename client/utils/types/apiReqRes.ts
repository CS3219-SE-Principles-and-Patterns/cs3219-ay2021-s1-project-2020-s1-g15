import { Util, Question, VoteStatus } from "utils/index";

export type SearchForm = {
  level: string;
  subject: string;
  searchText: string;
};
export type GetPaginatedQuestionsReq = SearchForm & {
  page: number;
  pageSize: number;
};

export type GetPaginatedQuestionRes = {
  questions: Question[];
  total: number;
};

export type CreateQuestionReq = {
  title: string;
  markdown: string;
  level: string;
  subject: string;
};

export type EditQuestionReq = CreateQuestionReq;

export type GetAnswersOfQuestionReq = {
  questionId: string;
};

export type CheckAnswerVoteStatusRes = {
  [answerId: string]: VoteStatus;
};

export type CreateAnswerReq = {
  questionId: string;
  markdown: string;
};

export type EditAnswerReq = Pick<CreateAnswerReq, "markdown">;

export type ApiErrorRes = {
  status: string;
  message: string;
};

export type RegisterUserReq = {
  username: string;
  email: string;
  password: string;
};

export type GetSingleUserReq =
  | {
      // get by user ID
      id: string;
      username?: never;
    }
  | {
      // get by username
      username: string;
      id?: never;
    };

export type GetSingleUserRes = Util & {
  email: string;
  username: string;
  answerIds: string[];
  questionIds: string[];
};
