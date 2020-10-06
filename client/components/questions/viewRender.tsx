import { Editor, Viewer } from '@toast-ui/react-editor'
import { Card } from 'antd'
import styles from './question.module.css'
type ViewRenderProp = {
  markdown: string
}

export const RenderMarkdown: React.FC<ViewRenderProp> = ({
  markdown,
}): JSX.Element => {
  return (
    <Card>
      <Viewer initialValue={markdown} />
    </Card>
  )
}
