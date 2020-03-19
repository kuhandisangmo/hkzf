// Home页面
import React, { Component, lazy } from 'react'

// 导入路由
import { Route } from 'react-router-dom'
// 导入地面四个TabBar
import Index from '../Index/index'

// 导入组件库组件
import { TabBar } from 'antd-mobile'
// 导入样式
import './index.scss'

const News = lazy(() => import('../News'))
const HouseList = lazy(() => import('../HouseList'))
const Profile = lazy(() => import('../Profile'))

const tabbars = [
  { title: '首页', icon: 'icon-ind', path: '/home' },
  { title: '找房', icon: 'icon-findHouse', path: '/home/houselist' },
  { title: '咨讯', icon: 'icon-infom', path: '/home/news' },
  { title: '我的', icon: 'icon-my', path: '/home/profile' }
]
export default class Home extends Component {
  state = {
    // 指定谁高亮  获取当前地址
    selectedTab: this.props.location.pathname
  }

  // 更新阶段的钩子函数
  // 两个参数表示更新前的props和更新前的state
  // 通过this获取当前最新的props和state
  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      // 更新状态
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }
  }
  render() {
    return (
      <div className="home">
        {/* 变化的页面 */}
        <Route path="/home" exact component={Index}></Route>
        <Route path="/home/houselist" component={HouseList}></Route>
        <Route path="/home/news" component={News}></Route>
        <Route path="/home/profile" component={Profile}></Route>
        {/* 不变的页面 */}
        <div className="tabbar-wrap">
          <TabBar
            noRenderContent
            // 选中文字颜色
            tintColor="#21B97A"
            // TabBar的背景色
            barTintColor="white"
          >
            {tabbars.map(item => (
              <TabBar.Item
                // 标题文字
                title={item.title}
                key={item.title}
                icon={<i className={`iconfont ${item.icon}`}></i>}
                selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
                selected={this.state.selectedTab === item.path}
                onPress={() => {
                  this.props.history.push(item.path)
                  // 由于上面做了判断,只要更新了地址,就会高亮,所有此处可以省略
                  // this.setState({
                  //   selectedTab: item.path
                  // })
                }}
              ></TabBar.Item>
            ))}
          </TabBar>
        </div>
      </div>
    )
  }
}
