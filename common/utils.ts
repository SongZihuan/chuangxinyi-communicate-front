import { useConfigStore } from '~/store/config'

let Utils = {
  linkTo(path: string) {
    window.location.href = path
    // 这里使用$router.push会导致跳转页面之后window.vditor对象undefined，原因未知
    // window.$nuxt.$router.push(path)
  },

  openTo(path: string) {
    window.open(path)
  },

  toSignin: async (nuxt: any, ref: string="") => {
    if (!ref && process.client) {
      // 如果没配置refUrl，那么取当前地址
      ref = window.location.pathname
    }

    try {
      await nuxt.$store.dispatch('auth/signout')

      let domainUID = nuxt.$store.state.config.appinfo.domainID
      if (!domainUID) {
        nuxt.$toast && nuxt.$toast.error("系统暂不支持登录")
      }

      let oauth2Query = this.encodeSearchParams({
        redirect_uri: nuxt.$config.REDIECT_URL,
        redirect: ref,
        domain: domainUID,
        params: '{}',
      })

      this.linkTo(`${nuxt.$config.OAUTH2_URL}?${oauth2Query}`)
    } catch (e) {
      nuxt.$toast && nuxt.$toast.error(e.message || e)
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

  siteTitle: (subTitle: string) => {
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
  }
}

export default Utils
