import { defineStore } from 'pinia'
import { useUserApi } from "~/api/user"

export const useAuthStore = defineStore("auth", ()=> {
  let currentUser = ref(null)
  let userJwt = ref("")

  const getTokenFromCookie = computed(async (): Promise<string> => {
    let cookieJwt = useCookie("jwt", {
      path: "/",
    })
    if (cookieJwt.value) {
      setUserJwt(cookieJwt.value)
    }
    return JSON.stringify(cookieJwt.value)
  })

  // 获取当前登录用户
  const getCurrentUser = computed(async (): Promise<any> => {
    if (!userJwt.value) {
      currentUser.value = null
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
    return currentUser.value.nickname || currentUser.value.username || currentUser.value.email || currentUser.value.phone
  })

  const setCurrentUser = (user: any) => {
    currentUser.value = user
  }

  const setUserJwt = (jwt: string) => {
    userJwt.value = jwt
  }

  const loginSuccess = ({ token }, nuxtApp: any): string => {
    nuxtApp.runWithContext(()=>{
      let cookieJwt = useCookie("jwt", {
        path: "/",
      })
      cookieJwt.value = token
      setUserJwt(token)
    })
    return token
  }

  // 登录
  const login = async ({ token }, nuxtApp: any): Promise<void> => {
    let {data, status} = await useUserApi().login({loginToken: token})
    if (status.value === "success" && data.value.success) {
      loginSuccess(data.value.data, nuxtApp)
    } else {
      throw data.value
    }
  }

  // 退出登录
  const logout = async () => {
    setCurrentUser(null)
    setUserJwt("")


    let cookieJwt = useCookie("jwt", {
      path: "/",
    })
    console.log("BBB", cookieJwt.value)
    cookieJwt.value = null
    console.log("DDD", cookieJwt.value)

    let cookieJwt2 = useCookie("jwt", {
      path: "/",
    })
    console.log("CCC", cookieJwt2.value)
  }

  return {
    currentUser,
    userJwt,

    setCurrentUser,
    setUserJwt,

    currentUserName,
    getTokenFromCookie,
    getCurrentUser,

    loginSuccess,
    login,
    logout,
  }

})
