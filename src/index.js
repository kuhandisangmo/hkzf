import React from 'react'
import ReactDOM from 'react-dom'
// 导入react-virtualized样式文件
import 'react-virtualized/styles.css'
// 组件库样式
// import 'antd-mobile/dist/antd-mobile.css'

// 导入字体图标文件
import './assets/fonts/iconfont.css'
// 导入根组件
import App from './App'
// 导入自己写的全局样式
import './index.scss'

ReactDOM.render(<App />, document.getElementById('root'))
