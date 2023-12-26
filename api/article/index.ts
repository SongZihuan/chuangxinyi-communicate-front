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
    getArticlesTag: async (id: number) => {
      return request({
          url: '/api/articles/tag'+id,
          method: "GET",
          query: {},
          data: undefined,
          useCache: true,
        }
      )
    },
  }
}
