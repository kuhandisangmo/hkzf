import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import { getCity, API } from '../../../utils'

// 导入工具库lodash
import debounce from 'lodash/debounce'

import styles from './index.module.css'

export default class Search extends Component {
  // 当前城市id
  cityId = getCity().value

  state = {
    // 搜索框的值
    searchTxt: '',
    // 搜索到的小区信息
    tipsList: []
  }

  // 使用lodash创建防抖函数
  searchCommunity = debounce(async searchTxt => {
    const res = await API.get(`/area/community`, {
      params: {
        name: searchTxt,
        id: this.cityId
      }
    })
    const { body } = res.data
    this.setState({
      tipsList: body
    })
  }, 500)

  // 获取搜索框的值.并进行小区信息搜索
  handleSearch = searchTxt => {
    this.setState({
      searchTxt
    })

    // 判断searchTxt是否为空
    // 如果为空,return,不发送请求
    if (!searchTxt.trim()) {
      return this.setState({
        tipsList: []
      })
    }
    // 调用防抖函数
    this.searchCommunity(searchTxt)
    // clearTimeout(this.timeId)
    // 避免频繁发送请求,通过定时器来延迟处理
    // this.timeId = setTimeout(async () => {
    //   const res = await API.get(`/area/community`, {
    //     params: {
    //       name: searchTxt,
    //       id: this.cityId
    //     }
    //   })
    //   const { body } = res.data
    //   this.setState({
    //     tipsList: body
    //   })
    // }, 500)
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li
        key={item.community}
        className={styles.tip}
        onClick={() => {
          const { community: communityId, communityName } = item
          // 返回发布房源的页面,并将数据返回
          this.props.history.replace('/rent/add', {
            communityId,
            communityName
          })
        }}
      >
        {item.communityName}
      </li>
    ))
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          onChange={this.handleSearch}
          showCancelButton
          onCancel={() => history.replace('/rent/add')}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
