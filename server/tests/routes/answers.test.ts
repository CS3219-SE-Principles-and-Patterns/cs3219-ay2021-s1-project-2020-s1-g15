/**
 * Integration test for the `/api/questions` route.
 *
 * - Only the prominent and happy/path will be tested here
 * - Authenticated routes are bypassed, and uses `devtestuser` credentials
 * - All error handling is tested on their relevant controllers/middlewares
 */
import request from "supertest";
import { ObjectId } from "mongodb";
import { stringify } from "querystring";

import server from "src/services/server";
import {
  initDb,
  closeDb,
  getAnswersCollection,
  getQuestionsCollection,
  getUsersCollection,
} from "src/services/database";
import {
  HttpStatusCode,
  TestConfig,
  VoteCommand,
  CreateAnswerRequest,
  VoteType,
} from "src/utils";
import { initAuth } from "src/services/authentication";
import { User } from "src/models";
import { createAnswer } from "src/controllers/answers";
import { handleAnswerVote } from "src/controllers/votes";

const VALID_QUESTION_ID = new ObjectId();
const API_ENDPOINT = "/api/answers";

const VALID_REQUEST_DATA_1: CreateAnswerRequest = {
  questionId: VALID_QUESTION_ID.toHexString(),
  markdown: "hello",
};
const VALID_REQUEST_DATA_2: CreateAnswerRequest = {
  questionId: VALID_QUESTION_ID.toHexString(),
  markdown: "hola",
};

beforeAll(async (done) => {
  // set bypass auth to true:
  process.env.BYPASS_AUTH = "true";
  // initialise the testing DB and firebase auth
  await initDb();
  await initAuth();
  // upsert the mongodb user document for `DEVTESTUSER`:
  const doc: Partial<User> = {
    _id: new ObjectId(TestConfig.DEVTESTUSER_UID),
    createdAt: new Date(),
    updatedAt: new Date(),
    email: TestConfig.DEVTESTUSER_EMAIL,
    username: TestConfig.DEVTESTUSER_EMAIL,
    questionIds: [],
    answerIds: [],
  };
  await getUsersCollection().findOneAndUpdate(
    {
      _id: doc._id,
    },
    { $set: doc },
    { upsert: true }
  );
  done();
});

afterAll(async (done) => {
  // clear all docs from all collections
  await Promise.all([
    getAnswersCollection().deleteMany({}),
    getQuestionsCollection().deleteMany({}),
  ]);
  // close the DB connection before ending
  await closeDb();
  done();
});

beforeEach(async (done) => {
  // clear Q&A docs to prevent test suite runs from interfering with one another
  await Promise.all([
    getAnswersCollection().deleteMany({}),
    getQuestionsCollection().deleteMany({}),
  ]);
  done();
});

describe("GET request - check user's vote status for answers of a question", () => {
  it("should return 200 and the correct info", async (done) => {
    const firstAnswer = await createAnswer(
      TestConfig.DEVTESTUSER_UID,
      VALID_REQUEST_DATA_1
    );
    const secondAnswer = await createAnswer(
      TestConfig.DEVTESTUSER_UID,
      VALID_REQUEST_DATA_2
    );
    const thirdAnswer = await createAnswer(
      TestConfig.DEVTESTUSER_UID,
      VALID_REQUEST_DATA_2
    );

    // upvote first answer:
    await handleAnswerVote(
      TestConfig.DEVTESTUSER_UID,
      firstAnswer._id,
      VoteCommand.INSERT,
      VoteType.UPVOTE
    );
    // downvote second answer:
    await handleAnswerVote(
      TestConfig.DEVTESTUSER_UID,
      secondAnswer._id,
      VoteCommand.INSERT,
      VoteType.DOWNVOTE
    );

    const firstAnswerId: string = firstAnswer._id.toHexString();
    const secondAnswerId: string = secondAnswer._id.toHexString();
    const thirdAnswerId: string = thirdAnswer._id.toHexString();

    const urlQuery = {
      answerIds: [firstAnswerId, secondAnswerId, thirdAnswerId],
    };
    const { body } = await request(server)
      .get(`${API_ENDPOINT}/vote-status?${stringify(urlQuery)}`)
      .send();

    expect(200).toBe(HttpStatusCode.OK);
    expect(body[firstAnswerId]).toStrictEqual({
      isUpvote: true,
      isDownvote: false,
    });
    expect(body[secondAnswerId]).toStrictEqual({
      isUpvote: false,
      isDownvote: true,
    });
    expect(body[thirdAnswerId]).toStrictEqual({
      isUpvote: false,
      isDownvote: false,
    });

    done();
  });
});
