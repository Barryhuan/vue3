import fetch from './fetch'
export const LOGIN_IN = (mobile, password) => fetch('user/login', { data: {
  mobile,
  password
}})

// ~ 用户登录
export const LOGIN_OUT = token => fetch('user/logout', { data: {
  token
} })

// ~ 用户基本信息
export const GET_USER_INFO = token => fetch('point/get-user-info', { data: {
  token
}})

// ~ 评点位列表
export const GET_POINT_LIST = (token, cityId) => fetch('point/get-point-list', { data: {
  token,
  city_id: cityId
}})

// ~ 新建报告
export const CREATE_POINT_PROJECT = params => fetch('point/set', { data: {
  ...params
}})

// ~ 获取城市列表
export const GET_CITY_LIST = token => fetch('point/get-city-list', { data: {
  token
}})

// ~ 获取区域概况数据
export const GET_OVERVIEW = (token, pointId) => fetch('report/regional-overview', { data: {
  token,
  comment_position_id: pointId
}})

// ~ 获取人群画像
export const GET_CROWD = (token, pointId, type) => fetch('report/crowd', { data: {
  token,
  comment_position_id: pointId,
  type
}})

// ~ 获取区域客流小时和时段数据
export const GET_HEAT_MAP = (token, pointId) => fetch('report/heat-map', { data: {
  token,
  comment_position_id: pointId,
}})

// ~ 获取区域客流热点地区24小时数据
export const GET_HEAT_MAP_DATA = (token, pointId) => fetch('report/heat-map-data', { data: {
  token,
  comment_position_id: pointId,
}})

// ~ 获取职住分布
export const GET_DISTRIBUTION = (token, pointId, type) => fetch('report/distribution', { data: {
  token,
  comment_position_id: pointId,
  type
}})

// ~ 获取职住分布
export const GET_DISTRIBUTION_HEAT = (token, pointId, type) => fetch('report/heat-map-point', { data: {
  token,
  comment_position_id: pointId,
  type
}})
