import { ReactNode } from "react";
import unified from "unified";
import parse from "remark-parse";
import remark2react from "remark-react";

export function markdownToReactNode(markdown: string): ReactNode {
  // https://github.com/remarkjs/remark-react#use
  return unified().use(parse).use(remark2react).processSync(markdown)
    .result as ReactNode;
}
