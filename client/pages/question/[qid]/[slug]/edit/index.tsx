import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, Row, Col, PageHeader } from "antd";

import FluidPage from "components/layout";
import {
  NavMenuKey,
  PageTitle,
  Route,
  GetSingleQuestionRes,
} from "utils/index";
import { QuestionForm } from "components/questions";
import { getSingleQuestion } from "utils/api";
import { useAuth } from "components/authentication";
import { LeftOutlined } from "@ant-design/icons";

const QuestionEditPage = (): JSX.Element => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [question, setQuestion] = useState<GetSingleQuestionRes | undefined>(
    undefined
  );
  // redirect if on client side
  if (typeof window !== "undefined" && !isAuthenticated) {
    router.push(Route.LOGIN);
  }

  useEffect(() => {
    const qid = router.query.qid as string | undefined;

    if (qid == null) {
      // this check is needed as qid may be null on page reload
      return;
    }

    getSingleQuestion(qid).then((question) => setQuestion(question));
  }, [isAuthenticated, router, router.query.qid]);

  return (
    <FluidPage title={PageTitle.FORUM} selectedkey={NavMenuKey.FORUM}>
      <Row justify="center">
        <Col flex="750px">
          <PageHeader
            title={<h1>Edit Question</h1>}
            backIcon={
              <LeftOutlined size={64} style={{ marginBottom: "12px" }} />
            }
            onBack={() => router.push(Route.FORUM)}
          />
          <Card>
            <QuestionForm question={question} />
          </Card>
        </Col>
      </Row>
    </FluidPage>
  );
};

export default QuestionEditPage;
