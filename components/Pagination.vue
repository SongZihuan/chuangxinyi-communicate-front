<template>
  <nav
    v-if="page.total > 0"
    class="pagination is-small"
    role="navigation"
    aria-label="pagination"
  >
    <a
      v-if="previousPageUrl"
      :href="previousPageUrl"
      class="pagination-previous"
      >上一页</a
    >
    <a v-else class="pagination-previous" disabled>上一页</a>

    <a v-if="nextPageUrl" :href="nextPageUrl" class="pagination-previous"
      >下一页</a
    >
    <a v-else class="pagination-previous" disabled>下一页</a>

    <ul class="pagination-list">
      <li v-for="p in pageList" :key="p">
        <a
          :class="{ 'is-current': p == page.page }"
          :href="getPageUrl(p)"
          class="pagination-link"
          >{{ p }}</a
        >
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">

const props = defineProps({
  page: {
    type: Object,
    default() {
      return {
        page: 1,
        total: 0,
        limit: 20,
      }
    },
    require: true,
  },
  urlPrefix: {
    // 分页url前缀
    type: String,
    default: '/',
    required: true
  }
})

let page = ref(props.page)
let urlPrefix = ref(props.urlPrefix)

let pageList = computed(() => {
  const start = page.value.page - 2
  const end = page.value.page + 2
  const totalPage = getTotalPage()
  if (start <= 0) {
    const pages = []
    for (let i = 1; i <= 5 && i <= totalPage; i++) {
      pages.push(i)
    }
    return pages
  } else if (end > totalPage) {
    const pages = []
    let i = totalPage - 5 <= 0 ? 1 : totalPage - 5
    for (; i > 0 && i <= totalPage; i++) {
      pages.push(i)
    }
    return pages
  } else {
    return [
      page.value.page - 2,
      page.value.page - 1,
      page.value.page,
      page.value.page + 1,
      page.value.page + 2
    ]
  }
})

let previousPageUrl = computed(() => {
  return getPreviousPageUrl()
})

let nextPageUrl = computed(() => {
  return getNextPageUrl()
})

const getNextPageUrl = () => {
  const nextPage = page.value.page + 1
  if (nextPage > getTotalPage()) {
    return ''
  }
  return getPageUrl(nextPage)
}

const getPreviousPageUrl = () => {
  const previousPage = page.value.page - 1
  if (previousPage <= 0) {
    return ''
  }
  return getPageUrl(previousPage)
}

const getPageUrl = (p: number) => {
  if (page.value.page === p) {
    return 'javascript:void(0)'
  }
  return urlPrefix.value + p
}

const getTotalPage = () => {
  return page.value.total % page.value.limit > 0
    ? parseInt(page.value.total / page.value.limit) + 1
    : page.value.total / page.value.limit
}

</script>

<style lang="scss" scoped>
.pagination {
  margin: 10px 0;
}
</style>
