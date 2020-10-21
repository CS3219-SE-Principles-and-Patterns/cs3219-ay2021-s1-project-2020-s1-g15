import React, { FC } from "react";
import { Space, Typography } from "antd";
import { grey } from "@ant-design/colors";

import { Answer, markdownToReactNode, toRelativeTimeAgo } from "utils/index";

const { Paragraph, Text } = Typography;

type AnswerPreviewProps = {
  answer: Partial<Answer> & Pick<Answer, "markdown">;
  className?: string;
};

const AnswerPreview: FC<AnswerPreviewProps> = ({
  answer,
  className,
}): JSX.Element => {
  const { userId, createdAt, markdown } = answer;
  const hasMarkdownContent: boolean = !!markdown && !!markdown.trim();

  return (
    <Space style={{ width: "100%" }} direction="vertical" className={className}>
      {userId && createdAt ? (
        <Space>
          <span style={{ color: grey[4] }}>{userId}</span>
          <span style={{ color: grey[1] }}>{toRelativeTimeAgo(createdAt)}</span>
        </Space>
      ) : null}
      <article className="markdown-body">
        {hasMarkdownContent ? (
          markdownToReactNode(markdown)
        ) : (
          <Paragraph type="secondary">No content yet.</Paragraph>
        )}
      </article>
    </Space>
  );
};

export { AnswerPreview };
