import FluidPage from '../../components/layout'
import { useRouter } from 'next/router'
import { pageTitles } from '../../util'

const Questions = (): JSX.Element => {
  const router = useRouter()
  const { qid } = router.query
  return (
    <FluidPage title={pageTitles.question}>
      {<p>I am a single question :{qid}</p>}
    </FluidPage>
  )
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  //const res = await fetch(`${process.env.localhost}questions/`)
  //const data = await res.json()
  const data = {}
  // Pass data to the page via props
  return { props: { data } }
}

export default Questions
