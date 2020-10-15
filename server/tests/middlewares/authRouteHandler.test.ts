import { Request, Response, NextFunction } from "express";
import { verifyUserAuth } from "src/middlewares/authRouteHandler";
import { TestConfig, ApiErrorMessage, toValidObjectId } from "src/utils";
import { initAuth } from "src/services/authentication";

const mockRequest = (): Request => {
  return {
    headers: {},
  } as Request;
};
const mockResponse = (): Response => {
  return {
    locals: {},
  } as Response;
};
const mockNext = (): NextFunction => jest.fn();
const getMockReqResNext = () => {
  return {
    req: mockRequest(),
    res: mockResponse(),
    next: mockNext(),
  };
};

describe("Bypass auth for dev/test environment", () => {
  beforeAll(() => {
    process.env.BYPASS_AUTH = "true";
  });

  it("should set res.locals.uid to the uid of the test account", () => {
    const { req, res, next } = getMockReqResNext();

    verifyUserAuth(req, res, next);
    expect(res.locals.uid).toBe(toValidObjectId(TestConfig.DEVTESTUSER_UID));
  });

  it("should call next exactly once", async () => {
    const { req, res, next } = getMockReqResNext();

    verifyUserAuth(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe("Actual auth flow for prod environment", () => {
  beforeAll(async (done) => {
    await initAuth();
    process.env.BYPASS_AUTH = "false";
    done();
  });

  it("should throw error for missing authorization headers", () => {
    const { req, res, next } = getMockReqResNext();

    expect(verifyUserAuth(req, res, next)).rejects.toThrow(
      ApiErrorMessage.User.NOT_AUTHENTICATED
    );
  });

  it("should throw error for authorization headers not starting with 'Bearer'", () => {
    const { req, res, next } = getMockReqResNext();
    req.headers.authorization = "does not start with bearer";

    expect(verifyUserAuth(req, res, next)).rejects.toThrow(
      ApiErrorMessage.User.NOT_AUTHENTICATED
    );
  });

  it("should throw error if unable to decode token for any reason", () => {
    /**
     * In CI, the call to `verifyIdToken` will always throw an error since the
     * CI does not contain the Firebase service account credentials. Nevertheless,
     * any errors thrown by `verifyIdToken` should be deemed as failed to authenticate
     */
    const { req, res, next } = getMockReqResNext();
    req.headers.authorization = "Bearer some_fake_token_here";

    expect(verifyUserAuth(req, res, next)).rejects.toThrow(
      ApiErrorMessage.User.NOT_AUTHENTICATED
    );
  });
});
