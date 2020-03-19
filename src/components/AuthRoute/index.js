/**
 * 封装 鉴权路由组件,来实现登录访问控制
 * 只有登陆了才允许访问该路由
 * 没有登录就重定向到登录页面
 */

// 创建函数组件
import React from 'react'

import { Route, Redirect } from 'react-router-dom'

import { isAuth } from '../../utils'

// 因为 component 属性表示一个组件,所有,要当成组件来渲染,就必须保证首字母大写,所有给component属性重命名,首字母大写
export default function AuthRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={data => {
        // 判断有没有登录
        // 登陆了,就渲染当前组件
        // 没有登录,就重定向到登录页面
        if (isAuth()) {
          //登录
          return <Component {...data} />
        } else {
          // 没有登录
          return (
            <Redirect
              to={{
                // 表示要跳转到的路由
                pathname: '/login',
                // 添加一个额外的信息,告诉登录页面,登录后跳转到哪
                state: { from: data.location }
              }}
            />
          )
        }
      }}
    />
  )
}
