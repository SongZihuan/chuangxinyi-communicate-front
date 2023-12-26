import Utils from '~/common/utils'
import {useAuthStore} from '~/store/auth'
import {useConfigStore} from '~/store/config'

export default async function(to: { path: string | string[] }) {
  const authStore = useAuthStore()
  const user = authStore.currentUser

  console.log("AAA")

  if (to.path.indexOf('/admin') === 0) {
    if (!isAdminUser(user)) {
      abortNavigation({
        statusCode: 403,
        message: '你不允许访问此页面'
      })
      return
    }
  } else {
    console.log("BBB", user)
    if (!isNormalUser(user)) {
      const nuxtApp = useNuxtApp()
      await Utils.toSignin(nuxtApp)
      abortNavigation({
        statusCode: 403,
        message: '请先登录在进行操作'
      })
      return
    }
  }
}

function isAdminUser(user: any): boolean {
  return user && user.level === useConfigStore().appinfo.user_level_admin
}

function isNormalUser(user: any): boolean {
  return user
}
