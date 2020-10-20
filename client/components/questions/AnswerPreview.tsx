import React, { FC } from "react";
import { Space } from "antd";
import { grey } from "@ant-design/colors";

import { Answer, markdownToReactNode, toRelativeTimeAgo } from "utils/index";
import styles from "./index.module.css";

type AnswerPreviewProps = {
  answer: Answer;
};

const AnswerPreview: FC<AnswerPreviewProps> = ({ answer }): JSX.Element => {
  return (
    <Space className={styles.my16} direction="vertical">
      <Space>
        <span style={{ color: grey[4] }}>{answer.userId}</span>
        <span style={{ color: grey[1] }}>
          {toRelativeTimeAgo(answer.createdAt)}
        </span>
      </Space>
      <article className="markdown-body">
        {markdownToReactNode(answer.markdown)}
      </article>
    </Space>
  );
};

export { AnswerPreview };
