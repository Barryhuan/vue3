<style lang="less" scope>
  .overview-container {
    .j-c(sb);
    .h(100%);
    .map-container {
      .ps(rt);
      .pd(0)!important;
      .bd(1px solid #e6e6e6);
      .amap-marker img {
        .w(auto);
      }
    }
    .show-data {
      .pd(0);
      .mg(t, 20px);
      .data-list {
        .h(100%);
        .data-item {
          .wh(100%, 100%);
          .data-content {
            .wh(100%, 100%);
            .pd(8px 4px 20px);
            .ft-s(14px);
            .bg-c(#fff);
            .bd(1px solid #e0e0e0);
            .c(rgba(0, 0, 0, .65));
            .data-title {
              display: inline-flex;
              .j-c(sb);
              .a-i(c);
              .h(48px);
              .max-h(48px);
              .pd(0 16px);
              .mode-select {
                .w(75%);
                .mg(l, 20px);
              }
            }
            .el-main {
              .pd(0);
              .data-count {
                .flex-hv();
                .f-d(c);
                .wh(100%, 100%);
                .data-line {
                  .dp(f);
                  .j-c(c);
                  .a-i(fe);
                  .pd(t, 14px);
                  .prev-desc {
                    max-width: 36px;
                    .l-h(14px);
                    .c(rgba(0, 0, 0, .28));
                    .ft-s(12px);
                    word-break: keep-all;
                    white-space: nowrap;
                  }
                  .data {
                    .ft-s(28px);
                    .l-h(28px);
                    .c(rgba(0, 0, 0, .6));
                    .pd(0 6px 0 12px);
                  }
                  .after-desc {
                    .ft-s(12px);
                    .c(rgba(0, 0, 0, .28));
                    .l-h(14px);
                    word-break: keep-all;
                    white-space: nowrap;
                  }
                }
                & .data-line:nth-of-type(1) {
                  .pd(t, 0);
                }
              }
            }
          }
        }
      }
    }
  }
</style>
<template>
  <el-container direction="vertical" class="overview-container">
    <!-- 地图 -->
    <div class="map-container">
      <OverMap
        :poiData = "centerPoint"
        :poiShow = "!0"
        fitViewLevel = "marker"
        @getMap = "getMap"
        showOverviewInfoWindow
        autoFitViewWhenChanged
      />
    </div>
    <!-- 客流信息 -->
    <el-footer class="show-data" height="160px" v-loading="viewload">
      <el-row type="flex" justify="space-every" :gutter="12" class="data-list">
        <el-col :span="4" class="data-item" v-for="(item, index) of overData" :key="index">
          <el-container direction="vertical" class="data-content">
            <el-header class="data-title" v-if="!index">
              <span>{{item.title}}</span>
              <el-select v-model="value" placeholder="请选择" size="small" class="mode-select">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-header>
            <el-header class="data-title" v-if="index">
              <span>{{item.title}}</span>
            </el-header>
            <el-main>
              <div class="data-count">
                <div class="data-line" v-for="(lineItem, lineIndex) of item.data" :key="lineIndex">
                  <span class="prev-desc">{{lineItem.prev}}</span>
                  <span class="data">{{lineItem.middle}}</span>
                  <span class="after-desc">{{lineItem.after}}</span>
                </div>
              </div>
            </el-main>
          </el-container>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { GET_OVERVIEW } from '@/api'
import overData from './overData.json'
import OverMap from '@com/map'
export default {
  data() {
    return {
      overData,
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '黄金糕'
        },
        {
          value: '选项3',
          label: '黄金糕'
        }
        ],
      value: '',
      AMap: null,
      map: null,
      viewload: !1
    }
  },
  mounted() {
    this.initOverView()
  },
  methods: {
    async initOverView() {
      console.log(this.pointList)
      if (!this.pointList.length) return !1
      this.viewload = !0
      let { data: { data } } = await GET_OVERVIEW(this.$getItem('STATUS_HSH'), this.pointId)
      console.log(data)
      console.log(this.overData)
      this.viewload = !1
      let dataKey = Object.keys(data)
      console.log(dataKey)
      this.overData.forEach(el => {
        let result = dataKey.find(item => item === el.type)
        if (result === 'model' || result === 'area') {
          el.data[0].middle = data[result]
        }
        if (result === 'live_index' || result === 'work_index') {
          el.data[0].middle = data[result].count
          el.data[1].middle = data[result].density
        }
        if (result === 'live_work_ratio') {
          el.data[0].middle = `${data[result].live} / ${data[result].work}`
        }
        if (result === 'passenger_index') {
          el.data[0].middle = data[result].holiday
          el.data[1].middle = data[result].weekdays
        }
      })
    },
    getMap(AMap, map) {
      this.AMap = AMap
      this.map = map
      this.resetInfoWindow()
    },
    resetInfoWindow() {
      if (!this.pointList.length) return null
      let { location_name, address, lon_lat } = this.pointList.find(el => el.id === this.pointId)
      this.infoWindow = new this.AMap.InfoWindow({
        isCustom: true,
        position: lon_lat.split(','),
        offset: new this.AMap.Pixel(0, -40),
        content: `<div class="info-window"><div class="info-title">${ location_name }</div><div class="info-content"><div>${ address }</div></div></div>`
      })
      this.infoWindow.open(this.map)
    }
  },
  computed: {
    ...mapGetters(['pointCenter', 'pointId', 'pointList']),
    centerPoint() {
      if (
        this.pointCenter &&
        this.pointCenter.length === 2
      ) {
        return [{ lnglat: this.pointCenter }]
      }
      return []
    },
  },
  watch: {
    pointId(newVal) {
      return newVal
    },
    pointCenter(newVal) {
      this.resetInfoWindow()
      this.initOverView()
      return newVal
    },
    loadingStatus: newVal => newVal
  },
  components: {
    OverMap
  }
}
</script>