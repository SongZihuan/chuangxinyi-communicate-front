import {useConfigStore} from '~/store/config'
import {useAuthStore} from '~/store/auth'
import {useMsgStore} from '~/store/msg'
import {useSocket} from '~/common/useWebstocket'

export default defineNuxtPlugin(async (): Promise<void> => {
  const configStore = useConfigStore()
  await configStore.loadConfig

  const authStore = useAuthStore()
  await authStore.getTokenFromCookie

  let user = await authStore.getCurrentUser
  if (user) {
    const msgStore = useMsgStore()
    await msgStore.setMessageList()

    if (process.client) {
      await useSocket(useNuxtApp())
    }
  }
})
