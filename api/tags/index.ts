import request from '~/requests/index'

export function useTagsApi() {
  return {
    tags: async (query: {page: number}) => {
      return request({
          url: '/api/tags',
          method: "GET",
          query: query,
          data: undefined,
          useCache: true,
        }
      )
    },
  }
}
