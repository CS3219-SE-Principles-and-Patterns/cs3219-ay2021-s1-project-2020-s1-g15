import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";

import {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  editUpvoteDownvoteQuestion,
} from "../controllers/questions";
import {
  addQuestionToUser,
  removeAllAnswersFromUsers,
  removeQuestionFromUser,
} from "../controllers/users";
import { Answer, Question } from "../models";
import { verifyUserAuth } from "../middlewares/authRouteHandler";
import {
  deleteAllAnswersByQuestionId,
  getAnswersByQuestionId,
} from "../controllers/answers";
import {
  QuestionRequestBody,
  HttpStatusCode,
  VoteType,
  UpvoteDownvoteStatus,
} from "../utils";
import {
  GetPaginatedQuestionRequestQuery,
  GetQuestionRequestResponse,
  UpvoteQuestionRequestBody,
} from "../utils/types/GetQuestionRequestResponse";
import { checkUpvoteDownvote, handleQuestionVote } from "../controllers/votes";

const router: Router = Router();

// GET request - list all questions
router.get("/", async (req: Request, res: Response) => {
  const args = req.query as GetPaginatedQuestionRequestQuery;
  const page = parseInt(args.page);
  const pageSize = parseInt(args.pageSize);

  const { questions, total }: GetQuestionRequestResponse = await getQuestions(
    page,
    pageSize
  );
  return res.status(HttpStatusCode.OK).json({ questions, total });
});

// GET request - get a single question by its ID
router.get("/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const question: Question = await getQuestionById(id);

  return res.status(HttpStatusCode.OK).json(question);
});

// POST request - create a question
router.post("/", verifyUserAuth, async (req: Request, res: Response) => {
  const userId: ObjectId = res.locals.uid;
  const data: QuestionRequestBody = {
    title: req.body.title,
    markdown: req.body.markdown,
    level: req.body.level,
    subject: req.body.subject,
  };

  // create the question:
  const createdQuestion: Question = await createQuestion(userId, data);
  // add the question ID to the user:
  await addQuestionToUser(userId, createdQuestion._id);

  return res.status(HttpStatusCode.CREATED).json(createdQuestion);
});

// GET request - check if  user has voted for question
router.put(
  "/:id/vote-status",
  verifyUserAuth,
  async (req: Request, res: Response) => {
    const userId: ObjectId = res.locals.uid;
    const questionId: string = req.params.id;
    const status: UpvoteDownvoteStatus = await checkUpvoteDownvote(
      userId,
      questionId
    );

    return res.status(HttpStatusCode.OK).json(status);
  }
);

// Put request - upvote a question
router.put(
  "/:id/upvote",
  verifyUserAuth,
  async (req: Request, res: Response) => {
    const userId: ObjectId = res.locals.uid;
    const questionId: string = req.params.id;
    const { command } = req.body as UpvoteQuestionRequestBody;
    const incObject = await handleQuestionVote(
      userId,
      questionId,
      command,
      VoteType.UPVOTE
    );
    const updatedQuestion: Question = await editUpvoteDownvoteQuestion(
      userId,
      questionId,
      incObject
    );
    return res.status(HttpStatusCode.OK).json(updatedQuestion);
  }
);

// Put request - downvote a question
router.put(
  "/:id/downvote",
  verifyUserAuth,
  async (req: Request, res: Response) => {
    const userId: ObjectId = res.locals.uid;
    const questionId: string = req.params.id;
    const { command } = req.body as UpvoteQuestionRequestBody;
    const incObject = await handleQuestionVote(
      userId,
      questionId,
      command,
      VoteType.DOWNVOTE
    );
    const updatedQuestion: Question = await editUpvoteDownvoteQuestion(
      userId,
      questionId,
      incObject
    );
    return res.status(HttpStatusCode.OK).json(updatedQuestion);
  }
);

// PUT request - update a question
router.put("/:id", verifyUserAuth, async (req: Request, res: Response) => {
  const userId: ObjectId = res.locals.uid;
  const questionId: string = req.params.id;
  const data: QuestionRequestBody = {
    title: req.body.title,
    markdown: req.body.markdown,
    level: req.body.level,
    subject: req.body.subject,
  };

  const updatedQuestion: Question = await updateQuestion(
    userId,
    questionId,
    data
  );

  return res.status(HttpStatusCode.OK).json(updatedQuestion);
});

// DELETE request
router.delete("/:id", verifyUserAuth, async (req: Request, res: Response) => {
  const userId: ObjectId = res.locals.uid;
  const questionId: string = req.params.id;

  const answers: Answer[] = await getAnswersByQuestionId(questionId);
  await Promise.all([
    deleteQuestion(userId, questionId),
    removeQuestionFromUser(userId, questionId),
    deleteAllAnswersByQuestionId(questionId),
  ]);

  if (answers.length != 0) {
    await removeAllAnswersFromUsers(answers);
  }

  return res.status(HttpStatusCode.NO_CONTENT).send();
});

export default router;
