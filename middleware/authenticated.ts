import Utils from '~/common/utils'
import {useAuthStore} from '~/store/auth'
import {useConfigStore} from '~/store/config'

export default async function(to) {
  const authStore = useAuthStore()
  const user = authStore.currentUser

  if (!user) {
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
