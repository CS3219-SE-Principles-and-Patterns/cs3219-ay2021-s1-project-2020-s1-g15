import { ObjectId } from "mongodb";
import { Vote } from "../models";
import { getVotesCollection } from "../services/database";
import {
  VoteType,
  toValidObjectId,
  VOTE_CMD,
  GetVoteStatusResponse,
  UpvoteDownvoteIncObject,
} from "../utils";

async function handleQuestionVote(
  userId: string | ObjectId,
  questionId: string | ObjectId,
  command: VOTE_CMD,
  type: VoteType
): Promise<UpvoteDownvoteIncObject> {
  const userObjectId: ObjectId = toValidObjectId(userId);
  const questionObjectId: ObjectId = toValidObjectId(questionId);

  const incObject: UpvoteDownvoteIncObject = { upvotes: 0, downvotes: 0 };
  const currentVote: Vote | null = await getQuestionVoteByUser(
    userObjectId,
    questionObjectId
  );

  // if vote is not persent and then we insert
  if (!currentVote && command === VOTE_CMD.insert) {
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
      incObject.upvotes = 1;
    } else {
      incObject.downvotes = 1;
    }
    return incObject;
  }

  // if vote present and type is different swap
  if (currentVote?.type != type && command == VOTE_CMD.insert) {
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
      incObject.downvotes = -1;
      incObject.upvotes = 1;
    } else {
      // if we swap in downvote mode, then is upvote decrease,  downvote increase
      incObject.downvotes = 1;
      incObject.upvotes = -1;
    }
    return incObject;
  } else if (currentVote?.type == type && command == VOTE_CMD.remove) {
    await getVotesCollection().deleteOne({
      userId: userObjectId,
      questionId: questionObjectId,
    });
    if (type == VoteType.UPVOTE) {
      incObject.upvotes = -1;
    } else {
      incObject.downvotes = -1;
    }
    return incObject;
  }
  // if vote already present and type is correct
  // if vote not present and type is remove
  // we dont increment or decrement
  return incObject;
}

async function checkUpvoteDownvote(
  userId: string | ObjectId,
  questionId: string | ObjectId
): Promise<GetVoteStatusResponse> {
  const vote: Vote | null = await getQuestionVoteByUser(userId, questionId);
  const status: GetVoteStatusResponse = { isUpvote: false, isDownvote: false };
  if (!vote) {
    return status;
  } else {
    if (vote.type == VoteType.UPVOTE) {
      status.isUpvote = true;
      return status;
    } else {
      status.isDownvote = true;
      return status;
    }
  }
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

export { handleQuestionVote, checkUpvoteDownvote };
