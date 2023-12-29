<template>
  <div class="flex flex-col w-[100%]">
    <div class="my-2">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/' }"> 首页 </el-breadcrumb-item>
        <el-breadcrumb-item>标签</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="flex flex-col justify-start my-2">
        <el-card>
          <template #header>
            标签
          </template>

          <div class="flex flex-col">
            <div class="flex flex-row flex-wrap">
              <div
                v-for="(tag, index) in tagsPage.results"
                :key="index"
                class="m-1"
              >
                <el-link :href="'/topics/tag/' + tag.tagId">
                  <el-tag>{{ tag.tagName }}</el-tag>
                </el-link>
              </div>
            </div>
            <Pagination @change="onChange" :page="tagsPage.page" />
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Pagination from '~/components/Pagination'
import { useTagsApi } from '~/api/tags'
import Utils from "~/common/utils"
import { ArrowRight } from '@element-plus/icons-vue'

let tagsPage = ref({})

const route = useRoute()
const page = ref(route.params.page || 1)

const getTagsPage = async () => {
  let {data, status, error} = await useTagsApi().tags({
    page: page
  })
  if (status.value === "success" && data.value.success) {
    tagsPage.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
    showError({
      statusCode: 404,
      message: "标签未找到",
    })
  }
}

await Promise.all([
  getTagsPage(),
])

const onChange = async (newPage: number) => {
  page.value = newPage
  await getTagsPage()
}

useHead({
  title: Utils.siteTitle('标签')
})

</script>

<style lang="scss" scoped></style>
