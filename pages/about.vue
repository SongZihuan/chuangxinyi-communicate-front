<template>
  <div class="flex flex-col w-[100%]">
    <div class="my-2">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/' }">{{ siteName }}</el-breadcrumb-item>
        <el-breadcrumb-item>关于</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="flex flex-col justify-start my-2">
        <el-card class="my-2">
          <template #header>
            <h2 class="title">关于 {{ siteName }}</h2>
          </template>
          {{ siteName }} 是一个社区网站，基于Zendea。
        </el-card>

        <el-card class="my-2">
          <template #header>
            <h2 class="title">浏览 {{ siteName }}</h2>
          </template>

          为了获得访问 {{ siteName }} 的最佳体验，我们推荐使用
          <el-link href="http://chrome.google.com/" target="_blank"
          >Google Chrome
          </el-link>
          或
          <el-link href="http://www.getfirefox.com/" target="_blank"
          >Mozilla Firefox
          </el-link>
          浏览器
        </el-card>

        <el-card class="my-2">
          <template #header>
            <h2 class="title">Tips</h2>
          </template>
          1. {{ siteName }} 不反对文章的原作者自己全文转载自己写的原创文章<br />
          2. “路过”、“沙发”之类的 0
          信息量回复会被自动规则阻挡或被管理员删除。与讨论主题完全无关的回复，尤其是在技术类主题下出现的话，会被管理员删除。
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Utils from "~/common/utils"
import { ArrowRight } from '@element-plus/icons-vue'

let siteName = computed(()=>{
  return Utils.siteTitle()
})

useHead({
  title: Utils.siteTitle('关于')
})

</script>

<style lang="scss" scoped>
.title {
  font-size: 20px;
}

</style>
