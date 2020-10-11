import { Editor, Viewer } from "@toast-ui/react-editor";
import { Card } from "antd";
import { FC } from "react";

type ViewRenderProp = {
  markdown: string;
};

export const RenderMarkdownViewer: FC<ViewRenderProp> = ({
  markdown,
}): JSX.Element => {
  return (
    <Card>
      <Viewer initialValue={markdown} />
    </Card>
  );
};
