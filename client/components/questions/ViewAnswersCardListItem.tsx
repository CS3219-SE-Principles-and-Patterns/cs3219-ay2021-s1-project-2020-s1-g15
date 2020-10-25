import React, { FC, useState } from "react";
import { Button, List, Space, Row, Modal, notification } from "antd";
import {
  LikeOutlined,
  DislikeOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import styles from "./index.module.css";
import { Answer, deleteSingleAnswer, useUpvoteDownvote } from "utils/index";
import { AnswerPreview } from "./AnswerPreview";
import { AnswerForm } from "./AnswerForm";
import { useAuth } from "components/authentication";

const { confirm } = Modal;

type ViewAnswersCardListItemProp = {
  answer: Answer;
  refreshAnswers: () => Promise<void>;
};

const ViewAnswersCardListItem: FC<ViewAnswersCardListItemProp> = ({
  answer,
  refreshAnswers,
}): JSX.Element => {
  const { firebaseUser } = useAuth();
  const isAnswerOwner: boolean = firebaseUser?.uid === answer.userId;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const {
    upvotesLocal,
    downvotesLocal,
    upvoteOnClick,
    downvoteOnClick,
  } = useUpvoteDownvote({
    isAnswerVote: true,
    answerId: answer._id,
    upvotes: answer.upvotes,
    downvotes: answer.downvotes,
  });

  const onDeleteClick = (answerId: string): void => {
    confirm({
      title: "Are you sure you want to delete this answer?",
      icon: <ExclamationCircleOutlined />,
      content: "Warning: this cannot be undone!",
      okText: "Delete",
      okType: "danger",
      async onOk() {
        await deleteSingleAnswer(answerId);
        await refreshAnswers();
        notification.success({
          message: "Answer succesfully deleted",
        });
      },
    });
  };

  const onCancelEdit = (): void => {
    setIsEditing(false);
  };

  return isEditing ? (
    <List.Item>
      <AnswerForm
        isEdit={true}
        answer={answer}
        questionId={answer.questionId}
        refreshAnswers={refreshAnswers}
        onCancelEdit={onCancelEdit}
      />
    </List.Item>
  ) : (
    <List.Item>
      <Space style={{ width: "100%" }} direction="vertical" size="large">
        <AnswerPreview
          className={`${styles.mt8} ${styles.mb16}`}
          answer={answer}
        />
        <Row justify="space-between">
          <Space>
            <Button onClick={upvoteOnClick} type="text" icon={<LikeOutlined />}>
              {upvotesLocal.toString()}
            </Button>
            <Button
              onClick={downvoteOnClick}
              type="text"
              icon={<DislikeOutlined />}
            >
              {downvotesLocal.toString()}
            </Button>
          </Space>
          {isAnswerOwner ? (
            <Space>
              <Button onClick={() => onDeleteClick(answer._id)} danger>
                Delete
              </Button>
              <Button onClick={() => setIsEditing(true)} type="primary">
                Edit
              </Button>
            </Space>
          ) : null}
        </Row>
      </Space>
    </List.Item>
  );
};

export { ViewAnswersCardListItem };
