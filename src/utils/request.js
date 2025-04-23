import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 请求基础地址，将自动拼接到请求路径前面
  // withCredentials: true // 跨域请求时是否发送 cookie
  timeout: 5000 // 请求超时时间，单位毫秒
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理
    if (store.getters.token) {
      // 如果 Vuex 中有 token，就在请求头中携带 token
      // 'X-Token' 是自定义的请求头字段，可根据实际情况修改
      config.headers['X-Token'] = store.getters.token || ''
    }
    return config
  },
  error => {
    // 请求出错时的处理
    console.log(error) // 调试用
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * 如果你想获取 HTTP 响应头等信息，可使用 response => response
   */

  /**
   * 通过自定义状态码判断请求是否成功
   * 这里仅为示例，也可以通过 HTTP 状态码来判断
   */
  response => {
    const res = response.data

    // 如果自定义状态码不是 200，表示请求失败
    if (res.status !== 200) {
      let message = res.message || '出错了'
      if (res.status === 3001) { // 用户未登录
        store.dispatch('user/setInfo', {})
        // window.location.reload() // 可选：刷新页面
        return
      } else if (res.status === 1001) { // 非法参数
        if (res.data instanceof Object) {
          for (const key in res.data) {
            message = res.data[key]
            break
          }
        } else {
          message = res.data || res.message
        }
      }

      // 弹出错误提示
      Message({
        message: message,
        type: 'error',
        duration: 3.6 * 1000
      })

      // 抛出错误
      return Promise.reject(new Error(message || '出错了'))
    } else {
      // 正常返回数据
      return res
    }
  },
  error => {
    // 响应出错的处理逻辑（例如：网络错误、超时等）
    console.log('err' + error) // 调试用
    Message({
      message: error.message,
      type: 'error',
      duration: 3.6 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
