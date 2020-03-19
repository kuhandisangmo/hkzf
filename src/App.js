// 根组件 配置路由信息
import React, { Suspense, lazy } from 'react'

// 导入路由文件
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

// 导入页面组件
import Home from './pages/Home'

// 导入鉴权路由组件
import AuthRoute from './components/AuthRoute'

// const Home = lazy(() => import('./routes/Home'))
const CityList = lazy(() => import('./pages/CityList'))
const Map = lazy(() => import('./pages/Map/index'))
const Details = lazy(() => import('./pages/Details'))
const Login = lazy(() => import('./pages/Login'))
const Rent = lazy(() => import('./pages/Rent'))
const RentAdd = lazy(() => import('./pages/Rent/Add'))
const RentSearch = lazy(() => import('./pages/Rent/Search'))

// 创建一个测试组件,需要登陆才能访问
export default function App() {
  // 使用Router 作为 项目的根节点
  return (
    <Router>
      <Suspense fallback={<div className="loading">loading...</div>}>
        <div className="app">
          {/*默认路由重定向 */}
          <Route path="/" exact render={() => <Redirect to="home" />} />
          {/* 配置路由规则 */}
          <Route path="/home" component={Home}></Route>
          <Route path="/cityList" component={CityList}></Route>
          <Route path="/map" component={Map}></Route>
          <Route path="/detail/:id" component={Details}></Route>
          <Route path="/login" component={Login}></Route>

          {/* 配置需要登陆才能访问的页面路由 */}
          <AuthRoute exact path="/rent" component={Rent}></AuthRoute>
          <AuthRoute path="/rent/add" component={RentAdd}></AuthRoute>
          <AuthRoute path="/rent/search" component={RentSearch}></AuthRoute>
        </div>
      </Suspense>
    </Router>
  )
}
