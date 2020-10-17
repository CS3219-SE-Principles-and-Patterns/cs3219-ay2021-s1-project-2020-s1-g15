import { ObjectId } from "mongodb";

import { getUsersCollection } from "../services/database";
import { User } from "../models";
import { getAuth } from "../services/authentication";
import {
  HttpStatusCode,
  ApiError,
  ApiErrorMessage,
  UserRequestBody,
  toValidObjectId,
} from "../utils";

/**
 * Returns a single user by id
 *
 * @param id the user id of the user
 */
async function getUserById(id: string | ObjectId): Promise<User> {
  const userObjectId: ObjectId = toValidObjectId(id);
  const user: User | null = await getUsersCollection().findOne({
    _id: userObjectId,
  });

  if (user == null) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      ApiErrorMessage.User.NOT_FOUND
    );
  }
  return user;
}

/**
 * Registers the user in Firebase and creates the user document.
 *
 * @param data the UserRequestBody with email and password keys
 */
async function registerAndCreateUser(data: UserRequestBody): Promise<User> {
  const { email, password }: UserRequestBody = data;

  if (!email || !password) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.User.MISSING_REQUIRED_FIELDS
    );
  }

  const trimmedEmail: string = email.trim();
  const trimmedPassword: string = password.trim();
  if (trimmedPassword === "" || trimmedEmail === "") {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.User.INVALID_FIELDS
    );
  }

  //* used as firebase user UID and `Users` collection _id
  const userObjectId: ObjectId = new ObjectId();

  // try to create the firebase user:
  try {
    await getAuth().createUser({
      uid: userObjectId.toHexString(),
      email: email,
      password: password,
    });
  } catch (error) {
    throw new ApiError(HttpStatusCode.BAD_REQUEST, error.message);
  }

  // create the mongodb document:
  const doc: User = {
    _id: userObjectId,
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
  userId: string | ObjectId,
  questionId: string | ObjectId
): Promise<User> {
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

  const updatedUser: User | undefined = result.value;
  if (updatedUser == null) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      ApiErrorMessage.User.NOT_FOUND
    );
  }

  return updatedUser;
}

async function removeQuestionFromUser(
  userId: string | ObjectId,
  questionId: string | ObjectId
): Promise<User> {
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

  const updatedUser: User | undefined = result.value;
  if (updatedUser == null) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      ApiErrorMessage.User.NOT_FOUND
    );
  }

  return updatedUser;
}

async function addAnswerToUser(
  userId: string | ObjectId,
  answerId: string | ObjectId
): Promise<User> {
  const answerObjectId: ObjectId = toValidObjectId(answerId);
  const userObjectId: ObjectId = toValidObjectId(userId);

  const result = await getUsersCollection().findOneAndUpdate(
    { _id: userObjectId },
    {
      $addToSet: {
        answerIds: answerObjectId,
      },
    },
    { returnOriginal: false }
  );

  const updatedUser: User | undefined = result.value;
  if (updatedUser == null) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      ApiErrorMessage.User.NOT_FOUND
    );
  }

  return updatedUser;
}

export {
  registerAndCreateUser,
  addQuestionToUser,
  removeQuestionFromUser,
  getUserById,
  addAnswerToUser,
};
