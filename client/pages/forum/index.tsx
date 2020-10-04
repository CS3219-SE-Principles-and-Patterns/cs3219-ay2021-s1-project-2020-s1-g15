/* eslint-disable no-console */
import FluidPage from '../../components/layout'
import { pageTitles } from '../../util'

const Forum = ({ data }): JSX.Element => {
  console.log(data)
  return <FluidPage title={pageTitles.forum}>{<p>I am forum</p>}</FluidPage>
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch('http://localhost:8000/api/questions/', {
    method: 'GET',
  })
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}
export default Forum
