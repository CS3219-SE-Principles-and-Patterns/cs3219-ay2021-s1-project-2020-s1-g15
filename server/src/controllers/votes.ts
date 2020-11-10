import { ObjectId } from "mongodb";

import { Vote, AnswerVote } from "../models";
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
  GetAnswersVoteStatusResponse,
} from "../utils";

async function handleQuestionVote(
  userId: string | ObjectId,
  questionId: string | ObjectId,
  voteCommand: VoteCommand | null | undefined,
  voteType: VoteType.DOWNVOTE | VoteType.UPVOTE
): Promise<VoteIncrementObject> {
  const userObjectId: ObjectId = toValidObjectId(userId);
  const questionObjectId: ObjectId = toValidObjectId(questionId);
  const validVoteCommand: VoteCommand = verifyVoteCommand(voteCommand);

  if (validVoteCommand === VoteCommand.INSERT) {
    // upsert new vote and return previous vote if it exists:
    const previousVote: Vote | null = await upsertQuestionVote(
      userObjectId,
      questionObjectId,
      voteType
    );
    // calculate the VoteIncrementObject:
    return getInsertOpVoteIncrementObject(voteType, previousVote);
  } else {
    // delete vote and return deleted vote if it exists:
    const deletedVote: Vote | null = await deleteQuestionVote(
      userObjectId,
      questionObjectId,
      voteType
    );
    // calculate the VoteIncrementObject:
    return getRemoveOpVoteIncrementObject(voteType, deletedVote);
  }
}

async function handleAnswerVote(
  userId: string | ObjectId,
  answerId: string | ObjectId,
  voteCommand: VoteCommand | null | undefined,
  voteType: VoteType.DOWNVOTE | VoteType.UPVOTE
): Promise<VoteIncrementObject> {
  const userObjectId: ObjectId = toValidObjectId(userId);
  const answerObjectId: ObjectId = toValidObjectId(answerId);
  const validVoteCommand: VoteCommand = verifyVoteCommand(voteCommand);

  if (validVoteCommand === VoteCommand.INSERT) {
    // upsert new vote and return previous vote if it exists:
    const previousVote: Vote | null = await upsertAnswerVote(
      userObjectId,
      answerObjectId,
      voteType
    );
    // calculate the VoteIncrementObject:
    return getInsertOpVoteIncrementObject(voteType, previousVote);
  } else {
    // delete vote and return deleted vote if it exists:
    const deletedVote: Vote | null = await deleteAnswerVote(
      userObjectId,
      answerObjectId,
      voteType
    );
    // calculate the VoteIncrementObject:
    return getRemoveOpVoteIncrementObject(voteType, deletedVote);
  }
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

async function getAnswersVoteStatus(
  userId: string | ObjectId,
  answerIdQuery: undefined | string | string[]
): Promise<GetAnswersVoteStatusResponse> {
  if (answerIdQuery === undefined) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Answer.MISSING_ID
    );
  }

  const answerIds: string[] = Array.isArray(answerIdQuery)
    ? answerIdQuery
    : [answerIdQuery];
  const answerVotes: AnswerVote[] = await getAnswerVotesByUser(
    userId,
    answerIds
  );

  const status: GetAnswersVoteStatusResponse = {};
  // initialise status first:
  answerIds.forEach((id: string) => {
    status[id] = { isUpvote: false, isDownvote: false };
  });
  // populate the status from resulting query:
  answerVotes.forEach(({ answerId, type }: AnswerVote) =>
    type === VoteType.UPVOTE
      ? (status[answerId.toHexString()].isUpvote = true)
      : (status[answerId.toHexString()].isDownvote = true)
  );

  return status;
}

// -----------------------------------------------------------------------------
// Helper functions
// -----------------------------------------------------------------------------

function verifyVoteCommand(
  voteCommand: VoteCommand | undefined | null
): VoteCommand {
  if (voteCommand == null) {
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

  return voteCommand;
}

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

async function getAnswerVotesByUser(
  userId: string | ObjectId,
  answerIds: string[]
): Promise<AnswerVote[]> {
  const userObjectId: ObjectId = toValidObjectId(userId);
  const answerObjectIds: ObjectId[] = answerIds.map((id) =>
    toValidObjectId(id)
  );

  return getVotesCollection()
    .find({
      userId: userObjectId,
      answerId: {
        $in: answerObjectIds,
      },
    })
    .toArray() as Promise<AnswerVote[]>;
}

function getInsertOpVoteIncrementObject(
  voteType: VoteType,
  previousVote: Vote | null
): VoteIncrementObject {
  const isUpvote: boolean = voteType === VoteType.UPVOTE;
  const isDownvote: boolean = voteType === VoteType.DOWNVOTE;
  const isNewVote: boolean = previousVote === null;
  const isSwapVote: boolean =
    previousVote !== null && previousVote.type !== voteType;

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

function getRemoveOpVoteIncrementObject(
  voteType: VoteType,
  deletedVote: Vote | null
): VoteIncrementObject {
  const isUpvote: boolean = voteType === VoteType.UPVOTE;
  const isDownvote: boolean = voteType === VoteType.DOWNVOTE;
  const isExisitingVote: boolean = deletedVote !== null;

  const shouldDecrementUpvote: boolean = isExisitingVote && isUpvote;
  const shouldDecrementDownvote: boolean = isExisitingVote && isDownvote;

  return {
    upvotes: shouldDecrementUpvote ? -1 : 0,
    downvotes: shouldDecrementDownvote ? -1 : 0,
  };
}

async function upsertQuestionVote(
  userObjectId: ObjectId,
  questionObjectId: ObjectId,
  voteType: VoteType.UPVOTE | VoteType.DOWNVOTE
): Promise<Vote | null> {
  const doc: Partial<Vote> = {
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: userObjectId,
    questionId: questionObjectId,
    type: voteType,
  };
  const result = await getVotesCollection().findOneAndUpdate(
    // a user can only have a single vote on a question,
    // filter by userId and questionId should be unique:
    {
      userId: userObjectId,
      questionId: questionObjectId,
    },
    { $set: doc },
    {
      upsert: true,
      returnOriginal: true,
    }
  );

  const previousVote: Vote | null = result.value ?? null;

  return previousVote;
}

async function deleteQuestionVote(
  userObjectId: ObjectId,
  questionObjectId: ObjectId,
  voteType: VoteType
): Promise<Vote | null> {
  const result = await getVotesCollection().findOneAndDelete({
    userId: userObjectId,
    questionId: questionObjectId,
    type: voteType,
  });

  const deletedVote: Vote | null = result.value ?? null;

  return deletedVote;
}

async function upsertAnswerVote(
  userObjectId: ObjectId,
  answerObjectId: ObjectId,
  voteType: VoteType.UPVOTE | VoteType.DOWNVOTE
): Promise<Vote | null> {
  const doc: Partial<Vote> = {
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: userObjectId,
    answerId: answerObjectId,
    type: voteType,
  };
  const result = await getVotesCollection().findOneAndUpdate(
    // a user can only have a single vote on a question,
    // filter by userId and questionId should be unique:
    {
      userId: userObjectId,
      answerId: answerObjectId,
    },
    { $set: doc },
    {
      upsert: true,
      returnOriginal: true,
    }
  );

  const previousVote: Vote | null = result.value ?? null;

  return previousVote;
}

async function deleteAnswerVote(
  userObjectId: ObjectId,
  answerObjectId: ObjectId,
  voteType: VoteType
): Promise<Vote | null> {
  const result = await getVotesCollection().findOneAndDelete({
    userId: userObjectId,
    answerId: answerObjectId,
    type: voteType,
  });

  const deletedVote: Vote | null = result.value ?? null;

  return deletedVote;
}

async function getRecentQuestionVotes(userObjectId: ObjectId): Promise<Vote[]> {
  const result = await getVotesCollection()
    .find({ userId: userObjectId })
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray();
  return result;
}

export {
  handleQuestionVote,
  handleAnswerVote,
  getQuestionVoteStatus,
  getAnswersVoteStatus,
  getRecentQuestionVotes,
};
