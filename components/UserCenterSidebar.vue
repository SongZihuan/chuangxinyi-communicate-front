<template>
  <div class="widget">
    <div class="widget-header" @click="toHomePage" >{{ user.username }} ({{ user.nickname }})</div>
    <div class="widget-content">
      <div class="score">
        <i class="iconfont icon-dollar" />
        <span>{{ user.score }}</span>
        <a v-if="isOwner" class="score-log" href="/user/scores"
          >积分明细&gt;&gt;</a
        >
      </div>
      <ul v-if="isOwner" class="operations">
        <li>
          <i class="iconfont icon-edit" />
          <span @click="toUserCenter">编辑资料</span>
        </li>
        <li>
          <i class="iconfont icon-message" />
          <a href="/user/notifications">动态</a>
        </li>
        <li>
          <i class="iconfont icon-favorite" />
          <a href="/user/favorites">收藏</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Utils from "~/common/utils"

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.currentUser
    },
    // 是否是主人态
    isOwner() {
      const current = this.$store.state.auth.currentUser
      return this.user && current && this.user.id === current.id
    }
  },
  methods: {
    toUserCenter() {
      Utils.openTo(this.$config.USER_CENTER)
    },
    toHomePage() {
      Utils.openTo(this.$config.HOME_PAGE + "?userID=" + this.user.uid)
    }
  }
}
</script>

<style lang="scss" scoped>
.img-avatar {
  margin-top: 5px;
  border: 1px dotted #eeeeee;
  border-radius: 5%;
}

.description {
  font-size: 14px;
  padding: 5px 0 5px 5px;
  // padding: 10px 15px;
  // border: 1px dotted #eeeeee;
  // border-left: 3px solid #eeeeee;
  background-color: #fbfbfb;
}

.score {
  span {
    font-size: 15px;
    font-weight: bold;
    color: #3c3107;
  }

  .score-log {
    color: #3273dc;
    font-size: 75%;
    margin-left: 5px;
    &:hover {
      text-decoration: underline;
    }
  }
}

.operations {
  list-style: none;
  margin-top: 8px;
  margin-left: 0px;

  li {
    padding-left: 3px;

    font-size: 13px;
    &:hover {
      cursor: pointer;
      background-color: #fcf8e3;
      color: #8a6d3b;
      font-weight: bold;
    }

    a {
      color: #3273dc;
    }
  }
}
</style>
