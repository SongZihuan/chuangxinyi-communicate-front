<template>
  <div class="flex flex-col items-end" v-if="page.total > 0">
    <div>
      <client-only>
        <el-pagination
          layout="prev, pager, jumper, total, next"
          :total="page.total"
          v-model:current-page="page.page"
          @change="onChange"
        />
      </client-only>
    </div>
  </div>
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
})

const emit = defineEmits(["change"])

let page = ref(props.page)

const onChange = () => {
  emit("change", page.value.page)
}

</script>

<style lang="scss" scoped>
.pagination {
  margin: 10px 0;
}
</style>
