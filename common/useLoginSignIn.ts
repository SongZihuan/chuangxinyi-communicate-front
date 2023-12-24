import utils from '~/common/utils'

export function useOauth2SignIn() {
	const redirect = async (path: string, query: object) => {
    try {
      await this.$store.dispatch('auth/signout')

      let domainUID = this.$store.state.config.appinfo.domainID
      if (!domainUID) {
        this.$toast.error("系统暂不支持登录")
      }

      let queryString = JSON.stringify(query)
      let oauth2Query = utils.encodeSearchParams({
        redirect_uri: this.$config.REDIECT_URL,
        redirect: path,
        domain: domainUID,
        params: queryString,
      })

      window.location.href = `${this.$config.OAUTH2_URL}?${oauth2Query}`
    } catch (e) {
      this.$toast.error(e.message || e)
    }
	}
	return {redirect}
}
