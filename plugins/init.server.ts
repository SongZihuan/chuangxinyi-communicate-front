import {useConfigStore} from '~/store/config'
import {useAuthStore} from '~/store/auth'

export default defineNuxtPlugin(async (): Promise<void> => {
  const configStore = useConfigStore()
  await configStore.loadConfig

  const authStore = useAuthStore()
  authStore.getTokenFromCookie
  authStore.getCurrentUser
})
