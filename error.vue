<template>
  <section class="main-container">
    <div class="container">
      <div class="error">
        <div class="description">
          <span v-if="props.error.statusCode === 404">{{
              props.error.message ? props.error.message : '页面没找到'
          }}</span>
          <span v-if="props.error.statusCode === 403">{{
              props.error.message ? props.error.message : '不允许访问'
          }}</span>
          <span v-else>
            {{ props.error.statusCode }}
            {{ runtimeConfig.public.ENV === "development" ? (props.error.message ? props.error.message : '页面错误' ): "页面错误" }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">

const props = defineProps({
  error: {
    type: Object,
    default: null,
  }
})

const runtimeConfig = useRuntimeConfig()

</script>

<style lang="scss" scoped>
.error {
  background: #fff;
  text-align: center;
  vertical-align: center;
  padding: 100px 0;

  .description {
    margin-top: 30px;
    span {
      font-size: 18px;
      font-weight: bold;
      line-height: 22px;
      color: rgb(230, 76, 76);
    }
  }
}
</style>
