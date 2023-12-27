import qs from 'qs'
import { useAuthStore } from '~/store/auth'
import { ElMessage } from "element-plus"

interface req {
    url: string,
    method: string,
    query: any,
    data?: any,
    useCache?: boolean
}

export function getBaseAPI() {
    const baseAPI = (): string => {
        const runtimeConfig = useRuntimeConfig()

        if (process.client) {
            return runtimeConfig.public.BaseAPI as string
        } else {
            return runtimeConfig.PrivateAPI as string
        }
    }

    return { baseAPI }
}

export default function (requests: req, opt?: any) {
    if (!requests.method) {
        requests.method = "GET"
    }

    if (!opt) {
        opt = {}
    }

    if (!requests.query) {
        requests.query = {}
    }

    return useNuxtApp().runWithContext(async () => {
      const token = useAuthStore().userJwt

      let data = requests.data
      if (data) {
        if (process.client && data instanceof FormData) {
          // 无操作
        } else {
          data = qs.stringify(data)
        }
      }

      const cfg = {
        method: requests.method,
        body: data,

        query: requests.query,

        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          "Authorization": `Bearer ${token}`
        },

        ...opt,

        onRequest: ({ options }) => {
          options.baseURL = getBaseAPI().baseAPI()
        },

        onResponse: (response) => {
          if (response.status !== 200) {
            response._data = {
              success: false,
              code: response.status,
              msg: "请求异常",
            }
            return response
          }

          let data = response._data

          if (data.success) {
            return response
          }

          ElMessage.error(data.msg || "遇到错误")
          return response
        },

        onRequestError: ({ error }) => {
          console.info("fetch requests error: ", error)
        },

        onResponseError: ({ error }) => {
          console.info("fetch error: ", error)
        }
      }

      if (requests.useCache) {
        return useFetch(requests.url, cfg)
      }
      return $fetch(requests.url, cfg).then((_data)=>{
        return {
          status: ref("success"),
          error: ref(null),
          data: ref(_data),
        }
      })
  })
}
