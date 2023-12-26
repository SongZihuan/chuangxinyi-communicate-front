<template>
  <div />
</template>

<script setup lang="ts">
import {useArticleApi} from '~/api/article'
import Utils from '~/common/utils'

const route = useRoute()
const articleId = route.params.id

const toRedirect = async () => {
  try {
    let {data, status} = useArticleApi().redirect(articleId)
    if (status === "success" && data.value.success) {
      Utils.redirectTo(data.value.data.url)
    } else {
      showError({
        statusCode: 404,
        message: '页面不存在'
      })
    }
  } catch (e) {
    showError({
      statusCode: 404,
      message: e.message || '页面不存在'
    })
  }
}

await toRedirect()

</script>
