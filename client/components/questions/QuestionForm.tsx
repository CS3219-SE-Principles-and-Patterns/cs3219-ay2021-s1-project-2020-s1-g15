import React, { FC, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import {
  Row,
  Typography,
  Form,
  Input,
  Select,
  Button,
  notification,
  Space,
  Tabs,
} from "antd";

import {
  Question,
  Subject,
  Level,
  CreateQuestionReq,
  Route,
  createQuestion,
  editQuestion,
} from "utils/index";
import { useAuth } from "components/authentication";
import QuestionPreview from "./QuestionPreview";
import Link from "next/link";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

type QuestionFormProp = {
  question?: Question | undefined;
};

type FormLabelProp = {
  label: string;
};

const FormLabel: FC<FormLabelProp> = ({ label }): JSX.Element => {
  return (
    <Title style={{ marginBottom: "0px" }} level={4}>
      {label}
    </Title>
  );
};

const subjectOptions: Subject[] = Object.values(Subject);
const levelOptions: Level[] = Object.values(Level);

// config values for the form
const Config = Object.freeze({
  Title: Object.freeze({
    NAME: "title", // the actual key used
    LABEL: "Title", // displayed to user
    PLACEHOLDER: "Write a meaningful and concise title",
    REQUIRED_MESSAGE: "Please input a title",
  }),
  Markdown: Object.freeze({
    NAME: "markdown",
    LABEL: "Content",
    PLACEHOLDER:
      "Elaborate on your question here. You may use Markdown syntax.",
    REQUIRED_MESSAGE: "Please provide some information for your question",
  }),
  Level: Object.freeze({
    NAME: "level",
    LABEL: "Level",
    PLACEHOLDER: "Choose an appropriate level",
    REQUIRED_MESSAGE: "Please select a level",
  }),
  Subject: Object.freeze({
    NAME: "subject",
    LABEL: "Subject",
    PLACEHOLDER: "Choose an appropriate subject",
    REQUIRED_MESSAGE: "Please select a subject",
  }),
});

const QuestionForm: FC<QuestionFormProp> = ({ question }): JSX.Element => {
  const isEditing: boolean = question !== undefined;
  const { getIdToken, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState<boolean>(isEditing); // set to true if editing to fetch question
  const [questionPreviewNode, setQuestionPreviewNode] = useState<ReactNode>();
  const [form] = Form.useForm();
  const router = useRouter();

  useEffect(() => {
    // force form to update initialValue when question prop changes
    // https://github.com/ant-design/ant-design/issues/22372
    form.resetFields();
    setLoading(false);
  }, [form, question]);

  const onFormFinish = async (questionReq: CreateQuestionReq) => {
    // validation will throw error and stop execution if it fails
    await form.validateFields();

    setLoading(true);
    const userIdToken = await getIdToken();
    const res: Question = isEditing
      ? await editQuestion(questionReq, userIdToken, question?._id as string)
      : await createQuestion(questionReq, userIdToken);
    notification.success({
      message: `Question succesfully ${isEditing ? "edited!" : "created!"}`,
    });
    router.push(Route.QUESTION_VIEW(res._id, res.slug));
  };

  const onTabChange = (key: string) => {
    if (key !== "preview") {
      return;
    }

    const questionReq = form.getFieldsValue() as CreateQuestionReq;
    setQuestionPreviewNode(<QuestionPreview question={questionReq} />);
  };

  return (
    <Space style={{ width: "100%" }} direction="vertical" size="large">
      <Tabs type="card" size="large" onChange={onTabChange}>
        <TabPane tab="Write" key="write">
          <Form
            form={form}
            initialValues={question}
            layout="vertical"
            onFinish={onFormFinish}
          >
            {/* QUESTION TITLE */}
            <Form.Item
              name={Config.Title.NAME}
              label={<FormLabel label={Config.Title.LABEL} />}
              rules={[
                { required: true, message: Config.Title.REQUIRED_MESSAGE },
              ]}
            >
              <Input
                disabled={loading}
                size="large"
                placeholder={Config.Title.PLACEHOLDER}
              />
            </Form.Item>

            {/* MARKDOWN CONTENT */}
            <Form.Item
              name={Config.Markdown.NAME}
              label={<FormLabel label={Config.Markdown.LABEL} />}
              rules={[
                {
                  required: true,
                  message: Config.Markdown.REQUIRED_MESSAGE,
                },
              ]}
            >
              <TextArea
                disabled={loading}
                rows={10}
                placeholder={Config.Markdown.PLACEHOLDER}
              />
            </Form.Item>

            {/* LEVEL SELECT */}
            <Form.Item
              name={Config.Level.NAME}
              label={<FormLabel label={Config.Level.LABEL} />}
              rules={[
                { required: true, message: Config.Level.REQUIRED_MESSAGE },
              ]}
            >
              <Select disabled={loading} placeholder={Config.Level.PLACEHOLDER}>
                {levelOptions.map((level) => (
                  <Option key={level} value={level}>
                    {level}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* SUBJECT SELECT */}
            <Form.Item
              name={Config.Subject.NAME}
              label={<FormLabel label={Config.Subject.LABEL} />}
              rules={[
                { required: true, message: Config.Subject.REQUIRED_MESSAGE },
              ]}
            >
              <Select
                disabled={loading}
                placeholder={Config.Subject.PLACEHOLDER}
              >
                {subjectOptions.map((subject) => (
                  <Option key={subject} value={subject}>
                    {subject}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="Preview" key="preview">
          {questionPreviewNode}
        </TabPane>
      </Tabs>

      {/* FORM BUTTONS */}
      <Row justify="end">
        {isAuthenticated ? (
          <Button loading={loading} onClick={form.submit} type="primary">
            Submit
          </Button>
        ) : (
          <Link href={Route.LOGIN}>
            You are not logged in. Log in to ask a question!
          </Link>
        )}
      </Row>
    </Space>
  );
};

export { QuestionForm };
