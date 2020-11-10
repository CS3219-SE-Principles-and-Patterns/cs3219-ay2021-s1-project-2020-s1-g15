import React, { FC } from "react";
import Link from "next/link";
import { Space, Typography } from "antd";
import { grey } from "@ant-design/colors";

import {
  Answer,
  markdownToReactNode,
  toRelativeTimeAgo,
  GetSingleAnswerRes,
  Route,
} from "utils/index";

const { Paragraph } = Typography;

type AnswerPreviewProps = {
  answer: Partial<GetSingleAnswerRes> & Pick<Answer, "markdown">;
  className?: string;
};

const AnswerPreview: FC<AnswerPreviewProps> = ({
  answer,
  className,
}): JSX.Element => {
  const { user, createdAt, markdown } = answer;
  const hasMarkdownContent: boolean = !!markdown && !!markdown.trim();

  return (
    <Space style={{ width: "100%" }} direction="vertical" className={className}>
      {user && createdAt ? (
        <Space>
          <Link
            href={`${Route.USER}/[username]`}
            as={`${Route.USER}/${user.username}`}
          >
            {`@${user.username}`}
          </Link>
          <span style={{ color: grey[3] }}>{toRelativeTimeAgo(createdAt)}</span>
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
