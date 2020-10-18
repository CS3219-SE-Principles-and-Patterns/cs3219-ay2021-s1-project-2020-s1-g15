import React, { FC, ReactNode } from "react";
import unified from "unified";
import parse from "remark-parse";
import remark2react from "remark-react";

import { Question, Answer } from "util/index";

type ViewQuestionProp = {
  question: Question;
  answers: Answer[];
};

function markdownToReactNode(markdown: string): ReactNode {
  // https://github.com/remarkjs/remark-react#use
  return unified().use(parse).use(remark2react).processSync(markdown)
    .result as ReactNode;
}

const ViewQuestion: FC<ViewQuestionProp> = ({
  question,
  answers,
}): JSX.Element => {
  const parsedQuestionNode: ReactNode = markdownToReactNode(question.markdown);

  return <div>{parsedQuestionNode}</div>;
};

export default ViewQuestion;
