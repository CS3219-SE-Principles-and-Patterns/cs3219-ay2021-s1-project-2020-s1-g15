import { Button, Table } from 'antd'
import { useRouter } from 'next/router'
/* eslint-disable no-console */
import FluidPage from '../../components/layout'
import { menuKeys, pageTitles, routesObject } from '../../util'

const columns = [
  {
    title: 'Name (all screens)',
    dataIndex: 'name',
    key: 'name',
  },
]

const tableData = [
  {
    key: '1',
    name: 'John Brown',
  },
]

const Forum = (_): JSX.Element => {
  const router = useRouter()
  const dummy = (e) => {
    e.preventDefault()
    //router.push(`${routesObject.question}/1`)
    router.push(`${routesObject.question}/ask`)
  }
  return (
    <FluidPage title={pageTitles.forum} selectedkey={menuKeys.forum}>
      {
        <div>
          <h1>Forum</h1>
          <Button onClick={dummy}>Ask Question</Button>

          <Table columns={columns} dataSource={tableData} />
        </div>
      }
    </FluidPage>
  )
}

// This gets called on every request
export async function getServerSideProps() {
  /*
  // Fetch data from external API
  const res = await fetch('http://localhost:8000/api/questions/', {
    method: 'GET',
  })
  const data = await res.json()
*/
  const data = {}
  // Pass data to the page via props
  return { props: { data } }
}
export default Forum
