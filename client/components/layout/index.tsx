import { FC } from 'react'
import { Layout, Menu } from 'antd'
import styles from './Layout.module.css'
import Link from 'next/link'
import { routesObject } from '../../util'
const { Header, Footer, Content } = Layout

type props = {
  children: React.ReactNode
}

const FluidPage: FC<props> = ({ children }) => {
  return (
    <Layout>
      <Header
        className={styles.header}
        style={{ position: 'fixed', zIndex: 1, width: '100%' }}
      >
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1">
            <Link href={routesObject.home}>Home</Link>
          </Menu.Item>
          <Menu.Item key="2">
            {' '}
            <Link href={routesObject.login}>Login</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link href={routesObject.forum}>Forum</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content className={styles.content}>{children}</Content>
      <Footer className={styles.footer}></Footer>
    </Layout>
  )
}

export default FluidPage
