import { Question, Answer } from './types'

const questionMock: Question = {
  id: 'test_id',
  createdAt: new Date(),
  updatedAt: new Date(),
  title: 'test_question', // title of the question, created by user
  markdown: 'test_markdown \n asdas\n## addada adada', // markdown content, created by user
  userId: 'test_id', // id of the user who created this question
  answerIds: ['test_ans_1', 'test_ans_2'], // list of answers to this question, updated when adding answers
  level: 'test',
  subject: 'level',
  upvotes: 0, // number of upvotes, updated when adding upvotes
  downvotes: 0,
}

const answersMock: Answer[] = [
  {
    id: '01',
    markdown: 'test_markdown \n asdas\n## addada adada',
    upvotes: 10,
    downvotes: 0,
  },
  {
    id: '02',
    upvotes: 10,
    downvotes: 0,
    markdown: 'test_markdown \n asdas\n## addada adada',
  },
  {
    id: '03',
    markdown: 'test_markdown \n asdas\n## addada adada',
    upvotes: 10,
    downvotes: 0,
  },
  {
    id: '04',
    markdown: 'test_markdown \n asdas\n## addada adada',
    upvotes: 10,
    downvotes: 0,
  },
  {
    id: '05',
    markdown: 'test_markdown \n asdas\n## addada adada',
    upvotes: 10,
    downvotes: 0,
  },
]

export { questionMock, answersMock }
