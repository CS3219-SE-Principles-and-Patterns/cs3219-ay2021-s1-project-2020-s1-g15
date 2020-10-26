import React, { FC, useState, useEffect } from "react";
import { List, Card, Space, Typography } from "antd";

import {
  Answer,
  getAnswersOfQuestion,
  CheckAnswerVoteStatusRes,
  checkAnswerVoteStatus,
} from "utils/index";
import { AnswerForm } from "./AnswerForm";
import { ViewAnswersCardListItem } from "./ViewAnswersCardListItem";
import { useAuth } from "components/authentication";

const { Text } = Typography;

type ViewAnswersCardProp = {
  answers: Answer[];
  questionId: string;
};

const ViewAnswersCard: FC<ViewAnswersCardProp> = ({
  answers: initialAnswers,
  questionId,
}): JSX.Element => {
  const { isAuthenticated, idToken } = useAuth();
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);
  const [answerVoteStatusMap, setAnswerVoteStatusMap] = useState<
    CheckAnswerVoteStatusRes
  >({});

  useEffect(() => {
    (async function () {
      if (!isAuthenticated || answers.length === 0) {
        // don't check answer vote status if not auth or no answers present
        return;
      }

      const answerIds: string[] = answers.map((answer) => answer._id);
      const voteStatus: CheckAnswerVoteStatusRes = await checkAnswerVoteStatus(
        idToken,
        answerIds
      );
      setAnswerVoteStatusMap(voteStatus);
    })();
  }, [answers, isAuthenticated, idToken]);

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
            voteStatus={answerVoteStatusMap[answer._id]}
          />
        ))}
      </List>

      {/* CREATE ANSWER FORM */}
      {isAuthenticated ? (
        <Space style={{ width: "100%" }} direction="vertical" size="middle">
          <Text style={{ fontSize: "1.2rem" }} type="secondary">
            Your Answer
          </Text>
          <AnswerForm questionId={questionId} refreshAnswers={refreshAnswers} />
        </Space>
      ) : null}
    </Card>
  );
};

export { ViewAnswersCard };
