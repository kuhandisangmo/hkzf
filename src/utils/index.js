// 工具
import axios from 'axios'
import { API } from './http'
import { BASE_URL } from './url'
// 导入当前定位城市代码
import { getCity, setCity } from './city'
// 封装一个函数,来获取当前定位城市数据
const getCurrentCity = () => {
  // 判断本地缓存中是否有本地数据
  const currentCity = getCity()
  if (!currentCity) {
    return new Promise(resolve => {
      // 通过百度地图API来获取当前定位城市信息
      let myCity = new window.BMap.LocalCity()
      myCity.get(async result => {
        // 当前定位城市名称
        const cityName = result.name
        console.log('当前定位城市:' + cityName)
        // 调用接口,获取有房源的城市信息,如果当前定位城市没有房源就默认定位在上海
        const res = await axios.get(`http://localhost:8080/area/info`, {
          params: {
            name: cityName
          }
        })
        // console.log('当前定位城市', res)
        // 将获取的数据存到缓存中
        // localStorage.setItem('itcast_city', JSON.stringify(res.data.body))
        setCity(res.data.body)
        resolve(res.data.body)
      })
    })
  } else {
    // 如果有数据,就直接调取数据
    // return new Promise(resolve => resolve(currentCity))

    // 简化写法
    return Promise.resolve(currentCity)
  }
}

export { getCurrentCity, getCity, setCity, API, BASE_URL }
// 直接将token中所有内容导出
export * from './token'
