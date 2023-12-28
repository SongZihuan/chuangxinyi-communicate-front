import { useConfigStore } from '~/store/config'
import { useAuthStore } from '~/store/auth'
import { ElMessage } from "element-plus"

let Utils = {
  linkTo: async (path: string, query: any = undefined) => {
    if (!query) {
      query = {}
    }

    const runtimeConfig = useRuntimeConfig()
    if (runtimeConfig.public.ENV === "development") {
      let q = Utils.encodeSearchParams(query)
      window.location.href = path + "?" +  q
    } else {
      const router = useRouter()
      await router.push({
        path: path,
        query: query || {},
      })
    }
  },

  redirectTo(path: string) {
    window.location.href = path
  },

  openTo(path: string) {
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
        redirect_uri: runtimeConfig.public.REDIECT_URL,
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

  // TODO 函数弃用，改写一下
  formatDate: (timestamp: number, fmt: string | undefined = undefined) => {
    fmt = fmt || 'yyyy-MM-dd HH:mm:ss'
    const date = new Date(timestamp)
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours() % 12,
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      S: date.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1 as string,
          (RegExp.$1.length === 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length)) as string
        ) as string
      }
    }
    return fmt
  },

  prettyDate: (timestamp: number) => {
    const minute = 1000 * 60
    const hour = minute * 60
    const day = hour * 24
    const diffValue = new Date().getTime() - timestamp
    if (diffValue / minute < 1) {
      return '刚刚'
    } else if (diffValue / minute < 60) {
      return parseInt(String(diffValue / minute)) + '分钟前'
    } else if (diffValue / hour <= 24) {
      return parseInt(String(diffValue / hour)) + '小时前'
    } else if (diffValue / day <= 30) {
      return parseInt(String(diffValue / day)) + '天前'
    }
    return this.formatDate(timestamp, 'yyyy-MM-dd HH:mm:ss')
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
