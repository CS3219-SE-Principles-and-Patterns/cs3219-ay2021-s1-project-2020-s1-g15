import { ObjectId } from "mongodb";
import { Router, Request, Response } from "express";

import { Answer } from "../models";
import { verifyUserAuth } from "../middlewares/authRouteHandler";
import {
  createAnswer,
  getAnswersByQuestionId,
  deleteAnswer,
  updateAnswer,
  updateAnswerVotes,
} from "../controllers/answers";
import {
  addAnswerToQuestion,
  getQuestionById,
  removeAnswerFromQuestion,
} from "../controllers/questions";
import { addAnswerToUser, removeAnswerFromUser } from "../controllers/users";
import { getAnswersVoteStatus, handleAnswerVote } from "../controllers/votes";
import {
  HttpStatusCode,
  CreateAnswerRequest,
  EditAnswerRequest,
  GetAnswersVoteStatusResponse,
  UpvoteQuestionRequest,
  VoteIncrementObject,
  VoteType,
  DownvoteQuestionRequest,
} from "../utils";

const router: Router = Router();

// GET request - get all answers by question ID
router.get("/", async (req: Request, res: Response) => {
  // typecase to string; let controller handle the error handling
  const questionId: string = req.query.questionId as string;
  const sortBy: string | undefined = req.query.sortBy as string | undefined;

  const answers: Answer[] = await getAnswersByQuestionId(questionId, sortBy);

  return res.status(HttpStatusCode.OK).json(answers);
});

// GET request - check user's vote status for answers of a question
router.get(
  "/vote-status",
  verifyUserAuth,
  async (req: Request, res: Response) => {
    const userId: ObjectId = res.locals.uid;
    const answerIdQuery = req.query.answerIds as undefined | string | string[];

    // TODO: throw error if answer not found
    const status: GetAnswersVoteStatusResponse = await getAnswersVoteStatus(
      userId,
      answerIdQuery
    );

    return res.status(HttpStatusCode.OK).json(status);
  }
);

// POST request - create an answer
router.post("/", verifyUserAuth, async (req: Request, res: Response) => {
  const userId: ObjectId = res.locals.uid;
  const data: CreateAnswerRequest = {
    questionId: req.body.questionId,
    markdown: req.body.markdown,
  };

  // try to get question by question ID to check if question exists:
  await getQuestionById(data.questionId as string);

  // create the answer:
  const createdAnswer: Answer = await createAnswer(userId, data);

  // add answer ID to the question:
  await addAnswerToQuestion(createdAnswer.questionId, createdAnswer._id);

  // add answer ID to the user:
  await addAnswerToUser(userId, createdAnswer._id);

  return res.status(HttpStatusCode.CREATED).json(createdAnswer);
});

// PUT request - update an answer
router.put("/:id", verifyUserAuth, async (req: Request, res: Response) => {
  const userId: ObjectId = res.locals.uid;
  const answerId: string = req.params.id;
  const data: EditAnswerRequest = {
    markdown: req.body.markdown,
  };
  const updatedAnswer: Answer = await updateAnswer(userId, answerId, data);

  return res.status(HttpStatusCode.OK).json(updatedAnswer);
});

// PUT request - upvote an answer
router.put(
  "/:id/upvote",
  verifyUserAuth,
  async (req: Request, res: Response) => {
    const userId: ObjectId = res.locals.uid;
    const answerId: string = req.params.id;
    const { command: voteCommand } = req.body as UpvoteQuestionRequest;

    const voteIncrementObject: VoteIncrementObject = await handleAnswerVote(
      userId,
      answerId,
      voteCommand,
      VoteType.UPVOTE
    );
    const updatedAnswer: Answer = await updateAnswerVotes(
      answerId,
      voteIncrementObject
    );

    return res.status(HttpStatusCode.OK).json(updatedAnswer);
  }
);

// PUT request - downvote an answer
router.put(
  "/:id/downvote",
  verifyUserAuth,
  async (req: Request, res: Response) => {
    const userId: ObjectId = res.locals.uid;
    const answerId: string = req.params.id;
    const { command: voteCommand } = req.body as DownvoteQuestionRequest;

    const voteIncrementObject = await handleAnswerVote(
      userId,
      answerId,
      voteCommand,
      VoteType.DOWNVOTE
    );
    const updatedAnswer: Answer = await updateAnswerVotes(
      answerId,
      voteIncrementObject
    );

    return res.status(HttpStatusCode.OK).json(updatedAnswer);
  }
);

// DELETE request - delete an answer
router.delete("/:id", verifyUserAuth, async (req: Request, res: Response) => {
  const userId: ObjectId = res.locals.uid;
  const answerId: string = req.params.id;

  await Promise.all([
    deleteAnswer(userId, answerId),
    removeAnswerFromQuestion(answerId),
    removeAnswerFromUser(userId, answerId),
  ]);

  return res.status(HttpStatusCode.NO_CONTENT).send();
});

export default router;
