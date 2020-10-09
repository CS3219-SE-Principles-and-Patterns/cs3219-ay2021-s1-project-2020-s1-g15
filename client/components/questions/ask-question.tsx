/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { QuestionCircleOutlined, LeftOutlined } from "@ant-design/icons";

import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  notification,
  PageHeader,
  Select,
  Spin,
  Typography,
} from "antd";
import React, { useRef, useState } from "react";
import FluidPage from "../layout";

import { pageTitles, routesObject } from "../../util";
import styles from "./question.module.css";
import { Editor } from "@toast-ui/react-editor";
import {
  CreateQuestionParam,
  Level,
  Question,
  Subject,
} from "../../util/types";
import { useForm } from "antd/lib/form/Form";
import { createQuestion } from "../api";
import router from "next/router";

const { Title } = Typography;

const { Option } = Select;

const subjectOptions = [
  Subject.BIOLOGY,
  Subject.CHEMISTRY,
  Subject.DEFAULT,
  Subject.ENGLISH,
  Subject.GENERAL,
  Subject.MATHEMATICS,
  Subject.PHYSICS,
  Subject.SCIENCE,
];

const levelOptions = [
  Level.DEFAULT,
  Level.JUNIOR_COLLEGE,
  Level.SECONDARY,
  Level.PRIMARY,
];

type AskQuestionProp = {
  question?: Question | undefined;
};

const AskQuestionsForm: React.FC<AskQuestionProp> = ({
  question,
}): JSX.Element => {
  const editor = useRef<Editor | null>(null);
  const [form] = useForm();
  const [questionLocal, setQuestion] = useState<Question | undefined>(question);
  const [subject, setSubject] = useState<string>(question?.level ?? "");
  const [level, setLevel] = useState<string>(question?.subject ?? "");
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = (values: { title: any }) => {
    console.log(values);
    try {
      setLoading(true);
      form.validateFields().then(async (_) => {
        const { title } = values;
        if (editor == undefined) {
          throw new Error("editor ref undefined");
        }
        if (editor.current == undefined) {
          throw new Error("curent instance undefined");
        }
        //@ts-ignore
        const markdown = editor.current.getInstance().getMarkdown();
        const questionArg: CreateQuestionParam = {
          title,
          markdown,
          level,
          subject,
        };
        const res: Question = await createQuestion(questionArg);
        console.log(res);
        notification.open({
          message: "Success",
          duration: 2,
        });
        router.push(`${routesObject.question}/${res._id}`);
      });
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLevel = (value: string) => setLevel(value);
  const handleSubject = (value: string) => setSubject(value);

  const layout = {};
  if (!question) {
    return <>Question is null</>;
  }

  return (
    <FluidPage title={pageTitles.askQuestion}>
      <PageHeader
        title={
          questionLocal ? (
            <h1>Editing question</h1>
          ) : (
            <h1>Ask a new Public Question</h1>
          )
        }
        backIcon={<LeftOutlined className={styles.iconOffset} size={64} />}
        onBack={() => window.history.back()}
      />
      {loading ? (
        <Spin spinning={loading} />
      ) : (
        <div className={styles.mainContent}>
          <Form
            form={form}
            {...layout}
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Card className={styles.shadow}>
              <div>
                <h2>Title</h2>
                <h4>
                  Be specific and imagine you are asking a question to another
                  person
                </h4>
                {questionLocal ? (
                  <Typography>
                    <Title>{question.title}</Title>
                  </Typography>
                ) : (
                  <Form.Item name="title" rules={[]}>
                    <Input
                      prefix={<QuestionCircleOutlined />}
                      placeholder="e.g is there an R function?"
                    />
                  </Form.Item>
                )}

                <h2>Body</h2>
                <h4>
                  Include all the information someone would need to answer your
                  question
                </h4>

                {
                  <Editor
                    previewStyle="vertical"
                    height="35vh"
                    initialEditType="markdown"
                    initialValue={
                      questionLocal
                        ? questionLocal.markdown
                        : "Your question here..."
                    }
                    ref={editor}
                  />
                }

                <Divider />
                <h2>Level:</h2>
                <h4>
                  Select the level of the question you are asking e.g Junior
                  College
                </h4>
                <Select
                  style={{ width: 120 }}
                  onChange={handleLevel}
                  value={level}
                >
                  {levelOptions.map((x, index) => (
                    <Option key={index} value={x}>
                      {x}
                    </Option>
                  ))}
                </Select>
                <Divider />
                <h2>Subject:</h2>
                <h4>Select your subject the question falls under</h4>
                <Select
                  style={{ width: 120 }}
                  onChange={handleSubject}
                  value={subject}
                >
                  {subjectOptions.map((x, index) => (
                    <Option key={index} value={x}>
                      {x}
                    </Option>
                  ))}
                </Select>
              </div>
            </Card>
            <br />
            <Button htmlType="submit" type="primary">
              {questionLocal ? "Edit Question" : "Submit Question"}
            </Button>
          </Form>
        </div>
      )}
    </FluidPage>
  );
};

export default AskQuestionsForm;
