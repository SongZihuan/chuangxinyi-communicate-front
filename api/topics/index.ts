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
  }
}
