/**
 * token的相关操作
 */
const KEY = 'itcast_token'
// 存储token
const setToken = token => localStorage.setItem(KEY, token)
// 获取token
const getToken = () => localStorage.getItem(KEY)
// 删除token
const removeToken = () => localStorage.removeItem(KEY)

// 判断是否登录
const isAuth = () => !!getToken()

export { setToken, getToken, removeToken, isAuth }
