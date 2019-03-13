import React, { Component } from 'react';
import { Tabs, Layout, Menu, Icon } from 'antd';
import Detial from './detail';
import List from './list';
import TestPage from './testpage';
import './index.css';

const TabPane = Tabs.TabPane;
const { Header, Content, Sider } = Layout;

const TABS = [
  { name: '列表', component: <List />},
  { name: '详情', component: <Detial />},
  { name: '测试', component: <TestPage />},
]
class Home extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Layout>
        <Sider
          style={{ overflow: 'auto', height: '100%', position: 'fixed', left: 0 }}
        >
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="user" />
              <span className="nav-text">列表</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="cloud-o" />
              <span className="nav-text">详情页</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: 200 }}>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <Tabs>
            {
              TABS.map((item, index)=> (<TabPane tab={item.name} key={index}>{item.component}</TabPane>))
            }
            </Tabs>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default Home;
