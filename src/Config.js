const config = {
  API_URL: "",

  AUTH: {
    KAKAO: "/api/auth/kakao",
    REISSUE: "/api/auth/reissue",
    LOGOUT: "/api/auth/logout",
    WITHDRAW: "/api/auth/withdraw",
  },

  FOLLOW: {
  FOLLOWINGS: "/api/follow/followings",
  DELETE: "/api/follow",
  SEARCH: "/api/follow/search",
  CREATE: "/api/follow",
  LIST: "/api/follow",
  PROFILE: (id) => `/api/follow/${encodeURIComponent(id)}`,
  TODOS: (id) => `/api/follow/${encodeURIComponent(id)}/todos`,
  CALENDAR: (id) => `/api/follow/${encodeURIComponent(id)}/calendar`,
  },

  PROFILE: {
    DELETE: "/api/profile",
    PUT: "/api/profile",
    GET: "/api/profile",
    INTRO: "/api/profile/intro",
  },  
    YOUTUBE: {
    SEARCH: "/api/youtube/search",
    SAVE: "/api/youtube/save",
    ME: "/api/youtube/me",
    DELETE: (songId) => `/api/youtube/save/${songId}`,
  },

  TODOS: {
    LIST: "/api/todos",
    CALENDAR: "/api/todos/calendar",
    TOGGLE_COMPLETE: (todoId, date) =>
      `/api/todos/${todoId}/dates/${date}/complete`,
  },

  CATEGORIES: {
    GET: "/api/categories",
  },
};

export default config;