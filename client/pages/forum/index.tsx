import { Button, Table, PageHeader } from 'antd'
import { useRouter } from 'next/router'
/* eslint-disable no-console */
import FluidPage from '../../components/layout'
import { menuKeys, pageTitles, routesObject } from '../../util'

const columns = [
  {
    title: 'Name',
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
  const dummyAsk = (e) => {
    e.preventDefault()
    router.push(`${routesObject.question}/ask`)
  }

  const view = (e) => {
    e.preventDefault()
    router.push(`${routesObject.question}/1`)
  }

  return (
    <FluidPage title={pageTitles.forum} selectedkey={menuKeys.forum}>
      {
        <div>
          <PageHeader
            title={<h1>Forum</h1>}
            subTitle="This is the forum"
            extra={[
              <Button key="3" onClick={dummyAsk}>
                Ask Question
              </Button>,
              <Button key="2" onClick={view} type="primary">
                View Question
              </Button>,
            ]}
          />

          <br />
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
