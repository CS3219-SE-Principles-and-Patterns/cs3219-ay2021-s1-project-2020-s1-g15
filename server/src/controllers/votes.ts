import { ObjectId } from "mongodb";
import { Vote } from "../models";
import { getVotesCollection } from "../services/database";
import {
  VoteType,
  toValidObjectId,
  VoteCommand,
  GetVoteStatusResponse,
  VoteIncrementObject,
  ApiError,
  HttpStatusCode,
  ApiErrorMessage,
} from "../utils";

async function handleQuestionVote(
  userId: string | ObjectId,
  questionId: string | ObjectId,
  voteCommand: VoteCommand | undefined,
  type: VoteType
): Promise<VoteIncrementObject> {
  const userObjectId: ObjectId = toValidObjectId(userId);
  const questionObjectId: ObjectId = toValidObjectId(questionId);

  if (voteCommand === undefined) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Vote.INVALID_VOTE_COMMAND
    );
  }

  const voteIncrementObject: VoteIncrementObject = { upvotes: 0, downvotes: 0 };
  const currentVote: Vote | null = await getQuestionVoteByUser(
    userObjectId,
    questionObjectId
  );

  // if vote is not persent and then we insert
  if (!currentVote && voteCommand === VoteCommand.INSERT) {
    const doc: Vote = {
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: userObjectId,
      questionId: questionObjectId,
      type: type,
    };
    await getVotesCollection().insertOne(doc);
    if (type == VoteType.UPVOTE) {
      voteIncrementObject.upvotes = 1;
    } else {
      voteIncrementObject.downvotes = 1;
    }
    return voteIncrementObject;
  }

  // if vote present and type is different swap
  if (currentVote?.type != type && voteCommand == VoteCommand.INSERT) {
    await getVotesCollection().deleteOne({
      userId: userObjectId,
      questionId: questionObjectId,
    });
    const doc: Vote = {
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: userObjectId,
      questionId: questionObjectId,
      type,
    };
    await getVotesCollection().insertOne(doc);
    if (type == VoteType.UPVOTE) {
      // if we swap in upvote, then is upvote increase, downvote decrease
      voteIncrementObject.downvotes = -1;
      voteIncrementObject.upvotes = 1;
    } else {
      // if we swap in downvote mode, then is upvote decrease,  downvote increase
      voteIncrementObject.downvotes = 1;
      voteIncrementObject.upvotes = -1;
    }
    return voteIncrementObject;
  } else if (currentVote?.type == type && voteCommand == VoteCommand.REMOVE) {
    await getVotesCollection().deleteOne({
      userId: userObjectId,
      questionId: questionObjectId,
    });
    if (type == VoteType.UPVOTE) {
      voteIncrementObject.upvotes = -1;
    } else {
      voteIncrementObject.downvotes = -1;
    }
    return voteIncrementObject;
  }
  // if vote already present and type is correct
  // if vote not present and type is remove
  // we dont increment or decrement
  return voteIncrementObject;
}

async function getVoteStatus(
  userId: string | ObjectId,
  questionId: string | ObjectId
): Promise<GetVoteStatusResponse> {
  const vote: Vote | null = await getQuestionVoteByUser(userId, questionId);
  const status: GetVoteStatusResponse = { isUpvote: false, isDownvote: false };

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

export { handleQuestionVote, getVoteStatus };
