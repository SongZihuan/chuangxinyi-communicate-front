import request from '~/requests/index'

export function useConfigApi() {
  return {
    getConfig: async () => {
      return request({
          url: '/api/config/configs',
          method: "GET",
          query: {},
          data: undefined,
          useCache: true,
        }
      )
    },
  }
}
