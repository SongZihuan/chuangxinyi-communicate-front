<template>
  <div v-if="links && links.length" class="my-2">
    <el-card>
      <template #header>
        <div class="flex flex-row justify-between items-center">
          <div>
            友情链接
          </div>

          <el-link href="/links/1">
            查看更多&gt;&gt;
          </el-link>
        </div>
      </template>

      <div class="flex flex-row flex-wrap">
        <FriendlyLink
          v-for="(link, index) in links"
          :key="index"
          :link="link"
        />
      </div>

    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useLinksApi } from '~/api/links'
import FriendlyLink from '~/components/FriendlyLink.vue'

const links = ref([])

const getLinksTop = async () => {
  let {data, status, error} = await useLinksApi().topLinks()
  if (status.value === "success" && data.value.success) {
    links.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

await Promise.all([
  getLinksTop(),
])

</script>

<style scoped lang="scss">

</style>
