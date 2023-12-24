<script>
  import Utils from '~/common/utils'

  export default {
    async mounted() {
      await Utils.toSignin(this)
    }
  }
</script>

<template>
  <div></div>
</template>

<style scoped lang="scss">

</style>
