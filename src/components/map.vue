<style lang="less" scope>
  .map-outer,.map-container {
    .ps(ab);
    .wh(100%, 100%);
    .z(0);
  }
  .info-window {
    .ps(rt);
    .pd(13px 19px);
    .bg-c(#fff);
    box-shadow: 0 0 6px 0 rgb(0 0 0 / 28%);
    .bdr(4px);
    .info-title {
      .ft-s(14px);
      .l-h(20px);
      .c(rgba(0, 0, 0, .85));
    }
    .info-content {
      .pd(t, 10px);
      .ft-s(12px);
      .c(rgba(0, 0, 0, .6));
    }
    &.no-offset {
      .tranf(translateY(30px));
    }
    &::after {
      content: '';
      .ps(ab);
      left: 50%;
      bottom: -4.2px;
      .mg(l, -4.5px);
      .bd(t, 4.2px solid #fff);
      .bd(l, 4.5px solid transparent);
      .bd(r, 4.5px solid transparent);
    }
  }
.business-poi-cluster {
  .wh(36px, 36px);
  .bdr(50%);
  .txt-a(c);
  .ft-s(12px);
  .l-h(36px);
  .c(#fff);
  .bg-s(100% 100%);
}

.business-poi-icon-1 .svg-fill-color{
  fill:#73819e;
}
.business-poi-marker-1 .marker-icon {
  fill:#73819e;
}
.business-poi-icon-2 .svg-fill-color{
  fill:#547eff;
}
.business-poi-marker-2 .marker-icon {
  fill:#547eff;
}
.business-poi-icon-3 .svg-fill-color{
  fill:#b2df8a;
}
.business-poi-marker-3 .marker-icon {
  fill:#b2df8a;
}
.business-poi-icon-4 .svg-fill-color{
  fill:#33a02c;
}
.business-poi-marker-4 .marker-icon {
  fill:#33a02c;
}
.business-poi-icon-5 .svg-fill-color{
  fill:#fb9a99;
}
.business-poi-marker-5 .marker-icon {
  fill:#fb9a99;
}
.business-poi-icon-6 .svg-fill-color{
  fill:#e31a3c;
}
.business-poi-marker-6 .marker-icon {
  fill:#e31a3c;
}
.business-poi-icon-7 .svg-fill-color{
  fill:#fdbf6f;
}
.business-poi-marker-7 .marker-icon {
  fill:#fdbf6f;
}
.business-poi-icon-8 .svg-fill-color{
  fill:#ff7f00;
}
.business-poi-marker-8 .marker-icon {
  fill:#ff7f00;
}
.business-poi-icon-9 .svg-fill-color{
  fill:#cab2d6;
}
.business-poi-marker-9 .marker-icon {
  fill:#cab2d6;
}
.business-poi-icon-10 .svg-fill-color{
  fill:#6a3d9a;
}
.business-poi-marker-10 .marker-icon {
  fill:#6a3d9a;
}
.chart-bg-1 {
  .bg-c(#73819e);
}
.chart-color-1 {
  .c(#73819e);
}
.chart-bg-2 {
  .bg-c(#547eff);
}
.chart-color-2 {
  .c(#547eff);
}
.chart-bg-3 {
  .bg-c(#b2df8a);
}
.chart-color-3 {
  .c(#b2df8a);
}
.chart-bg-4 {
  .bg-c(#33a02c);
}
.chart-color-4 {
  .c(#33a02c);
}
.chart-bg-5 {
  .bg-c(#fb9a99);
}
.chart-color-5 {
  .c(#fb9a99);
}
.chart-bg-6 {
  .bg-c(#e31a3c);
}
.chart-color-6 {
  .c(#e31a3c);
}
.chart-bg-7 {
  .bg-c(#fdbf6f);
}
.chart-color-7 {
  .c(#fdbf6f);
}
.chart-bg-8 {
  .bg-c(#ff7f00);
}
.chart-color-8 {
  .c(#ff7f00);
}
.chart-bg-9 {
  .bg-c(#cab2d6);
}
.chart-color-9 {
  .c(#cab2d6);
}
.chart-bg-10 {
  .bg-c(#6a3d9a);
}
.chart-color-10 {
  .c(#6a3d9a);
}
</style>
<template>
  <div class="map-outer" ref="map-outer">
    <div class="map-container" ref="map-container"></div>
  </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import { debounce } from 'debounce'
import { sleep } from '@common/utils'
import {
  BASIC_MAP,
  BASIC_MAP_STYLE,
  INFO_WINDOW_STYLE,
  POLYGON_STYLE,
  HEATMAP_ZINDEX,
  NORMAL_HEATMAP_STYLE,
  HIGHLIGHT_POLYGON_STYLE,
  CLUSTER_MARKER_STYLE,
  ZOOM_MATCH,
  CUSTOMER_POLYGON_OPTION
} from '@common/utils/const'
let AMap = null // ~ 地图加载对象
let map = null // ~ 地图
let basicHeatmapLayer = null // ~ 基础热点图对象
let basicHeatmapOptions = Object.assign({}, NORMAL_HEATMAP_STYLE) // ~ 基础热点图配置对象
let infoWindow = null // ~ 信息框
let polygonMarkers = [] // ~ 多边形存储对象
let focusAreaMarker = null // ~ 范围对象
let pointMarkers = [] // ~ 聚合标注存储对象
let poiClusterMarkers = {}

// ~ 表示api家在状态的promise
let ApiLoadedResolve
let ApiLoadedPromise = new Promise((res, rej) => {
  ApiLoadedResolve = res
})
let checkApiLoaded = () => ApiLoadedPromise

// ~ 表示组件mounted的promise
let mountedResolve
let MountedPromise = new Promise((res, rej) => {
  mountedResolve = res
})
let checkAllMounted = () => MountedPromise
export default {
  beforeMount() {
    AMap = null
    map = null
    basicHeatmapLayer = null
    basicHeatmapOptions = Object.assign({}, NORMAL_HEATMAP_STYLE)
    infoWindow = null
    polygonMarkers = []
    focusAreaMarker = []
    pointMarkers = []
    poiClusterMarkers = {}
    // ~ 表示api家在状态的promise
    ApiLoadedResolve
    ApiLoadedPromise = new Promise((res, rej) => {
      ApiLoadedResolve = res
    })
    checkApiLoaded = () => { ApiLoadedPromise }

    // ~ 表示组件mounted的promise
    mountedResolve
    MountedPromise = new Promise((res, rej) => {
      mountedResolve = res
    })
    checkAllMounted = () => { MountedPromise }
  },
  async mounted() {
    this.clearMap() // ~ 切换项目列表时清除上一个地图对象
    await this.initMap() // ~ 初始化新的地图对象

    // ~ 城市、是否显示轮廓
    if (this.haveFocusArea) {
      await this.renderFocusArea()
    }

    // ~ 基本热力图
    this.clearBasicHeatmap()
    if (this.basicHeatmapData && this.basicHeatmapData.length && this.basicHeatmapShow) {
      await this.renderBasicHeatmap()
    }

    // ~ 多个多边形
    this.clearPolygonList() // ~ 清除上一个多边形对象
    if (this.polygonData && this.polygonData.length && this.polygonShow) {
      await this.renderPolygonList()
    }

    // ~ 绘制poi图
    this.clearPoiList()
    if (this.poiData && this.poiData.length && this.poiShow) {
      await this.renderPoiList()
    }

    // ~ 初始化信息框
    const { x, y } = INFO_WINDOW_STYLE.offset
    const infoWindowOffset = new AMap.Pixel(x, y)
    infoWindow = new AMap.InfoWindow(
      Object.assign({}, INFO_WINDOW_STYLE, {
        offset: infoWindowOffset
      })
    )
    this.renderKeywordSeach()
  },
  methods: {
    // ~ 初始化地图
    async initMap() {
      await checkApiLoaded()
      AMap =  await AMapLoader.load(BASIC_MAP)
      .catch(err => {
        console.log('地图错误异常：' + err)
      })
      const mapOptions = Object.assign({}, BASIC_MAP_STYLE)
      if (this.features && this.features.length) {
        mapOptions.features = this.features
      }
      map = new AMap.Map(this.$refs['map-container'], mapOptions)
      // ~ 修改热力图半径
      map.on('zoomchange', () => {
        this.editHeatmapRadiusDebounce()
        const zoom = map.getZoom()
        this.$emit('zoom', zoom)
      })
    },
    // ~ 清理map
    clearMap() {
      if (map) {
        map.destroy()
        map = null
      }
    },
    // ~ 显示信息框
    async showInfoWindow() {
      await checkApiLoaded()
      if (!map || !infoWindow) return !1
      if (typeof this.infoWindow.content === 'string') {
        const contentWithBox = `<div>
          ${this.infoWindow.content}
        </div>`
        infoWindow.setContent(contentWithBox)
      } else if (this.infoWindow.content instanceof HTMLElement) {
        const contentWithBox = document.createElement('div')
        contentWithBox.append(this.infoWindow.content)
        infoWindow.setContent(contentWithBox)
      }
      infoWindow.open(map, this.infoWindow.lnglat)
    },
    // ~ 隐藏信息框
    hideInfoWindow() {
      if (infoWindow) {
        infoWindow.close()
      }
    },
    // ~ 渲染多个多边形
    async renderPolygonList() {
      await checkApiLoaded()
      if (!map) return !1
      polygonMarkers = this.polygonData.map( ({ path }) =>
          new AMap.Polygon({
            map,
            path: path.map(([lng, lat]) => new AMap.LngLat(lng, lat)),
            ...POLYGON_STYLE,
          })
      )
      // ~ 注册事件
      if (this.$listeners['clickAoi'] &&
          this.$listeners['mouseoverAoi'] &&
          this.$listeners['mouseoutAoi']
      ) {
        polygonMarkers.forEach((marker, index) => {
        marker.on('click', () => {
          this.$emit('clickAoi', index)
        })
        marker.on('mouseover', () => {
          this.$emit('mouseoverAoi', index)
        })
        marker.on('mouseout', () => {
          this.$emit('mouseoutAoi', index)
        })
      })
      }
      this.setFitView()
    },
    // ~ 擦除多个多边形
    clearPolygonList() {
      if (map && !!polygonMarkers.length) {
        map.remove(polygonMarkers)
        polygonMarkers = []
      }
    },
    // ~ 显示多个多边形
    showPolygonList() {
      polygonMarkers.forEach((marker) => {
        marker.show()
      })
    },
    // ~ 隐藏多个多边形
    hidePolygonList() {
      polygonMarkers.forEach((marker) => {
        marker.hide()
      })
    },
    // ~ 激活地图多个多边形状态
    setPolygonListActive(newVal, oldVal) {
      // ~ 需要从活跃状态变为非活跃状态的点
      if (oldVal && oldVal.length) {
        let needCancelAois = []
        if (newVal && newVal.length) {
          needCancelAois = oldVal.filter(oldAoiIndex => !newVal.includes(oldAoiIndex))
        } else {
          needCancelAois = oldVal
        }
        needCancelAois.forEach((aoiIndex) => {
          if (this.polygonData && this.polygonData[aoiIndex] && polygonMarkers[aoiIndex]) {
            const marker = polygonMarkers[aoiIndex]
            marker.setOptions(POLYGON_STYLE)
          }
        })
      }
      // ~ 需要从非活跃变为活跃的点
      if (newVal && newVal.length) {
        let needSetActiveAois = []
        if (oldVal && oldVal.length) {
          needSetActiveAois = newVal.filter(newAoiIndex => !oldVal.includes(newAoiIndex))
        } else {
          needSetActiveAois = newVal
        }
        needSetActiveAois.forEach(aoiIndex => {
          if (this.polygonData && this.polygonData[aoiIndex] && polygonMarkers[aoiIndex]) {
            const marker = polygonMarkers[aoiIndex]
            // ~ todo marker设定
            marker.setOptions(HIGHLIGHT_POLYGON_STYLE)
          }
        })
      }
    },
    // ~ 渲染热力图
    async renderBasicHeatmap(options) {
      basicHeatmapLayer = new AMap.HeatMap(map)
      window.basicHeatmapLayer = basicHeatmapLayer
      basicHeatmapLayer.setDataSet({
        data: this.basicHeatmapData.map((item) => ({
          lng: item.lnglat[0],
          lat: item.lnglat[1],
          count: item.value,
        })),
        max: this.basicHeatmapMax
      })
      basicHeatmapLayer.setOptions({
        ...NORMAL_HEATMAP_STYLE,
        zIndex: HEATMAP_ZINDEX,
        radius: this.getHeatmapNewRadius(),
        ...(options || {}),
        visible: !0
      })
      if (!options) {
        this.setFitView(true);
      }
    },
    // ~ 给heatmap重新设定数据
    async resetBasicHeatmap() {
      await checkApiLoaded()
      if (basicHeatmapLayer) {
        basicHeatmapLayer.setDataSet({
          data: this.basicHeatmapData.map((item) => ({
            lng: item.lnglat[0],
            lat: item.lnglat[1],
            count: item.value,
          })),
          max: this.basicHeatmapMax
        })
      }
    },
    // ~ 清除基本热力图
    clearBasicHeatmap() {
      if (basicHeatmapLayer && map) {
        basicHeatmapLayer.destroy()
      }
      basicHeatmapLayer = null
      window.basicHeatmapLayer = null
    },
    // ~ 显示基本热力图
    showBasicHeatmap() {
      if (basicHeatmapLayer) {
        basicHeatmapLayer.show()
        this.setFitView()
      }
    },
    // ~ 隐藏基本热力图
    hideBasicHeatmap() {
      if (basicHeatmapLayer) {
        basicHeatmapLayer.hide()
      }
    },
    // ~ 修改基本热力图
    async resetBasicHeatmapStyle(styleOptions) {
      if (basicHeatmapLayer && this.basicHeatmapData && this.basicHeatmapData.length) {
        basicHeatmapOptions = Object.assign(
          {},
          NORMAL_HEATMAP_STYLE,
          { zIndex: HEATMAP_ZINDEX },
          styleOptions,
        )
        basicHeatmapLayer.setOptions(basicHeatmapOptions)
      }
    },
    // ~ 修改热力图半径
    async editHeatmapRadius() {
      if (basicHeatmapLayer && this.basicHeatmapShow) {
        const newRadius = this.getHeatmapNewRadius()
        this.resetBasicHeatmapStyle({
          radius: newRadius
        })
      }
    },
    // ~ 获取热力图新的半径
    getHeatmapNewRadius() {
      const zoom = map.getZoom() // ~ 获取当前地图缩放倍数
      const tmp = (zoom * 100) % 100 // ~ 获取zoom的小数部分
      const oldRadius = ZOOM_MATCH[parseInt(zoom)] * (this.basicHeatmapRadiusScale || 1) // ~ 通过zoom整数部分计算热力图半径
      const newRadius = (tmp * oldRadius) / 100 + oldRadius // ~ 新的热力图半径=zoom整数部分计算热力图半径 + 小数部分占的比例半径
      return newRadius
    },
    // ~ 地图范围
    async setFitView(forceTrigger) {
      if (!map) return !1
      if (this.autoFitViewWhenChanged || forceTrigger) {
        // ~ 根据不同的情况，分级别设置
        switch (this.fitViewLevel) {
          case 'basicHeatmap':
            if (basicHeatmapLayer && this.basicHeatmapShow) {
              const lnglatList = this.getHeatMapRectangleLnglat()
              if (lnglatList) {
                const [arr1, arr2] = lnglatList
                const bounds = new AMap.Bounds(
                  new AMap.LngLat(arr1[0], arr1[1]),
                  new AMap.LngLat(arr2[0], arr2[1]),
                );
                // 因此人为设定一个异步时间
                await sleep(500)
                this.editHeatmapRadius()
                this._fitBounds(bounds)
              }
            }
            break
          // ~ marker
          case 'marker':
            const allMarkers = [
              [focusAreaMarker],
              this.poiShow ? pointMarkers : [],
              this.polygonShow ? polygonMarkers : [],
            ]
              .reduce((merged, current) => merged.concat(current), [])
              .filter((item) => !!item)
            await sleep(400)
            let newArr = []
            allMarkers.forEach(item => {
              if (Object.keys(item).length) {
                newArr.push(item)
              }
            })
            if (newArr.length) {
              // ~ 有newArr，渲染newArr
              map.setFitView(newArr)
            }
            break
        }
      }
    },
    // ~ 获取热力图上下左右边界
    getHeatMapRectangleLnglat() {
      if (this.basicHeatmapData && this.basicHeatmapData.length > 0) {
        let minLng = 180,
          maxLng = -180,
          minLat = 90,
          maxLat = -90
        this.basicHeatmapData.forEach((poi) => {
          const { lnglat } = poi
          minLng = Math.min(minLng, lnglat[0])
          maxLng = Math.max(maxLng, lnglat[0])
          minLat = Math.min(minLat, lnglat[1])
          maxLat = Math.max(maxLat, lnglat[1])
        });
        return [
          [minLng, minLat],
          [maxLng, maxLat]
        ]
      }
      return undefined
    },
    // ~ 渲染poi图
    async renderPoiList() {
      if (!map) return !1
      // ~ 如果有聚合的需求，先渲染聚合marker
      const poisInCluster = {}
      const poisWithNoCluster = []
      if (this.clusterTypeData && this.clusterTypeData.length) {
        poiClusterMarkers = {}
        this.clusterTypeData.forEach((cluster) => {
          // ~ 调用apis的点聚合模块
          const clusterMarker = new AMap.MarkerCluster(
            map,
            [],
            Object.assign({}, CLUSTER_MARKER_STYLE, {
              renderClusterMarker: cluster.render || undefined,
              renderMarker: cluster.poiRender || undefined,
            })
          )
          poiClusterMarkers[cluster.id] = clusterMarker
          poisInCluster[cluster.id] = []
          // ~ 注册事件
          clusterMarker.on('click', () => {
            this.$emit('clickClusterPoi', cluster.id)
          })
          clusterMarker.on('mouseover', () => {
            this.$emit('mouseoverClusterPoi', cluster.id)
          })
          clusterMarker.on('mouseout', () => {
            this.$emit('mouseoutClusterPoi', cluster.id)
          })
        })
      }
      // ~ 初始化pointer
      pointMarkers = []
      // ~ 按照纬度排序
      const sortedPoiList = this.poiData.map((i, index) => ({
        ...i,
        _index: index
      }))
      const sortedZIndexList = []
      sortedPoiList.sort((a, b) =>
        b.lnglat[1] - a.lnglat[1] === 0 ? b.lnglat[0] - a.lnglat[0] : b.lnglat[1] - a.lnglat[1],
      )
      sortedPoiList.forEach((sortedItem, index) => {
        sortedZIndexList[sortedItem._index] = index
      })
      this.poiData.forEach((poi, index) => {
        const marker = new AMap.Marker(
          Object.assign(
            {
              // ~ offset: new AMap.Pixel(-11, -25), // 使用默认的偏移
              // ~ zIndex根据纬度确定，靠下的点浮在上方
              zIndex: sortedZIndexList[index],
              visible: this.poiShow,
              position: poi.lnglat,
              content: typeof poi.render === 'function' ? poi.render(poi, index) : poi.name,
            },
            this.poiOptions || {},
          ),
        )
        // ~注册事件
        if (!poi.noEvents) {
          marker.on('click', () => {
            this.$emit('clickPoi', index)
          })
          marker.on('mouseover', () => {
            this.$emit('mouseoverPoi', index)
          })
          marker.on('mouseout', () => {
            this.$emit('mouseoutPoi', index)
          })
        }
        // ~ 如果poiData里面有clusterId，需要根据聚合id分组
        if (poi.clusterId && poiClusterMarkers[poi.clusterId]) {
          poisInCluster[poi.clusterId].push({
            ...poi,
            _inx: index,
            _sortInx: sortedZIndexList[index],
            funcs: {
              click: () => {
                this.$emit('clickPoi', index)
              },
              mouseover: () => {
                this.$emit('mouseoverPoi', index)
              },
              mouseout: () => {
                this.$emit('mouseoutPoi', index)
              },
            }
          })
        } else {
          poisWithNoCluster.push(marker)
        }
        pointMarkers.push(marker)
      })
      this.setFitView()
      // ~ 渲染到地图上
      Object.keys(poiClusterMarkers).forEach((key) => {
        const clusterMarker = poiClusterMarkers[key]
        clusterMarker.setData(poisInCluster[key])
      })
      poisWithNoCluster.forEach((marker) => {
        marker.setMap(map)
      })
    },
    // ~ 清除poi
    clearPoiList() {
      if (map) {
        if (pointMarkers.length) {
          map.remove(pointMarkers)
          pointMarkers = []
        }
        if (Object.keys(poiClusterMarkers).length) {
          Object.keys(poiClusterMarkers).forEach((key) => {
            poiClusterMarkers[key].setMap(null)
          })
          poiClusterMarkers = {}
        }
      }
    },
    // ~ 设定poi
    setPoiListActive(newVal, oldVal) {
      // ~ 需要从活跃状态变为非活跃状态的点
      if (oldVal && oldVal.length) {
        let needCancelPois = []
        if (newVal && newVal.length) {
          needCancelPois = oldVal.filter((oldPoiIndex) => !newVal.includes(oldPoiIndex))
        } else {
          needCancelPois = oldVal
        }
        needCancelPois.forEach((poiIndex) => {
          if (this.poiData && this.poiData[poiIndex] && pointMarkers[poiIndex]) {
            const marker = pointMarkers[poiIndex]
            const poi = this.poiData[poiIndex]
            marker.setContent(
              typeof poi.render === 'function' ? poi.render(poi, poiIndex, !1) : poi.name,
            )
          }
        })
      }
      // ~ 需要从非活跃变为活跃的点
      if (newVal && newVal.length) {
        let needSetActivePois = []
        if (oldVal && oldVal.length) {
          needSetActivePois = newVal.filter((newPoiIndex) => !oldVal.includes(newPoiIndex))
        } else {
          needSetActivePois = newVal
        }
        needSetActivePois.forEach((poiIndex) => {
          if (this.poiData && this.poiData[poiIndex] && pointMarkers[poiIndex]) {
            const marker = pointMarkers[poiIndex]
            const poi = this.poiData[poiIndex]
            marker.setContent(
              typeof poi.render === 'function' ? poi.render(poi, poiIndex, !0) : poi.name
            )
          }
        })
      }
    },
    // ~ 展示poi
    showPoiList() {
      pointMarkers.forEach((marker) => {
        marker.show()
      })
      Object.keys(poiClusterMarkers).forEach((key) => {
        map.add(poiClusterMarkers[key])
      })
    },
    // ~ 隐藏poi
    hidePoiList() {
      pointMarkers.forEach((marker, index) => {
        marker.hide()
      })
      Object.keys(poiClusterMarkers).forEach((key) => {
        map.remove(poiClusterMarkers[key])
      })
    },
    // ~ 绘制多边形
    async renderFocusArea() {
      await checkApiLoaded()
      if (map && this.haveFocusArea) {
        if (this.focusArea.type === 'polygon') {
          focusAreaMarker = new AMap.Polygon(
            Object.assign({}, CUSTOMER_POLYGON_OPTION, {
              path: this.focusArea.path.map(([lng, lat]) => new AMap.LngLat(+lng, +lat)),
              map
            })
          )
          this.setFitView()
        }
      }
    },
    // ~ 清除多边形
    clearFocusArea() {
      if (focusAreaMarker && map) {
        map.remove(focusAreaMarker)
        focusAreaMarker = null
      }
    },
    // ~ 定位
    _fitBounds(bounds, offsetZoom = 0) {
      const [zoom, center] = map.getFitZoomAndCenterByBounds(bounds, [60, 60, 60, 60], 18);
      map.setZoomAndCenter(Math.max(zoom + offsetZoom, 12), center);
    },
    // ~ 地点关键词搜索
    renderKeywordSeach() {
      this.$emit('getMap', AMap, map)
    }
  },
  computed: {
    haveFocusArea() {
      // ~ focusArea信息是否符合形式
      return (
        this.focusArea &&
        this.focusArea.type &&
        !!this.focusArea.type.length &&
        ((this.focusArea.type === 'circle' &&
          !!this.focusArea.radius &&
          Array.isArray(this.focusArea.center) &&
          !!this.focusArea.center.length) ||
          (this.focusArea.type === 'polygon' &&
            Array.isArray(this.focusArea.path) &&
            !!this.focusArea.path.length))
      )
    }
  },
  watch: {
    // ~ 当切换底部选项时触发信息框更新
    async infoWindow(newVal) {
      console.log('窗口信息我调用了')
      console.log(newVal)
      await checkAllMounted()
      if (newVal && newVal.lnglat && newVal.content) {
        this.showInfoWindow()
      } else {
        this.hideInfoWindow()
      }
    },
    // ~ 监听底部选项数据变化
    async polygonData(newVal) {
      await checkAllMounted()
      this.clearPolygonList()
      if (newVal && newVal.length && this.polygonShow) {
        await this.renderPolygonList()
        this.setFitView()
      }
    },
    // ~ 监听是否切换到AOI图
    async polygonShow(newVal) {
      await checkAllMounted()
      if (newVal) {
        if (this.polygonData.length > polygonMarkers.length) {
          await this.renderPolygonList()
        } else {
          this.showPolygonList()
        }
        this.setFitView()
      } else {
        this.hidePolygonList()
      }
    },
    // ~ 监听是否切换到热力图
    async basicHeatmapShow(newVal) {
      await checkAllMounted()
      if (newVal) {
        if (basicHeatmapLayer) {
          this.showBasicHeatmap()
        } else if (this.basicHeatmapData && this.basicHeatmapData.length) {
          await this.renderBasicHeatmap()
        }
        this.setFitView(true)
      } else {
        this.hideBasicHeatmap()
      }
    },
    // ~ 监听热力数据变化
    async basicHeatmapData(newVal) {
      await checkAllMounted()
      setTimeout(async () => {
        if (newVal && newVal.length && this.basicHeatmapShow) {
        if (basicHeatmapLayer) {
          await this.resetBasicHeatmap()
          this.setFitView(true)
        } else {
          await this.renderBasicHeatmap()
        }
        } else {
          this.clearBasicHeatmap()
        }
      }, 500)
    },
    // ~ 监听地图多边形的激活状态
    async activeAois(newVal, oldVal) {
      await checkAllMounted()
      this.setPolygonListActive(newVal, oldVal)
    },
    // ~ 监听多边形数据变化
    async focusArea(newVal) {
      await checkAllMounted()
      this.clearFocusArea()
      if (this.haveFocusArea) {
        await this.renderFocusArea()
        this.setFitView()
      }
    },
    // ~ 监听poi数据变化
    async poiData(newVal, oldVal) {
      await checkAllMounted()
      await checkApiLoaded()
      this.clearPoiList()
      if (newVal && newVal.length && this.poiShow) {
        await this.renderPoiList()
        this.setFitView()
      }
    },
    // ~ 监听poi显示
    async poiShow(newVal) {
      await checkAllMounted()
      await checkApiLoaded()
      if (newVal) {
        if (this.poiData.length > pointMarkers.length) {
          await this.renderPoiList()
        } else {
          this.showPoiList()
        }
        this.setFitView()
      } else {
        this.hidePoiList()
      }
    },
    // ~ 监听poi激活状态
    async activePois(newVal, oldVal) {
      await checkAllMounted()
      this.setPoiListActive(newVal, oldVal)
    },
    // ~ 监听poi
    async clusterTypeData() {
      await checkAllMounted()
      await checkApiLoaded()
      this.clearPoiList()
      if (this.poiData && this.poiData.length && this.poiShow) {
        await this.renderPoiList()
        this.setFitView()
      }
    },
  },
  props: {
    infoWindow: Object, // ~ 信息框
    basicHeatmapRadiusScale: Number, // ~ 热地图热力半径
    basicHeatmapData: Array, // ~ 热力图数据
    polygonData: Array, // ~ 多边形数据
    activeAois: Array, // ~ 激活状态
    basicHeatmapShow: Boolean, // ~ 热力图显示
    polygonShow: Boolean, // ~ 多边形显示
    fitViewLevel: String,
    autoFitViewWhenChanged: Boolean, // ~ 自动调整热力半径范围
    focusArea: Object, // ~ 聚焦的圆形或多边形区域
    clusterTypeData: Array, // ~ 聚合点样式Data id：与poi点中的clusterId对应
    features: Array, // ~ 展示哪些元素，如果不传则是默认
    poiData: Array, // ~ 如果需要使用聚合，则设置clusterId，相同clusterId的点会用同一种聚合marker展示
    poiShow: Boolean, // ~ 聚合显示
    basicHeatmapMax: Number, // ~ 热力图最大值
    showOverviewInfoWindow: Boolean // ~ 显示来自父组件的信息框
  },
  data() {
    return {
      editHeatmapRadiusDebounce: debounce(this.editHeatmapRadius, 30),
    }
  }
}
</script>
