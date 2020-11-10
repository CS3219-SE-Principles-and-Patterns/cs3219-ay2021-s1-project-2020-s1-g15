import { Util, Question, User, VoteStatus } from "utils/index";
import { Answer } from "./models";

//-------------------
// MISC
//-------------------

export type SearchForm = {
  level: string;
  subject: string;
  searchText: string;
};

export type ApiErrorRes = {
  status: string;
  message: string;
};

//-------------------
// QUESTIONS
//-------------------

export type GetSingleQuestionRes = Omit<Question, "userId"> & {
  user: Pick<User, "_id" | "email" | "username">;
};

export type GetPaginatedQuestionsReq = SearchForm & {
  sortBy: "recent" | "trending" | "controversial" | "top";
  page: number;
  pageSize: number;
};

export type GetPaginatedQuestionRes = {
  questions: GetSingleQuestionRes[];
  total: number;
};

export type CreateQuestionReq = {
  title: string;
  markdown: string;
  level: string;
  subject: string;
};

export type EditQuestionReq = CreateQuestionReq;

//-------------------
// ANSWERS
//-------------------

export type GetSingleAnswerRes = Omit<Answer, "userId"> & {
  user: Pick<User, "_id" | "email" | "username">;
};

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

//-------------------
// USERS
//-------------------

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
export type AnalyticsResponse = {
  totalNumQuestions: number;
  totalNumAnswers: number;
  ratioQuestionsToAnswer: number;
  totalNumUpvotes: number;
  totalNumDownvotes: number;
  ratioUpvotesToDownvotes: number;
  topVotedAnswer: string | null;
  topVotedQuestion: string | null;
};

export type GetSingleUserRes = Util & {
  _id: string;
  email: string;
  username: string;
  answers: Answer[];
  questions: Question[];
  analytics: AnalyticsResponse;
};
