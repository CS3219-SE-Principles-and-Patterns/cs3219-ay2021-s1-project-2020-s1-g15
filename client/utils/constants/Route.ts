export const Route = Object.freeze({
  LOGIN: "/login",
  HOME: "/",
  FORUM: "/forum",
  REGISTER: "/register",
  QUESTION: "/question",
  QUESTION_ASK: "/question/ask",
  QUESTION_VIEW: (qid: string, slug: string): string =>
    `/question/${qid}/${slug}`,
  QUESTION_EDIT: (qid: string, slug: string): string =>
    `/question/${qid}/${slug}/edit`,
  USER: "/user",
});
