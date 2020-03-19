import axios from 'axios'
import { BASE_URL } from './url'
import { getToken, removeToken } from '../utils'
// 配置baseURL
const API = axios.create({
  baseURL: BASE_URL
})

// 进行axios 拦截器的处理

// 请求拦截器
API.interceptors.request.use(config => {
  const { url } = config

  // 判断url 是否以 /user 开头,并且不是登录或者注册接口,此时九田家token到请求头中
  if (
    url.startsWith('/user') &&
    !url.startsWith('/user/login') &&
    !url.startsWith('/user/registered')
  ) {
    // 添加请求头
    config.headers.authorization = getToken()
  }
  return config
})

// 相应拦截器
API.interceptors.response.use(response => {
  if (response.data.status === 400) {
    // 说明token失效,所以需要移除token
    removeToken()
  }
  // 注意需要将response返回
  return response
})

// 导出配置后的axios
export { API }
