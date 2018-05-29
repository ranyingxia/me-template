import React, { Component } from 'react';
import { Tabs } from 'antd';
import Detial from './detail';


const TabPane = Tabs.TabPane;
const TABS = [
  { name: '列表', component: ''},
  { name: '详情', component: <Detial />},
  { name: '创建', component: ''}
]

class Home extends Component {
  render() {
    return (
      <div>
        <Tabs>
        {
          TABS.map((item, index)=> (<TabPane tab={item.name} key={index}>{item.component}</TabPane>))
        }
        </Tabs>
      </div>
    );
  }
}

export default Home;
