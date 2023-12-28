<template>
  <el-avatar @click="onClick" shape="square" :src="runtimeConfig.public.AVATAR_URL + '?uid=' + user.uid" />
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
