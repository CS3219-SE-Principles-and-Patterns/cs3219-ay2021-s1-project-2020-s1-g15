import { Router, Request, Response } from "express";

import { User } from "../models";
import { HttpStatusCode, UserRequestBody } from "../utils";
import { getUserById, registerAndCreateUser } from "../controllers/users";

const router: Router = Router();

// GET request - get a single User
router.get("/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const user: User = await getUserById(id);

  return res.status(HttpStatusCode.OK).json(user);
});

// POST request - create a single User
router.post("/", async (req: Request, res: Response) => {
  const data: UserRequestBody = {
    email: req.body.email,
    password: req.body.password,
  };

  const createdUser: User = await registerAndCreateUser(data);

  return res.status(HttpStatusCode.CREATED).json(createdUser);
});

export default router;
