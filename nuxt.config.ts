export default {
  devtools: { enabled: true },
  devServer: {
    port: process.env.SERVER_PORT,
  },

  /*
   ** Global CSS
   */
  css: [
    '~/assets/styles/all.scss'
  ],

  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/eslint-module',
    '@pinia/nuxt',
    '@element-plus/nuxt',
  ],

  /*
   ** Build configuration
   */
  build: {
    optimizeCSS: true,
    extractCSS: true,
    splitChunks: {
      layouts: true,
      pages: true,
      commons: true
    },
  },

  runtimeConfig: {
    PrivateAPI: process.env.NUXT_PRIVARE_BASE_API,
    public: {
      BaseAPI: process.env.NUXT_PUBLIC_BASE_API,
      OAUTH2_URL: process.env.OAUTH2_URL,
      REDIECT_URL: process.env.REDIECT_URL,
      USER_CENTER: process.env.USER_CENTER,
      HOME_PAGE: process.env.HOME_PAGE,
      AVATAR_URL: process.env.AVATAR_URL,
      ENV: process.env.ENV || "development",
    }
  }
}
