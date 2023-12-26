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
    scoreLog: async (page: number) => {
      return request({
          url: '/api/user/scorelogs',
          method: "GET",
          query: {
            page: page || 1,
          },
          data: undefined,
          useCache: true,
        }
      )
    },
    favorites: async (cursor: number) => {
      return request({
          url: '/api/user/favorites',
          method: "GET",
          query: {
            cursor: cursor,
          },
          data: undefined,
          useCache: true,
        }
      )
    },
    profile: async (id: number) => {
      return request({
          url: '/api/profile/' + id,
          method: "GET",
          query: {},
          data: undefined,
          useCache: true,
        }
      )
    },
    topics: async (id: number, page: number) => {
      return request({
          url: '/api/user/topics/' + id,
          method: "GET",
          query: {
            userId: id,
            page: page
          },
          data: undefined,
          useCache: true,
        }
      )
    },
    articles: async (id: number, page: number) => {
      return request({
          url: '/api/user/articles/' + id,
          method: "GET",
          query: {
            userId: id,
            page: page
          },
          data: undefined,
          useCache: true,
        }
      )
    },
    watched: async (id: number) => {
      return request({
          url: '/api/watch/watched',
          method: "GET",
          query: {
            userId: id,
          },
          data: undefined,
          useCache: true,
        }
      )
    },
    recentwatchers: async (id: number) => {
      return request({
          url: '/api/users/' + id + '/recentwatchers',
          method: "GET",
          query: {
            userId: id,
          },
          data: undefined,
          useCache: true,
        }
      )
    },
    topicesRecent: async (id: number) => {
      return request({
          url: '/api/topics/user/recent/' + id + '',
          method: "GET",
          query: {},
          data: undefined,
          useCache: true,
        }
      )
    },
    articleRecent: async (id: number) => {
      return request({
          url: '/api/articles/user/recent/' + id + '',
          method: "GET",
          query: {},
          data: undefined,
          useCache: true,
        }
      )
    },
    deleteWatched: async (id: number) => {
      return request({
          url: '/api/watch/delete',
          method: "GET",
          query: {
            userId: id,
          },
          data: {},
          useCache: false,
        }
      )
    },
    addWatched: async (id: number) => {
      return request({
          url: '/api/users/' + id + '/watch',
          method: "GET",
          query: {},
          data: {},
          useCache: false,
        }
      )
    },
  };
}
