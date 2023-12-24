import Utils from '~/common/utils'

export default async function(context) {
  const user = context.store.state.auth.currentUser
  if (!user) {
    await Utils.toSignin(context)
    return
  }
  if (isAdminUrl(context)) {
    if (!isAdminUser(context, user)) {
      context.error({
        statusCode: 403,
        message: '403 forbidden'
      })
    }
  }
}

// 当前访问URL是否是管理后台
function isAdminUrl(context) {
  return context.route.path.indexOf('/admin') === 0
}

// 当前用户是否是管理员
function isAdminUser(context, user) {
  const LevelUserAdmin = context.store.state.config.appinfo.user_level_admin
  if (!user) {
    return false
  }
  return user.level === LevelUserAdmin;

}
