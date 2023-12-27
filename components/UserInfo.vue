<template>
  <div class="user-info-component">
    <img :src="runtimeConfig.public.AVATAR_URL + '?uid=' + user.uid" class="avatar" />
    <div class="user-info-component-right">
      <div>{{ user.id }}</div>
      <span>{{ user.nickname }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">

const runtimeConfig = useRuntimeConfig()

const props = defineProps({
  user: {
    type: Object,
    required: true,
    default() {
      return null
    }
  }
})

let user = ref(props.user)
</script>

<style lang="scss" scoped>
.user-info-component {
  display: flex;

  .user-info-component-right {
    margin-left: 5px;
    padding: 3px 0;

    font-weight: 700;
    font-size: 15px;
  }
}
</style>
