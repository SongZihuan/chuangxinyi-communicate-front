<template>
  <div @click="onClick">
    <el-avatar shape="square" :src="runtimeConfig.public.AVATAR_URL + '?uid=' + user.uid" />
  </div>
</template>

<script setup lang="ts">
import Utils from "~/common/utils"

const props = defineProps({
  user: {
    type: Object,
    require: true,
  }
})

const runtimeConfig = useRuntimeConfig()
let user = ref(props.user)

const onClick = () => {
  Utils.linkTo('/user/' + user.value.id)
}

</script>

<style scoped lang="scss">

</style>
