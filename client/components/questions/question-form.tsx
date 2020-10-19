import React, { FC, useState } from "react";
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
} from "antd";

import {
  Question,
  Subject,
  Level,
  QuestionParam,
  routesObject,
} from "util/index";
import { useAuth } from "components/authentication";
import { createQuestion } from "components/api";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

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
  const { getIdToken } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const router = useRouter();

  const onFormFinish = async (questionParam: QuestionParam) => {
    // validation will throw error and stop execution if it fails
    await form.validateFields();

    setLoading(true);
    const userIdToken = await getIdToken();
    const res: Question = await createQuestion(questionParam, userIdToken);
    notification.success({
      message: "Question created succesfully",
    });
    router.push(`${routesObject.question}/${res._id}/${res.slug}`);
    setLoading(false);
  };

  const onPreviewClick = () => {
    console.log("preview clicked");
  };

  const onSubmitClick = () => {
    form.submit();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFormFinish}>
      {/* QUESTION TITLE */}
      <Form.Item
        name={Config.Title.NAME}
        initialValue={question?.title}
        label={<FormLabel label={Config.Title.LABEL} />}
        rules={[{ required: true, message: Config.Title.REQUIRED_MESSAGE }]}
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
        initialValue={question?.markdown}
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
        initialValue={question?.level}
        label={<FormLabel label={Config.Level.LABEL} />}
        rules={[{ required: true, message: Config.Level.REQUIRED_MESSAGE }]}
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
        initialValue={question?.subject}
        label={<FormLabel label={Config.Subject.LABEL} />}
        rules={[{ required: true, message: Config.Subject.REQUIRED_MESSAGE }]}
      >
        <Select disabled={loading} placeholder={Config.Subject.PLACEHOLDER}>
          {subjectOptions.map((subject) => (
            <Option key={subject} value={subject}>
              {subject}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* FORM BUTTONS */}
      <Form.Item>
        <Row justify="end">
          <Space>
            <Button loading={loading} onClick={onPreviewClick}>
              Preview
            </Button>
            <Button loading={loading} onClick={onSubmitClick} type="primary">
              Submit
            </Button>
          </Space>
        </Row>
      </Form.Item>
    </Form>
  );
};

export { QuestionForm };
