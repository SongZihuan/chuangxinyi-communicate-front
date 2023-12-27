import {useConfigStore} from '~/store/config'
import {useAuthStore} from '~/store/auth'

export default defineNuxtPlugin(async (): Promise<void> => {
  const configStore = useConfigStore()
  await configStore.loadConfig

  const authStore = useAuthStore()
  await authStore.getTokenFromCookie
  await authStore.getCurrentUser
})
