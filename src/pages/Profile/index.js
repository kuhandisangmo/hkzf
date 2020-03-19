import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import { Grid, Button, Modal } from 'antd-mobile'

import { BASE_URL, isAuth, API, removeToken } from '../../utils'

import styles from './index.module.css'

// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  {
    id: 4,
    name: '成为房主',
    iconfont: 'icon-identity'
  },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]

// 默认头像
const DEFAULT_AVATAR = BASE_URL + '/img/profile/avatar.png'

export default class Profile extends Component {
  state = {
    // 是否登陆
    isLogin: isAuth(),
    // 用户信息
    userInfo: {
      avatar: DEFAULT_AVATAR,
      nickname: '游客'
    }
  }
  async componentDidMount() {
    const { isLogin } = this.state
    // 没有登录
    if (!isLogin) return
    // 登录
    const res = await API.get(`/user`)
    console.log(res)
    const { status, body } = res.data
    if (status === 200) {
      // 获取成功
      const { avatar, nickname } = body
      this.setState({
        userInfo: { avatar: BASE_URL + avatar, nickname }
      })
    } else {
      // removeToken()
      this.setState({
        isLogin: false
      })
    }
  }
  logout = () => {
    Modal.alert('提示', '是否确认退出?', [
      {
        text: '取消',
        onPress: () => console.log('cancel')
      },
      {
        text: '退出',
        onPress: async () => {
          // 服务端退出
          await API.post(`/user/logout`)
          // 本地退出
          removeToken()

          // 让登录状态修改成false和初始值
          this.setState({
            isLogin: false,
            userInfo: {
              avatar: DEFAULT_AVATAR,
              nickname: '游客'
            }
          })
        }
      }
    ])
    console.log('退出')
  }
  render() {
    const { history } = this.props
    const {
      isLogin,
      userInfo: { avatar, nickname }
    } = this.state
    return (
      <div className={styles.root}>
        {/* 个人信息 */}
        <div className={styles.title}>
          <img
            className={styles.bg}
            src={BASE_URL + '/img/profile/bg.png'}
            alt="背景图"
          />
          <div className={styles.info}>
            <div className={styles.myIcon}>
              <img className={styles.avatar} src={avatar} alt="icon" />
            </div>
            <div className={styles.user}>
              <div className={styles.name}>{nickname}</div>
              {isLogin ? (
                <>
                  <div className={styles.auth}>
                    <span onClick={this.logout}>退出</span>
                  </div>
                  <div className={styles.edit}>
                    编辑个人资料
                    <span className={styles.arrow}>
                      <i className="iconfont icon-arrow" />
                    </span>
                  </div>
                </>
              ) : (
                <div className={styles.edit}>
                  <Button
                    type="primary"
                    size="small"
                    inline
                    onClick={() => history.push('/login')}
                  >
                    去登录
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 九宫格菜单 */}
        <Grid
          data={menus}
          columnNum={3}
          hasLine={false}
          renderItem={item =>
            item.to ? (
              <Link to={item.to}>
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              </Link>
            ) : (
              <div className={styles.menuItem}>
                <i className={`iconfont ${item.iconfont}`} />
                <span>{item.name}</span>
              </div>
            )
          }
        />

        {/* 加入我们 */}
        <div className={styles.ad}>
          <img src={BASE_URL + '/img/profile/join.png'} alt="" />
        </div>
      </div>
    )
  }
}
