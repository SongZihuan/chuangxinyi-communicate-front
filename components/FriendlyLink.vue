<template>
  <div class="my-1 mx-1">
    <el-link
      :href="link.url"
    >
      <div v-if="link.logo">
        <el-avatar shape="square" :src="link.logo" />
      </div>
      <div v-else class="flex flex-col justify-center">
        <div>
          {{ link.title }}
        </div>
        <div>
          {{ link.summary }}
        </div>
      </div>
    </el-link>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  link: {
    type: Object,
    require: true,
  }
})

let link = ref(props.link)

</script>

<style scoped lang="scss">

</style>
