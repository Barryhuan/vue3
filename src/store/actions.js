import {
  GET_USER_INFO,
  GET_POINT_LIST,
  GET_CITY_LIST
} from '@api'
export default {
  // ~ 设置评点位区域信息
  setPointFocusAreaInfo: ({ commit }, areaInfo) => {
    commit('pointFocusAreaInfo', areaInfo)
  },

  setPointTaskInfo: ({ commit }, areaInfo) => {
    commit('pointTaskInfo', areaInfo)
  },

  // ~ 检测用户是否登录
  testingLoginStatus: ({ commit }) => {
    commit('loginStatus')
  },

  // ~ 设置当前城市的中心点
  setPointCenter: ({ commit }, center) => {
    commit('setPointCenter', center)
  },

  // ~ 用户基本信息
  getUserInfo: async ({ commit }, token) => GET_USER_INFO(token).then(({ data }) => { commit('getUserInfo', data) }),

  // ~ 获取评点位信息
  getPointList: async ({ commit }, { token, cityId = 0 }) => {
    return GET_POINT_LIST(token, cityId).then(({ data }) => { commit('getPointList', data) })
  },

  // ~ 获取城市列表
  getCityList: async ({ commit }, token) => GET_CITY_LIST(token).then(({ data }) => { commit('getCityList', data) }),

  // ~ 通知更新PointId
  setPointId({ commit }, id) {
    commit('setPointId', id)
  },

  // ~ 通知更新cityId
  setCityId({ commit }, id) {
    commit('setCityId', id)
  },

  // ~ 加载loading
  changeLoadingStatus({ commit }, status) {
    commit('changeLoadingStatus', status)
  }
}