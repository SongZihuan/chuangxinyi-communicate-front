class Utils {
  linkTo(path) {
    window.location = path
    // 这里使用$router.push会导致跳转页面之后window.vditor对象undefined，原因未知
    // window.$nuxt.$router.push(path)
  }

  async toSignin(ref) {
    const nuxt = window.$nuxt
    if (!ref && process.client) {
      // 如果没配置refUrl，那么取当前地址
      ref = window.location.pathname
    }

    try {
      await nuxt.$store.dispatch('auth/signout')

      let domainUID = nuxt.$store.state.config.appinfo.domainID
      if (!domainUID) {
        nuxt.$toast.error("系统暂不支持登录")
      }

      let oauth2Query = this.encodeSearchParams({
        redirect_uri: nuxt.$config.REDIECT_URL,
        redirect: ref,
        domain: domainUID,
        params: '{}',
      })

      console.log("AAA", nuxt.$config.OAUTH2_URL)
      this.linkTo(`${nuxt.$config.OAUTH2_URL}?${oauth2Query}`)
    } catch (e) {
      nuxt.$toast.error(e.message || e)
    }
  }

  handleToc(tocDom) {
    if (!window || !window.document || !tocDom) {
      return
    }
    const tocSelector = '.toc'
    window.addEventListener('scroll', () => {
      const fromTop = window.scrollY
      const mainNavLinks = document.querySelectorAll(tocSelector + ' a')
      mainNavLinks.forEach((link, index) => {
        const section = document.getElementById(
          decodeURI(link.hash).substring(1)
        )
        if (!section) {
          return
        }
        let nextSection = null
        if (mainNavLinks[index + 1]) {
          nextSection = document.getElementById(
            decodeURI(mainNavLinks[index + 1].hash).substring(1)
          )
        }
        if (section.offsetTop <= fromTop) {
          if (nextSection) {
            if (nextSection.offsetTop > fromTop) {
              link.classList.add('active')
            } else {
              link.classList.remove('active')
            }
          } else {
            link.classList.add('active')
          }
        } else {
          link.classList.remove('active')
        }
      })
    })

    // 滚动的时候控制toc位置
    const oldTop = tocDom.offsetTop
    window.addEventListener('scroll', () => {
      // 更改toc位置
      const scrollTop = Math.max(
        document.body.scrollTop || document.documentElement.scrollTop
      )
      if (scrollTop < oldTop) {
        tocDom.style.position = 'relative'
        tocDom.style.top = 'unset'
      } else {
        tocDom.style.position = 'fixed'
        tocDom.style.top = '52px'
      }
    })
  }

  isArray(sources) {
    return Object.prototype.toString.call(sources) === '[object Array]'
  }

  isDate(sources) {
    return (
      {}.toString.call(sources) === '[object Date]' &&
      sources.toString() !== 'Invalid Date' &&
      !isNaN(sources)
    )
  }

  isElement(sources) {
    return !!(sources && sources.nodeName && sources.nodeType === 1)
  }

  isFunction(sources) {
    return Object.prototype.toString.call(sources) === '[object Function]'
  }

  isNumber(sources) {
    return (
      Object.prototype.toString.call(sources) === '[object Number]' &&
      isFinite(sources)
    )
  }

  isObject(sources) {
    return Object.prototype.toString.call(sources) === '[object Object]'
  }

  isString(sources) {
    return Object.prototype.toString.call(sources) === '[object String]'
  }

  isBoolean(sources) {
    return typeof sources === 'boolean'
  }

  encodeSearchParams(obj) {
    const params = []

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
  }
}
export default new Utils()
