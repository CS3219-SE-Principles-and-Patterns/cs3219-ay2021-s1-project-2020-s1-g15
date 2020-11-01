import { Router, Request, Response } from "express";

import { User } from "../models";
import { HttpStatusCode, ResisterUserRequest } from "../utils";
import { getUserById, registerAndCreateUser } from "../controllers/users";
import { getQuestionsByUserId } from "../controllers/questions";
import { getAnswersByUserId } from "../controllers/answers";

const router: Router = Router();

// GET request - get a single User
router.get("/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const user: User = await getUserById(id);

  return res.status(HttpStatusCode.OK).json(user);
});

// GET request - get all questions created by a single User
router.get("/:id/questions", async (req: Request, res: Response) => {
  const userId: string = req.params.id;

  const [questions] = await Promise.all([
    getQuestionsByUserId(userId),
    getUserById(userId), // throws error if user not found
  ]);
  return res.status(HttpStatusCode.OK).json(questions);
});

// GET request - get all answers created by a single User
router.get("/:id/answers", async (req: Request, res: Response) => {
  const userId: string = req.params.id;

  const [answers] = await Promise.all([
    getAnswersByUserId(userId),
    getUserById(userId), // throws error if user not found
  ]);
  return res.status(HttpStatusCode.OK).json(answers);
});

// POST request - create a single User
router.post("/", async (req: Request, res: Response) => {
  const data: ResisterUserRequest = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  const createdUser: User = await registerAndCreateUser(data);

  return res.status(HttpStatusCode.CREATED).json(createdUser);
});

export default router;
