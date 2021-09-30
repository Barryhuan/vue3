// ~ 固定颜色
export const CHART_COLORS = {
  data() {
    return {
      colors: ['#3d6eff', '#ffcd61', '#70cb7c', '#4bb3ff', '#afebb6']
    }
  }
}

export const INFO_WINDOW_ZINDEX = 200 // ~ 信息窗口
export const SHAPE_ZINDEX = 112 // ~ aoi图形
export const HEATMAP_ZINDEX = 120 // ~ 热力图层
export const MAP_LABEL_ZINDEX = 113 // ~ 地图POI
export const CUSTOMER_POI_ZINDEX = 114 // ~ 自定义POI
export const CUSTOMER_DRAW_ZINDEX = 122 // ~ 自定义绘制图形

// ~ 信息窗口基础配置
export const INFO_WINDOW_STYLE = {
  zIndex: INFO_WINDOW_ZINDEX,
  isCustom: true,
  autoMove: false,
  offset: {
    x: 0,
    y: -38
  },
  showShadow: false
}

// ~ 多边形范围样式
// ~ 用于展示居住/工作片区
export const POLYGON_STYLE = {
  zIndex: SHAPE_ZINDEX,
  strokeColor: "#3d6eff",
  strokeOpacity: 1,
  strokeWeight: 2,
  fillColor: "#3d6eff",
  fillOpacity: 0.64
}

// ~ 高亮aoi颜色
export const HIGHLIGHT_POLYGON_STYLE = {
  fillColor: "rgb(255, 109, 154)",
  strokeColor: "rgb(255, 109, 154)"
}

// ~ 传统热力图样式
export const NORMAL_HEATMAP_STYLE = {
  radius: 20,
  opacity: [0, 0.75],
  gradient: {
    0.25: '#2D92FF',
    0.5: '#87ED5F',
    0.75: '#F7E725',
    1.0: '#F21D1D'
  },
}

// ~ 地图zoom与热力图半径对应关系
export const ZOOM_MATCH = {
  20: 3000,
  19: 2900,
  18: 2800,
  17: 1500,
  16: 760,
  15: 400,
  14: 215,
  13: 120,
  12: 70,
  11: 43,
  10: 27,
  9: 25,
  8: 25,
  7: 25,
  6: 25,
  5: 25,
  4: 25,
  3: 25,
  2: 25
}

// ~ 地图apis加载对象
export const BASIC_MAP = {
  key: 'b2f22f999b0413bb0824a8955315caaf',
  version : '2.0',
  plugins: [
    'AMap.HeatMap',
    'AMap.MarkerCluster',
    'AMap.AutoComplete',
    'AMap.PlaceSearch',
    'AMap.Geocoder',
    'AMap.DistrictSearch'
  ]
}

// ~ 基础地图样式
export const BASIC_MAP_STYLE = {
  viewMode: "2D",
  isHotspot: true,
  mapStyle: 'amap://styles/ebf2552444d0ee5e90ba8203ecf8f305',
  resizeEnable: true,
  zoom: 11,
  animateEnable: true,
  WebGLParams: {
    preserveDrawingBuffer: true
  }
}

// ~ 大量聚合点标记样式
export const CLUSTER_MARKER_STYLE = {
  gridSize: 80,
  maxZoom: 17,
}

// ~ 自定义绘图多边形
export const CUSTOMER_POLYGON_OPTION = {
  strokeWeight: 2,
  fillColor: '#3d6eff',
  fillOpacity: 0.4,
  strokeColor: '#3d6eff',
  strokeOpacity: 1,
  cursor: 'pointer',
  zIndex: CUSTOMER_DRAW_ZINDEX
}

// ~ elementUI提示基础配置
export const BASE_CONFIG = {
  showClose: !0,
	center: !0
}

// ~ elementUI提示框警告配置
export const CONFIG_MESSAGE_WARNING = msg => ({ ...BASE_CONFIG,  message: msg, type: 'warning'})

// ~ elementUI提示框成功配置
export const CONFIG_MESSAGE_SUCCESS = msg => ({ ...BASE_CONFIG,  message: msg, type: 'success'})

// ~ VerifyPlug插件配件(jQ插件)
export const VERIFY_PLUG_CONFIG = {
  wrapWidth: '372',
	initText: '请按住滑块，拖动到最右边',
	sucessText: '验证通过'
}

// ~ 防止state数据因为刷新丢失数据
export const SAVE_CURRENT_STATE = store => {
  if (sessionStorage.getItem('store')) {
    store.replaceState(Object.assign({}, store.state, JSON.parse(sessionStorage.getItem('store'))))
    sessionStorage.removeItem('store')
  }
  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('store', JSON.stringify(store.state))
    if (store.state.pointId) {
      localStorage.setItem('pointId', store.state.pointId)
    }
  })
  // window.addEventListener('unload', () => {
  //   localStorage.setItem('isWindowClose', !0)
  // })
}