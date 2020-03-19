import React from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

import NavHeader from '../../components/NavHeader'

import { API, setToken } from '../../utils'

// 校验 formik,高阶组件 withFormik
import { withFormik, Form, Field, ErrorMessage } from 'formik'
// 配合校验的yup
import * as Yup from 'yup'

import styles from './index.module.css'

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

let Login = () => {
  return (
    <div className={styles.root}>
      {/* 顶部导航 */}
      <NavHeader className={styles.navHeader}>账号登录</NavHeader>
      <WhiteSpace size="xl" />

      {/* 登录表单 */}
      <WingBlank>
        <Form>
          <div className={styles.formItem}>
            <Field
              className={styles.input}
              name="username"
              placeholder="请输入账号"
            />
          </div>
          {/* 长度为5到8位，只能出现数字、字母、下划线 */}
          <ErrorMessage
            component="div"
            name="username"
            className={styles.error}
          />
          <div className={styles.formItem}>
            <Field
              className={styles.input}
              name="password"
              type="password"
              placeholder="请输入密码"
            />
          </div>
          {/* 长度为5到12位，只能出现数字、字母、下划线 */}
          <ErrorMessage
            component="div"
            name="password"
            className={styles.error}
          />
          <div className={styles.formSubmit}>
            <button className={styles.submit} type="submit">
              登 录
            </button>
          </div>
        </Form>
        <Flex className={styles.backHome}>
          <Flex.Item>
            <Link to="/registe">还没有账号，去注册~</Link>
          </Flex.Item>
        </Flex>
      </WingBlank>
    </div>
  )
}

// 使用withFormik 高阶组件,包装login登录页面
// 两次调用 第一次调用,用来给withFormik高阶组件传入配置.因为每个表单的功能并不一样,所以通过该配置,来告诉withFormik,当前要处理的表单有什么样的功能

// 第二次调用:包装组件
Login = withFormik({
  // 该配置项,用来给表单提供状态
  mapPropsToValues: () => ({ username: 'test2', password: 'test2' }),

  // 添加表单校验的配置项
  // object,表示校验的对象,shape 表示用来指定该对象的结构
  validationSchema: Yup.object().shape({
    username: Yup.string()
      .required('账号为必填项')
      .matches(REG_UNAME, '长度为5到8位,只能出现数字,字母,下划线'),
    password: Yup.string()
      .required('密码为必填项')
      .matches(REG_PWD, '长度为5到12位,只能出现数字,字母,下划线')
  }),

  // 第二个参数是个对象,传递给组件内部的一些属性,直接解构出props
  handleSubmit: async (values, { props }) => {
    const { username, password } = values
    const res = await API.post(`/user/login`, {
      username,
      password
    })
    const { status, body, description } = res.data
    if (status === 200) {
      // 登录成功
      // 保存token到本地缓存中
      // localStorage.setItem('itcast_token', body.token)
      setToken(body.token)

      // 判断是否是重定向过来的路由
      // 如果是,就返回重定向的页面
      // 如果不是,就返回上一页
      if (props.location.state) {
        // 返回重定向的页面
        props.history.replace(props.location.state.from.pathname)
      } else {
        props.history.go(-1)
      }
    } else if (status === 400) {
      // 登陆失败
      Toast.info(description, 1)
    }
  }
})(Login)
export default Login
