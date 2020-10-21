import React, { FC, useState } from "react";
import { Row, Form, Input, Button, notification, Space, Tabs } from "antd";

import styles from "./index.module.css";
import { Answer, createAnswer } from "utils/index";
import { AnswerPreview } from "./AnswerPreview";

const { TextArea } = Input;
const { TabPane } = Tabs;

type AnswerFormProp = {
  questionId: string;
  refreshAnswers: () => Promise<void>;
};

// config values for the form
const Config = Object.freeze({
  Markdown: Object.freeze({
    NAME: "markdown",
    PLACEHOLDER: "Write your answer here? You may use Markdown syntax.",
    REQUIRED_MESSAGE: "Answers cannot be blank",
  }),
});

const AnswerForm: FC<AnswerFormProp> = ({
  questionId,
  refreshAnswers,
}): JSX.Element => {
  const [previewMarkdown, setPreviewMarkdown] = useState<string>("");
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const resetForm = (): void => {
    form.resetFields();
    setPreviewMarkdown("");
  };

  const onFormFinish = async ({ markdown }: Pick<Answer, "markdown">) => {
    // validation will throw error and stop execution if it fails
    await form.validateFields();

    setIsLoading(true);
    await createAnswer({ markdown, questionId });
    await refreshAnswers();
    resetForm();
    notification.success({
      message: "Answer succesfully submitted",
    });
    setIsLoading(false);
  };

  const onTabChange = (key: string) => {
    if (key !== "preview") {
      return;
    }

    const { markdown }: Pick<Answer, "markdown"> = form.getFieldsValue();
    setPreviewMarkdown(markdown);
  };

  return (
    <Space style={{ width: "100%" }} direction="vertical">
      <Tabs
        className={styles.minHeight300}
        type="card"
        size="large"
        onChange={onTabChange}
      >
        <TabPane tab="Write" key="write">
          <Form form={form} onFinish={onFormFinish}>
            {/* MARKDOWN CONTENT */}
            <Form.Item
              name={Config.Markdown.NAME}
              rules={[
                {
                  required: true,
                  message: Config.Markdown.REQUIRED_MESSAGE,
                },
              ]}
            >
              <TextArea rows={10} placeholder={Config.Markdown.PLACEHOLDER} />
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="Preview" key="preview">
          <AnswerPreview answer={{ markdown: previewMarkdown }} />
        </TabPane>
      </Tabs>

      {/* FORM BUTTONS */}
      <Row justify="end">
        <Button loading={isLoading} onClick={form.submit} type="primary">
          Submit Answer
        </Button>
      </Row>
    </Space>
  );
};

export { AnswerForm };
