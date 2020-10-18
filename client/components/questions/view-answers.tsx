import React, { FC, ReactNode } from "react";
import { Comment, List, Card, Space } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";

import { Answer, markdownToReactNode } from "util/index";

type AnswerCardProp = {
  answer: Answer;
};

type ViewAnswersProp = {
  answers: Answer[];
};

type IconTextProp = {
  icon: ReactNode;
  text: number;
};

const ParsedAnswerContent: FC<AnswerCardProp> = ({ answer }): JSX.Element => {
  const parsedAnswerNode: ReactNode = markdownToReactNode(answer.markdown);
  return <article className="markdown-body">{parsedAnswerNode}</article>;
};

const IconText: FC<IconTextProp> = ({ icon, text }): JSX.Element => (
  <Space>
    {icon}
    {text}
  </Space>
);

const ViewAnswers: FC<ViewAnswersProp> = ({ answers }): JSX.Element => {
  return (
    <Card>
      <List
        header={`${answers.length} answers`}
        itemLayout="vertical"
        dataSource={answers}
        renderItem={(answer) => (
          <List.Item
            key={answer._id}
            actions={[
              <IconText
                key="like"
                icon={<LikeOutlined />}
                text={answer.upvotes}
              />,
              <IconText
                key="dislike"
                icon={<DislikeOutlined />}
                text={answer.downvotes}
              />,
            ]}
          >
            <Comment
              content={<ParsedAnswerContent answer={answer} />}
              author={answer.userId}
              datetime={answer.createdAt}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export { ViewAnswers };
