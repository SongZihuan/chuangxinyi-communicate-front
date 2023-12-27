<template>
  <div
    v-infinite-scroll="loadMore"
    class="load-more"
    :infinite-scroll-disabled="disabled"
    infinite-scroll-distance="10"
  >
    <slot :results="results" />
    <div v-if="loading" class="load-more-loading">
      <div class="loading-animation" />
      <span class="load-more-text">加载中...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import requests from "~/requests"

const props = defineProps({
  // 请求URL
  url: {
    type: String,
    required: true
  },
  // 请求参数
  params: {
    type: Object,
    default() {
      return {}
    },
    required: false
  },
  // 初始化数据
  initData: {
    type: Object,
    default() {
      return {
        results: [],
        cursor: ''
      }
    }
  }
})

let cursor = ref(props.initData.cursor)
let results = ref(props.initData.results || [])
let hasMore = ref(true)
let loading = ref(false)

let disabled = computed((): boolean => {
  return loading.value || !hasMore.value
})

const loadMore = async () => {
  loading.value = true
  try {
    const _params = Object.assign(props.params || {}, {
      cursor: cursor.value
    })
    let {data, status} = await requests({
      url: props.url,
      method: "GET",
      query: _params,
      data: undefined,
      useCache: false,
    })

    if (status == "success") {
      cursor.value = data.value.data.cursor
    }

    if (status == "success" && data.value.data.results && data.value.data.results.length) {
      data.value.data.results.forEach((item) => {
        results.value.push(item)
      })
    } else {
      hasMore.value = false
    }
  } catch (err) {
    hasMore.value = false
    console.error(err)
  } finally {
    loading.value = false
  }
}

const unshiftResults = (item) => {
  if (item) {
    results.value.unshift(item)
  }
}

const pushResults = (item) => {
  if (item) {
    results.value.push(item)
  }
}

defineExpose({
  unshiftResults,
  pushResults,
})

</script>

<style lang="scss" scoped>
.load-more {
  .load-more-loading {
    text-align: center;
    font-size: 12px;

    .loading-animation {
      height: 12px;
      width: 12px;
    }

    .load-more-text {
      color: #000;
      margin-left: 5px;
    }
  }
}
</style>
