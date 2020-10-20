import { ObjectId } from "mongodb";
import { Vote } from "src/models";
import { getVoteCollection } from "src/services/database";
import { VoteType } from "src/utils";

export async function handleUpvoteDownvoteQuestion(
  userObjectId: ObjectId,
  questionObjectId: ObjectId,
  type: VoteType
): Promise<void> {
  const updatedResult = await getVoteCollection().findOneAndUpdate(
    {
      userId: userObjectId,
      questionId: questionObjectId,
    },
    {
      $set: {
        updatedAt: new Date(),
        type,
      }, // if present we change value based on voteType
    }
  );
  if (!updatedResult.value) {
    const doc: Vote = {
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: userObjectId,
      questionId: questionObjectId,
      type,
    };
    await getVoteCollection().insertOne(doc);
  }
}
