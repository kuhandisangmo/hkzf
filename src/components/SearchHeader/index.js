import React from 'react'
// 导入轮播图组件
import { Flex } from 'antd-mobile'

// 属性校验
import Types from 'prop-types'

// 高阶组件
import { withRouter } from 'react-router-dom'

// 样式组件
import cls from 'classnames'
import styles from './index.module.scss'

function SearchHeader(props) {
  return (
    <Flex
      className={cls(styles.navHeader, {
        [props.className]: !!props.className
      })}
    >
      <Flex className={styles.navHeaderLeft}>
        {/* 左侧定位 */}
        <div
          className={styles.location}
          onClick={() => props.history.push('/cityList')}
        >
          <span>{props.cityName}</span>
          <i className="iconfont icon-arrow"></i>
        </div>
        {/* 右侧表单 */}
        <div
          className={styles.form}
          onClick={() => props.history.push('/search')}
        >
          <i className="iconfont icon-seach"></i>
          <span>请输入小区或地址</span>
        </div>
      </Flex>
      <i
        className="iconfont icon-map"
        onClick={() => {
          props.history.push('/map')
        }}
      ></i>
    </Flex>
  )
}

// 添加属性校验
SearchHeader.propTypes = {
  cityName: Types.string.isRequired,
  className: Types.string
}
export default withRouter(SearchHeader)
