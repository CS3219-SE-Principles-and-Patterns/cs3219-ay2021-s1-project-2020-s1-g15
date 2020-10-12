/**
 * Integration test for the `/api/questions` route. Only the prominent and happy
 * path will be tested here. All error handling is tested on the questions controller.
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
import { HttpStatusCode, Level, Subject, QuestionRequestBody } from "src/utils";

const API_ENDPOINT = "/api/questions";

const VALID_USER_ID = new ObjectId();
const VALID_REQUEST_DATA: QuestionRequestBody = {
  title: "This is the title!",
  markdown: "hello",
  level: Level.DEFAULT,
  subject: Subject.GENERAL,
};

beforeAll(async (done) => {
  // initialise the testing DB before starting
  await initDb();
  done();
});

afterAll(async (done) => {
  // close the DB connection before ending
  await closeDb();
  done();
});

beforeEach(async (done) => {
  // clear all docs from all collections before each test suite to prevent runs from interfering with one another
  await getAnswersCollection().remove({});
  await getQuestionsCollection().remove({});
  await getUsersCollection().remove({});
  done();
});

describe("GET request - list all questions", () => {
  it("should return 200", async (done) => {
    const res = await request(server).get(API_ENDPOINT).send();

    expect(res.status).toEqual(HttpStatusCode.OK);
    //! make sure done is called at the end: https://github.com/visionmedia/supertest/issues/520#issuecomment-456340621
    done();
  });
});

describe("GET request - find single question by id", () => {
  it("should return 200 and the question on success", async (done) => {
    const createdQuestion = await createQuestion(
      VALID_USER_ID,
      VALID_REQUEST_DATA
    );

    const res = await request(server)
      .get(`${API_ENDPOINT}/${createdQuestion._id}`)
      .send();

    expect(res.status).toEqual(HttpStatusCode.OK);
    expect(res.body._id).toBe(createdQuestion._id.toHexString());
    done();
  });
});
