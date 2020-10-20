import { ObjectId } from "mongodb";
import { Vote } from "src/models";
import { getVotesCollection } from "src/services/database";
import { VoteType } from "src/utils";

export async function handleUpvoteDownvoteQuestion(
  userObjectId: ObjectId,
  questionObjectId: ObjectId,
  type: VoteType,
  isSameType: boolean,
  currentVote: boolean
): Promise<void> {
  // if present and same type, we delete
  if (isSameType && currentVote) {
    await getVotesCollection().deleteOne({
      userId: userObjectId,
      questionId: questionObjectId,
    });
    return;
  }
  // if present and different type , we update
  // if not present we create
  if (currentVote) {
    await getVotesCollection().deleteOne({
      userId: userObjectId,
      questionId: questionObjectId,
    });
  }
  const doc: Vote = {
    _id: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: userObjectId,
    questionId: questionObjectId,
    type,
  };
  await getVotesCollection().insertOne(doc);
  return;
}
