import { buildURL } from '@common/utils/url'
import { Message } from 'element-ui'
function request (path, config) {
  // config = { method: "GET", ...config }
  let url = `/api/${path}`

  if (config.params) {
    url = buildURL(url, config.params)
  }

  const formData = new FormData()

  Object.keys(config.data).forEach(item => {
    formData.append(item, config.data[item])
  })

  const promiseData = fetch(process.env.API_ROOT + url, {
    method: config.method,
    body: formData
  })
    .then(res => res.json())
    .then(res => {
      if (res.code === 200) {
        return {
          code: res.code,
          data: res.data
        }
      }
      if (res.code === 401) {
        Message({
          type: 'warning',
          message: '登录状态已过期，请重新登录'
        })
        setTimeout(() => {
          localStorage.removeItem('STATUS_HSH')
          window.location.href = window.location.origin
        }, 1500)
      }
      if (res.code === -1) {
        return Promise.reject({ code: res.code, msg: res.msg })
      }
    })
    .catch(err => err)
  return promiseData
}

// export default {
//   install(Vue) {
//     Vue.prototype.$get = (path, config) => request(path, { ...config, method: 'GET' })
//     Vue.prototype.$post = (path, config) => request(path, { ...config, method: 'POST' })
//   }
// }

export default (path, config) => request(path, { ...config, method: 'POST' })
