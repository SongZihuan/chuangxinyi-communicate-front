import { useConfigStore } from '~/store/config'
import { useAuthStore } from '~/store/auth'
import { ElMessage } from "element-plus"
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime); // 相对时间
dayjs.locale('zh-cn'); // 使用本地化语言

let Utils = {
  linkTo: async (path: string, query: any = undefined) => {
    if (!query) {
      query = {}
    }

    const runtimeConfig = useRuntimeConfig()
    if (runtimeConfig.public.ENV === "development") {
      if (process.server) {
        return
      }

      if (Object.keys(query).length !== 0) {
        let q = Utils.encodeSearchParams(query)
        window.location.href = path + "?" +  q
      } else {
        window.location.href = path
      }
    } else {
      const router = useRouter()
      await router.push({
        path: path,
        query: query || {},
      })
    }
  },

  redirectTo(path: string) {
    if (process.server) {
      return
    }
    window.location.href = path
  },

  openTo(path: string) {
    if (process.server) {
      return
    }
    window.open(path)
  },

  toSignin: async (ref: string="") => {
    if (process.server) {
      return
    }

    if (!ref) {
      const route = useRoute()
      if (route) {
        ref = route.path
      } else {
        ref = "/"
      }
    }

    const runtimeConfig = useRuntimeConfig()
    const authStore = useAuthStore()
    const configStore = useConfigStore()

    try {
      await authStore.logout()

      let domainUID = configStore.appinfo.domainID
      if (!domainUID) {
        ElMessage.error("系统暂不支持登录")
        return
      }


      let oauth2Query = Utils.encodeSearchParams({
        redirect_uri: runtimeConfig.public.REDIRECT_URL,
        redirect: ref,
        domain: domainUID,
        params: '{}',
      })

      Utils.redirectTo(`${runtimeConfig.public.OAUTH2_URL}?${oauth2Query}`)
    } catch (e) {
      ElMessage.error(e.message || e)
    }
  },

  encodeSearchParams: (obj: Object) => {
    const params: Array[string] = []

    Object.keys(obj).forEach((key) => {
      let value = obj[key]
      // 如果值为undefined我们将其置空
      if (typeof value === 'undefined') {
        value = ''
      }
      // 对于需要编码的文本（比如说中文）我们要进行编码
      params.push([key, encodeURIComponent(value)].join('='))
    })

    return params.join('&')
  },

  formatDate: (timestamp: number, fmt: string | undefined = undefined) => {
    return dayjs(timestamp).format(fmt || 'YYYY-MM-DD HH:mm:ss')
  },

  prettyDate: (timestamp: number) => {
    return dayjs(timestamp).fromNow();
  },

  siteTitle: (subTitle: string|undefined = undefined) => {
    const configStore = useConfigStore()
    const title = configStore.siteTitle || ''
    if (subTitle) {
      return subTitle + (title ? ' | ' + title : '')
    }
    return title
  },

  siteDescription: () => {
    const configStore = useConfigStore()
    return configStore.siteDescription
  },

  siteKeywords: () => {
    const configStore = useConfigStore()
    return configStore.siteKeywords
  },

  getUserName: (user: any): string => {
    if (!user) {
      return "陌生用户"
    }

    if (user.nickname) {
      return user.nickname
    }

    if (user.username) {
      return user.username
    }

    if (user.uid) {
      return user.uid.substr(0, 6)
    }

    return "陌生用户"
  }

}

export default Utils
