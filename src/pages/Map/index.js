import React, { Component } from 'react'
import NavHeader from '../../components/NavHeader'
import { getCurrentCity, API } from '../../utils/index'
import cls from 'classnames'
// import axios from 'axios'
import { Toast } from 'antd-mobile'
// css-module 样式写法,防止样式覆盖问题
import styles from './index.module.scss'
import HouseItem from '../../components/HouseItem'

// 覆盖物样式
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}
const BMap = window.BMap
export default class Map extends Component {
  state = {
    // 控制房源列表的展示
    isShowList: false,
    // 房源具体数据
    list: []
  }
  async componentDidMount() {
    const { label, value } = await getCurrentCity()

    // 1.创建百度地图实例对象  参数表示容器ID
    const map = new BMap.Map('container')
    this.map = map
    // 创建地址解析器实例
    var myGeo = new BMap.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图视野
    // 第一个参数是详细地址
    // 第二个参数是一个回调函数,获取解析后的坐标
    // 第三个参数是城市名称
    myGeo.getPoint(
      null,
      point => {
        if (point) {
          map.centerAndZoom(point, 11)
          //  渲染覆盖物
          this.renderOverlays(value)

          // 添加两个控件
          map.addControl(new BMap.NavigationControl())
          map.addControl(new BMap.ScaleControl())
        }
      },
      label
    )
    // 给地图绑定移动事件,在移动地图时,隐藏房源列表
    map.addEventListener('movestart', () => {
      console.log('地图移动了')
      if (this.state.isShowList) {
        this.setState({
          isShowList: false
        })
      }
    })
  }
  // 1 发送请求,获取房源数据 获取覆盖类型和下一级缩放级别
  async renderOverlays(id) {
    // 开启一个loading效果
    Toast.loading('加载中...', 0)
    // 发送ajax请求 获取房源数据
    const res = await API.get(`/area/map`, {
      params: {
        id
      }
    })
    // 关闭加载效果
    Toast.hide()
    const { nextLevel, type } = this.getTypeAndZoom()
    // 因为每一个区都有覆盖物,所以需要便利所有区的数据,来渲染覆盖物
    const { status, body } = res.data
    if (status === 200) {
      body.forEach(item => {
        // 调用该方法,将渲染房源所有数据传递给该方法
        this.createOverlays(item, nextLevel, type)
      })
    }
  }

  // 2 封装当前缩放级别的函数
  getTypeAndZoom() {
    // 当前缩放级别
    const level = this.map.getZoom()
    // 下一级别
    let nextLevel
    // 当前渲染覆盖物的类型
    let type
    // 如果当前渲染的是区,那么下一级就是镇
    if (level === 11) {
      nextLevel = 13
      type = 'circle'
    } else if (level === 13) {
      nextLevel = 15
      type = 'circle'
    } else {
      type = 'rect'
    }
    return {
      nextLevel,
      type
    }
  }

  // 3 根据传入数据type,来决定调用哪个方法来渲染覆盖物
  createOverlays(data, nextLevel, type) {
    const {
      label,
      value,
      count,
      coord: { latitude, longitude }
    } = data
    // 根据返回的数据坐标,创建一个百度地图的坐标对象
    const point = new BMap.Point(longitude, latitude)
    // 判断区镇
    if (type === 'circle') {
      // 区,镇覆盖物
      this.createCircle(label, value, count, point, nextLevel)
    } else {
      // 小区
      this.createRect(label, value, count, point)
    }
  }
  // 4 区镇覆盖物
  createCircle(areaName, id, count, point, nextLevel) {
    // 给地图添加覆盖物
    // opts  配置对象
    const opts = {
      position: point, //指示文本标注所在的地理位置
      offset: new BMap.Size(-35, -35) //设置文本偏移量
    }
    const label = new BMap.Label('', opts) //创建文本标注对象
    // 给label设置HTML内容
    label.setContent(`
          <div class="${styles.bubble}">
            <p class="${styles.name}">${areaName}</p>
            <p>${count}套</p>
          </div>
          `)
    label.setStyle(labelStyle)

    // 给label添加单击事件
    // 注意  这是百度地图自己提供的注册事件方法
    label.addEventListener('click', () => {
      // console.log('覆盖物点击了', id, nextLevel)
      // 放大地图
      this.map.centerAndZoom(point, nextLevel)
      // 清除地图中当前的覆盖物
      setTimeout(() => {
        this.map.clearOverlays()
      }, 0)
      // 调用方法重新渲染覆盖物
      this.renderOverlays(id)
    })
    // 将创建好的覆盖物添加到地图中
    this.map.addOverlay(label)
  }
  // 5 小区覆盖物
  createRect(name, id, count, point) {
    // 给地图添加覆盖物
    // opts  配置对象
    const opts = {
      position: point, //指示文本标注所在的地理位置
      offset: new BMap.Size(-50, -28) //设置文本偏移量
    }
    const label = new BMap.Label('', opts) //创建文本标注对象
    // 小区覆盖物结构：
    label.setContent(`
      <div class="${styles.rect}">
        <span class="${styles.housename}">${name}</span>
        <span class="${styles.housenum}">${count}套</span>
        <i class="${styles.arrow}"></i>
      </div>
    `)
    label.setStyle(labelStyle)

    // 给label添加单击事件
    // 注意  这是百度地图自己提供的注册事件方法
    label.addEventListener('click', e => {
      console.log('小区点击了', id)
      // 1.移动小区到地图中心
      // 获取移动中心点的坐标
      const x1 = window.innerWidth / 2
      const y1 = (window.innerHeight - 330) / 2
      // 获取当前点击的坐标
      const { clientX, clientY } = e.changedTouches[0]
      // 计算偏移值
      const x = x1 - clientX
      const y = y1 - clientY
      // 调用地图API移动地图
      this.map.panBy(x, y)
      // 2,展示房源列表数据
      this.getHouseList(id)
    })
    // 将创建好的覆盖物添加到地图中
    this.map.addOverlay(label)
  }
  // 封装获取小区房源列表的方法
  async getHouseList(id) {
    // 开启一个loading效果
    Toast.loading('加载中...', 0)
    const res = await API.get(`/houses`, {
      params: {
        cityId: id
      }
    })
    // 关闭加载效果
    Toast.hide()
    this.setState({
      isShowList: true,
      list: res.data.body.list
    })
  }
  renderHouseList() {
    // 渲染房源列表
    return this.state.list.map(item => (
      <HouseItem key={item.houseCode} {...item}></HouseItem>
    ))
  }
  render() {
    return (
      <div className={styles.map}>
        <NavHeader className={styles.mapHeader}>地图找房</NavHeader>
        {/* 地图容器 */}
        <div id="container" className={styles.container} />
        {/* 房源列表 */}
        <div
          className={cls(styles.houseList, {
            [styles.show]: this.state.isShowList
          })}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <a className={styles.titleMore} href="/house/list">
              更多房源
            </a>
          </div>
          <div className={styles.houseItems}>{this.renderHouseList()}</div>
        </div>
      </div>
    )
  }
}
