import Utils from '~/common/utils'
import {useAuthStore} from '~/store/auth'
import {useConfigStore} from '~/store/config'

export default async function(to: { path: string | string[] }) {
  const authStore = useAuthStore()
  const user = authStore.currentUser

  console.log("AAAAA", user)

  if (!user) {
    console.log("BBBB")
    const nuxtApp = useNuxtApp()
    await Utils.toSignin(nuxtApp)
    return
  }

  if (to.path.indexOf('/admin') === 0) {
    if (!isAdminUser(user)) {
      abortNavigation({
        statusCode: 403,
        message: '403 forbidden'
      })
    }
  }
}

function isAdminUser(user: any): boolean {
  return user && user.level === useConfigStore().appinfo.user_level_admin
}
