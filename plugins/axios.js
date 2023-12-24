import qs from 'qs'

export default function({ $axios, $config, store }) {
  $axios.onRequest((config) => {
    config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

    const token = store.state.auth.userJwt
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }

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
      config.baseURL = $config.PrivateAPI
    } else {
      config.baseURL = $config.BaseAPI
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
