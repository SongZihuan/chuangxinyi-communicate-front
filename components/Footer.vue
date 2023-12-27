<template>
  <div>
    <footer class="flex flex-col justify-center items-center my-3">
      <div class="flex flex-col justify-center items-center">
        <div class="flex flex-row justify-center items-center my-3">
          <el-text class="flex flex-row justify-center items-center">
            <el-link href="/about">关于</el-link>
            <span class="mx-1"> | </span>
            <el-link href="/tags">标签</el-link>
          </el-text>
        </div>
        <div class="flex flex-row justify-center items-center my-3">
          <el-text class="mx-3">
            © 2020-2022 Powered by {{ appName }}
          </el-text>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {useConfigStore} from '~/store/config'

const configStore = useConfigStore()

let appName = computed(() => {
  return configStore.appinfo.name || ''
})

</script>

<style lang="scss" scoped>
//.footer {
//  background: #fff;
//  padding: 20px 0 20px 0;
//
//  font-size: 14px;
//  color: #666;
//  background: none;
//  text-align: center;
//  margin: 0px 10px;
//
//  a {
//    color: #666;
//    text-decoration: none;
//  }
//
//  .light {
//    font-weight: 700;
//  }
//  .icon-divider-vertical {
//    font-size: 12px;
//  }
//
//  .hide {
//    a {
//      color: #efeaea;
//
//      &:hover {
//        color: #746f6f;
//      }
//    }
//  }
//}

</style>
