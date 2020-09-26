/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/errors/ApiError";

/**
 * Error handler for custom errors defined in src/utils/errors.
 */
export default async function customErrorHandler(
  err: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<unknown> {
  if (err instanceof ApiError) {
    return res.status(err.status).send(err.message);
  }

  // let default express error handler handle other errors
  return next(err);
}
