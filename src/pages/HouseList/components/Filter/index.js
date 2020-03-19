/* eslint-disable default-case */
import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import { API, getCurrentCity } from '../../../../utils'
import FilterMore from '../FilterMore'

// 导入动画组件
import { Spring } from 'react-spring/renderprops'

import styles from './index.module.css'

export default class Filter extends Component {
  state = {
    titleSelectedStatus: {
      area: false,
      mode: false,
      price: false,
      more: false
    },
    // 展示FilterPicker
    openType: '',
    // 4个对象对应的筛选条件数据
    filtersDate: {},
    // 4个菜单选中值
    selectedValues: {
      area: ['area', 'null'],
      mode: ['null'],
      price: ['null'],
      more: []
    }
  }
  async componentDidMount() {
    // 获取body
    this.htmlBody = document.body

    const { value } = await getCurrentCity()
    const res = await API.get(`/houses/condition`, {
      params: {
        id: value
      }
    })
    this.setState({
      filtersDate: res.data.body
    })
  }
  changeTitle = type => {
    // 给body添加一个样式,超出部分隐藏,解决滚动问题
    this.htmlBody.classList.add('fixed')
    // 获取到所有菜单的选中状态
    const { selectedValues, titleSelectedStatus } = this.state
    // 创建标题高亮的新状态
    const newTitleSelectedStatus = {
      ...titleSelectedStatus
    }
    Object.keys(selectedValues).forEach(key => {
      const curSelected = selectedValues[key]
      // 判断是否是当前菜单 如果是当前菜单直接高亮
      if (key === type) {
        console.log('当前菜单', type)
        newTitleSelectedStatus[key] = true
      } else {
        // 再判断每一个菜单,分别来决定每一个菜单是否高亮
        newTitleSelectedStatus[key] = this.getTitleStatus(key, curSelected)
      }
    })

    this.setState({
      titleSelectedStatus: newTitleSelectedStatus,
      openType: type
    })
  }
  // 隐藏FilterPicker FilterMore组件
  onCancel = () => {
    // 去掉body的fixed样式
    this.htmlBody.classList.remove('fixed')
    const { openType, selectedValues } = this.state
    // 获取当前选中值
    const curSelected = selectedValues[openType]
    console.log(curSelected)

    // 菜单是否高亮
    let isSelected = this.getTitleStatus(openType, curSelected)

    this.setState({
      // 更新高亮状态
      titleSelectedStatus: {
        ...this.state.titleSelectedStatus,
        [openType]: isSelected
      },
      openType: ''
    })
  }
  // 确认按钮事件
  onSave = value => {
    // 去掉body的fixed样式
    this.htmlBody.classList.remove('fixed')
    const { openType } = this.state
    // 获取当前选中值
    const curSelected = value

    // 菜单是否高亮
    let isSelected = this.getTitleStatus(openType, curSelected)

    //因为需要在点击确认按钮时来进行房源列表的渲染,所以在当前实践出库程序中进行
    // 1.获取当前最新的选中值
    const newSelectedValues = {
      ...this.state.selectedValues,
      [openType]: value
    }
    // 2.将最新的选中值转化为接口所需要的的格式
    // 2.1 创建接口数据对象
    const filters = {}
    // 2.2转化数据
    //租赁方式的转化
    filters.rentType = newSelectedValues.mode[0]
    // 租金
    filters.price = newSelectedValues.price[0]
    // more
    filters.more = newSelectedValues.more.join(',')
    // 如果选中的区域,键名是area,选中的是地铁,那就是subway
    const key = newSelectedValues.area[0]
    let areaValue
    if (newSelectedValues.area.length === 2) {
      areaValue = 'null'
    } else {
      if (newSelectedValues.area[2] === 'null') {
        areaValue = newSelectedValues.area[1]
      } else {
        areaValue = newSelectedValues.area[2]
      }
    }
    filters[key] = areaValue

    // 将修改好的数据传递给父组件
    this.props.onFilter(filters)

    this.setState({
      selectedValues: newSelectedValues,
      // 更新高亮状态
      titleSelectedStatus: {
        ...this.state.titleSelectedStatus,
        [openType]: isSelected
      },
      openType: ''
    })
  }

  // 封装一个方法,,获取某个菜单是否高亮
  getTitleStatus(openType, curSelected) {
    let isSelected
    if (
      openType === 'area' &&
      (curSelected.length === 3 || curSelected[0] !== 'area')
    ) {
      // 区域菜单啊
      isSelected = true
    } else if (openType === 'mode' && curSelected[0] !== 'null') {
      // 方式菜单
      isSelected = true
    } else if (openType === 'price' && curSelected[0] !== 'null') {
      // 租金菜单
      isSelected = true
    } else if (openType === 'more' && curSelected.length > 0) {
      // 第4个菜单
      isSelected = true
    } else {
      isSelected = false
    }
    return isSelected
  }

  // 渲染FilterPicker 前三个菜单对应的内容
  renderFilterPicker() {
    const {
      openType,
      filtersDate: { area, subway, rentType, price },
      selectedValues
    } = this.state

    // 根据d当前菜单的类型,来获取到该菜单对应的筛选数据
    // 然后,传递给FilterPicker组件
    let data, rows

    switch (openType) {
      case 'area':
        // 区域菜单
        data = [area, subway]
        rows = 3
        break
      case 'mode':
        // 方式菜单
        data = rentType
        rows = 1
        break
      case 'price':
        // 租金菜单
        data = price
        rows = 1
        break
      default:
        break
    }

    const selected = selectedValues[openType]

    if (openType === 'area' || openType === 'mode' || openType === 'price') {
      return (
        <FilterPicker
          onCancel={this.onCancel}
          data={data}
          rows={rows}
          onSave={this.onSave}
          selected={selected}
          key={openType}
        />
      )
    }
    return null
  }
  // 渲染FilterMore组件
  renderFilterMore() {
    const {
      openType,
      filtersDate: { roomType, oriented, floor, characteristic },
      selectedValues
    } = this.state
    if (openType !== 'more') return null
    const data = {
      roomType,
      oriented,
      floor,
      characteristic
    }
    // 选中值
    const selected = selectedValues.more
    return (
      <FilterMore
        selected={selected}
        data={data}
        onCancel={this.onCancel}
        onSave={this.onSave}
      />
    )
  }

  // 渲染遮罩层
  renderMask() {
    const { openType } = this.state
    const isShow =
      openType === 'area' || openType === 'mode' || openType === 'price'
    return (
      <Spring to={{ opacity: isShow ? 1 : 0 }}>
        {props => {
          if (props.opacity === 0) return null
          return (
            <div
              style={props}
              className={styles.mask}
              onClick={this.onCancel}
            />
          )
        }}
      </Spring>
    )
  }
  render() {
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {this.renderMask()}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            selected={this.state.titleSelectedStatus}
            onClick={this.changeTitle}
          />

          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
