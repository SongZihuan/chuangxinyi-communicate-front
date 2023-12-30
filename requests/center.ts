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

export function getCenterBaseAPI() {
  const baseAPI = (): string => {
    const runtimeConfig = useRuntimeConfig()

    if (process.client) {
      return runtimeConfig.public.CenterBaseAPI as string
    } else {
      return runtimeConfig.CenterPrivateAPI as string
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

  const nuxtApp = useNuxtApp()
  const authStore = useAuthStore()
  const token = authStore.centerToken

  return useNuxtApp().runWithContext(async () => {
    const cfg = {
      method: requests.method,
      body: requests.data,

      query: requests.query,

      headers: {
        'Content-Type': 'application/json',
        "X-Token": token,
      },

      ...opt,

      onRequest: ({ options }) => {
        options.baseURL = getCenterBaseAPI().baseAPI()
      },

      onResponse: async ({ response }) => {
        console.log("AAABBB")
        if (response.status !== 200) {
          response._data = {
            success: false,
            code: response.status,
            msg: "请求异常",
          }
          return response
        }

        let data = response._data

        if (data.code === "SUCCESS") {
          return response
        } else if (data.code === "POLICY_DENY" || data.code === "CORS_DENY" || data.code === "WEBSITE_DENY") {
          process.client && ElMessage.error("系统错误，稍后重试")
          return response;
        } else if (data.code === "DOUBLE_CHECK_DENY") {
          process.client && ElMessage.error("二次身份验证失败，请重试")
          return response
        } else if (data.code === "ROBOT_DENY") {
          if (data.subCode !== "CAPTCHA_SECOND_CHECK") {
            process.client && ElMessage.error("人机验证失败，行为疑似机器人")
          }
          return response
        } else if (data.code === "TOKEN_DENY") {
          if (!token) {
            process.client && ElMessage.error("请登陆后再操作")
          } else {
            await nuxtApp.runWithContext(async ()=>{
              await authStore.logout()
            })
            process.client && ElMessage.error("登录过期，请重新登录")
          }
        } else if (data.code === "LOGIC_DENY") {
          if (data.msg.length !== 0) {
            process.client && ElMessage.error(data.msg)
          }
          return Promise.resolve(data);
        }
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
