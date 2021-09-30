export default {
  pointFocusAreaInfo(state, payload) {
    state.pointFocusAreaInfo = payload
  },
  pointTaskInfo(state, payload) {
    state.pointTaskInfo = payload
  },
  setPointCenter(state, center) {
    state.pointCenter = center
  },
  loginStatus(state) {
    state.loginStatus = !0
  },
  getUserInfo(state, { data }) {
    state.user = data
  },
  setPointId(state, id) {
    state.pointId = id
  },
  getPointList(state, { data }) {
    state.pointList = data
  },
  setCityId(state, id) {
    state.cityId = id
  },
  getCityList(state, { data }) {
    state.cityList = data
  },
  changeLoadingStatus(state, status) {
    state.loadingStatus = status
  }
}