import request from '~/requests/index'

export function useStatApi() {
  return {
    stat: async () => {
      return request({
          url: '/api/stat',
          method: "GET",
          query: {},
          data: undefined,
          useCache: true,
        }
      )
    },
  }
}
