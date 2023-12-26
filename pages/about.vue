<template>
  <section class="main">
    <div class="container">
      <div class="main-container columns">
        <div class="column is-12">
          <div class="widget">
            <div class="widget-header">
              <a href="/">{{ siteName }}</a>
              › About <i class="el-icon-edit"></i>
            </div>
            <div class="widget-content content">
              <h2>关于{{ siteName }}</h2>
              <p>
                {{ siteName }}是一个社区网站，基于Zendea。
              </p>

              <h2>浏览</h2>
              <p>
                为了获得访问 Zendea 的最佳体验，我们推荐使用
                <a href="http://chrome.google.com/" target="_blank"
                  >Google Chrome
                </a>
                或
                <a href="http://www.getfirefox.com/" target="_blank"
                  >Mozilla Firefox
                </a>
                浏览器
              </p>

              <h2>Tips</h2>
              <p>
                1. {{ siteName }} 不反对文章的原作者自己全文转载自己写的原创文章<br />
                2. “路过”、“沙发”之类的 0
                信息量回复会被自动规则阻挡或被管理员删除。与讨论主题完全无关的回复，尤其是在技术类主题下出现的话，会被管理员删除。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Utils from "~/common/utils"

let siteName = computed(()=>{
  return Utils.siteTitle()
})

useHead({
  title: Utils.siteTitle('关于')
})

</script>

<style lang="scss" scoped></style>
