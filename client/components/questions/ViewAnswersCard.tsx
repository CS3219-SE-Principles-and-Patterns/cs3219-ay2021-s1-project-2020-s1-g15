import React, { FC, ReactNode } from "react";
import { List, Card, Space, Divider, Typography } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";

import styles from "./index.module.css";
import { Answer } from "utils/index";
import { AnswerPreview } from "./AnswerPreview";
import { AnswerForm } from "./AnswerForm";

const { Text } = Typography;

type ViewAnswersCardProp = {
  answers: Answer[];
};

type IconTextProp = {
  icon: ReactNode;
  text: number;
};

const IconText: FC<IconTextProp> = ({ icon, text }): JSX.Element => (
  <Space>
    {icon}
    {text}
  </Space>
);

const ViewAnswersCard: FC<ViewAnswersCardProp> = ({ answers }): JSX.Element => {
  return (
    <Card>
      {/* ANSWERS LIST */}
      <List
        header={
          <Text style={{ fontSize: "1.2rem" }} type="secondary">
            {answers.length} Answers
          </Text>
        }
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
            <AnswerPreview
              className={`${styles.mt8} ${styles.mb16}`}
              answer={answer}
            />
          </List.Item>
        )}
      />

      <Divider />

      {/* ANSWER FORM */}
      <Space style={{ width: "100%" }} direction="vertical" size="middle">
        <Text style={{ fontSize: "1.2rem" }} type="secondary">
          Your Answer
        </Text>
        <AnswerForm />
      </Space>
    </Card>
  );
};

export { ViewAnswersCard };
