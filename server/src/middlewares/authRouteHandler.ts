import { Request, Response, NextFunction } from "express";

import { getAuth } from "../services/authentication";
import {
  HttpStatusCode,
  ApiError,
  ApiErrorMessage,
  TestConfig,
  shouldBypassAuth,
  isDevEnv,
  isTestEnv,
} from "../utils";

/**
 * Middleware for authenticated routes. This middleware will extract the `uid`
 * from the provided token in the request headers, and store it in `res.locals`.
 * If no token is provided, or if the token is invalid, an `ApiError` will be
 * thrown with a HTTP 401 UNAUTHORIZED error. If this function succeeds without
 * throwing errors, `res.locals` is guaranteed to have the valid `uid` key.
 *
 * If `process.env.BYPASS_AUTH` is set to the string `true`, and if we are in the
 * `dev` or `test` environemnt, this function will store in `res.locals` the `uid`
 * of the testing account `devtestuser@answerleh.com`.
 */
async function verifyUserAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if ((isDevEnv() || isTestEnv()) && shouldBypassAuth()) {
    console.log(
      `WARNING: bypassing Firebase Auth and using ${TestConfig.DEVTESTUSER_EMAIL} as user`
    );
    res.locals.uid = TestConfig.DEVTESTUSER_UID;
    next();
    return;
  }

  const authHeader: string | undefined = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new ApiError(
      HttpStatusCode.UNAUTHORIZED,
      ApiErrorMessage.User.NOT_AUTHENTICATED
    );
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
    throw new ApiError(
      HttpStatusCode.UNAUTHORIZED,
      ApiErrorMessage.User.NOT_AUTHENTICATED
    );
  }
}

export { verifyUserAuth };
