import FluidPage from "../../components/layout";
import { useRouter } from "next/router";
import {
  listOfAnswersMock,
  pageTitles,
  Question,
  questionMock,
} from "../../util";
import React, { FC, useEffect, useState } from "react";
import ViewQuestion from "../../components/questions/view-question";
import { getSingleQuestion } from "../../components/api";
import { Spin } from "antd";

type QuestionsProps = {
  query: string;
};

const Questions: FC<QuestionsProps> = ({ query }): JSX.Element => {
  const router = useRouter();
  const { qid } = router.query;

  const [question, setQuestion] = useState<Question | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getSingleQuestion({ id: qid });
      setQuestion(data);
      setLoading(false);
    };
    fetchData();
  }, [qid]);

  return (
    <FluidPage title={pageTitles.question}>
      <Spin spinning={loading}>
        {question ? (
          <ViewQuestion question={question} answers={listOfAnswersMock} />
        ) : (
          <></>
        )}
      </Spin>
    </FluidPage>
  );
};

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  //const res = await fetch(`${process.env.localhost}questions/`)
  //const data = await res.json()
  const data = {};
  // Pass data to the page via props
  return { props: { data } };
}

export default Questions;
