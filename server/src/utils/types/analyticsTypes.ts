import { ObjectId } from "mongodb";
import { Answer, Question } from "../../models";

export type AnalyticsResponse = {
  totalNumQuestions?: number;
  totalNumAnswers?: number;
  ratioQuestionsToAnswer?: number;
  totalNumUpvotes?: number;
  totalNumDownvotes?: number;
  ratioUpvotesToDownvotes?: number;
  topVotedAnswer?: ObjectId | null;
  topVotedQuestion?: ObjectId | null;
  recentlyVotedQuestions: Question[];
  // recentlyVotedAnswers: Answer[];
};
