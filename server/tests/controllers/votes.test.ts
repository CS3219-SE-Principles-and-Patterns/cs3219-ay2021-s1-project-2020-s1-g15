import { ObjectId } from "mongodb";
import { createQuestion } from "src/controllers/questions";
import { handleUpvoteDownvoteQuestion } from "src/controllers/votes";
import { closeDb, getVotesCollection, initDb } from "src/services/database";
import { Level, QuestionRequestBody, Subject, VoteType } from "src/utils";
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

describe("Vote Creation", () => {
  it("should create a vote document", async () => {
    // create a question:
    const createdQuestion = await createQuestion(
      VALID_USER_ID,
      VALID_REQUEST_DATA
    );
    /*
    await handleUpvoteDownvoteQuestion(
      VALID_USER_ID,
      createdQuestion._id,
      VoteType.UPVOTE,
      false,

    );*/

    const voteDoc = await getVotesCollection().findOne({
      userId: VALID_USER_ID,
      questionId: createdQuestion._id,
    });

    expect(voteDoc).toHaveProperty("type", VoteType.UPVOTE);
  });
});
