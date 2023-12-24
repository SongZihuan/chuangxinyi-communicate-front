export const state = () => ({
  currentUser: null,
  userJwt: null
})

export const mutations = {
  setCurrentUser(state, user) {
    state.currentUser = user
  },
  setUserJwt(state, jwt) {
    state.userJwt = jwt
  }
}

export const actions = {
  // 登录成功
  loginSuccess(context, { token }) {
    this.$cookies.set('jwt', token, { maxAge: 86400 * 7, path: '/' })
    context.commit('setUserJwt', token)
  },

  getTokenFromCookie(context) {
    const token = this.$cookies.get('jwt')
    if (token) {
      context.commit('setUserJwt', token)
    }
  },

  // 获取当前登录用户
  async getCurrentUser(context) {
    const ret = await this.$axios.get('/api/user/current')
    if (ret.success) {
      const user = ret.data
      context.commit('setCurrentUser', user)
      return user
    }
  },

  // 登录
  async signin(context, { token }) {
    const ret = await this.$axios.post('/api/auth/login', {
      loginToken: token,
    })
    if (ret.success === true) {
      context.dispatch('loginSuccess', ret.data)
    } else {
      throw ret
    }
  },

  // 退出登录
  signout(context) {
    context.commit('setCurrentUser', null)
    this.$cookies.remove('jwt')
  }
}
