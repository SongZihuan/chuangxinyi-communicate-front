import { defineStore } from 'pinia'
import { computed } from 'vue'
import {useConfigApi} from '~/api/config'

export const useConfigStore = defineStore("config", ()=> {
  let setting = ref({})
  let appinfo = ref({})

  const loadConfig = computed(async () => {
    let {data, status} = await useConfigApi().getConfig()
    if (status.value === "success") {
      setConfig(data.value.data)
      return data.value.data
    }
    return {}
  })

  const siteTitle = computed(() => {
    return setting.value.siteTitle || ''
  })

  const siteDescription = computed(() => {
    return setting.value.siteDescription || ''
  })

  const siteKeywords = computed(() => {
    return setting.value.siteKeywords || ''
  })

  const setConfig = (config: { setting: any, appinfo: any }) => {
    setting.value = config.setting
    appinfo.value = config.appinfo
  }

  return {
    setting,
    appinfo,

    loadConfig,
    siteTitle,
    siteDescription,
    siteKeywords,

    setConfig,
  }
})
