import { Router, Request, Response } from "express";

import { User } from "../models";
import { HttpStatusCode, UserRequestBody } from "../utils";
import { registerAndCreateUser } from "../controllers/users";

const router: Router = Router();

//CREATE USER
router.post("/", async (req: Request, res: Response) => {
  const data: UserRequestBody = {
    email: req.body.email,
    password: req.body.password,
  };

  const createdUser: User = await registerAndCreateUser(data);

  return res.status(HttpStatusCode.CREATED).json(createdUser);
});

export default router;
