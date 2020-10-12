import { titleToSlug } from "../../src/utils";

const TITLE_1 = "This is a NEW question!";
const TITLE_2 = "Why is 2+2=4?";
const TITLE_3 = "What does this HTML snippet do: `<div>   hello</div>`?";

const SLUG_1 = "this-is-a-new-question";
const SLUG_2 = "why-is-224";
const SLUG_3 = "what-does-this-html-snippet-do-div-hello-div";

describe("Slugify title", () => {
  it("should return correct slugs", () => {
    expect(titleToSlug(TITLE_1)).toBe(SLUG_1);
    expect(titleToSlug(TITLE_2)).toBe(SLUG_2);
    expect(titleToSlug(TITLE_3)).toBe(SLUG_3);
  });
});
