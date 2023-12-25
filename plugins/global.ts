export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.config.globalProperties.$siteTitle = function(subTitle) {
    const siteTitle = this.$store.getters['config/siteTitle'] || ''
    if (subTitle) {
      return subTitle + (siteTitle ? ' | ' + siteTitle : '')
    }
    return siteTitle
  }

  vueApp.config.globalProperties.$siteDescription = function() {
    return this.$store.getters['config/siteDescription']
  }

  vueApp.config.globalProperties.$siteKeywords = function() {
    return this.$store.getters['config/siteKeywords']
  }
})
