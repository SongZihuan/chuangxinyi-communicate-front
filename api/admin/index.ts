import request from '~/requests/index'

export function useAdminApi() {
  return {
    getSystemInfo: async () => {
      return request({
          url: '/api/admin/dashboard/systeminfo',
          method: "GET",
          query: {},
          data: undefined,
          useCache: true,
        }
      )
    },
  }
}
