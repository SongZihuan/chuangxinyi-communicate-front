import request from '~/requests/index'

export function useUserApi() {
  return {
    getCurrentUser: async () => {
      return request({
          url: '/api/user/current',
          method: "GET",
          query: {},
          data: undefined,
          useCache: true,
        }
      )
    },
    login: async (data: {loginToken: string}) => {
      return request({
          url: '/api/auth/login',
          method: "POST",
          query: {},
          data: data,
          useCache: false,
        }
      )
    },
    scoreRank: async () => {
      return request({
            url: '/api/user/score/rank',
            method: "GET",
            query: {},
            data: undefined,
            useCache: true,
          }
        )
    },
  };
}
