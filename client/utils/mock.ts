import { Question, Answer } from "./types";

const questionMock: Question = {
  _id: "test_id",
  createdAt: new Date(),
  updatedAt: new Date(),
  title: "test_question", // title of the question, created by user
  markdown: "test_markdown \n asdas\n## addada adada", // markdown content, created by user
  userId: "test_id", // id of the user who created this question
  answerIds: ["test_ans_1", "test_ans_2"], // list of answers to this question, updated when adding answers
  level: "test",
  subject: "level",
  upvotes: 0, // number of upvotes, updated when adding upvotes
  downvotes: 0,
  slug: "slug-test-slug",
};

const listOfAnswersMock: Answer[] = [
  {
    _id: "01",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "test_id", // id of the user who created this question
    markdown:
      "Maybe you should try `console.log`?\n> Don't blame me if it breaks.",
    upvotes: 10,
    downvotes: 0,
  },
  {
    _id: "02",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "test_id", // id of the user who created this question
    upvotes: 1,
    downvotes: 2,
    markdown: "Here are some ways:\n- way 1\n- way 2\n- way 3",
  },
  {
    _id: "03",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "test_id", // id of the user who created this question
    markdown: "Here is another method: `if fork() fork()`",
    upvotes: 10,
    downvotes: 5,
  },
  {
    _id: "04",
    createdAt: new Date(),
    updatedAt: new Date(),
    markdown: "# Title over here cos why not\nJust do it =D",
    userId: "test_id", // id of the user who created this question
    upvotes: 1,
    downvotes: 54,
  },
];

// await new Promise((resolve) => setTimeout(resolve, 4000)); use this to set timeout in async function to test

export { questionMock, listOfAnswersMock };
