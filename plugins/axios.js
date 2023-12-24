import qs from 'qs'

export default function({ $axios, $config: cfg }) {
  $axios.onRequest((config) => {
    config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

    config.transformRequest = [
      function(data) {
        if (process.client && data instanceof FormData) {
          // 如果是FormData就不转换
          return data
        }
        data = qs.stringify(data)
        return data
      }
    ]

    if (process.server) {
      config.baseURL = cfg.PrivateAPI
    } else {
      config.baseURL = cfg.BaseAPI
    }
  })

  $axios.onResponse((response) => {
    if (response.status !== 200) {
      return Promise.reject(response)
    }
    const jsonResult = response.data
    if (jsonResult.code === 0) {
      return Promise.resolve(jsonResult.data)
    } else if (jsonResult.code === 200) {
      return Promise.resolve(jsonResult)
    } else {
      return Promise.reject(jsonResult)
    }
  })
}
