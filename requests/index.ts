import qs from 'qs'
import { useAuthStore } from '~/store/auth'

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

    return useNuxtApp().runWithContext(() => {
      const token = useAuthStore().userJwt

      const cfg = {
        method: requests.method,
        body: requests.data,

        query: requests.query,

        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          "Authorization": `Bearer ${token}`
        },

        ...opt,

        onRequest({ options }) {
          options.transformRequest = [
            function(data) {
              if (process.client && data instanceof FormData) {
                // 如果是FormData就不转换
                return data
              }
              data = qs.stringify(data)
              return data
            }
          ]

          options.baseURL = getBaseAPI().baseAPI()
        },

        onRequestError({ error }) {
          console.info("fetch requests error: ", error)
        },

        onResponseError({ error }) {
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
