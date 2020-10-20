import React, { FC, ReactNode } from "react";
import { List, Card, Space } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import { grey } from "@ant-design/colors";

import { Answer, markdownToReactNode, toRelativeTimeAgo } from "util/index";
import styles from "./question.module.css";

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
  return (
    <Space className={styles.my16} direction="vertical">
      <Space>
        <span style={{ color: grey[4] }}>{answer.userId}</span>
        <span style={{ color: grey[1] }}>
          {toRelativeTimeAgo(answer.createdAt)}
        </span>
      </Space>
      <article className="markdown-body">{parsedAnswerNode}</article>
    </Space>
  );
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
            <ParsedAnswerContent answer={answer} />
          </List.Item>
        )}
      />
    </Card>
  );
};

export { ViewAnswers };
