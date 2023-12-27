<template>
  <div class="navbar-item dropdown is-hoverable is-right msg-notice">
    <div class="dropdown-trigger">
      <a
        :class="{ 'msg-flicker': msgcount > 0 }"
        href="/user/notifications"
        class="msgicon"
        title="消息"
      >
        <i class="iconfont icon-bell"></i>
        <sup v-if="msgcount > 0">{{ msgcount > 9 ? '9+' : msgcount }}</sup>
      </a>
    </div>
    <div v-if="messages && messages.length" class="dropdown-menu">
      <div class="dropdown-content msglist-wrapper">
        <div class="msglist">
          <ul>
            <li v-for="msg in messages" :key="msg.messageId" class="msg-item">
              <a :href="'/user/' + msg.from.id" :title="Utils.getUserName(msg.from)">
                <img
                  v-lazy="runtimeConfig.public.AVATAR_URL + '?uid=' + msg.from.uid"
                  class="avatar size-20"
                />
              </a>
              <a href="/user/notifications">{{ msg.content }}</a>
            </li>
          </ul>
        </div>
        <div class="msgfooter">
          <a href="/user/notifications">消息中心&gt;&gt;</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {useAuthStore} from '~/store/auth'
  import Utils from '~/common/utils'

  let msgcount = ref(0)
  let messages = ref([])
  let authStore = useAuthStore()
  const runtimeConfig = useRuntimeConfig()

  let user = authStore.currentUser

  const getMsgcount = async () => {
    if (user) {
      // 还未对接用户中心
      // const ret = await this.$axios.get('/api/user/notifications/recent')
      // this.msgcount = ret.count
      // this.messages = ret.notifications
    }
  }

  getMsgcount()
</script>

<style lang="scss" scoped>
.msg-notice {
  .msgicon {
    font-size: 16px;
    color: #000;

    &:hover {
      color: red;
    }
  }

  // 闪烁
  .msg-flicker {
    // animation: msgnotice 1s 3;
    animation: msgnotice 1s infinite;
  }

  @keyframes msgnotice {
    50% {
      // color: transparent;
      color: red;
    }
  }

  .msglist-wrapper {
    padding: 5px 10px;
    .msglist {
      .msg-item {
        padding: 3px 0 -10px 0;
        font-size: 12px;
        line-height: 31px;
        overflow: hidden;
        word-break: break-all;
        -webkit-line-clamp: 1;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        &:not(:last-child) {
          border-bottom: 1px solid #f7f7f7;
        }
        .avatar {
          vertical-align: middle;
        }
      }
    }
    .msgfooter {
      border-top: 1px solid #f7f7f7;
      text-align: right;
      a {
        font-size: 13px;
      }
    }
  }
}
</style>
