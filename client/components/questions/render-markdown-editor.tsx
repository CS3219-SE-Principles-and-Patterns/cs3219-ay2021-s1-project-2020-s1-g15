import { Editor } from "@toast-ui/react-editor";
import { Card, Form, Button } from "antd";
import React, { useRef } from "react";

export const RenderMarkdownEditor: React.FC = (): JSX.Element => {
  const editor = useRef<Editor | null>(null);
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  return (
    <Card>
      <Form initialValues={{ remember: true }} onFinish={onFinish}>
        <Editor
          previewStyle="vertical"
          height="40vh"
          initialEditType="markdown"
          initialValue={"Your Answer here..."}
          ref={editor}
        />
        <br />
        <Button htmlType="submit" color="green">
          Submit Answer
        </Button>
      </Form>
    </Card>
  );
};
