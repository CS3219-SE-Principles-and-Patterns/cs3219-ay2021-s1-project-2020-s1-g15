import React, { FC, useState, ReactNode } from "react";
import { Row, Form, Input, Button, notification, Space, Tabs } from "antd";

import { Answer } from "utils/index";
import { AnswerPreview } from "./AnswerPreview";

const { TextArea } = Input;
const { TabPane } = Tabs;

// config values for the form
const Config = Object.freeze({
  Markdown: Object.freeze({
    NAME: "markdown",
    PLACEHOLDER: "Write your answer here? You may use Markdown syntax.",
    REQUIRED_MESSAGE: "Answers cannot be blank",
  }),
});

const AnswerForm: FC = (): JSX.Element => {
  const [answerPreviewNode, setAnswerPreviewNode] = useState<ReactNode>();
  const [form] = Form.useForm();

  const onFormFinish = async ({ markdown }: Pick<Answer, "markdown">) => {
    // validation will throw error and stop execution if it fails
    await form.validateFields();
  };

  const onTabChange = (key: string) => {
    if (key !== "preview") {
      return;
    }

    const answer: Pick<Answer, "markdown"> = form.getFieldsValue();
    setAnswerPreviewNode(<AnswerPreview answer={answer} />);
  };

  return (
    <Space style={{ width: "100%" }} direction="vertical">
      <Tabs type="card" size="large" onChange={onTabChange}>
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
          {answerPreviewNode}
        </TabPane>
      </Tabs>

      {/* FORM BUTTONS */}
      <Row justify="end">
        <Button onClick={form.submit} type="primary">
          Submit Answer
        </Button>
      </Row>
    </Space>
  );
};

export { AnswerForm };
