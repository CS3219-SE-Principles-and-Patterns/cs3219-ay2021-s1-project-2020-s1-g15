import { ObjectId } from "mongodb";

import { titleToSlug, toValidObjectId } from "src/utils";

describe("titleToSlug", () => {
  const TITLE_1 = "This is a NEW question!";
  const TITLE_2 = "Why is 2+2=4?";
  const TITLE_3 = "What does this HTML snippet do: `<div>   hello</div>`?";

  const SLUG_1 = "this-is-a-new-question";
  const SLUG_2 = "why-is-224";
  const SLUG_3 = "what-does-this-html-snippet-do-div-hello-div";

  it("should return correct slugs", () => {
    expect(titleToSlug(TITLE_1)).toBe(SLUG_1);
    expect(titleToSlug(TITLE_2)).toBe(SLUG_2);
    expect(titleToSlug(TITLE_3)).toBe(SLUG_3);
  });
});

describe("toValidObjectId", () => {
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
