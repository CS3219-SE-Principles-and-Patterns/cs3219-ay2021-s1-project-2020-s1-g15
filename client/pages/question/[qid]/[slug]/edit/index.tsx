import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, Row, Col } from "antd";

import FluidPage from "components/layout";
import { NavMenuKey, PageTitle, Question } from "util/index";
import { QuestionForm } from "components/questions";
import { getSingleQuestion } from "components/api";

const Edit = (): JSX.Element => {
  const router = useRouter();
  const [question, setQuestion] = useState<Question | undefined>(undefined);

  useEffect(() => {
    const qid = router.query.qid as string | undefined;

    if (qid == null) {
      // this check is needed as qid may be null on page reload
      return;
    }

    getSingleQuestion(qid).then((question) => setQuestion(question));
  }, [router.query.qid]);

  return (
    <FluidPage title={PageTitle.FORUM} selectedkey={NavMenuKey.FORUM}>
      <Row justify="center">
        <Col flex="750px">
          <Card>
            <QuestionForm question={question} />
          </Card>
        </Col>
      </Row>
    </FluidPage>
  );
};

export default Edit;
