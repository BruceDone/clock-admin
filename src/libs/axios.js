import axios from 'axios'
import store from '@/store'
import { getToken } from './util'
import { Message } from 'iview'

// import { Spin } from 'iview'
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const token = getToken()
    return {
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'token': 'duckduckgo ' + token
      }
    }
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(
      response => {
        if (response.status !== 200) {
          console.log(response.data)
          Message.error(response.data.msg)
          return Promise.reject(response.data.msg)
        } else {
          return response.data.data
        }
      }, error => {
        let errorInfo = error.response
        if (!errorInfo) {
          const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
          errorInfo = {
            statusText,
            status,
            request: { responseURL: config.url }
          }
        } else {
          Message.error(errorInfo.data.msg)
        }

        addErrorLog(errorInfo)
        return Promise.reject(error)
      })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
