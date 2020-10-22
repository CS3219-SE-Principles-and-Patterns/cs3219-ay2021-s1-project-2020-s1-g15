import React, { FC, useState } from "react";
import { List, Card, Space, Typography } from "antd";

import { Answer, getAnswersOfQuestion } from "utils/index";
import { AnswerForm } from "./AnswerForm";
import { ViewAnswersCardListItem } from "./ViewAnswersCardListItem";

const { Text } = Typography;

type ViewAnswersCardProp = {
  answers: Answer[];
  questionId: string;
};

const ViewAnswersCard: FC<ViewAnswersCardProp> = ({
  answers: initialAnswers,
  questionId,
}): JSX.Element => {
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);

  const refreshAnswers = async (): Promise<void> => {
    const answers: Answer[] = await getAnswersOfQuestion({ questionId });
    setAnswers(answers);
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
      >
        {answers.map((answer) => (
          <ViewAnswersCardListItem
            key={answer._id}
            answer={answer}
            refreshAnswers={refreshAnswers}
          />
        ))}
      </List>

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
