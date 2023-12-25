import request from '~/requests/index'

export function useCommentApi() {
  return {
    comment: async (data: any) => {
      return request({
          url: '/api/comments',
          method: "POST",
          query: {},
          data: data,
          useCache: true,
        }
      )
    },
  }
}
