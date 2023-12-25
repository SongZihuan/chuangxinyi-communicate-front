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
    return setting.siteTitle || ''
  })

  const siteDescription = computed(() => {
    return setting.siteDescription || ''
  })

  const siteKeywords = computed(() => {
    return setting.siteKeywords || ''
  })

  const setConfig = (config) => {
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

export const getters = {
  siteTitle(state) {
    return state.setting.siteTitle || ''
  },
  siteDescription(state) {
    return state.setting.siteDescription || ''
  },
  siteKeywords(state) {
    return state.setting.siteKeywords || ''
  },
}
