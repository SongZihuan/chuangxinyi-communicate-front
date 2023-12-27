<template>
  <div />
</template>

<script setup lang="ts">
import {useArticleApi} from '~/api/article'
import Utils from '~/common/utils'

const route = useRoute()
const articleId = route.params.id

const toRedirect = async () => {
  let {data, status} = await useArticleApi().redirect(articleId)
  if (status.value === "success" && data.value.success) {
    Utils.redirectTo(data.value.data.url)
  } else {
    showError({
      statusCode: 404,
      message: '页面不存在'
    })
  }
}

await toRedirect()

</script>
