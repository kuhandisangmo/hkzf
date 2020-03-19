import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'

export default class FilterPicker extends Component {
  state = {
    // 用来存储PickerView 组件中选中的值
    value: this.props.selected
  }

  // 获取选中值
  handleChange = value => {
    // 参数就是当前选中值
    this.setState({
      value
    })
  }
  render() {
    const { data, rows } = this.props
    return (
      <>
        {/* 选择器组件： */}
        <PickerView
          data={data}
          value={this.state.value}
          onChange={this.handleChange}
          cols={rows}
        />

        {/* 底部按钮 */}
        <FilterFooter
          onCancel={() => this.props.onCancel()}
          onOk={() => this.props.onSave(this.state.value)}
        />
      </>
    )
  }
}
