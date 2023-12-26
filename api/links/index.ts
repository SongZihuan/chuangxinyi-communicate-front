import request from '~/requests/index'

export function useLinksApi() {
  return {
    topLinks: async () => {
      return request({
          url: '/api/links/top',
          method: "GET",
          query: {},
          data: undefined,
          useCache: true,
        }
      )
    },
    links: async (query: {page: number}) => {
      return request({
          url: '/api/links',
          method: "GET",
          query: query,
          data: undefined,
          useCache: true,
        }
      )
    },
    create: async (data: any) => {
      return request({
          url: '/api/link/create',
          method: "POST",
          query: {},
          data: data,
          useCache: false,
        }
      )
    },
  }
}
