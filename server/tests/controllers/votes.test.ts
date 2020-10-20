import { ObjectId } from "mongodb";
import { handleQuestionVoteV2 } from "src/controllers/votes";
import { closeDb, getVotesCollection, initDb } from "src/services/database";
import { VOTE_CMD, VoteType } from "src/utils";

const VALID_USER_ID = new ObjectId();
const VALID_QUESTION_ID = new ObjectId();

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
  await getVotesCollection().deleteMany({});
  await getVotesCollection().deleteMany({});
  done();
});

describe("Vote Creation", () => {
  it("should create a vote document", async () => {
    const res = await handleQuestionVoteV2(
      VALID_USER_ID,
      VALID_QUESTION_ID,
      VOTE_CMD.insert,
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
