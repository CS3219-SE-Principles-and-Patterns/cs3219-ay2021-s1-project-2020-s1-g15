import React, { FC, useState } from "react";
import {
  Button,
  List,
  Card,
  Space,
  Row,
  Typography,
  Modal,
  notification,
} from "antd";
import {
  LikeOutlined,
  DislikeOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import styles from "./index.module.css";
import {
  Answer,
  getAnswersOfQuestion,
  deleteSingleAnswer,
  useFirebaseAuthentication,
} from "utils/index";
import { AnswerPreview } from "./AnswerPreview";
import { AnswerForm } from "./AnswerForm";

const { Text } = Typography;
const { confirm } = Modal;

type ViewAnswersCardProp = {
  answers: Answer[];
  questionId: string;
};

const ViewAnswersCard: FC<ViewAnswersCardProp> = ({
  answers: initialAnswers,
  questionId,
}): JSX.Element => {
  const firebaseUser = useFirebaseAuthentication();
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);

  const refreshAnswers = async (): Promise<void> => {
    const answers: Answer[] = await getAnswersOfQuestion({ questionId });
    setAnswers(answers);
  };

  const onDeleteClick = (answerId: string) => {
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

  return (
    <Card>
      {/* ANSWERS LIST */}
      <List
        header={
          <Text style={{ fontSize: "1.2rem" }} type="secondary">
            {answers.length} Answers
          </Text>
        }
        footer=" " // hack for last item to have border as well
        itemLayout="vertical"
        dataSource={answers}
        renderItem={(answer) => (
          <List.Item key={answer._id}>
            <Space style={{ width: "100%" }} direction="vertical" size="large">
              <AnswerPreview
                className={`${styles.mt8} ${styles.mb16}`}
                answer={answer}
              />
              <Row justify="space-between">
                <Space>
                  <Button type="text" icon={<LikeOutlined />}>
                    {answer.upvotes.toString()}
                  </Button>
                  <Button type="text" icon={<DislikeOutlined />}>
                    {answer.downvotes.toString()}
                  </Button>
                </Space>
                {firebaseUser !== null && firebaseUser.uid === answer.userId ? (
                  <Space>
                    <Button onClick={() => onDeleteClick(answer._id)} danger>
                      Delete
                    </Button>
                  </Space>
                ) : null}
              </Row>
            </Space>
          </List.Item>
        )}
      />

      {/* CREATE ANSWER FORM */}
      <Space style={{ width: "100%" }} direction="vertical" size="middle">
        <Text style={{ fontSize: "1.2rem" }} type="secondary">
          Your Answer
        </Text>
        <AnswerForm questionId={questionId} refreshAnswers={refreshAnswers} />
      </Space>
    </Card>
  );
};

export { ViewAnswersCard };
