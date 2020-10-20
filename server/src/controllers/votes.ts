import { ObjectId } from "mongodb";
import { Vote } from "src/models";
import { getVotesCollection } from "src/services/database";
import { VoteType, toValidObjectId } from "src/utils";

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

async function handleQuestionVote(
  userObjectId: ObjectId,
  questionObjectId: ObjectId,
  type: VoteType,
  isCurrentVotePresent: boolean,
  isSameVoteType: boolean
): Promise<void> {
  if (isCurrentVotePresent) {
    // delete any vote if present:
    await getVotesCollection().deleteOne({
      userId: userObjectId,
      questionId: questionObjectId,
    });
  }

  if (isSameVoteType) {
    // undoing a previous action, no need to proceed further
    return;
  }

  const doc: Vote = {
    _id: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: userObjectId,
    questionId: questionObjectId,
    type: type,
  };

  await getVotesCollection().insertOne(doc);
  return;
}

export { getQuestionVoteByUser, handleQuestionVote };
