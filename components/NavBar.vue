<template>
  <nav ref="nav" class="navbar" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <nuxt-link to="/" class="navbar-item">
          <i class="iconfont icon-zendea brand"></i>
        </nuxt-link>
        <a
          :class="{ 'is-active': navbarActive }"
          @click="toggleNav"
          class="navbar-burger burger"
          data-target="navbarBasic"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </a>
      </div>
      <div :class="{ 'is-active': navbarActive }" class="navbar-menu">
        <div class="navbar-start">
          <a
            v-for="(nav, index) in setting.siteNavs"
            :key="index"
            :href="nav.url"
            :class="{ 'is-active': route.path === nav.url }"
            class="navbar-item"
            >{{ nav.title }}</a
          >
        </div>

        <div class="navbar-end">
          <div class="navbar-item has-dropdown is-hoverable">
            <a href="/topic/create" title="发表话题" class="navbar-link">
              <i class="iconfont icon-create"></i>
            </a>
            <div class="navbar-dropdown">
              <a href="/topic/create" class="navbar-item">
                <i class="iconfont icon-topic" />&nbsp;话题
              </a>
              <a href="/article/create" class="navbar-item">
                <i class="iconfont icon-article" />&nbsp;文章
              </a>
            </div>
          </div>

          <notifier v-if="user" />

          <div v-if="isAdmin" class="navbar-item dropdown">
            <a href="/admin" title="后台管理">
              <i class="iconfont icon-wrench"></i>
            </a>
          </div>

          <div v-if="user" class="navbar-item has-dropdown is-hoverable">
            <a :href="'/user/' + user.id" class="navbar-link">
              <strong>{{ username }}</strong>
            </a>
            <div class="navbar-dropdown">
              <a :href="'/user/' + user.id" class="navbar-item">
                <i class="iconfont icon-home" />&nbsp;我的首页
              </a>
              <a class="navbar-item" href="/user/settings">
                <i class="iconfont icon-user" />&nbsp;编辑资料
              </a>
              <a class="navbar-item" href="/user/favorites">
                <i class="iconfont icon-favorite" />&nbsp;我的收藏
              </a>
              <a @click="logout" class="navbar-item">
                <i class="iconfont icon-logout" />&nbsp;退出登录
              </a>
            </div>
          </div>
          <div v-else class="navbar-item">
            <div class="buttons">
              <div class="button is-small is-info" @click="login"
                >登录
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import utils from '~/common/utils'
import Notifier from '~/components/Notifier'
import { useConfigStore } from '~/store/config'
import { useAuthStore } from '~/store/auth'
import { ElMessage } from "element-plus"

const route = useRoute()
const configStore = useConfigStore()
const authStore = useAuthStore()

let navbarActive = ref(false)

let user = authStore.currentUser

let username = computed((): string => {
  return authStore.currentUserName
})

let isAdmin = computed((): boolean => {
  const user = authStore.currentUser
  const LevelUserAdmin = configStore.appinfo.user_level_admin
  return user && user.level === LevelUserAdmin
})

let setting = computed((): any => {
  return configStore.setting
})

const login = async () => {
  await utils.toSignin(this, window.location.href)
}

const logout = async () => {
  try {
    await authStore.logout(useNuxtApp())
    let ref = '/'
    if (ref === '/' && process.client) {
      ref = window.location.pathname
    }

    ElMessage.info("退出成功")
    setTimeout(()=> {
      utils.linkTo(ref)
    }, 1000)
  } catch (e) {
    console.error(e)
  }
}
const toggleNav = () => {
  navbarActive.value = !navbarActive.value
}

</script>

<style lang="scss" scoped></style>
