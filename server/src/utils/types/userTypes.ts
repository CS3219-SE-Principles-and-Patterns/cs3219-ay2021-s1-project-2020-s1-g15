// API REQUEST RESPONSE //

import { ObjectId } from "mongodb";

export type ResisterUserRequest = {
  email?: string | undefined;
  password?: string | undefined;
};

export type analyticsResponse = {
  totalNumQuestions?: number | undefined;
  totalNumAnswers?: number | undefined;
  ratioQuestionsToAnswer?: number | undefined;
  totalNumUpvotes?: number | undefined;
  totalNumDownvotes?: number | undefined;
  ratioUpvotesToDownvotes?: number | undefined;
  topVotedAnswer?: ObjectId | undefined;
  topVotedQuestion?: ObjectId | undefined;
};
