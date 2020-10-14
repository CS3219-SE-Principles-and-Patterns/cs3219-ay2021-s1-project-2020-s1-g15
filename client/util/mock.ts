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
    markdown: "test_markdown \n asdas\n## addada adada",
    upvotes: 10,
    downvotes: 0,
  },
  {
    _id: "02",
    upvotes: 10,
    downvotes: 0,
    markdown: "test_markdown \n asdas\n## addada adada",
  },
  {
    _id: "03",
    markdown: "test_markdown \n asdas\n## addada adada",
    upvotes: 10,
    downvotes: 0,
  },
  {
    _id: "04",
    markdown: "test_markdown \n asdas\n## addada adada",
    upvotes: 10,
    downvotes: 0,
  },
  {
    _id: "05",
    markdown: "test_markdown \n asdas\n## addada adada",
    upvotes: 10,
    downvotes: 0,
  },
];

// await new Promise((resolve) => setTimeout(resolve, 4000)); use this to set timeout in async function to test

export { questionMock, listOfAnswersMock };
