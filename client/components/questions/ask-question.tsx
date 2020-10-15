/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { QuestionCircleOutlined, LeftOutlined } from "@ant-design/icons";

import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  notification,
  PageHeader,
  Select,
  Spin,
} from "antd";
import React, { useRef, useState, FC } from "react";

import { routesObject } from "../../util";
import styles from "./question.module.css";
import { Editor } from "@toast-ui/react-editor";
import { Level, Question, QuestionParam, Subject } from "../../util/types";
import { useForm } from "antd/lib/form/Form";
import { createQuestion, deleteSingleQuestion, editQuestion } from "../api";
import router from "next/router";
import { useAuth } from "../authentication";
import Link from "next/link";

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

const AskQuestionsForm: FC<AskQuestionProp> = ({ question }): JSX.Element => {
  const { isAuthenticated, getIdToken } = useAuth();
  const editor = useRef<Editor | null>(null);
  const [form] = useForm();
  const [questionLocal] = useState<Question | undefined>(question);
  const isEdit: boolean = questionLocal ? true : false;
  const [subject, setSubject] = useState<string>(question?.level ?? "");
  const [level, setLevel] = useState<string>(question?.subject ?? "");
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = (values: { title: any }) => {
    setLoading(true);
    form.validateFields().then(async (_) => {
      const { title } = values;
      const idToken = await getIdToken();
      // @ts-ignore
      const markdown = editor.current.getInstance().getMarkdown();
      const questionArg: QuestionParam = {
        title,
        markdown,
        level,
        subject,
      };
      try {
        if (isEdit) {
          if (!questionLocal) {
            throw new Error("question is undefiend");
          }

          const res: Question = await editQuestion(
            questionArg,
            idToken,
            questionLocal._id
          );
          notification.success({
            message: "Question Edited Succesfully",
            duration: 2,
          });
          router.push(`${routesObject.question}/${res._id}`);
        } else {
          const res: Question = await createQuestion(questionArg, idToken);
          notification.success({
            message: "Question Created Succesfully",
            duration: 2,
          });
          router.push(`${routesObject.question}/${res._id}`);
        }
      } catch (err) {
        notification.error({
          message: err.message,
          duration: 2,
        });
        setLoading(false);
      }
    });
  };

  const handleLevel = (value: string) => setLevel(value);
  const handleSubject = (value: string) => setSubject(value);
  const deleteQuestion = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!questionLocal) {
        throw new Error("question is undefiend");
      }
      const idToken = await getIdToken();
      await deleteSingleQuestion(idToken, questionLocal?._id);
      router.push(`${routesObject.forum}`);
    } catch (err) {
      notification.error({
        message: err.message,
        duration: 2,
      });
      setLoading(false);
    }
  };
  const layout = {};
  return (
    <>
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

      <Spin spinning={loading}>
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

                <Form.Item
                  name="title"
                  initialValue={question?.title}
                  rules={[{ required: true }]}
                >
                  <Input
                    prefix={<QuestionCircleOutlined />}
                    placeholder="e.g is there an R function?"
                  />
                </Form.Item>
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
                    initialValue={questionLocal?.markdown ?? ""}
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
            {isEdit && isAuthenticated ? (
              <Button type="primary" color="red" onClick={deleteQuestion}>
                Delete Question
              </Button>
            ) : null}
            {isAuthenticated ? (
              <Button htmlType="submit" type="primary">
                {questionLocal ? "Edit Question" : "Submit Question"}
              </Button>
            ) : (
              <Link href={routesObject.login}>
                You are not logged in. Log in to ask a question!
              </Link>
            )}
          </Form>
        </div>
      </Spin>
    </>
  );
};

export default AskQuestionsForm;
