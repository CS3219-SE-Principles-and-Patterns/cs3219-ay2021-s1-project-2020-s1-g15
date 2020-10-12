import { ObjectId } from "mongodb";

import ApiError from "./errors/ApiError";
import HttpStatusCode from "./HttpStatusCode";

/**
 * Checks if the provided `id` argument is a valid `ObjectId`, and returns
 * the `ObjectId` instance if so. If `id` is not valid, an `ApiError` will
 * be thrown with HTTP 400 (BAD REQUEST).
 *
 * @param id the id to verify
 * @returns the valid `ObjectId` instance
 */
function toValidObjectId(id: string | ObjectId): ObjectId {
  if (!ObjectId.isValid(id)) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      `Invalid ID detected: ${id}`
    );
  }

  return new ObjectId(id);
}

export default toValidObjectId;
