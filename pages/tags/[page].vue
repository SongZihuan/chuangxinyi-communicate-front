<template>
  <section class="main">
    <div class="container">
      <div class="main-container columns">
        <div class="column is-12">
          <div class="widget">
            <div class="widget-header">
              <span>标签</span>
            </div>
            <div class="widget-content">
              <div class="tags are-medium">
                <span
                  v-for="tag in tagsPage.results"
                  :key="tag.tagId"
                  class="tag is-normal"
                >
                  <a :href="'/topics/tag/' + tag.tagId" :title="tag.tagName">
                    {{ tag.tagName }}
                  </a>
                </span>
              </div>
            </div>
            <Pagination :page="tagsPage.page" @change="onChange"/>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Pagination from '~/components/Pagination'
import { useTagsApi } from '~/api/tags'
import Utils from "~/common/utils"

let tagsPage = ref({})

const route = useRoute()

const getTagsPage = async () => {
  let {data, status, error} = await useTagsApi().tags({
    page: route.params.page
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

useHead({
  title: Utils.siteTitle('标签')
})

</script>

<style lang="scss" scoped></style>
