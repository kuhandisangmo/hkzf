import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
// 导入list列表组件
// import { List, AutoSizer } from 'react-virtualized'
import List from 'react-virtualized/dist/commonjs/List'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import { Toast } from 'antd-mobile'
import NavHeader from '../../components/NavHeader'
import './index.scss'
import axios from 'axios'
//导入获取定位城市的函数
import { getCurrentCity } from '../../utils'

/**
 * 分类名称高度
 */
const CATE_NAME_HEIGHT = 36
/**
 * 城市名高度
 */
const CITY_NAME_HEIGHT = 50
// 便利数据的方法
function formatCityList(list) {
  // 城市分类列表数据
  const cityList = {}
  list.forEach(item => {
    // 便利每一项数据城市的首字母
    const firstLetter = item.short.slice(0, 1)
    // 判断cityList中是否存在首字母的字母,有的话,就在该字母属性后面添加数据,没有就创建一个新的属性并创建数组,添加数据
    if (firstLetter in cityList) {
      cityList[firstLetter].push(item)
    } else {
      cityList[firstLetter] = [item]
    }
  })
  // Object.keys(obj)  获取对象的key值 返回一个数组   sort()方法是升序
  const cityIndex = Object.keys(cityList).sort()
  // console.log(cityIndex)
  return {
    cityList,
    cityIndex
  }
}

//数据处理
function format(name) {
  switch (name) {
    case '#':
      return '当前定位'
    case 'hot':
      return '热门城市'
    default:
      return name.toUpperCase()
  }
}

export default class CityList extends Component {
  // 状态数据
  state = {
    cityList: {},
    cityIndex: [],
    // 高亮索引
    activeIndex: 0
  }
  // 创建一个ref对象
  listRef = React.createRef()
  // 钩子函数
  async componentDidMount() {
    this._isMounted = true
    await this.getCityList()
    // 调用measureAllRows方法,来提前计算每一行高度
    // console.log('measureAllRows', this.listRef)
  }
  // 组件卸载函数
  componentWillUnmount() {
    this._isMounted = false
  }
  // 获取城市数据
  async getCityList() {
    const res = await axios.get(`http://localhost:8080/area/city`, {
      params: {
        level: 1
      }
    })
    // console.log('城市数据', res)
    const { status, body } = res.data
    if (status === 200) {
      const { cityList, cityIndex } = formatCityList(body)
      // 获取热门城市数据
      const hotCity = await axios.get(`http://localhost:8080/area/hot`)
      cityIndex.unshift('hot')
      cityList['hot'] = hotCity.data.body
      // Promise方法得到数据
      /*  getCurrentCity().then(data => {
        console.log('Promise', data)
      }) */
      // 通过await得到结果
      const curCity = await getCurrentCity()
      // 将当前的城市和索引添加金数据里面
      cityIndex.unshift('#')
      cityList['#'] = [curCity]
      if (this._isMounted) {
        this.setState({
          cityList,
          cityIndex
        })
        this.listRef.current.measureAllRows()
      }
    }
  }

  // 渲染每行的内容
  rowRenderer = ({ key, index, style }) => {
    const { cityList, cityIndex } = this.state
    const handelClick = item => {
      console.log('单机', item)
      if (['北京', '上海', '广州', '深圳'].indexOf(item.label) > -1) {
        const curCity = {
          label: item.label,
          value: item.value
        }
        localStorage.setItem('itcast_city', JSON.stringify(curCity))
        this.props.history.go(-1)
      } else {
        Toast.info('该城市暂无数据', 1)
      }
    }
    return (
      <div key={key} style={style} className="city">
        <div className="title">{format(cityIndex[index])}</div>
        {cityList[cityIndex[index]].map(item => {
          return (
            <div
              className="name"
              key={item.value}
              onClick={() => handelClick(item)}
            >
              {item.label}
            </div>
          )
        })}
      </div>
    )
  }
  // 计算列表高度
  heightAll = ({ index }) => {
    const { cityList, cityIndex } = this.state
    const cityItem = cityList[cityIndex[index]]
    return CATE_NAME_HEIGHT + CITY_NAME_HEIGHT * cityItem.length
  }
  // 渲染索引
  renderCityIndex() {
    const { cityIndex, activeIndex } = this.state
    // 点击事件
    const handelClick = index => {
      this.listRef.current.scrollToRow(index)
    }
    return cityIndex.map((item, index) => (
      <li
        className="city-index-item"
        key={item}
        onClick={() => handelClick(index)}
      >
        {/*"index-active"  高亮类名 */}
        <span className={activeIndex === index ? 'index-active' : ''}>
          {item === 'hot' ? '热' : item.toUpperCase()}
        </span>
      </li>
    ))
  }

  // List滚动事件

  onRowsRendered = ({ startIndex }) => {
    if (this.state.activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex
      })
    }
  }
  render() {
    return (
      <div className="citylist">
        {/* 表头 */}
        <NavHeader>城市选择</NavHeader>
        {/* 右侧城市索引列表： */}
        <ul className="city-index">{this.renderCityIndex()}</ul>
        {/* 长列表 */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={this.listRef}
              height={height - 45}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.heightAll}
              rowRenderer={this.rowRenderer}
              width={width}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>
      </div>
    )
  }
}
