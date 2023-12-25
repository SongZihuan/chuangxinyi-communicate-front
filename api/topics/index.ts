import request from '~/requests/index'

export function useTopicApi() {
  return {
    topics: async (query: object) => {
      return request({
          url: '/api/topics',
          method: "GET",
          query: query,
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
          url: '/api/topic/delete/' + id,
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
  }
}
