<style lang="less" scope>
  .overview-content {
    .j-c(sb);
    .h(100%);
    .map-wrapper {
      .ps(rt);
      .h(611px);
      .max-h(611px);
      .pd(0)!important;
      .bd(1px solid #e6e6e6);
      .map-type-switch {
        .ps(ab);
        top: 20px;
        right: 20px;
        .z(100);
        button {
          .wh(74.67px, 38px);
          .ft-s(12px);
          &.el-button--primary {
            .bg-c(#3d6eff);
          }
        }
      }
    }
    .main-box {
      .ps(rt);
      .w(100%);
      .h(240px)!important;
      .min-h(240px);
      .pd(13px 21px);
      .bd(1px solid #e6e6e6);
      .bg-c(#fff);
      .box-header {
        .l-h(17px);
        .ft-s(12px);
        .c(#666);
      }
      .box-content {
        .ps(rt);
        .flex-hv();
        .wh(100%, 157px);
        top: 24px;
        .top-20-col {
          .dp(f);
          .f-d(c);
          .j-c(sb);
          .a-i(c);
          .wh(100%, 100%);
          .bd(r, 1px solid #e6e6e6);
          &:last-child {
            .bd(r, 0);
          }
          .aoi-info-line {
            .dp(f);
            .j-c(sb);
            .a-i(c);
            .wh(100%, 20px);
            .pd(0 15px);
            .l-h(20px);
            .ft-s(12px);
            .c(rgba(0, 0, 0, .6));
            cursor: pointer;
            &.active {
              .c(#3d6eff);
            }
            .no {
              .min-w(18px);
            }
            .name {
              .w(100%);
              .mg(r, 23.7px);
            }
            .percent-track {
              .ps(rt);
              .min-w(70px);
              .h(7.5px);
              .percent {
                .h(100%);
                .bg-c(#3d6eff);
              }
            }
          }
        }
      }
    }
  }
</style>
<template>
  <el-container direction="vertical" class="overview-content">
    <el-main class="map-wrapper">
      <div class="map-type-switch">
        <el-button-group size="small">
          <el-button :type="mapTypeSwitch ? '' : 'primary'" @click="mapTypeSwitch = !1">AOI图</el-button>
          <el-button :type="mapTypeSwitch ? 'primary' : ''" @click="mapTypeSwitch = !0">热力图</el-button>
        </el-button-group>
      </div>
      <DistributionMap
        fitViewLevel = "marker"
        :activeAois = "activeAoiIndexs"
        :basicHeatmapRadiusScale = "0.15"
        :basicHeatmapData = "heatmapData"
        :basicHeatmapShow = "mapTypeSwitch"
        :polygonData = "mapAoiData"
        :polygonShow = "!mapTypeSwitch"
        :infoWindow = "infoWindow"
        @clickAoi = "handleClickAoi"
        @mouseoverAoi = "handleMouseoverAoi"
        @mouseoutAoi = "handleMouseoutAoi"
        @zoom = "zoomChange"
        autoFitViewWhenChanged
      />
    </el-main>
    <el-footer class="main-box">
      <div class="box-header">{{ pageIndex ? '居住人口的工作地 Top20': '工作人口的居住地 Top20' }}</div>
      <div class="box-content">
        <div :key="colIndex" class="top-20-col" v-for="colIndex in [0, 1, 2, 3]">
          <div
            :class="[selectedAoiSortedIndex, hoverAoiSortedIndex].indexOf(colIndex * 5 + $indexInCol) !== -1 ? 'active' : ''"
            @click="handleClickSortedAoi(colIndex * 5 + $indexInCol)"
            @mouseout="handleMouseoutSortedAoi(colIndex * 5 + $indexInCol)"
            @mouseover="handleMouseoverSortedAoi(colIndex * 5 + $indexInCol)"
            :key="$indexInCol"
            class="aoi-info-line"
            v-for="(item, $indexInCol) in listData.slice(colIndex * 5, (colIndex + 1) * 5)"
          >
            <span class="no">{{colIndex * 5 + $indexInCol + 1}}</span>
            <span class="name">{{item.name}}</span>
            <div class="percent-track">
              <div :style="{ width: item.count / maxCountInDistrict * 100 + '%' }" class="percent"></div>
            </div>
          </div>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { GET_DISTRIBUTION, GET_DISTRIBUTION_HEAT } from '@api'
import DistributionMap from '@com/map'
import * as util from '@common/utils'
const pageList = ['home', 'company']
// ~ 信息框
let infoWindow = null
export default {
  data() {
    return {
      hoverAoiSortedIndex: -1,
      hoverAoiIndex: -1,
      selectedAoiSortedIndex: -1,
      selectedAoiIndex: -1,
      maxCountInDistrict: 0,
      listData: [],
      aoiOriginData: [],
      heatmapData: [],
      polygonData: null,
      mapTypeSwitch: !1, // ~ AOI图和热力图切换状态
      mapObj: null, // ~ 地图对象
      heatmapRadiusScale: 0.15,
      currentZoom: undefined,
      pageIndex: null
    }
  },
  inject: ['openLoading', 'closeLoading'],
  beforeMount() {
    infoWindow = null
    this.activeAoiIndexs
  },
  async mounted() {
    this.initHome()
  },
  methods: {
    async initHome() {
      this.openLoading()
      let { data: { data } } = await GET_DISTRIBUTION(this.$getItem('STATUS_HSH'), this.pointId, this.pageIndex + 1)
      let keyName = Object.keys(data)[0]
      let { address, polygon } = data[keyName]
      let { data: { data: headData } } = await GET_DISTRIBUTION_HEAT(this.$getItem('STATUS_HSH'), this.pointId, this.pageIndex + 1)
      this.listData = address
      this.aoiOriginData = polygon
      this.heatmapData = headData
      this.maxCountInDistrict = this.listData.reduce((lastMax, { count }) => Math.max(count, lastMax), 0)
      this.closeLoading()
    },
    // ~ 地名鼠标点击激活信息框和选中状态
    handleClickSortedAoi(index) {
      this.selectedAoiSortedIndex = index
      const poiId = this.listData[index].poiid || ''
      this.selectedAoiIndex = this.aoiOriginData.findIndex(
        ({ area_poi_id }) => area_poi_id === poiId
      )
    },
    // ~ 地名鼠标悬浮激活选中状态
    handleMouseoverSortedAoi(index) {
      this.hoverAoiSortedIndex = index
      const poiId = this.listData[index].poiid || ''
      this.hoverAoiIndex = this.aoiOriginData.findIndex(({ area_poi_id }) => area_poi_id === poiId)
    },
    // ~ 地名鼠标离开取消选中状态
    handleMouseoutSortedAoi() {
      this.hoverAoiIndex = -1
      this.hoverAoiSortedIndex = -1
    },
    // ~ 多边形鼠标点击激活
    handleClickAoi(index) {
      this.selectedAoiIndex = index
      const poiId = this.aoiOriginData[index].area_poi_id || ''
      this.selectedAoiSortedIndex = this.listData.findIndex(({ poiid }) => poiid === poiId)
    },
    // ~ 多边形鼠标悬浮激活
    handleMouseoverAoi(index) {
      this.hoverAoiIndex = index
      const poiId = this.aoiOriginData[index].area_poi_id || ''
      this.hoverAoiSortedIndex = this.listData.findIndex(({ poiid }) => poiid === poiId)
    },
    // ~ 多边形鼠标离开取消激活
    handleMouseoutAoi() {
      this.hoverAoiIndex = -1
      this.hoverAoiSortedIndex = -1
    },
    zoomChange(zoom) {
      this.currentZoom = zoom
    },
  },
  computed: {
    ...mapGetters(['pointId']),
    mapAoiData() {
      return this.aoiOriginData
        .filter((item) => item.wkt)
        .map(({ wkt }) => ({ path: util.aoiPathStrFormat(wkt) }));
    },
    infoWindow() {
      if (!this.listData || !this.listData[this.selectedAoiSortedIndex]) {
        return null
      }
      const selectedAoi = this.listData[this.selectedAoiSortedIndex]
      const { name, address, x, y } = selectedAoi
      console.log(selectedAoi)
      const content = `<div  class="info-window no-offset">
        <div class="info-title">${name}</div>
          ${address !== '-' ? `<div class="info-content"><div>${address}</div></div>` : ''}
        </div>`
      return { lnglat: [x, y], content, offset: [0, 0] }
    },
    activeAoiIndexs() {
      return Array.from(new Set([this.selectedAoiIndex, this.hoverAoiIndex])).filter(
        (index) => index !== -1,
      )
    },
  },
  watch: {
    $route: {
      handler(newVal) {
        this.pageIndex = pageList.findIndex(el => el === newVal.path.split('/').slice(-1)[0])
        return newVal
      },
      deep: !0,
      immediate: !0
    },
    pointId(newVal) {
      this.initHome()
      return newVal
    },
    pageIndex(newVal) {
      this.initHome()
      return newVal
    }
  },
  components: {
    DistributionMap
  }
}
</script>
