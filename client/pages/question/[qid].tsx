import FluidPage from "../../components/layout";
import { useRouter } from "next/router";
import { answersMock, pageTitles, Question, questionMock } from "../../util";
import React, { useEffect, useState } from "react";
import ViewQuestion from "../../components/questions/view-question";
import { getAllQuestion, getSingleQuestion } from "../../components/api";
import { Spin } from "antd";

const Questions = ({ query }): JSX.Element => {
  const router = useRouter();
  const { qid } = router.query;

  const [question, setQuestion] = useState<Question | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log("triggered fetch");
      setLoading(true);
      const data = await getSingleQuestion({ id: qid });
      setQuestion(data);
      setLoading(false);
    };
    console.log(qid);
    fetchData();
  }, []);

  return (
    <FluidPage title={pageTitles.question}>
      <Spin spinning={loading}>
        {question ? (
          <ViewQuestion question={question} answers={answersMock} />
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
