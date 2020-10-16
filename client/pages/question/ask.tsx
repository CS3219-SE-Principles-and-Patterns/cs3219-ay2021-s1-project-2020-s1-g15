import { render } from "@testing-library/react";
import { Spin } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import React, { useEffect, useState } from "react";
import { getSingleQuestion } from "../../components/api";
import FluidPage from "../../components/layout";
import { menuKeys, pageTitles, Question } from "../../util";

const renderOnClient = (question: Question | undefined) => {
  if (typeof window !== "undefined") {
    // client-side-only code
    const AskQuestionsForm = dynamic(
      () => import("../../components/questions/ask-question")
    );
    return <AskQuestionsForm question={question} />;
  } else {
    return <></>;
  }
};
/**
 * Create question page
 * @params qid - question id : send via url params.
 * qid will determine whether or not this component will be in edited or not
 */
const AskQuestions = (): JSX.Element => {
  const router = useRouter();
  const qid = router.query.qid as string;
  const isEdit = qid !== "null";
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<Question | undefined>(undefined);

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

    if (isEdit && qid) {
      fetchQuestion(qid);
    }
  }, [isEdit, qid]);
  return (
    <FluidPage title={pageTitles.forum} selectedkey={menuKeys.question}>
      <Spin spinning={loading} tip="Loading question...">
        {renderOnClient(question)}
      </Spin>
    </FluidPage>
  );
};

export default AskQuestions;

/**
 * Example hook on checking for SSR-ed

const AskQuestions = (): JSX.Element => {
  const [isComponentMounted, setIsComponentMounted] = useState(false)

  useEffect(() => setIsComponentMounted(true), [])

  if (!isComponentMounted) {
    return null
  }

  if (typeof window !== 'undefined') {
    // client-side-only code
    const AskQuestionsForm = dynamic(
      () => import('../../components/questions/ask-question')
    )
    return <AskQuestionsForm />
  } else {
    return null
  }
}
*/
