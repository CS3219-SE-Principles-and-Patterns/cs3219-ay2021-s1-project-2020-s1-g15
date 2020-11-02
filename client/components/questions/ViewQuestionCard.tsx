import React, { FC } from "react";
import { useRouter } from "next/router";
import { Card, Divider, Space, Row, Button, Modal, notification } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { Route, deleteSingleQuestion, GetSingleQuestionRes } from "utils/index";
import { useAuth } from "components/authentication";
import QuestionPreview from "./QuestionPreview";

const { confirm } = Modal;

type ViewQuestionCardProp = {
  question: GetSingleQuestionRes;
};

const ViewQuestionCard: FC<ViewQuestionCardProp> = ({
  question,
}): JSX.Element => {
  const { user, idToken } = useAuth();
  const router = useRouter();
  const belongsToUser: boolean = !!user && user._id === question.user._id;

  const onEditClick = () => {
    router.push(Route.QUESTION_EDIT(question._id, question.slug));
  };

  const onDeleteClick = () => {
    confirm({
      title: "Are you sure you want to delete this question?",
      icon: <ExclamationCircleOutlined />,
      content: "Warning: this cannot be undone!",
      okText: "Delete",
      okType: "danger",
      async onOk() {
        await deleteSingleQuestion(idToken, question._id);
        notification.success({
          message: "Question succesfully deleted",
        });
        router.push(Route.FORUM);
      },
    });
  };

  return (
    <Card>
      <QuestionPreview question={question} />

      {belongsToUser ? (
        <>
          <Divider />

          <Row justify="end">
            <Space>
              <Button danger onClick={onDeleteClick}>
                Delete
              </Button>
              <Button type="primary" onClick={onEditClick}>
                Edit
              </Button>
            </Space>
          </Row>
        </>
      ) : null}
    </Card>
  );
};

export { ViewQuestionCard };
