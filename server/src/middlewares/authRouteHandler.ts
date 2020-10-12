import { Request, Response, NextFunction } from "express";

import { getAuth } from "../services/authentication";
import ApiError from "../utils/errors/ApiError";
import HttpStatusCode from "../utils/HttpStatusCode";

/**
 * Middleware for authenticated routes. This middleware will extract the `uid`
 * from the provided token in the request headers, and store it in `res.locals`.
 * If no token is provided, or if the token is invalid, an `ApiError` will be
 * thrown with a HTTP 401 UNAUTHORIZED error. If this function succeeds without
 * throwing errors, `res.locals` is guaranteed to have the valid `uid` key.
 */
async function verifyUserAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader: string | undefined = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new ApiError(HttpStatusCode.UNAUTHORIZED, "User not authorised");
  }

  const idToken: string = authHeader.split(" ")[1];
  try {
    // try to decode the idToken
    const decodedToken = await getAuth().verifyIdToken(idToken);
    // store the recovered UID in res.locals for other the next routes to use
    res.locals.uid = decodedToken.uid;
    // call the next route
    next();
  } catch (error) {
    // assume token is invalid for any errors
    throw new ApiError(HttpStatusCode.UNAUTHORIZED, "User not authorised");
  }
}

export { verifyUserAuth };
