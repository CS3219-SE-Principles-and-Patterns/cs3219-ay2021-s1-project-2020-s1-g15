import FluidPage from '../../components/layout'
import { useRouter } from 'next/router'
import { pageTitles } from '../../util'

const User = (): JSX.Element => {
  const router = useRouter()
  const { qid } = router.query
  return (
    <FluidPage title={pageTitles.user}>
      {<p>I am a single User :{qid} </p>}
    </FluidPage>
  )
}

export default User
