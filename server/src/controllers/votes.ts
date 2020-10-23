import { ObjectId, FilterQuery } from "mongodb";

import { Vote } from "../models";
import { getVotesCollection } from "../services/database";
import {
  VoteType,
  toValidObjectId,
  VoteCommand,
  GetQuestionVoteStatusResponse,
  VoteIncrementObject,
  ApiError,
  HttpStatusCode,
  ApiErrorMessage,
} from "../utils";

async function handleQuestionVote(
  userId: string | ObjectId,
  questionId: string | ObjectId,
  voteCommand: VoteCommand | undefined,
  voteType: VoteType.DOWNVOTE | VoteType.UPVOTE
): Promise<VoteIncrementObject> {
  const userObjectId: ObjectId = toValidObjectId(userId);
  const questionObjectId: ObjectId = toValidObjectId(questionId);

  if (voteCommand === undefined) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Vote.MISSING_VOTE_COMMAND
    );
  }

  if (
    voteCommand !== VoteCommand.INSERT &&
    voteCommand !== VoteCommand.REMOVE
  ) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Vote.INVALID_VOTE_COMMAND
    );
  }

  return voteCommand === VoteCommand.INSERT
    ? handleInsertQuestionVote(userObjectId, questionObjectId, voteType)
    : handleRemoveQuestionVote(userObjectId, questionObjectId, voteType);
}

async function getQuestionVoteStatus(
  userId: string | ObjectId,
  questionId: string | ObjectId
): Promise<GetQuestionVoteStatusResponse> {
  const vote: Vote | null = await getQuestionVoteByUser(userId, questionId);
  const status: GetQuestionVoteStatusResponse = {
    isUpvote: false,
    isDownvote: false,
  };

  if (vote === null) {
    return status;
  }

  if (vote.type === VoteType.UPVOTE) {
    status.isUpvote = true;
  } else {
    status.isDownvote = true;
  }

  return status;
}

// -----------------------------------------------------------------------------
// Helper functions
// -----------------------------------------------------------------------------

async function getQuestionVoteByUser(
  userId: string | ObjectId,
  questionId: string | ObjectId
): Promise<Vote | null> {
  const userObjectId: ObjectId = toValidObjectId(userId);
  const questionObjectId: ObjectId = toValidObjectId(questionId);

  return getVotesCollection().findOne({
    userId: userObjectId,
    questionId: questionObjectId,
  });
}

async function upsertQuestionVoteByUser(
  userObjectId: ObjectId,
  questionObjectId: ObjectId,
  voteType: VoteType
): Promise<Vote | undefined> {
  // a user can only have a single vote on a question,
  // filter by userId and questionId should be unique:
  const filter: FilterQuery<Vote> = {
    userId: userObjectId,
    questionId: questionObjectId,
  };
  const doc: Vote = {
    _id: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: userObjectId,
    questionId: questionObjectId,
    type: voteType,
  };
  const result = await getVotesCollection().findOneAndUpdate(
    filter,
    { $set: doc },
    {
      upsert: true,
      returnOriginal: true,
    }
  );

  const oldVote: Vote | undefined = result.value;

  return oldVote;
}

async function removeQuestionVoteByUser(
  userObjectId: ObjectId,
  questionObjectId: ObjectId
): Promise<Vote | undefined> {
  const result = await getVotesCollection().findOneAndDelete({
    userId: userObjectId,
    questionId: questionObjectId,
  });

  const deletedVote: Vote | undefined = result.value;

  return deletedVote;
}

async function handleInsertQuestionVote(
  userObjectId: ObjectId,
  questionObjectId: ObjectId,
  voteType: VoteType.UPVOTE | VoteType.DOWNVOTE
): Promise<VoteIncrementObject> {
  const previousVote: Vote | undefined = await upsertQuestionVoteByUser(
    userObjectId,
    questionObjectId,
    voteType
  );

  const isUpvote: boolean = voteType === VoteType.UPVOTE;
  const isDownvote: boolean = voteType === VoteType.DOWNVOTE;
  const isNewVote: boolean = previousVote === undefined;
  const isSwapVote: boolean = previousVote?.type !== voteType;

  const shouldIncrementUpvote: boolean = isUpvote && (isNewVote || isSwapVote);
  const shouldDecrementUpvote: boolean = isDownvote && isSwapVote;
  const shouldIncrementDownvote: boolean =
    isDownvote && (isNewVote || isSwapVote);
  const shouldDecrementDownvote: boolean = isUpvote && isSwapVote;

  return {
    upvotes: shouldIncrementUpvote ? 1 : shouldDecrementUpvote ? -1 : 0,
    downvotes: shouldIncrementDownvote ? 1 : shouldDecrementDownvote ? -1 : 0,
  };
}

async function handleRemoveQuestionVote(
  userObjectId: ObjectId,
  questionObjectId: ObjectId,
  voteType: VoteType.UPVOTE | VoteType.DOWNVOTE
): Promise<VoteIncrementObject> {
  const deletedVote: Vote | undefined = await removeQuestionVoteByUser(
    userObjectId,
    questionObjectId
  );

  const isUpvote: boolean = voteType === VoteType.UPVOTE;
  const isDownvote: boolean = voteType === VoteType.DOWNVOTE;
  const isExistingVote: boolean = deletedVote !== undefined;

  const shouldDecrementUpvote: boolean = isUpvote && isExistingVote;
  const shouldDecrementDownvote: boolean = isDownvote && isExistingVote;

  return {
    upvotes: shouldDecrementUpvote ? -1 : 0,
    downvotes: shouldDecrementDownvote ? -1 : 0,
  };
}

export { handleQuestionVote, getQuestionVoteStatus };
