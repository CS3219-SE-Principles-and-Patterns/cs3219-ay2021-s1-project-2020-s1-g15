import { Router, Request, Response } from "express";

import { User } from "../models";
import { HttpStatusCode, UserRequestBody } from "../utils";
import { createUser } from "../controllers/users";

const router: Router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const data: UserRequestBody = {
    email: req.body.email,
    password: req.body.password,
  };

  const createdUser: User = await createUser(data);

  return res.status(HttpStatusCode.OK).json(createdUser);
});

export default router;
