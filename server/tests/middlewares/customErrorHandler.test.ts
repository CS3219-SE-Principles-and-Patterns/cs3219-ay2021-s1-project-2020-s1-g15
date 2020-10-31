import { Request, Response, NextFunction } from "express";
import { ApiError } from "src/utils";
import customErrorHandler from "src/middlewares/customErrorHandler";

const mockRequest = (): Request => {
  return {} as Request;
};
const mockResponse = (): Response => {
  return ({
    locals: {
      body: null, // mocked to use this to store the json which is sent
    },
    statusCode: undefined,
    status: function (code: number) {
      (this as Response).statusCode = code;
      return this;
    },
    json: function (body: unknown) {
      (this as Response).locals.body = body; // mock json to store in res.locals
    },
  } as unknown) as Response;
};
const mockNext = (): NextFunction => jest.fn();
const getMockReqResNext = function () {
  return {
    req: mockRequest(),
    res: mockResponse(),
    next: mockNext(),
  };
};
const mockApiError = () => new ApiError(0, "MESSAGE");
const mockError = () => new Error("MESSAGE");

beforeAll(() => {
  process.env.NODE_ENV = "test";
});

describe("Handle ApiError", () => {
  it("should not call next handler", async () => {
    const { req, res, next } = getMockReqResNext();
    const apiError = mockApiError();

    await customErrorHandler(apiError, req, res, next);

    expect(next).not.toBeCalled();
  });

  it("should set response appropriately", async () => {
    const { req, res, next } = getMockReqResNext();
    const apiError = mockApiError();

    await customErrorHandler(apiError, req, res, next);

    expect(res.statusCode).toBe(apiError.status);
    expect(res.locals.body).toEqual({
      status: apiError.status,
      message: apiError.message,
    });
  });
});

describe("Handle other errors", () => {
  it("should call next function with the error exactly once", async () => {
    const { req, res, next } = getMockReqResNext();
    const error = mockError();

    await customErrorHandler(error, req, res, next);

    expect(next).toBeCalledWith(error);
    expect(next).toBeCalledTimes(1);
  });
});
