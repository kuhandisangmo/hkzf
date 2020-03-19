import React from 'react'
import { NavBar } from 'antd-mobile'
// 导入路由的高阶组件
import { withRouter } from 'react-router-dom'
// 导入属性校验
import Types from 'prop-types'
// 多个类名组合组件
import cls from 'classnames'
import './index.scss'
function NavHeader(props) {
  return (
    // <div className={`root ${props.className ? props.className : ''}`}>
    <div
      className={cls('root', {
        [props.className]: !!props.className
      })}
    >
      <NavBar
        className="navheader"
        mode="light"
        icon={<i className="iconfont icon-back" />}
        onClick={() => props.history.go(-1)}
      >
        {props.children}
      </NavBar>
    </div>
  )
}

// 天加校验
NavHeader.propTypes = {
  children: Types.string.isRequired
}
export default withRouter(NavHeader)
