<template>
  <div>
    <footer class="flex flex-col justify-center items-center my-3">
      <div class="flex flex-col justify-center items-center">
        <div class="flex flex-row justify-center items-center my-3">
          <el-text class="flex flex-row justify-center items-center">
            <el-link href="/about">关于</el-link>
            <span class="mx-1"> | </span>
            <el-link href="/tags/1">标签</el-link>
          </el-text>
        </div>
        <div class="flex flex-row justify-center items-center my-3">
          <div class="mx-3" v-if="config?.copyright">
            <el-text>
              版权所有 © {{ dayjs().format("YYYY") }} {{ config.copyright }}
            </el-text>
          </div>

          <div class="mx-3" v-if="config?.icp" @click="Utils.openTo('https://beian.miit.gov.cn/')">
            <el-text>
              {{ config.icp }}
            </el-text>
          </div>

          <div class="flex flex-row mx-3 justify-center items-center" v-if="config?.gongan" @click="Utils.openTo('https://beian.mps.gov.cn/#/query/webSearch')">
            <img
              :src="beian" class="w-[20px] h-[20px] mr-[4px]"
              alt="gongan"
            />
            <el-text>
              {{ config.gongan }}
            </el-text>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {useConfigStore} from '~/store/config'
import Utils from "~/common/utils"
import beian from "~/assets/images/beian.png"
import dayjs from "dayjs"

const configStore = useConfigStore()

let config = computed(() => {
  return configStore.setting.footerConfig || {}
})

</script>

<style lang="scss" scoped>
</style>
