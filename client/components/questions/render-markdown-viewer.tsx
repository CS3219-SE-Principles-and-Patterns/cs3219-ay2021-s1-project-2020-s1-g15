import { Editor, Viewer } from "@toast-ui/react-editor";
import { Card } from "antd";

type ViewRenderProp = {
  markdown: string;
};

export const RenderMarkdownViewer: React.FC<ViewRenderProp> = ({
  markdown,
}): JSX.Element => {
  return (
    <Card>
      <Viewer initialValue={markdown} />
    </Card>
  );
};
