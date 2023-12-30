import request from '~/requests/center'

export function useMsgApi() {
  return {
    getMessage: async (page: number, pageSize: number) => {
      return request({
          url: "/api/v1/user/center/allow-website/message/list",
          method: "GET",
          query: {
            page: page,
            pagesize: pageSize,
          },
          data: undefined,
          useCache: true,
        }
      )
    },
    readMessage: (id: number) => {
      return request({
        url: `/api/v1/user/center/allow-website/message/read/`,
        method: "post",
        query: {},
        data: {
          id: id
        },
        useCache: false,
      })
    },
    // 全部已读
    readAllMessage: () => {
      return request({
        url: `/api/v1/user/center/allow-website/message/read/all`,
        method: "post",
        query: {},
        data: {},
        useCache: false,
      })
    }
  }
}
