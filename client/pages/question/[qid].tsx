import FluidPage from "../../components/layout";
import { useRouter } from "next/router";
import { listOfAnswersMock, pageTitles, Question } from "../../util";
import React, { FC, useEffect, useState } from "react";
import ViewQuestion from "../../components/questions/view-question";
import { getSingleQuestion } from "../../components/api";
import { Spin } from "antd";

type QuestionsProps = {
  query: string;
};

/**
 * A single Question Page
 * @param query : qid question id. Sent via url params
 */
const Questions: FC<QuestionsProps> = ({ query }): JSX.Element => {
  const router = useRouter();
  const qid = router.query.qid as string;

  const [question, setQuestion] = useState<Question | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuestion = async (id: string) => {
      setLoading(true);
      try {
        const question = await getSingleQuestion(id);
        setQuestion(question);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion(qid);
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
// TODO: ssr this page
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
