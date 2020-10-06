import FluidPage from '../../components/layout'
import { useRouter } from 'next/router'
import { pageTitles } from '../../util'
import React from 'react'
import ViewQuestion from '../../components/questions/view'
import { Answer, Question } from '../../util/types'

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

const Questions = (): JSX.Element => {
  const router = useRouter()
  const { qid } = router.query
  return (
    <FluidPage title={pageTitles.question}>
      {<ViewQuestion question={questionMock} answers={answersMock} />}
    </FluidPage>
  )
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  //const res = await fetch(`${process.env.localhost}questions/`)
  //const data = await res.json()
  const data = {}
  // Pass data to the page via props
  return { props: { data } }
}

export default Questions
