import React, { FC, ReactNode } from "react";
import { List, Card, Space } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";

import { Answer } from "utils/index";
import { AnswerPreview } from "./AnswerPreview";

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
            <AnswerPreview answer={answer} />
          </List.Item>
        )}
      />
    </Card>
  );
};

export { ViewAnswersCard };
