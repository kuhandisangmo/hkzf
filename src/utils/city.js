/**
 * 当前定位城市 - 本地缓存的处理
 */

// 使用常量来存储键
const CITY_KEY = 'itcast_city'

// 1 获取当前定位城市
const getCity = () => JSON.parse(localStorage.getItem(CITY_KEY))

// 2 保存当前定位城市
const setCity = city => localStorage.setItem(CITY_KEY, JSON.stringify(city))

export { getCity, setCity }
