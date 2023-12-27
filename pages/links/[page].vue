<template>
  <section class="main">
    <div class="container">
      <div class="widget">
        <div class="widget-header">友情链接</div>
        <div class="widget-content">
          <ul class="links">
            <li
              v-for="link in linksPage.results"
              :key="link.linkId"
              class="link"
            >
              <div class="link-logo">
                <img v-if="link.logo" :src="link.logo" />
                <i v-if="!link.logo" class="iconfont icon-globe" />
              </div>
              <div class="link-content">
                <a
                  :href="'/link/' + link.linkId"
                  :title="link.title"
                  class="link-title"
                  target="_blank"
                  >{{ link.title }}</a
                >
                <p class="link-summary">
                  {{ link.summary }}
                </p>
              </div>
            </li>
          </ul>
          <Pagination :page="linksPage.page" url-prefix="/links/" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Pagination from '~/components/Pagination'
import { useLinksApi } from '~/api/links'
import Utils from '~/common/utils'

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
