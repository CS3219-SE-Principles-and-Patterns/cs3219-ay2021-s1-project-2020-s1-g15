import { type } from 'os'

export type Question = {
  _id: string
  createdAt: Date
  updatedAt: Date
  title: string // title of the question, created by user
  slug?: string // URL slug, generated by title and _id
  markdown: string // markdown content, created by user
  userId: string // id of the user who created this question
  answerIds: string[] // list of answers to this question, updated when adding answers
  level: string
  subject: string
  upvotes: number // number of upvotes, updated when adding upvotes
  downvotes: number // number of downvotes, updated when adding downvotes
}

export type QuestionTableData = {
  key: number
  _id: string
  createdAt: Date
  updatedAt: Date
  title: string // title of the question, created by user
  slug?: string // URL slug, generated by title and _id
  markdown: string // markdown content, created by user
  userId: string // id of the user who created this question
  answerIds: string[] // list of answers to this question, updated when adding answers
  level: string
  subject: string
}

export type Answer = {
  _id: string
  markdown: string
  upvotes: number
  downvotes: number
}

export enum Level {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  JUNIOR_COLLEGE = 'junior college',
  DEFAULT = 'others',
}

export enum Subject {
  ENGLISH = 'english',
  MATHEMATICS = 'mathematics',
  SCIENCE = 'science',
  PHYSICS = 'physics',
  CHEMISTRY = 'chemistry',
  BIOLOGY = 'biology',
  GENERAL = 'general',
  DEFAULT = 'others',
}

// -----------------------------------------------------------------------------
// API Types
// -----------------------------------------------------------------------------

export type GetAllQuestionsParam = {
  page: number
  pageSize: number
}

export type CreateQuestionParam = {
  title: string
  markdown: string
  level: string
  subject: string
}
