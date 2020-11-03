import React, { FC, useState, useEffect } from "react";
import { Button, List, Space, Row, Modal, notification } from "antd";
import {
  LikeOutlined,
  LikeFilled,
  DislikeOutlined,
  DislikeFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import styles from "./index.module.css";
import {
  deleteSingleAnswer,
  useUpvoteDownvote,
  VoteStatus,
  GetSingleAnswerRes,
} from "utils/index";
import { AnswerPreview } from "./AnswerPreview";
import { AnswerForm } from "./AnswerForm";
import { useAuth } from "components/authentication";

const { confirm } = Modal;

type ViewAnswersCardListItemProp = {
  answer: GetSingleAnswerRes;
  refreshAnswers: () => Promise<void>;
  voteStatus: VoteStatus | undefined; // undefined if user is not auth
};

const ViewAnswersCardListItem: FC<ViewAnswersCardListItemProp> = ({
  answer,
  refreshAnswers,
  voteStatus,
}): JSX.Element => {
  const { firebaseUser, idToken } = useAuth();
  const isAnswerOwner: boolean = firebaseUser?.uid === answer.user._id;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const {
    setHasUpvoted,
    setHasDownvoted,
    hasUpvoted,
    hasDownvoted,
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

  useEffect(() => {
    setHasUpvoted(voteStatus?.isUpvote ?? false);
    setHasDownvoted(voteStatus?.isDownvote ?? false);
  }, [voteStatus, setHasUpvoted, setHasDownvoted]);

  const onDeleteClick = (answerId: string): void => {
    confirm({
      title: "Are you sure you want to delete this answer?",
      icon: <ExclamationCircleOutlined />,
      content: "Warning: this cannot be undone!",
      okText: "Delete",
      okType: "danger",
      async onOk() {
        await deleteSingleAnswer(idToken, answerId);
        await refreshAnswers();
        notification.success({
          message: "Answer successfully deleted",
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
            <Button
              onClick={upvoteOnClick}
              type="text"
              icon={hasUpvoted ? <LikeFilled /> : <LikeOutlined />}
            >
              {upvotesLocal.toString()}
            </Button>
            <Button
              onClick={downvoteOnClick}
              type="text"
              icon={hasDownvoted ? <DislikeFilled /> : <DislikeOutlined />}
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
