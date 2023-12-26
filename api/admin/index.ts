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
    getNodes: async (query: any) => {
      return request({
          url: '/api/admin/nodes',
          method: "GET",
          query: query,
          data: undefined,
          useCache: true,
        }
      )
    },
    addNode: async (data: any) => {
      return request({
          url: '/api/admin/nodes',
          method: "POST",
          query: {},
          data: data,
          useCache: false,
        }
      )
    },
    edit: async (id: number) => {
      return request({
          url: '/api/admin/nodes/' + id,
          method: "GET",
          query: {},
          data: undefined,
          useCache: true,
        }
      )
    },
    editNode: async (id: number, data: any) => {
      return request({
          url: '/api/admin/nodes/' + id,
          method: "PUT",
          query: {},
          data: data,
          useCache: false,
        }
      )
    },
  }
}
