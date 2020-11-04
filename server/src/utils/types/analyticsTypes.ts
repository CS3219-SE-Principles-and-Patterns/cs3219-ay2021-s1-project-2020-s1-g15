import { ObjectId } from "mongodb";

export type AnalyticsResponse = {
  totalNumQuestions?: number;
  totalNumAnswers?: number;
  ratioQuestionsToAnswer?: number;
  totalNumUpvotes?: number;
  totalNumDownvotes?: number;
  ratioUpvotesToDownvotes?: number;
  topVotedAnswer?: ObjectId | null;
  topVotedQuestion?: ObjectId | null;
};
