import React, { FC, ReactNode } from "react";
import unified from "unified";
import parse from "remark-parse";
import remark2react from "remark-react";
import { Typography, Card, Tag, Divider, Space } from "antd";

import { Question } from "util/index";

type ViewQuestionProp = {
  question: Question;
};

const { Title } = Typography;

function markdownToReactNode(markdown: string): ReactNode {
  // https://github.com/remarkjs/remark-react#use
  return unified().use(parse).use(remark2react).processSync(markdown)
    .result as ReactNode;
}

const ViewQuestion: FC<ViewQuestionProp> = ({ question }): JSX.Element => {
  const parsedQuestionNode: ReactNode = markdownToReactNode(question.markdown);

  return (
    <Card>
      <Typography>
        <Title level={1}>{question.title}</Title>
      </Typography>
      <Space direction="vertical">
        <div>
          <Tag>{question.createdAt}</Tag>
          <Tag>{question.userId}</Tag>
        </div>
        <div>
          <Tag color="geekblue">{question.level}</Tag>
          <Tag color="geekblue">{question.subject}</Tag>
        </div>
      </Space>
      <Divider />
      <article className="markdown-body">{parsedQuestionNode}</article>
    </Card>
  );
};

export default ViewQuestion;
