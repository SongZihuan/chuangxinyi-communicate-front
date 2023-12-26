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
    getEditNode: async (id: number) => {
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
    getTopics: async (query: any) => {
      return request({
          url: '/api/admin/topics',
          method: "GET",
          query: query,
          data: undefined,
          useCache: true,
        }
      )
    },
    getEditTopics: async (id: number) => {
      return request({
          url: '/api/admin/topics/' + id,
          method: "GET",
          query: {},
          data: undefined,
          useCache: true,
        }
      )
    },
    editTopic: async (id: number, data: any) => {
      return request({
          url: '/api/admin/topics/' + id,
          method: "PUT",
          query: {},
          data: data,
          useCache: false,
        }
      )
    },
    deleteTopic: async (id: number) => {
      return request({
          url: '/api/admin/topics/' + id,
          method: "DELETE",
          query: {},
          data: {},
          useCache: false,
        }
      )
    },
    undeleteTopic: async (id: number) => {
      return request({
          url: '/api/admin/topics/' + id + '/undelete',
          method: "POST",
          query: {},
          data: {},
          useCache: false,
        }
      )
    },
    recommendTopics: async (id: number) => {
      return request({
          url: '/api/admin/topics/' + id + '/recommend',
          method: "POST",
          query: {},
          data: {},
          useCache: false,
        }
      )
    },
    cancleRecommendTopics: async (id: number) => {
      return request({
          url: '/api/admin/topics/' + id + '/unrecommend',
          method: "POST",
          query: {},
          data: {},
          useCache: false,
        }
      )
    },
  }
}
