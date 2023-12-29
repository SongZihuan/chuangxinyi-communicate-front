<template>
  <div class="flex flex-col w-[100%]">
    <div class="my-2">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/' }"> 首页 </el-breadcrumb-item>
        <el-breadcrumb-item>友情链接</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="flex flex-col justify-start my-2">
        <el-card>
          <template #header>
            友情链接
          </template>

          <div class="flex flex-col">
            <div class="flex flex-row flex-wrap">
              <FriendlyLink
                v-for="(link, index) in linksPage.results"
                :key="index"
                :link="link"
              />
            </div>
            <Pagination @change="onChange" :page="linksPage.paging" />
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Pagination from '~/components/Pagination'
import { useLinksApi } from '~/api/links'
import Utils from '~/common/utils'
import FriendlyLink from '~/components/FriendlyLink.vue'
import { ArrowRight } from '@element-plus/icons-vue'

let linksPage = ref({})

const route = useRoute()
const page = route.params.page || 1

const getLinkPage = async () => {
  let {data, status, error} = await useLinksApi().links({
    page: page
  })
  if (status.value === "success" && data.value.success) {
    linksPage.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
    showError({
      statusCode: 404,
      message: "友链未找到",
    })
  }
}

await Promise.all([
  getLinkPage(),
])

const onChange = async (newPage: number) => {
  page.value = newPage
  await getLinkPage()
}

useHead({
  title: Utils.siteTitle('友情链接'),
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: Utils.siteDescription()
    },
    { hid: 'keywords', name: 'keywords', content: Utils.siteKeywords() }
  ]
})

</script>

<style lang="scss" scoped></style>
