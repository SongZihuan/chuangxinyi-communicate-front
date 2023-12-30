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
  }
}
