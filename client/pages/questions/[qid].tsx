import FluidPage from '../../components/layout'
import { useRouter } from 'next/router'

const Questions = (): JSX.Element => {
  const router = useRouter()
  const { qid } = router.query
  return <FluidPage>{<p>I am a single question :{qid} </p>}</FluidPage>
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`http://localhost:8000/api/questions/`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}

export default Questions
