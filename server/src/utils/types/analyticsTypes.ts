import { Question, Answer } from "src/models";

export type AnalyticsResponse = {
  totalNumQuestions?: number;
  totalNumAnswers?: number;
  ratioQuestionsToAnswer?: number;
  totalNumUpvotes?: number;
  totalNumDownvotes?: number;
  ratioUpvotesToDownvotes?: number;
  topVotedAnswer?: Answer | null;
  topVotedQuestion?: Question | null;
  recentlyVotedQuestions: Question[];
  recentlyVotedAnswers: Answer[];
};
