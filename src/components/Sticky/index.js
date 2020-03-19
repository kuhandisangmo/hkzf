// 吸顶功能组件
import React, { Component } from 'react'
import styles from './index.module.scss'
import Types from 'prop-types'
class Sticky extends Component {
  // 创建占位元素的ref
  placeholderRef = React.createRef()
  // 创建内容的ref
  contentRef = React.createRef()

  handleScroll = () => {
    // 占位元素的DOM对象
    const placeholderDOM = this.placeholderRef.current
    // 内容DOM对象
    const contentDOM = this.contentRef.current
    const { top } = placeholderDOM.getBoundingClientRect()

    const { height } = this.props
    if (top <= 0) {
      // 吸顶
      // 方法一:行内样式
      // contentDOM.style.position = 'fixed'
      // contentDOM.style.top = '0px'
      // contentDOM.style.width = '100% '
      // contentDOM.style.zIndex = 1
      // 方法二: 添加类名
      contentDOM.classList.add(styles.fixed)
      placeholderDOM.style.height = `${height}px`
    } else {
      // 取消吸顶,恢复默认
      // 方法一: 恢复行内样式
      // contentDOM.style.position = 'static'
      // 方法二:移除类名
      contentDOM.classList.remove(styles.fixed)
      placeholderDOM.style.height = '0px'
    }
  }
  componentDidMount() {
    // 监听浏览器滚动监听事件
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    // 解绑监听事件
    window.removeEventListener('scroll', this.handleScroll)
  }
  render() {
    return (
      <>
        {/* 占位元素 */}
        <div ref={this.placeholderRef}></div>

        {/* 内容 */}
        <div ref={this.contentRef}>{this.props.children}</div>
      </>
    )
  }
}
// 添加属性校验
Sticky.propTypes = {
  height: Types.number.isRequired
}
export default Sticky
