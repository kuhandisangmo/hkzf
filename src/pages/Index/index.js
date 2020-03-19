import React, { Component } from 'react'
// 导入axios
import axios from 'axios'
// 导入轮播图组件
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'

// 导入封装的搜索组件
import SearchHeader from '../../components/SearchHeader/index'
// 导入图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

// 导入获取城市定位的函数
import { getCurrentCity } from '../../utils'
// 导入样式
import './index.scss'

// 将导航菜单抽象成一个数组
const menus = [
  { title: '整租', imgSrc: Nav1, path: '/home/houselist' },
  { title: '合租', imgSrc: Nav2, path: '/home/houselist' },
  { title: '地图找房', imgSrc: Nav3, path: '/map' },
  { title: '去出租', imgSrc: Nav4, path: '/rent/add' }
]

// 测试H5中的地理位置 API
// navigator.geolocation.getCurrentPosition(function(position) {
//   console.log('H5地理位置', position)
// })

export default class Index extends Component {
  state = {
    // 轮播图数据
    data: [],
    // 图片高度
    imgHeight: 212,
    // 是否有轮播图数据判断
    isLoaded: false,
    // 租房小组数据
    groups: [],
    //最新资讯数据
    news: [],
    // 当前城市名称
    cityName: ''
  }
  async componentDidMount() {
    this.getData()
    this.getGroups()
    this.getNews()

    // 获取当前城市
    const { label } = await getCurrentCity()
    console.log('label', label)
    this.setState({
      cityName: label
    })
  }
  // 获取轮播图数据
  async getData() {
    const res = await axios.get(`http://localhost:8080/home/swiper`)
    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        data: body,
        isLoaded: true
      })
    }
  }
  // 获取租房小组数据
  async getGroups() {
    const res = await axios.get(`http://localhost:8080/home/groups`, {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        groups: body
      })
    }
  }
  // 获取最新资讯
  async getNews() {
    const res = await axios.get(`http://localhost:8080/home/news`, {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        news: body
      })
    }
  }
  renderSwiper() {
    //如果轮播图没有加载完成就悬案null,表示不渲染轮播图
    if (!this.state.isLoaded) {
      return null
    }
    // 否则,再渲染轮播图
    return (
      <Carousel
        // 是否自动轮播
        autoplay
        // 是否持续轮播
        infinite
      >
        {this.state.data.map(item => (
          <a
            key={item.id}
            href="http://itcast.cn"
            style={{
              display: 'inline-block',
              width: '100%',
              height: this.state.imgHeight
            }}
          >
            <img
              src={`http://localhost:8080${item.imgSrc}`}
              alt=""
              style={{ width: '100%', verticalAlign: 'top' }}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event('resize'))
                this.setState({ imgHeight: 'auto' })
              }}
            />
          </a>
        ))}
      </Carousel>
    )
  }
  // 渲染最新资讯
  renderNews() {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`http://localhost:8080${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }
  render() {
    return (
      <div className="index">
        {/* 轮播图和顶部的搜索框 */}
        <div className="swipper-wrap">
          {/* 搜索框 */}
          <SearchHeader cityName={this.state.cityName}></SearchHeader>
          {/* 轮播图 */}
          {this.renderSwiper()}
        </div>
        {/* 导航菜单 */}
        <Flex className="menus">
          {menus.map(item => (
            <Flex.Item
              key={item.title}
              onClick={() => this.props.history.push(item.path)}
            >
              <img src={item.imgSrc} alt="" />
              <h3>{item.title}</h3>
            </Flex.Item>
          ))}
        </Flex>
        {/* // 租房小组结构： 需要导入 Grid 宫格组件 */}
        <div className="groups">
          <Flex className="groups-title" justify="between">
            <h3>租房小组</h3>
            <span>更多</span>
          </Flex>
          {/* rendeItem 属性：用来 自定义 每一个单元格中的结构 */}
          <Grid
            data={this.state.groups}
            columnNum={2}
            square={false}
            activeStyle
            hasLine={false}
            renderItem={item => (
              <Flex className="grid-item" justify="between">
                <div className="desc">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </Flex>
            )}
          />
        </div>
        {/* // 最新资讯 结构： */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    )
  }
}
