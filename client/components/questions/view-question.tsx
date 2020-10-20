import React, { FC } from "react";
import { useRouter } from "next/router";
import { Card, Divider, Space, Row, Button, Modal, notification } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { Question, routesObject } from "util/index";
import { deleteSingleQuestion } from "components/api";
import { useAuth } from "components/authentication";
import ViewQuestionPreview from "./view-question-preview";

const { confirm } = Modal;

type ViewQuestionProp = {
  question: Question;
};

const ViewQuestion: FC<ViewQuestionProp> = ({ question }): JSX.Element => {
  const { user, getIdToken } = useAuth();
  const router = useRouter();
  const belongsToUser: boolean = !!user && user._id === question.userId;

  const onEditClick = () => {
    router.push(routesObject.editQuestion(question._id, question.slug));
  };

  const onDeleteClick = () => {
    confirm({
      title: "Are you sure you want to delete this question?",
      icon: <ExclamationCircleOutlined />,
      content: "Warning: this cannot be undone!",
      okText: "Delete",
      okType: "danger",
      async onOk() {
        const userIdToken = await getIdToken();
        await deleteSingleQuestion(userIdToken, question._id);
        notification.success({
          message: "Question succesfully deleted",
        });
        router.push(routesObject.forum);
      },
    });
  };

  return (
    <Card>
      <ViewQuestionPreview question={question} />

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

export { ViewQuestion };
