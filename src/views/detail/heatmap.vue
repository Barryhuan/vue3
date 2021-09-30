<style lang="less" scope>
  .overview-container {
    .j-c(sb);
    .h(100%);
    .map-wrapper {
      .ps(rt);
      .h(664px);
      .pd(0)!important;
      .bd(1px solid #e6e6e6);
      &::-webkit-scrollbar {
        .dp(n);
      }
      #map-container {
        .wh(100%, 100%);
      }
      .tiemlime {
        .ps(ab);
        left: 0;
        bottom: 0;
        .wh(100%, 50px);
        .pd(0 20px);
        .bg-c(rgba(255, 255, 255, .8));
      }
    }
    .overflow-data {
      .h(187px)!important;
      .pd(8px 4px 20px)!important;
      .mg(t, 16px);
      .bd(1px solid #e0e0e0);
      .show-data-title {
        .dp(f);
        .j-c(sb);
        .a-i(c);
        .wh(100%, 48px);
        .pd(0 16px);
        .ft-s(14px);
        .c(rgba(0,0,0,.65));
        .title-r {
          .dp(f);
          .j-c(sb);
          .a-i(c);
          .show-day {
            .dp(f);
            .mg(r, 20px);
            p {
              .flex-hv();
              .mg(l, 10px);
              span {
                .wh(6px, 6px);
                .bdr(50%);
                .mg(r, 5px);
              }
            }
          }
          .change-btn {
            button {
              .bg-c(#fff);
              .bd(1px solid #e0e0e0);
              .c(#606266);
              &:hover {
                .c(#3d6eff);
                border-color: #c5d4ff;
                .bg-c(#ecf1ff);
              }
              &.active {
                .bg-c(#3d6eff);
                border-color: #3d6eff;
                .c(#fff);
                &:hover {
                  .bg-c(#648bff);
                  border-color: #648bff;
                }
              }
            }
            & button:nth-of-type(1) {
              .bd(r, none);
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
            }
            & button:nth-of-type(2) {
              .bd(l, none);
              .mg(l, -4px);
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            }
          }
        }
      }
      .echart-line {
        .ps(rt);
        .min-h(109px);
        .pd(0 16px);
        & > div {
          .ps(ab);
          left: 0;
          top: 0;
          .wh(100%, 109px);
          .min-h(109px);
          .pd(0 16px);
        }
      }
    }
  }
</style>
<template>
  <el-container direction="vertical" class="overview-container">
    <el-main class="map-wrapper">
      <ReportMap
        :basicHeatmapData = "crowdHeatData"
        :basicHeatmapRadiusScale = "0.15"
        :basicHeatmapMax = "currentHourMaxProcessed"
        :poiData = "centerPoint"
        :poiShow = "true"
        :fitViewLevel = "fitViewLevel"
        basicHeatmapShow
        autoFitViewWhenChanged
      />
      <div class="tiemlime">
        <TimeLinePlayer @change="handleChangeHour"/>
      </div>
    </el-main>
    <el-footer class="show-data overflow-data">
      <div class="show-data-title">
        <div class="title-l">客流指数</div>
        <div class="title-r">
          <div class="show-day">
            <p><span :style="{ 'background-color': colors[0] }"></span>工作日</p>
            <p><span :style="{ 'background-color': colors[1] }"></span>周末</p>
            <p><span :style="{ 'background-color': colors[2] }"></span>平均</p>
          </div>
          <div class="change-btn">
            <el-button
              :class="{ active: changeBtn === 'hour' }"
              @click="changeBtn = 'hour'"
              type="primary"
              size="mini"
            >按小时</el-button>
            <el-button
              :class="{ active: changeBtn === 'timeInterval' }"
              @click="changeBtn = 'timeInterval'"
              type="primary"
              size="mini"
            >按时段</el-button>
          </div>
        </div>
      </div>
      <div class="echart-line">
        <div v-show="changeBtn === 'hour'" ref="hour"></div>
        <div v-show="changeBtn === 'timeInterval'" ref="timeInterval"></div>
      </div>
    </el-footer>
  </el-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { CHART_COLORS } from '@common/utils/const'
import { LINE_CONFIG } from '@common/utils/echarts'
import { GET_HEAT_MAP, GET_HEAT_MAP_POINT, GET_HEAT_MAP_DATA } from '@api'
import ReportMap from '@com/map'
import echarts from 'echarts'
const TimeLinePlayer = () => import('@com/form/timelineplayer')
export default {
  data() {
    return {
      chart: null,
      changeBtn: 'hour',
      isInit: !1,
      crowdHeatData: [],
      crowdHeatmapLoading: !1,
      crowdHeatmapData: {},
      crowdHeatmapHour: 0,
      charOption: {
        hour: {
          xAxis: new Array(24).fill().map((_, i) => i),
          series: []
        },
        timeInterval: {
          xAxis: ['凌晨', '早高峰', '白天', '晚高峰', '夜间'],
          series: []
        }
      },
    }
  },
  inject: ['openLoading', 'closeLoading'],
  mounted() {
    this.initHeaderMap()
  },
  mixins: [ CHART_COLORS ],
  methods: {
    async initHeaderMap() {
      this.openLoading()
      let { data: { data: { passenger_index: { hour, time_interval } } } } = await GET_HEAT_MAP(this.$getItem('STATUS_HSH'), this.pointId)
      let { data } = await GET_HEAT_MAP_DATA(this.$getItem('STATUS_HSH'), this.pointId)
      this.charOption.hour.series = hour
      this.charOption.timeInterval.series = time_interval
      this.resizeCharts(this.changeBtn)
      this.getCrowdHeatmapData(data)
      this.closeLoading()
    },
    handleChangeHour(hour) {
      console.log(this.crowdHeatmapHour)
      this.crowdHeatmapHour = hour
    },
    getCrowdHeatmapData(resData) {
      this.crowdHeatmapLoading = !0
      this.crowdHeatmapData = {}
      const res = resData
      if (res && res.data && res.data.length) {
        const heatmapData = {}
        let max = 0
        res.data.forEach(({ trend, x, y }) => {
          heatmapData[`${x},${y}`] = trend
          const currentMax = trend.reduce((lastMax, current) => Math.max(lastMax, current), 0)
          max = Math.max(currentMax, max)
        })
        this.crowdHeatmapMax = max
        this.crowdHeatmapData = heatmapData
        this.crowdHeatData = this.currentHourCrowdHeatmapData()
      }
    },
    currentHourCrowdHeatmapData() {
      if (!Object.keys(this.crowdHeatmapData).length) {
        return []
      }
      return Object.keys(this.crowdHeatmapData).map(center => ({
        value: this.crowdHeatmapData[center][this.crowdHeatmapHour],
        lnglat: center.split(',').map((str) => +str)
      }))
    },
    resizeCharts(el) {
      if (!this.isInit) {
        this.isInit = !0
        this.$nextTick(() => {
          this.chart = echarts.init(this.$refs[el])
          this.chart.setOption({...LINE_CONFIG(el, this.charOption)})
          this.chart.resize()
          window.onresize = () => {
            this.chart.resize()
          }
        })
      }
    }
  },
  computed: {
    ...mapGetters([
      'pointFocusAreaInfo',
      'pointId',
      'pointList'
    ]),
    currentHourMax() {
      return this.crowdHeatData.reduce(
        (lastMax, { value }) => Math.max(lastMax, value),
        0,
      )
    },
    // ~ 为了避免当前小时客流与当天最大客流差距过大，所以需要做一些处理
    currentHourMaxProcessed() {
      return this.currentHourMax + (this.crowdHeatmapMax - this.currentHourMax) * 0.15;
    },
    centerPoint() {
      if (
        this.pointFocusAreaInfo &&
        this.pointFocusAreaInfo.center &&
        this.pointFocusAreaInfo.center.length === 2
      ) {
        return [{ lnglat: this.pointFocusAreaInfo.center }]
      }
      return []
    },
    fitViewLevel() {
      return this.crowdHeatData && this.crowdHeatData.length ? 'basicHeatmap' : ''
    }
  },
  watch: {
    pointId(newVal) {
      this.initHeaderMap()
      return newVal
    },
    changeBtn(newVal) {
      this.isInit = !1
      this.resizeCharts(newVal)
    },
    crowdHeatmapHour() {
      this.crowdHeatData = Object.keys(this.crowdHeatmapData).map((center) => ({
        value: this.crowdHeatmapData[center][this.crowdHeatmapHour],
        lnglat: center.split(',').map((str) => +str)
      }))
    }
  },
  components: {
    TimeLinePlayer,
    ReportMap
  }
}
</script>
