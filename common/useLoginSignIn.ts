import utils from '~/common/utils'
import {useAuthStore} from '~/store/auth'
import {useConfigStore} from '~/store/config'
import {ElMessage} from "element-plus"

export function useOauth2SignIn() {
	const redirect = async (path: string, query: object) => {
    try {
      const authStore = useAuthStore()
      const configStore = useConfigStore()
      const runtimeConfig = useRuntimeConfig()

      await authStore.logout(useNuxtApp())

      let domainUID = configStore.appinfo.domainID
      if (!domainUID) {
        ElMessage.error("系统暂不支持登录")
      }

      let queryString = JSON.stringify(query)
      let oauth2Query = utils.encodeSearchParams({
        redirect_uri: runtimeConfig.public.REDIECT_URL,
        redirect: path,
        domain: domainUID,
        params: queryString,
      })

      window.location.href = `${runtimeConfig.public.OAUTH2_URL}?${oauth2Query}`
    } catch (e) {
      ElMessage.error(e.message || e)
    }
	}
	return {redirect}
}
