import { ObjectId } from "mongodb";

import { toValidObjectId } from "src/utils";

describe("Verify and transform to valid object ID", () => {
  const VALID_ID_1 = new ObjectId();
  const VALID_ID_STRING_1 = VALID_ID_1.toHexString();

  const INVALID_ID_STRING_1 = "1";

  it("should return an ObjectId for valid string and ObjectId", () => {
    expect(toValidObjectId(VALID_ID_1)).toEqual(VALID_ID_1);
    expect(toValidObjectId(VALID_ID_STRING_1)).toEqual(VALID_ID_1);
  });

  it("should throw error for invalid ObjectId", () => {
    expect(() => toValidObjectId(INVALID_ID_STRING_1)).toThrow();
  });
});
