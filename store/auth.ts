import { defineStore } from 'pinia'
import { useUserApi } from "~/api/user"

export const useAuthStore = defineStore("auth", ()=> {
  let currentUser = ref(null)
  let userJwt = ref("")

  const getTokenFromCookie = computed((): string => {
    let cookieJwt = useCookie("jwt")
    if (cookieJwt.value) {
      setUserJwt(cookieJwt.value)
    }
    return cookieJwt.token
  })

  // 获取当前登录用户
  const getCurrentUser = computed(async (): Promise<any> => {
    let {data, status} = await useUserApi().getCurrentUser()
    if (status.value === "success" && data.value.success) {
      const user = data.value.data
      setCurrentUser(user)
      return user
    }
  })

  const setCurrentUser = (user) => {
    currentUser.value = user
  }

  const setUserJwt = (jwt: string) => {
    userJwt.value = jwt
  }

  const loginSuccess = ({ token }): string => {
    let cookieJwt = useCookie("jwt")
    cookieJwt.value = token
    setUserJwt(token)
    return token
  }

  // 登录
  const login = async ({ token }): Promise<void> => {
    let {data, status} = await useUserApi().login({loginToken: token as string})
    if (status.value === "success" && data.value.success) {
      loginSuccess(data.value.data)
    } else {
      throw data.value
    }
  }

  // 退出登录
  const logout = async () => {
    let cookieJwt = useCookie("jwt")

    setCurrentUser(null)
    setUserJwt("")
    cookieJwt.value = ""
  }

  return {
    currentUser,
    userJwt,

    setCurrentUser,
    setUserJwt,

    getTokenFromCookie,
    getCurrentUser,

    loginSuccess,
    login,
    logout,
  }

})
