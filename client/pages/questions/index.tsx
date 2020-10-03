import FluidPage from '../../components/layout'
import { useRouter } from 'next/router'

const Questions = (): JSX.Element => {
  const router = useRouter()
  const { qid } = router.query
  return <FluidPage>{<p>I am a single question :{qid} </p>}</FluidPage>
}

export default Questions
