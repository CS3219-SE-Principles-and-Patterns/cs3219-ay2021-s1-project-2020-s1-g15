import { Question } from '../../util'

const baseUrl = 'http://localhost:8000/api/questions/'

type GetAllQuestionsParam = {
  page: number
  pageSize: number
}

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
