<template>
  <el-page-header
    title="回到首页"
    class="h-10 my-2 mx-5"
    @back="onBack"
  >
    <template #icon>
      <el-image style="width: 50px; height: 50px" :src="Logo" fit="contain" />
    </template>

    <template #title>
      <span class="text-2xl"> {{ siteName }} </span>
    </template>

    <template #content>
      <el-button
        :disabled="route.path === btn.link"
        v-for="(btn, index) in btnList"
        :key="index"
        @click="Utils.linkTo(btn.link)"
      >
        {{ btn.name }}
      </el-button>
    </template>

    <template #extra>
      <el-button @click="Utils.linkTo('/')">
        回到前台
      </el-button>
    </template>
  </el-page-header>
</template>

<script setup lang="ts">
import Logo from 'assets/images/logo.png'
import Utils from '~/common/utils'

const route = useRoute()

const btnList =  [
  {
    name: "控制台",
    link: "/admin",
  },
  {
    name: "节点",
    link: "/admin/nodes",
  },
  {
    name: "话题",
    link: "/admin/topics",
  },
  {
    name: "文章",
    link: "/admin/articles",
  },
  {
    name: "评论",
    link: "/admin/comments",
  },
  {
    name: "用户",
    link: "/admin/users",
  },
  {
    name: "积分",
    link: "/admin/users/score",
  },
  {
    name: "友链",
    link: "/admin/links",
  },
  {
    name: "设置",
    link: "/admin/settings",
  },
]

let siteName = computed((): any => {
  return Utils.siteTitle('管理后台')
})

const onBack = async () => {
  await Utils.linkTo("/admin")
}

</script>

<style scoped lang="scss">

</style>
