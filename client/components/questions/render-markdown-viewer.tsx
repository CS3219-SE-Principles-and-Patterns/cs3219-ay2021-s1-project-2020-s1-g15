import { Editor, Viewer } from "@toast-ui/react-editor";
import { Card } from "antd";
import { FC } from "react";

type ViewRenderProp = {
  markdown: string;
  className?: string;
};

export const RenderMarkdownViewer: FC<ViewRenderProp> = ({
  markdown,
  className,
}): JSX.Element => {
  return (
    <Card className={className}>
      <Viewer initialValue={markdown} />
    </Card>
  );
};
