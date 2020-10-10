import { Router, Request, Response } from "express";
// import { ObjectID, ObjectId } from "mongodb";

import { User } from "../models";
import ApiError from "../utils/errors/ApiError";
import ApiErrorMessage from "../utils/errors/ApiErrorMessage";
import HttpStatusCode from "../utils/HttpStatusCode";
import { createUser } from "../controllers/users";

const router: Router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const email: string | undefined = req.body.email;
  const password: string | undefined = req.body.password;

  if (!email || !password) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.User.MISSING_REQUIRED_FIELDS
    );
  }

  const trimmedEmail: string = email.trim();
  const trimmedPassword: string = password.trim();
  if (trimmedPassword === "" || trimmedEmail === "") {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.User.INVALID_FIELDS
    );
  }

  const createdUser: User = await createUser(trimmedEmail, trimmedPassword);

  return res.status(HttpStatusCode.OK).json(createdUser);
});

export default router;
