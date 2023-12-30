import { defineStore } from 'pinia'
import { useUserApi } from "~/api/user"

export const useAuthStore = defineStore("auth", ()=> {
  let currentUser = ref(null)
  let userJwt = ref("")
  let centerToken = ref("")

  const getTokenFromCookie = computed(async (): Promise<string> => {
    let cookieJwt = useCookie("jwt", {
      path: "/",
    })
    let cookieCenterToken = useCookie("center-token", {
      path: "/",
    })
    if (cookieJwt.value) {
      setUserJwt(cookieJwt.value)
    }
    if (cookieCenterToken.value) {
      setCenterToken(cookieCenterToken.value)
    }
    return JSON.stringify(cookieJwt.value)
  })

  // 获取当前登录用户
  const getCurrentUser = computed(async (): Promise<any> => {
    if (!userJwt.value || !centerToken.value) {
      currentUser.value = null
      userJwt.value = ''
      centerToken.value = ''
      return
    }

    let {data, status} = await useUserApi().getCurrentUser()
    if (status.value === "success" && data.value.success) {
      const user = data.value.data
      setCurrentUser(user)
      return user
    }
  })

  const currentUserName = computed(() => {
    if (!currentUser.value) {
      return "陌生用户"
    }
    return (currentUser.value.nickname ||
      currentUser.value.username ||
      currentUser.value.phone ||
      (currentUser.value.uid && currentUser.value.uid.substr(0, 6)) ||
      "陌生用户")
  })

  const setCurrentUser = (user: any) => {
    currentUser.value = user
  }

  const setUserJwt = (jwt: string) => {
    userJwt.value = jwt
  }

  const setCenterToken = (token: string) => {
    centerToken.value = token
  }

  const loginSuccess = ({ token }, subToken: string, nuxtApp: any): string => {
    nuxtApp.runWithContext(()=>{
      let cookieJwt = useCookie("jwt", {
        path: "/",
      })
      cookieJwt.value = token
      setUserJwt(token)

      let cookieCenterToken = useCookie("center-token", {
        path: "/",
      })
      cookieCenterToken.value = subToken
      setCenterToken(subToken)
    })
    return token
  }

  // 登录
  const login = async ({ token, subToken }, nuxtApp: any): Promise<void> => {
    let {data, status} = await useUserApi().login({loginToken: token})
    if (status.value === "success" && data.value.success) {
      loginSuccess(data.value.data, subToken, nuxtApp)
    } else {
      throw data.value
    }
  }

  // 退出登录
  const logout = async () => {
    setCurrentUser(null)
    setUserJwt("")
    setCenterToken("")

    let cookieJwt = useCookie("jwt", {
      path: "/",
    })
    cookieJwt.value = null

    let cookieCenterToken = useCookie("center-token", {
      path: "/",
    })
    cookieCenterToken.value = null
  }

  return {
    currentUser,
    userJwt,
    centerToken,

    setCurrentUser,
    setUserJwt,
    setCenterToken,

    currentUserName,
    getTokenFromCookie,
    getCurrentUser,

    loginSuccess,
    login,
    logout,
  }

})
