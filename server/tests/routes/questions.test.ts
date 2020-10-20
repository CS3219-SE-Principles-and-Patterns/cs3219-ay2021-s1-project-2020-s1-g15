/**
 * Integration test for the `/api/questions` route.
 *
 * - Only the prominent and happy/path will be tested here
 * - Authenticated routes are bypassed, and uses `devtestuser` credentials
 * - All error handling is tested on their relevant controllers/middlewares
 */
import request from "supertest";
import { ObjectId } from "mongodb";

import server from "src/services/server";
import {
  initDb,
  closeDb,
  getAnswersCollection,
  getQuestionsCollection,
  getUsersCollection,
} from "src/services/database";
import { createQuestion } from "src/controllers/questions";
import {
  HttpStatusCode,
  Level,
  Subject,
  QuestionRequestBody,
  TestConfig,
} from "src/utils";
import { initAuth } from "src/services/authentication";
import { User } from "src/models";

const API_ENDPOINT = "/api/questions";

const VALID_REQUEST_DATA_1: QuestionRequestBody = {
  title: "This is the title!",
  markdown: "hello",
  level: Level.DEFAULT,
  subject: Subject.GENERAL,
};
const VALID_REQUEST_DATA_2: QuestionRequestBody = {
  title: "This is the changed title now =D",
  markdown: "hola",
  level: Level.DEFAULT,
  subject: Subject.GENERAL,
};

beforeAll(async (done) => {
  // set bypass auth to true:
  process.env.BYPASS_AUTH = "true";
  // initialise the testing DB and firebase auth
  await initDb();
  await initAuth();
  // create the mongodb user document for `DEVTESTUSER`:
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
  done();
});

afterAll(async (done) => {
  // clear all docs from all collections
  await getAnswersCollection().deleteMany({});
  await getQuestionsCollection().deleteMany({});
  await getUsersCollection().deleteMany({});
  // close the DB connection before ending
  await closeDb();
  done();
});

beforeEach(async (done) => {
  // clear Q&A docs to prevent test suite runs from interfering with one another
  await getAnswersCollection().deleteMany({});
  await getQuestionsCollection().deleteMany({});
  done();
});

describe("GET request - list all questions", () => {
  it("should return 200", async (done) => {
    const res = await request(server)
      .get(API_ENDPOINT)
      .query({ page: 1, pageSize: 10 })
      .send();

    expect(res.status).toBe(HttpStatusCode.OK);
    //! make sure done is called at the end: https://github.com/visionmedia/supertest/issues/520#issuecomment-456340621
    done();
  });
});

describe("GET request - find single question by id", () => {
  it("should return 200 and the question on success", async (done) => {
    const createdQuestion = await createQuestion(
      TestConfig.DEVTESTUSER_UID,
      VALID_REQUEST_DATA_1
    );

    const res = await request(server)
      .get(`${API_ENDPOINT}/${createdQuestion._id}`)
      .send();

    expect(res.status).toBe(HttpStatusCode.OK);
    expect(res.body._id).toBe(createdQuestion._id.toHexString());
    done();
  });
});

describe("POST request - create a single question", () => {
  it("should return 201 and the question on success", async (done) => {
    const res = await request(server)
      .post(API_ENDPOINT)
      .send(VALID_REQUEST_DATA_1);

    expect(res.status).toBe(HttpStatusCode.CREATED);
    expect(res.body._id).not.toBeNull();
    done();
  });
});

describe("PUT request - update a single question", () => {
  it("should return 200 and the updated question on success", async (done) => {
    // create a question first:
    const createdQuestion = await createQuestion(
      TestConfig.DEVTESTUSER_UID,
      VALID_REQUEST_DATA_1
    );

    const res = await request(server)
      .put(`${API_ENDPOINT}/${createdQuestion._id}`)
      .send(VALID_REQUEST_DATA_2);

    expect(res.status).toBe(HttpStatusCode.OK);
    expect(res.body.title).toBe(VALID_REQUEST_DATA_2.title);
    expect(res.body.markdown).toBe(VALID_REQUEST_DATA_2.markdown);
    done();
  });
});

describe("DELETE request - delete a single question", () => {
  it("should return 204 on success", async (done) => {
    // create a question first:
    const createdQuestion = await createQuestion(
      TestConfig.DEVTESTUSER_UID,
      VALID_REQUEST_DATA_1
    );

    const res = await request(server)
      .delete(`${API_ENDPOINT}/${createdQuestion._id}`)
      .send();

    expect(res.status).toBe(HttpStatusCode.NO_CONTENT);
    done();
  });
});
