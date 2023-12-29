import request from '~/requests/index'

export function useArticleApi() {
  return {
    articles: async () => {
      return request({
          url: '/api/articles',
          method: "GET",
          query: {},
          data: undefined,
          useCache: true,
        }
      )
    },
    tags: async () => {
      return request({
          url: '/api/tags',
          method: "GET",
          query: {},
          data: undefined,
          useCache: true,
        }
      )
    },
    getTag: async (id: number) => {
      return request({
          url: '/api/tag/'+id,
          method: "GET",
          query: {},
          data: undefined,
          useCache: true,
        }
      )
    },
    create: async (data: any) => {
      return request({
          url: '/api/articles',
          method: "POST",
          query: {},
          data: data,
          useCache: false,
        }
      )
    },
    getArticle: async (id: number) => {
      return request({
          url: '/api/article/' + id,
          method: "GET",
          query: {},
          data: undefined,
          useCache: true,
        }
      )
    },
    comments: async (id: number) => {
      return request({
          url: "/api/comments",
          method: "GET",
          query: {
            entityType: 'article',
            entityId: id,
          },
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
            entityType: 'article',
            entityId: id,
          },
          data: undefined,
          useCache: true,
        }
      )
    },
    newest: async (userId: number) => {
      return request({
          url: '/api/articles/user/newest/' + userId,
          method: "GET",
          query: {},
          data: undefined,
          useCache: true,
        }
      )
    },
    delete: async (id: number) => {
      return request({
          url: '/api/article/' + id + "/delete",
          method: "POST",
          query: {},
          data: {},
          useCache: false,
        }
      )
    },
    favoriteDelete: async (id: number) => {
      return request({
          url: '/api/favorite/delete',
          method: "DELETE",
          query: {
            entityType: 'article',
            entityId: id
          },
          data: {},
          useCache: false,
        }
      )
    },
    favoriteAdd: async (id: number) => {
      return request({
          url: '/api/article/' + id + '/favorite',
          method: "POST",
          query: {
            entityType: 'article',
            entityId: id
          },
          data: {},
          useCache: false,
        }
      )
    },
    getEdit: async (id: number) => {
      return request({
          url: '/api/article/' + id + '/edit',
          method: "GET",
          query: {},
          data: undefined,
          useCache: false,
        }
      )
    },
    edit: async (id: number, data: any) => {
      return request({
          url: '/api/article/' + id,
          method: "PUT",
          query: {},
          data: data,
          useCache: false,
        }
      )
    },
  }
}
