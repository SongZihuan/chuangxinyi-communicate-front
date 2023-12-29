<template>
  <div v-if="isOwner && userWatchers">
    <el-card>
      <div class="flex flex-row flex-wrap">
        <Avatar
          v-for="(u, index) in userWatchers"
          class="m-2"
          :key="index"
          :user="u"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'
import { useUserApi } from '~/api/user'

const props = defineProps({
  id: {
    type: Number,
    required: true,
  }
})

let currentUser = computed(()=>{
  return useAuthStore().currentUser
})

let isOwner = computed(()=>{
  return props.id && currentUser.value && props.id === currentUser.value.id
})

let userWatchers = ref([])
const getUserWatcher = async () => {
  let {data, status, error} = await useUserApi().recentwatchers(props.id)
  if (status.value === "success" && data.value.success) {
    userWatchers.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

await Promise.all([
  getUserWatcher(),
])

</script>

<style scoped lang="scss">

</style>
