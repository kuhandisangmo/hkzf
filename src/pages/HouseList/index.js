import React, { Component } from 'react'

import SearchHeader from '../../components/SearchHeader'

import { Flex, Toast } from 'antd-mobile'

// 导入条件渲染的父组件
import Filter from './components/Filter'

import NoHouse from '../../components/NoHouse'
import { API, getCurrentCity } from '../../utils'

// 导入list列表组件
/* import {
  List,
  AutoSizer,
  WindowScroller,
  InfiniteLoader
} from 'react-virtualized' */

import List from 'react-virtualized/dist/commonjs/List'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader'
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller'

import HouseItem from '../../components/HouseItem'

import styles from './index.module.scss'

// 导入吸顶组件
import Sticky from '../../components/Sticky'

export default class HouseList extends Component {
  state = {
    // 列表数据
    list: [],
    // 总条数
    count: 0,
    // 数据是否加载完成的状态
    isLoaded: false,
    // 当前定位城市名称
    cityName: '上海'
  }
  // 获取Filter组件中,组装好的房源数据
  onFilter = filters => {
    // 没次根据筛选条件筛选时,让页面回到最顶部
    window.scrollTo(0, 0)
    // 将数据存到this中
    this.filters = filters
    this.searchHouseList()
  }

  // 进去页面就获取房源列表数据
  async componentDidMount() {
    // 获取当前定位城市数据
    const { label, value } = await getCurrentCity()
    this.setState({
      cityName: label
    })
    this.cityId = value
    this.searchHouseList()
  }
  // 根据筛选条件获取房源列表
  async searchHouseList() {
    // 获取当前城市ID
    // const { value } = await getCurrentCity()

    // 开启一个loading
    Toast.loading('加载中...', 0)

    this.setState({
      isLoaded: false
    })
    const res = await API.get(`/houses`, {
      params: {
        ...this.filters,
        cityId: this.cityId,
        start: 1,
        end: 20
      }
    })
    // 关闭loading
    Toast.hide()
    const { list, count } = res.data.body

    // 提示房源数量
    if (count !== 0) {
      Toast.info(`共找到${count}套房源`, 1)
    }
    this.setState({
      list,
      count,
      isLoaded: true
    })
  }
  // 渲染房源列表的每一行的数据
  rowRenderer = ({ key, index, style }) => {
    const { list } = this.state
    const data = list[index]

    // 判断data是否存在
    if (data) {
      return (
        <HouseItem
          onClick={() => this.props.history.push(`/detail/${data.houseCode}`)}
          key={key}
          style={style}
          {...data}
        />
      )
    } else {
      return (
        <div key={key} style={style}>
          <div className={styles.loading} />
        </div>
      )
    }
  }

  // 确定列表中是否加载完成
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }
  // 加载更多数据
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise(async resolve => {
      // 发送请求获取数据
      // 获取当前城市ID
      // const { value } = await getCurrentCity()
      const res = await API.get(`/houses`, {
        params: {
          ...this.filters,
          cityId: this.cityId,
          start: startIndex,
          end: stopIndex
        }
      })
      const { list, count } = res.data.body
      // 存储数据
      this.setState({
        list: [...this.state.list, ...list],
        count
      })
      // 数据加载完成时
      resolve()
    })
  }

  // 渲染房源列表
  renderHouseList() {
    const { count, isLoaded } = this.state
    // 如果没有房源数据,就下那是Nohouse组件
    if (isLoaded && count === 0)
      return <NoHouse>没有找到房源,请您换个搜索条件吧~</NoHouse>
    // 否则渲染房源列表
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={this.state.count}
        minimumBatchSize={15}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    autoHeight
                    scrollTop={scrollTop}
                    isScrolling={isScrolling}
                    ref={registerChild}
                    height={height - 45}
                    rowCount={this.state.count}
                    rowHeight={120}
                    rowRenderer={this.rowRenderer}
                    width={width}
                    onRowsRendered={onRowsRendered}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    )
  }
  render() {
    return (
      <div className={styles.root}>
        <Flex className={styles.headerWrap}>
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          ></i>
          <SearchHeader
            className={styles.header}
            cityName={this.state.cityName}
          />
        </Flex>
        {/* 条件渲染栏组件 */}
        <Sticky height={40}>
          <Filter onFilter={this.onFilter} />
        </Sticky>

        {/* 城市列表 */}
        {this.renderHouseList()}
      </div>
    )
  }
}
