import FluidPage from '../../components/layout'
import { useRouter } from 'next/router'
import { pageTitles } from '../../util'

const Questions = (): JSX.Element => {
  const router = useRouter()
  const { qid } = router.query
  return (
    <FluidPage title={pageTitles.question}>
      {<p>I am a single question :{qid} </p>}
    </FluidPage>
  )
}

export default Questions
