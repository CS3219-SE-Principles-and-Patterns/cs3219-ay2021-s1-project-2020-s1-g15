import { Question } from '../../util'

const baseUrl = 'http://localhost:8000/api/questions/'

type GetAllQuestionsParam = {
  page: number
  pageSize: number
}

export const getAllQuestion = ({
  page,
  pageSize,
}: GetAllQuestionsParam): Promise<Question[]> => {
  return fetch(baseUrl, {
    method: 'GET',
  }).then((res) => res.json())
}

export const getSingleQuestion = ({ id }): Promise<Question> => {
  return fetch(baseUrl + '/' + id, {
    method: 'GET',
  }).then((res) => res.json())
}
