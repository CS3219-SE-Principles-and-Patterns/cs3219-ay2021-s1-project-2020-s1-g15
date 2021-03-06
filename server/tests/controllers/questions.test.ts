import { ObjectId } from "mongodb";

import {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  addAnswerToQuestion,
  removeAnswerFromQuestion,
  updateQuestionVotes,
} from "src/controllers/questions";
import { Question } from "src/models";
import { initDb, closeDb, getAnswersCollection } from "src/services/database";
import { CreateQuestionRequest, Level, Subject } from "src/utils";
import { getQuestionsCollection } from "src/services/database";

const MISSING_REQUEST_DATA = {};
const INVALID_REQUEST_DATA: CreateQuestionRequest = {
  title: "    ", // this is invalid
  markdown: "hello",
  level: Level.DEFAULT,
  subject: Subject.GENERAL,
};
const VALID_REQUEST_DATA: CreateQuestionRequest = {
  title: "This is the title!",
  markdown: "hello",
  level: Level.DEFAULT,
  subject: Subject.GENERAL,
};
const VALID_REQUEST_DATA_CHANGED: CreateQuestionRequest = {
  title: "Now, title has changed",
  markdown: "markdown changed as well!!",
  level: Level.DEFAULT,
  subject: Subject.GENERAL,
};
const VALID_USER_ID = new ObjectId();
const VALID_UNUSED_QUESTION_ID = new ObjectId();
const VALID_ANSWER_ID = new ObjectId();

beforeAll(async (done) => {
  // initialise the testing DB before starting
  process.env.NODE_ENV = "test";
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
  await Promise.all([
    getAnswersCollection().deleteMany({}),
    getQuestionsCollection().deleteMany({}),
  ]);
  done();
});

describe("Create a question", () => {
  it("should throw error on missing request data", async () => {
    await expect(
      createQuestion(VALID_USER_ID, MISSING_REQUEST_DATA)
    ).rejects.toThrow();
  });

  it("should throw error on invalid request data", async () => {
    await expect(
      createQuestion(VALID_USER_ID, INVALID_REQUEST_DATA)
    ).rejects.toThrow();
  });

  it("should return the created question document on success", async () => {
    const createdQuestion = await createQuestion(
      VALID_USER_ID,
      VALID_REQUEST_DATA
    );
    expect(createdQuestion._id).not.toBeNull();
  });
});

describe("Get all questions", () => {
  it("should return an array", async () => {
    const { questions } = await getQuestions({ page: "1", pageSize: "10" });
    expect(Array.isArray(questions)).toBe(true);
  });
});

describe("Get a specific questions", () => {
  it("should throw error if question not found", async () => {
    const newId = new ObjectId();
    await expect(getQuestionById(newId)).rejects.toThrow();
  });

  it("should return the same question on success", async () => {
    // create a question:
    const createdQuestion = await createQuestion(
      VALID_USER_ID,
      VALID_REQUEST_DATA
    );
    // get back the same quesion:
    const question = await getQuestionById(createdQuestion._id);

    expect(question._id).toStrictEqual(createdQuestion._id);
  });
});

describe("Update a question", () => {
  it("should throw error on missing request data", async () => {
    await expect(
      updateQuestion(
        VALID_USER_ID,
        VALID_UNUSED_QUESTION_ID,
        MISSING_REQUEST_DATA
      )
    ).rejects.toThrow();
  });

  it("should throw error on invalid request data", async () => {
    await expect(
      updateQuestion(
        VALID_USER_ID,
        VALID_UNUSED_QUESTION_ID,
        INVALID_REQUEST_DATA
      )
    ).rejects.toThrow();
  });

  it("should throw error if question not found", async () => {
    await expect(
      updateQuestion(
        VALID_USER_ID,
        VALID_UNUSED_QUESTION_ID,
        VALID_REQUEST_DATA
      )
    ).rejects.toThrow();
  });

  it("should return the updated question document on success", async () => {
    // create a question:
    const createdQuestion = await createQuestion(
      VALID_USER_ID,
      VALID_REQUEST_DATA
    );
    // update the question:
    const updatedQuestion = await updateQuestion(
      VALID_USER_ID,
      createdQuestion._id,
      VALID_REQUEST_DATA_CHANGED
    );
    // get back the question
    const question = await getQuestionById(createdQuestion._id);

    expect(updatedQuestion._id).toStrictEqual(question._id);
  });
});

describe("Delete a question", () => {
  it("should throw error if question not found", async () => {
    await expect(
      deleteQuestion(VALID_USER_ID, VALID_UNUSED_QUESTION_ID)
    ).rejects.toThrow();
  });

  it("should return true and delete the document on success", async () => {
    // create a question:
    const createdQuestion = await createQuestion(
      VALID_USER_ID,
      VALID_REQUEST_DATA
    );
    // delete the created question:
    const res = await deleteQuestion(VALID_USER_ID, createdQuestion._id);

    expect(res).toBe(true);
    // getting the question by id should throw now:
    await expect(getQuestionById(createdQuestion._id)).rejects.toThrow();
  });
});

describe("Add an answer reference to a question", () => {
  it("should throw error if question not found", async () => {
    await expect(
      addAnswerToQuestion(VALID_UNUSED_QUESTION_ID, VALID_ANSWER_ID)
    ).rejects.toThrow();
  });

  it("should return the updated question document on success", async () => {
    // create a question:
    const createdQuestion = await createQuestion(
      VALID_USER_ID,
      VALID_REQUEST_DATA
    );
    // update the question by adding an answer reference:
    const updatedQuestion = await addAnswerToQuestion(
      createdQuestion._id,
      VALID_ANSWER_ID
    );
    // get back the question
    const question = await getQuestionById(createdQuestion._id);

    expect(updatedQuestion._id).toStrictEqual(question._id);
  });
});

describe("Remove an answer reference to a question", () => {
  it("should throw error if question not found", async () => {
    await expect(removeAnswerFromQuestion(VALID_ANSWER_ID)).rejects.toThrow();
  });

  it("should return the updated question document on success", async () => {
    // create a question:
    const createdQuestion = await createQuestion(
      VALID_USER_ID,
      VALID_REQUEST_DATA
    );
    // update the question by adding an answer reference:
    await addAnswerToQuestion(createdQuestion._id, VALID_ANSWER_ID);
    // remove the answer reference again:
    const updatedQuestion = await removeAnswerFromQuestion(VALID_ANSWER_ID);

    expect(updatedQuestion).toStrictEqual(createdQuestion);
  });
});

describe("Upvote a question", () => {
  it("should update question upvote value", async () => {
    // create a question:
    const createdQuestion = await createQuestion(
      VALID_USER_ID,
      VALID_REQUEST_DATA
    );

    const question: Question = await updateQuestionVotes(createdQuestion._id, {
      upvotes: 1,
      downvotes: 0,
    });

    expect(question.upvotes).toStrictEqual(1);
  });
});

describe("Downvote a question", () => {
  it("should update question downvote value", async () => {
    // create a question:
    const createdQuestion = await createQuestion(
      VALID_USER_ID,
      VALID_REQUEST_DATA
    );

    const question: Question = await updateQuestionVotes(createdQuestion._id, {
      upvotes: 0,
      downvotes: 1,
    });

    expect(question.downvotes).toStrictEqual(1);
  });
});
