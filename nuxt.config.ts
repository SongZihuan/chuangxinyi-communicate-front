import ElementPlus from 'unplugin-element-plus/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

export default {
  devtools: { enabled: true },
  devServer: {
    port: process.env.SERVER_PORT,
  },

  vite: {
    plugins: [
      ElementPlus({}),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'assets/svg')]
      })
    ],
  },
  /*
   ** Global CSS
   */
  css: [
    '~/assets/styles/all.scss',
    'element-plus/dist/index.css'
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
    transpile: ['element-plus/es'],
  },

  postcss: {
    plugins: {
      tailwindcss: {},
    },
  },

  runtimeConfig: {
    PrivateAPI: process.env.NUXT_PRIVARE_BASE_API,
    CenterPrivateAPI: process.env.CENTER_PRIVATE_BASE_API,
    public: {
      BaseAPI: process.env.NUXT_PUBLIC_BASE_API,
      CenterBaseAPI: process.env.CENTER_PUBLIC_BASE_API,
      OAUTH2_URL: process.env.OAUTH2_URL,
      REDIRECT_URL: process.env.REDIRECT_URL,
      USER_CENTER: process.env.USER_CENTER,
      HOME_PAGE: process.env.HOME_PAGE,
      AVATAR_URL: process.env.AVATAR_URL,
      FILE_URL: process.env.FILE_URL,
      CENTER_WS_URL: process.env.CENTER_WS_URL,
      LOGOUT_URL: process.env.LOGOUT_URL,
      LOGOUT_REFERRER: process.env.LOGOUT_REFERRER,
      LOGOUT_REDIRECT_URL: process.env.LOGOUT_REDIRECT_URL,
      ENV: process.env.ENV || "development",
    }
  }
}
