export const routesObject = {
  login: "/login",
  home: "/",
  forum: "/forum",
  register: "/register",
  question: "/question",
  askQuestion: "/question/ask",
  editQuestion: (qid: string, slug: string): string =>
    `/question/${qid}/${slug}/edit`,
  user: "/user",
};

export const menuKeys = {
  login: "login",
  logout: "logout",
  home: "home",
  forum: "forum",
  register: "register",
  question: "question",
  user: "",
};
