import { ObjectId } from "mongodb";

import { initDb, closeDb, getUsersCollection } from "src/services/database";
import {
  addQuestionToUser,
  registerAndCreateUser,
  removeQuestionFromUser,
} from "src/controllers/users";
import { ApiErrorMessage, TestConfig } from "src/utils";
import { User } from "src/models";

const VALID_QUESTION_ID = new ObjectId();
const createTestUserDoc = async (): Promise<User> => {
  const doc: User = {
    _id: new ObjectId(TestConfig.DEVTESTUSER_UID),
    createdAt: new Date(),
    updatedAt: new Date(),
    email: TestConfig.DEVTESTUSER_EMAIL,
    username: TestConfig.DEVTESTUSER_EMAIL,
    questionIds: [],
    answerIds: [],
  };
  await getUsersCollection().insertOne(doc);
  return doc;
};

beforeAll(async (done) => {
  // initialise the testing DB before starting
  await initDb();
  done();
});

afterAll(async (done) => {
  // reset and close DB before ending
  await getUsersCollection().deleteMany({});
  await closeDb();
  done();
});

beforeEach(async (done) => {
  // clear all docs before each test suite to prevent runs from interfering with one another
  await getUsersCollection().deleteMany({});
  done();
});

describe("Register and create user document", () => {
  const MISSING_REQUEST_DATA = {};
  const INVALID_REQUEST_DATA = { email: "  ", password: "  " };

  it("should throw error if required fields are missing", async () => {
    await expect(registerAndCreateUser(MISSING_REQUEST_DATA)).rejects.toThrow(
      ApiErrorMessage.User.MISSING_REQUIRED_FIELDS
    );
  });

  it("should throw error if required fields are invalid", async () => {
    await expect(registerAndCreateUser(INVALID_REQUEST_DATA)).rejects.toThrow(
      ApiErrorMessage.User.INVALID_FIELDS
    );
  });
});

describe("Add question to user", () => {
  it("should throw error if user not found", async () => {
    const unusedUserId = new ObjectId();
    await expect(
      addQuestionToUser(unusedUserId, VALID_QUESTION_ID)
    ).rejects.toThrow(ApiErrorMessage.User.NOT_FOUND);
  });

  it("should return the correct updated user on success", async () => {
    const createdUser = await createTestUserDoc();

    const updatedUser = await addQuestionToUser(
      createdUser._id,
      VALID_QUESTION_ID
    );

    expect(updatedUser.questionIds).toContainEqual(VALID_QUESTION_ID);
  });
});

describe("Remove question from user", () => {
  it("should throw error if user not found", async () => {
    const unusedUserId = new ObjectId();
    await expect(
      removeQuestionFromUser(unusedUserId, VALID_QUESTION_ID)
    ).rejects.toThrow(ApiErrorMessage.User.NOT_FOUND);
  });

  it("should return the correct updated user on success", async () => {
    const createdUser = await createTestUserDoc();

    // add the question id to user first
    await addQuestionToUser(createdUser._id, VALID_QUESTION_ID);
    // remove it again
    const updatedUser = await removeQuestionFromUser(
      createdUser._id,
      VALID_QUESTION_ID
    );

    expect(updatedUser.questionIds).not.toContainEqual(VALID_QUESTION_ID);
  });
});
