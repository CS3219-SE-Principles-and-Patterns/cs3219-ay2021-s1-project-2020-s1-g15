import { ObjectID, ObjectId } from "mongodb";

import { getUsersCollection } from "../services/database";
import { User } from "../models";
import { getAuth } from "../services/authentication";
import ApiError from "../utils/errors/ApiError";
import HttpStatusCode from "../utils/HttpStatusCode";

async function createUser(email: string, password: string): Promise<User> {
  //* used as firebase user UID and `Users` collection _id
  const uid: ObjectId = new ObjectID();

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

export { createUser };
