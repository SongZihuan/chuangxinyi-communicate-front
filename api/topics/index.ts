import request from '~/requests/index'

export function useTopicApi() {
  return {
    topics: async (page: number) => {
      return request({
          url: '/api/topics',
          method: "GET",
          query: {
            page: page || 1,
          },
          data: undefined,
          useCache: true,
        }
      )
    },
    topicsRecommend: async (page: number) => {
      return request({
          url: '/api/topics/recommend',
          method: "GET",
          query: {
            page: page || 1
          },
          data: undefined,
          useCache: true,
        }
      )
    },
    topicsLast: async (page: number) => {
      return request({
          url: '/api/topics/last',
          method: "GET",
          query: {
            page: page || 1
          },
          data: undefined,
          useCache: true,
        }
      )
    },
    topicsNoReply: async (page: number) => {
      return request({
          url: '/api/topics/noreply',
          method: "GET",
          query: {
            page: page || 1
          },
          data: undefined,
          useCache: true,
        }
      )
    },
    topicsTag: async (page: number, id: number) => {
      return request({
          url: '/api/topics/tag',
          method: "GET",
          query: {
            tagId: id,
            page: page || 1
          },
          data: undefined,
          useCache: true,
        }
      )
    },
    tag: async (id: number) => {
      return request({
          url: '/api/tag/' + id,
          method: "GET",
          query: {},
          data: undefined,
          useCache: true,
        }
      )
    },
    getTopic: async (id: number) => {
      return request({
          url: '/api/topic/' + id,
          method: "GET",
          query: {},
          data: undefined,
          useCache: true,
        }
      )
    },
    favorited: async (id: number) => {
      return request({
          url: '/api/favorites/favorited',
          method: "GET",
          query: {
            entityType: 'topic',
            entityId: id,
          },
          data: undefined,
          useCache: true,
        }
      )
    },
    comments: async (id: number) => {
      return request({
          url: '/api/comments/',
          method: "GET",
          query: {
            entityType: 'topic',
            entityId: id,
          },
          data: undefined,
          useCache: true,
        }
      )
    },
    recentlikes: async (id: number) => {
      return request({
          url: '/api/topic/' + id + '/recentlikes',
          method: "GET",
          query: {},
          data: undefined,
          useCache: true,
        }
      )
    },
    favoriteDelete: async (id: number) => {
      return request({
          url: '/api/favorite/delete',
          method: "DELETE",
          query: {
            entityType: 'topic',
            entityId: id,
          },
          data: undefined,
          useCache: false,
        }
      )
    },
    favoriteAdd: async (id: number) => {
      return request({
          url: '/api/topic/' + id + '/favorite',
          method: "POST",
          query: {},
          data: undefined,
          useCache: false,
        }
      )
    },
    deleteTopic: async (id: number) => {
      return request({
          url: '/api/topic/' + id + "/delete",
          method: "POST",
          query: {},
          data: undefined,
          useCache: false,
        }
      )
    },
    likeTopic: async (id: number) => {
      return request({
          url: '/api/topic/' + id + '/like',
          method: "POST",
          query: {},
          data: undefined,
          useCache: false,
        }
      )
    },
    tagAutoComplete: async (data: { input: string }) => {
      return request({
          url: '/api/tag/autocomplete',
          method: "POST",
          query: {},
          data: data,
          useCache: false,
        }
      )
    },
    nodes: async () => {
      return request({
          url: '/api/nodes',
          method: "GET",
          query: {},
          data: undefined,
          useCache: false,
        }
      )
    },
    getNode: async (id: number) => {
      return request({
          url: '/api/node/' + id,
          method: "GET",
          query: {},
          data: undefined,
          useCache: true,
        }
      )
    },
    newTopics: async (data: any) => {
      return request({
          url: '/api/topics',
          method: "POST",
          query: {},
          data: data,
          useCache: false,
        }
      )
    },
    getEdit: async (id: number) => {
      return request({
          url: '/api/topic/' + id + '/edit',
          method: "GET",
          query: {},
          data: undefined,
          useCache: true,
        }
      )
    },
    edit: async (id: number, data: any) => {
      return request({
          url: '/api/topic/' + id,
          method: "PUT",
          query: {},
          data: data,
          useCache: false,
        }
      )
    },
    topicsNode: async (page: number, id: number) => {
      return request({
          url: '/api/topics/node',
          method: "GET",
          query: {
            nodeId: id,
            page: page || 1
          },
          data: undefined,
          useCache: true,
        }
      )
    },
  }
}
