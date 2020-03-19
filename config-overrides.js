/**
 * 重新脚手架配置
 */

const { override, fixBabelImports } = require('customize-cra')

// 导出一个用于重新脚手架配置的一个文件
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd-mobile',
    style: 'css'
  })
)
