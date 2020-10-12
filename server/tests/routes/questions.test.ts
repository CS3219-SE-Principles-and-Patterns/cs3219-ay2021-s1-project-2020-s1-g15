import request from "supertest";
import { ObjectId } from "mongodb";

import server from "../../src/services/server";
import { initDb, closeDb } from "../../src/services/database";
import { createQuestion } from "../../src/controllers/questions";
import { HttpStatusCode, Level, Subject } from "../../src/utils";

const API_ENDPOINT = "/api/questions";

const INVALID_ID = "123";
const VALID_ID_UNUSED = new ObjectId();
const INVALID_DATA = { markdown: "" };
const VALID_DATA_1 = {
  title: "my title",
  markdown: "hello",
  level: Level.DEFAULT,
  subject: Subject.BIOLOGY,
};
const VALID_DATA_2 = {
  title: "my title",
  markdown: "world",
  level: Level.DEFAULT,
  subject: Subject.SCIENCE,
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

describe("GET request - list all questions", () => {
  it("should return 200", async (done) => {
    const res = await request(server).get(API_ENDPOINT).send();

    expect(res.status).toEqual(HttpStatusCode.OK);
    //! make sure done is called at the end: https://github.com/visionmedia/supertest/issues/520#issuecomment-456340621
    done();
  });
});

describe("GET request - find single question by id", () => {
  it("should return 400 if ObjectId is invalid", async (done) => {
    const res = await request(server)
      .get(`${API_ENDPOINT}/${INVALID_ID}`)
      .send();

    expect(res.status).toEqual(HttpStatusCode.BAD_REQUEST);
    done();
  });

  it("should return 404 if question is not found", async (done) => {
    const res = await request(server)
      .get(`${API_ENDPOINT}/${VALID_ID_UNUSED}`)
      .send();

    expect(res.status).toEqual(HttpStatusCode.NOT_FOUND);
    done();
  });

  it("should return 200 and the question on success", async (done) => {
    const { title, markdown, level, subject } = VALID_DATA_1;
    const createdQuestion = await createQuestion(
      title,
      markdown,
      new ObjectId(),
      level,
      subject
    );

    const res = await request(server)
      .get(`${API_ENDPOINT}/${createdQuestion._id}`)
      .send();

    expect(res.status).toEqual(HttpStatusCode.OK);
    // check if ID is the same:
    expect(createdQuestion._id.equals(res.body._id)).toBe(true);
    // check if markdown field is the same:
    expect(res.body.markdown).toEqual(VALID_DATA_1.markdown);
    done();
  });
});

describe("POST request - create a question", () => {
  it("should return 400 if any required fields are missing", async (done) => {
    const res = await request(server).post(API_ENDPOINT).send();

    expect(res.status).toEqual(HttpStatusCode.BAD_REQUEST);
    done();
  });

  it("should return 400 if any fields are invalid", async (done) => {
    const res = await request(server).post(API_ENDPOINT).send(INVALID_DATA);

    expect(res.status).toEqual(HttpStatusCode.BAD_REQUEST);
    done();
  });

  it("should return 201 and the created document on success", async (done) => {
    const res = await request(server).post(API_ENDPOINT).send(VALID_DATA_1);

    expect(res.status).toEqual(HttpStatusCode.CREATED);
    expect(res.body.markdown).toEqual(VALID_DATA_1.markdown);
    done();
  });
});

describe("PUT request - update a single question", () => {
  it("should return 400 if ObjectId is invalid", async (done) => {
    const res = await request(server)
      .put(`${API_ENDPOINT}/${INVALID_ID}`)
      .send();

    expect(res.status).toEqual(HttpStatusCode.BAD_REQUEST);
    done();
  });

  it("should return 400 if any required fields are missing", async (done) => {
    const res = await request(server)
      .put(`${API_ENDPOINT}/${VALID_ID_UNUSED}`)
      .send();

    expect(res.status).toEqual(HttpStatusCode.BAD_REQUEST);
    done();
  });

  it("should return 400 if any fields are invalid", async (done) => {
    const res = await request(server)
      .put(`${API_ENDPOINT}/${VALID_ID_UNUSED}`)
      .send(INVALID_DATA);

    expect(res.status).toEqual(HttpStatusCode.BAD_REQUEST);
    done();
  });

  it("should return 404 if question is not found", async (done) => {
    const res = await request(server)
      .put(`${API_ENDPOINT}/${VALID_ID_UNUSED}`)
      .send(VALID_DATA_1);

    expect(res.status).toEqual(HttpStatusCode.NOT_FOUND);
    done();
  });

  it("should return 200 and the updated question on success", async (done) => {
    const { title, markdown, level, subject } = VALID_DATA_1;
    const createdQuestion = await createQuestion(
      title,
      markdown,
      new ObjectId(),
      level,
      subject
    );

    const res = await request(server)
      .put(`${API_ENDPOINT}/${createdQuestion._id}`)
      .send(VALID_DATA_2);

    expect(res.status).toEqual(HttpStatusCode.OK);
    // check if ID is the same:
    expect(createdQuestion._id.equals(res.body._id)).toBe(true);
    // check if markdown field is updated:
    expect(res.body.markdown).toEqual(VALID_DATA_2.markdown);
    done();
  });
});

describe("DELETE request", () => {
  it("should return 400 if ObjectId is invalid", async (done) => {
    const res = await request(server)
      .delete(`${API_ENDPOINT}/${INVALID_ID}`)
      .send();

    expect(res.status).toEqual(HttpStatusCode.BAD_REQUEST);
    done();
  });

  it("should return 404 if question is not found", async (done) => {
    const res = await request(server)
      .delete(`${API_ENDPOINT}/${VALID_ID_UNUSED}`)
      .send();

    expect(res.status).toEqual(HttpStatusCode.NOT_FOUND);
    done();
  });

  it("should return 204 on success", async (done) => {
    const { title, markdown, level, subject } = VALID_DATA_1;
    const createdQuestion = await createQuestion(
      title,
      markdown,
      new ObjectId(),
      level,
      subject
    );

    const res = await request(server)
      .delete(`${API_ENDPOINT}/${createdQuestion._id}`)
      .send();

    expect(res.status).toEqual(HttpStatusCode.NO_CONTENT);
    expect(res.body).toMatchObject({});
    done();
  });
});
