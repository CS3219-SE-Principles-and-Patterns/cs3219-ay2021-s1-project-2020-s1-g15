import { CreateQuestionParam, GetAllQuestionsParam, Question } from '../../util'

console.log(process.env)
const baseUrl =
  process.env.NODE_ENV == 'development'
    ? `${process.env.baseUrlDev}questions/`
    : `${process.env.baseUrlDev}questions/`

export const getAllQuestion = async ({
  page,
  pageSize,
}: GetAllQuestionsParam): Promise<Question[]> => {
  const res = await fetch(baseUrl, {
    method: 'GET',
  })
  return await res.json()
}

export const getSingleQuestion = async ({ id }): Promise<Question> => {
  const res = await fetch(baseUrl + id, {
    method: 'GET',
  })
  return await res.json()
}

export const createQuestion = async (
  question: CreateQuestionParam
): Promise<any> => {
  const res = await fetch(baseUrl, {
    method: 'POST',
    body: JSON.stringify({ ...question }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return await res.json()
}
