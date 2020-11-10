import { Question, Answer } from "src/models";
import { GetSingleQuestionResponse } from "./questionTypes";

export type AnalyticsResponse = {
  totalNumQuestions?: number;
  totalNumAnswers?: number;
  ratioQuestionsToAnswer?: number;
  totalNumUpvotes?: number;
  totalNumDownvotes?: number;
  ratioUpvotesToDownvotes?: number;
  topVotedAnswer?: Answer | null;
  topVotedQuestion?: Question | null;
  recentlyVotedQuestions: GetSingleQuestionResponse[];
  // recentlyVotedAnswers: Answer[];
};
