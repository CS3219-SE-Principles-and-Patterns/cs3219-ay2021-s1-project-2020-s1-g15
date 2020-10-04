import { Table } from 'antd'
/* eslint-disable no-console */
import FluidPage from '../../components/layout'
import { menuKeys, pageTitles } from '../../util'

const columns = [
  {
    title: 'Name (all screens)',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age (medium screen or bigger)',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address (large screen or bigger)',
    dataIndex: 'address',
    key: 'address',
  },
]

const tableData = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
]

const Forum = (_): JSX.Element => {
  return (
    <FluidPage title={pageTitles.forum} selectedkey={menuKeys.forum}>
      {
        <div>
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
