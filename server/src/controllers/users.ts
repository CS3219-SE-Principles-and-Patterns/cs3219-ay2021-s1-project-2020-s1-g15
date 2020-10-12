import { ObjectId } from "mongodb";

import { getUsersCollection } from "../services/database";
import { User } from "../models";
import { getAuth } from "../services/authentication";
import ApiError from "../utils/errors/ApiError";
import HttpStatusCode from "../utils/HttpStatusCode";
import toValidObjectId from "../utils/toValidObjectId";

async function createUser(email: string, password: string): Promise<User> {
  //* used as firebase user UID and `Users` collection _id
  const uid: ObjectId = new ObjectId();

  // try to create the firebase user:
  try {
    await getAuth().createUser({
      uid: uid.toHexString(),
      email: email,
      password: password,
    });
  } catch (error) {
    throw new ApiError(HttpStatusCode.BAD_REQUEST, error.message);
  }

  // create the mongodb document:
  const doc: User = {
    _id: uid,
    createdAt: new Date(),
    updatedAt: new Date(),
    email: email,
    username: email,
    questionIds: [],
    answerIds: [],
  };
  await getUsersCollection().insertOne(doc);

  return doc;
}

async function addQuestionToUser(
  questionId: string | ObjectId,
  userId: string | ObjectId
): Promise<User | undefined> {
  const questionObjectId: ObjectId = toValidObjectId(questionId);
  const userObjectId: ObjectId = toValidObjectId(userId);

  const result = await getUsersCollection().findOneAndUpdate(
    { _id: userObjectId },
    {
      $addToSet: {
        questionIds: questionObjectId,
      },
    },
    { returnOriginal: false }
  );

  return result.value;
}

async function removeQuestionFromUser(
  questionId: string | ObjectId,
  userId: string | ObjectId
): Promise<User | undefined> {
  const questionObjectId: ObjectId = toValidObjectId(questionId);
  const userObjectId: ObjectId = toValidObjectId(userId);

  const result = await getUsersCollection().findOneAndUpdate(
    { _id: userObjectId },
    {
      $pull: {
        questionIds: questionObjectId,
      },
    },
    { returnOriginal: false }
  );

  return result.value;
}

export { createUser, addQuestionToUser, removeQuestionFromUser };
