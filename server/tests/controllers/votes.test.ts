import { ObjectId } from "mongodb";

import { handleQuestionVote, handleAnswerVote } from "src/controllers/votes";
import { closeDb, getVotesCollection, initDb } from "src/services/database";
import { VoteCommand, VoteType, VoteIncrementObject } from "src/utils";

const VALID_USER_ID = new ObjectId();
const VALID_QUESTION_ID = new ObjectId();
const VALID_ANSWER_ID = new ObjectId();

async function insertAnswerVote(
  voteType: VoteType
): Promise<VoteIncrementObject> {
  return handleAnswerVote(
    VALID_USER_ID,
    VALID_ANSWER_ID,
    VoteCommand.INSERT,
    voteType
  );
}

async function removeAnswerVote(
  voteType: VoteType
): Promise<VoteIncrementObject> {
  return handleAnswerVote(
    VALID_USER_ID,
    VALID_ANSWER_ID,
    VoteCommand.REMOVE,
    voteType
  );
}

beforeAll(async (done) => {
  // initialise the testing DB before starting
  await initDb();
  done();
});

afterAll(async (done) => {
  // close the DB connection before ending
  await getVotesCollection().deleteMany({});
  await closeDb();
  done();
});

beforeEach(async (done) => {
  // clear all docs from all collections before each test suite to prevent runs from interfering with one another
  await getVotesCollection().deleteMany({});
  done();
});

describe("Vote Creation", () => {
  it("should create a vote document", async () => {
    const res = await handleQuestionVote(
      VALID_USER_ID,
      VALID_QUESTION_ID,
      VoteCommand.INSERT,
      VoteType.UPVOTE
    );

    expect(res).toHaveProperty("upvotes", 1);

    const voteDoc = await getVotesCollection().findOne({
      userId: VALID_USER_ID,
      questionId: VALID_QUESTION_ID,
    });

    expect(voteDoc).toHaveProperty("type", VoteType.UPVOTE);
  });
});

describe("Insert brand new answer vote", () => {
  beforeEach(async (done) => {
    // clear all docs from all collections before each test suite to prevent runs from interfering with one another
    await getVotesCollection().deleteMany({});
    done();
  });

  it("should create correct VoteIncrementObject for upvote", async () => {
    const incrementObject = await insertAnswerVote(VoteType.UPVOTE);

    expect(incrementObject.upvotes).toBe(1);
    expect(incrementObject.downvotes).toBe(0);
  });

  it("should create correct VoteIncrementObject for downvote", async () => {
    const incrementObject = await insertAnswerVote(VoteType.DOWNVOTE);

    expect(incrementObject.upvotes).toBe(0);
    expect(incrementObject.downvotes).toBe(1);
  });
});

describe("Insert existing answer vote of same type", () => {
  beforeEach(async (done) => {
    // clear all docs from all collections before each test suite to prevent runs from interfering with one another
    await getVotesCollection().deleteMany({});
    done();
  });

  it("should create correct VoteIncrementObject for upvote", async () => {
    // upvote once:
    await insertAnswerVote(VoteType.UPVOTE);
    // upvote again:
    const incrementObject = await insertAnswerVote(VoteType.UPVOTE);

    expect(incrementObject.upvotes).toBe(0);
    expect(incrementObject.downvotes).toBe(0);
  });

  it("should create correct VoteIncrementObject for downvote", async () => {
    // downvote once:
    await insertAnswerVote(VoteType.DOWNVOTE);
    // downvote again:
    const incrementObject = await insertAnswerVote(VoteType.DOWNVOTE);

    expect(incrementObject.upvotes).toBe(0);
    expect(incrementObject.downvotes).toBe(0);
  });
});

describe("Insert existing vote of different type", () => {
  beforeEach(async (done) => {
    // clear all docs from all collections before each test suite to prevent runs from interfering with one another
    await getVotesCollection().deleteMany({});
    done();
  });

  it("should create correct VoteIncrementObject for downvote after upvote", async () => {
    // upvote first:
    await insertAnswerVote(VoteType.UPVOTE);
    // then downvote:
    const incrementObject = await insertAnswerVote(VoteType.DOWNVOTE);

    expect(incrementObject.upvotes).toBe(-1);
    expect(incrementObject.downvotes).toBe(1);
  });

  it("should create correct VoteIncrementObject for upvote after downvote", async () => {
    // downvote first:
    await insertAnswerVote(VoteType.DOWNVOTE);
    // then upvote:
    const incrementObject = await insertAnswerVote(VoteType.UPVOTE);

    expect(incrementObject.upvotes).toBe(1);
    expect(incrementObject.downvotes).toBe(-1);
  });
});

describe("Remove non-existent vote", () => {
  beforeEach(async (done) => {
    // clear all docs from all collections before each test suite to prevent runs from interfering with one another
    await getVotesCollection().deleteMany({});
    done();
  });

  it("should create correct VoteIncrementObject for upvote", async () => {
    const incrementObject = await removeAnswerVote(VoteType.UPVOTE);

    expect(incrementObject.upvotes).toBe(0);
    expect(incrementObject.downvotes).toBe(0);
  });

  it("should create correct VoteIncrementObject for downvote", async () => {
    const incrementObject = await removeAnswerVote(VoteType.DOWNVOTE);

    expect(incrementObject.upvotes).toBe(0);
    expect(incrementObject.downvotes).toBe(0);
  });
});

describe("Remove existing vote of same type", () => {
  beforeEach(async (done) => {
    // clear all docs from all collections before each test suite to prevent runs from interfering with one another
    await getVotesCollection().deleteMany({});
    done();
  });

  it("should create correct VoteIncrementObject for upvote", async () => {
    // upvote first:
    await insertAnswerVote(VoteType.UPVOTE);
    // then remove the upvote:
    const incrementObject = await removeAnswerVote(VoteType.UPVOTE);

    expect(incrementObject.upvotes).toBe(-1);
    expect(incrementObject.downvotes).toBe(0);
  });

  it("should create correct VoteIncrementObject for downvote", async () => {
    // downvote first:
    await insertAnswerVote(VoteType.DOWNVOTE);
    // then remove the downvote:
    const incrementObject = await removeAnswerVote(VoteType.DOWNVOTE);

    expect(incrementObject.upvotes).toBe(0);
    expect(incrementObject.downvotes).toBe(-1);
  });
});

describe("Remove existing vote of different type", () => {
  beforeEach(async (done) => {
    // clear all docs from all collections before each test suite to prevent runs from interfering with one another
    await getVotesCollection().deleteMany({});
    done();
  });

  it("should create correct VoteIncrementObject for removing non-existent downvote", async () => {
    // upvote first:
    await insertAnswerVote(VoteType.UPVOTE);
    // then remove non existent downvote:
    const incrementObject = await removeAnswerVote(VoteType.DOWNVOTE);

    expect(incrementObject.upvotes).toBe(0);
    expect(incrementObject.downvotes).toBe(0);
  });

  it("should create correct VoteIncrementObject for removing non-existent upvote", async () => {
    // downvote first:
    await insertAnswerVote(VoteType.DOWNVOTE);
    // then remove non existent upvote:
    const incrementObject = await removeAnswerVote(VoteType.UPVOTE);

    expect(incrementObject.upvotes).toBe(0);
    expect(incrementObject.downvotes).toBe(0);
  });
});
