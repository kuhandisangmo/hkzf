import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import cls from 'classnames'

import styles from './index.module.css'

export default class FilterMore extends Component {
  state = {
    selectedValues: this.props.selected
  }

  // 处理标签的单击事件
  handleClick = id => {
    console.log('id', id)
    const { selectedValues } = this.state

    let newSelectedValues
    if (selectedValues.indexOf(id) > -1) {
      // 包含
      console.log('包含')
      newSelectedValues = selectedValues.filter(item => item !== id)
      this.setState({
        selectedValues: newSelectedValues
      })
    } else {
      // 不包含
      console.log('不包含')
      newSelectedValues = [...selectedValues, id]
      this.setState({
        selectedValues: newSelectedValues
      })
    }
  }
  // 渲染标签
  renderFilters(data) {
    // 高亮类名： styles.tagActive
    return data.map(item => {
      // 选中,类名就高亮
      const isSelected = this.state.selectedValues.indexOf(item.value) > -1
      return (
        <span
          key={item.value}
          className={cls(styles.tag, {
            [styles.tagActive]: isSelected
          })}
          onClick={() => this.handleClick(item.value)}
        >
          {item.label}
        </span>
      )
    })
  }

  render() {
    console.log(this.props)
    const {
      data: { roomType, oriented, floor, characteristic }
    } = this.props
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={this.props.onCancel} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          cancelText="清除"
          onCancel={() =>
            this.setState({
              selectedValues: []
            })
          }
          onOk={() => this.props.onSave(this.state.selectedValues)}
        />
      </div>
    )
  }
}
