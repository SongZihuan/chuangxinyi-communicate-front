<template>
  <div>
    <footer class="footer">
      <div class="container content">
        <p>
          <a href="/about">关于</a>
          <a href="/tags">标签</a>
        </p>
        <p>
          © 2020-2022 Powered by
          {{ appName }}
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  computed: {
    appName() {
      return this.$store.state.config.appinfo.name || ''
    },
  },
}

</script>

<style lang="scss" scoped>
.footer {
  font-size: 14px;
  color: #666;
  background: none;
  text-align: center;
  margin: 0px 10px;
  a {
    color: #666;
    text-decoration: none;
  }

  .light {
    font-weight: 700;
  }
  .icon-divider-vertical {
    font-size: 12px;
  }
}
</style>
