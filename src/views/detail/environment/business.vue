<style lang="less" scope>
.main-container {
  .wh(100%, 100%);
  .map-outer {
    left: 0;
    top: 0;
    .amap-markers img {
      .w(auto);
    }
  }
  .card {
    .dp(f);
    .f-d(c);
    .ps(ab);
    top: 16px;
    right: 16px;
    .w(240px);
    .pd(8px 4px 20px);
    .bd(1px solid #e0e0e0);
    .bg-c(#fff);
    box-shadow: 0 0 6px rgba(0, 0, 0, .28);
    .bdr(4px);
    .card-header {
      .dp(f);
      .a-i(c);
      .w(100%);
      .h(48px);
      .min-h(48px);
      .pd(0 16px);
      .ft-s(14px);
      .c(#666);
      .card-title {
        .dp(f);
        .a-i(c);
        word-break: keep-all;
        white-space: nowrap
      }
      .card-text-desc {
        .dp(f);
        .a-i(c);
        flex: 1;
        .mg(l, 8px);
        .ft-s(12px);
        .l-h(20px);
      }
    }
    .card-body {
      .w(100%);
      .pd(0 16px);
      .over(auto);
      .business-list {
        .mg(12px 0);
        user-select: none;
        &__item {
          .dp(f);
          .a-i(c);
          .mg(b, 8px);
          opacity: 0.25;
          cursor: pointer;
          &.active {
            opacity: 1;
          }
          &-icon {
            .wh(16px, 16px);
            .mg(r, 8px);
          }
          &-name {
            .w(72px);
            white-space: nowrap;
            .ft-s(12px);
            .over(h);
            text-overflow: ellipsis;
            .mg(r, 8px);
            .c(#9e9e9e);
          }
          &-value {
            .txt-a(r);
            .w(28px);
            .over(h);
            text-overflow: ellipsis;
            .ft-s(12px);
            .mg(r, 8px);
            .c(#9e9e9e);
          }
          &-bar-container {
            flex: 1;
            .mg(r, 8px);
          }
          &-bar {
            .h(8px);
            .bdr(2px);
            &.has-value {
              .min-w(2px);
            }
          }
        }
        .h-box {
          .dp(f);
          .a-i(c);
          .j-c(sb);
          .wh(100%, 100%);
          .is-checked {
            .el-switch__core {
              border-color: #3d6eff;
              .bg-c(#3d6eff);
            }
          }
          button {
            .c(#3d6eff);
          }
        }
      }
    }
  }
}
</style>
<template>
  <div class="main-container">
    <BusinessMap
      :clusterTypeData="clusterTypeData"
      :features="['bg', 'road', 'point', 'building']"
      :focusArea="pointFocusAreaInfo"
      :infoWindow="infoWindow"
      :poiData="businessPoiData"
      @clickPoi="handleSelectPoi"
      @zoom="zoomChange"
      autoFitViewWhenChanged
      fitViewLevel="marker"
      poiShow
    />
    <section class="card">
      <header class="card-header">
        <div class="card-title">行业配套</div>
        <div class="card-text-desc">(点击展示行业配套)</div>
      </header>
      <main class="card-body">
        <div class="business-list">
          <div
            class="business-list__item"
            :class="{ active:selectedBusinesss.includes(item.code)} "
            @click="handleBusinessClick(item.code)"
            v-for="item in businessList"
            :key="item.id"
          >
            <div
              class="business-list__item-icon"
              :class="['business-poi-icon-'+ item.id]"
              v-html="bussines_icon_legend[item.type] || bussines_icon_legend['00']"
            ></div>
            <div class="business-list__item-name" :title="item.name">{{item.name}}</div>
            <div class="business-list__item-value">{{ (item.value === undefined || !selectedBusinesss.includes(item.code)) ? '-': item.value.length }}</div>
            <div class="business-list__item-bar-container">
              <div
                :class="['chart-bg-'+item.id, (item.value&& item.value.length && selectedBusinesss.includes(item.code)) ? 'has-value': '']"
                :style="{width:barWidth(item)}"
                class="business-list__item-bar"
              ></div>
            </div>
            <i
              :class="['chart-color-'+item.id]"
              :style="{visibility:selectedBusinesss.includes(item.code) ? 'visible' : 'hidden'}"
              class="el-icon-view"
            ></i>
          </div>
          <div class="h-box f-c">
            <el-tooltip :content="showCluster ? '关闭聚合':'开启聚合'" effect="light" placement="top" visible-arrow="false">
              <el-switch :width="40" v-model="showCluster"></el-switch>
            </el-tooltip>
            <div class="f-1"></div>
            <el-button type="text">配置行业</el-button>
          </div>
        </div>
      </main>
    </section>
  </div>
</template>
<script>
import BusinessMap from '@com/map'
import userData from './userConfigData.json'
import businessData from './businessData.json'
import { debounce } from 'debounce'
import { mapState, mapGetters } from 'vuex'

import 汽车服务_图例 from '!raw-loader!@a/poi/汽车服务_图例.svg';
import 餐饮美食_图例 from '!raw-loader!@a/poi/餐饮美食_图例.svg';
import 购物服务_图例 from '!raw-loader!@a/poi/购物服务_图例.svg';
import 体育休闲_图例 from '!raw-loader!@a/poi/体育休闲_图例.svg';
import 医疗保健_图例 from '!raw-loader!@a/poi/医疗保健_图例.svg';
import 酒店住宿_图例 from '!raw-loader!@a/poi/酒店住宿_图例.svg';
import 商务住宅_图例 from '!raw-loader!@a/poi/商务住宅_图例.svg';
import 科教文化_图例 from '!raw-loader!@a/poi/科教文化_图例.svg';
import 交通设施_图例 from '!raw-loader!@a/poi/交通设施_图例.svg';
import 金融保险_图例 from '!raw-loader!@a/poi/金融保险_图例.svg';
import 通用行业_图例 from '!raw-loader!@a/poi/通用行业_图例.svg';
import 汽车服务_坐标 from '!raw-loader!@a/poi/汽车服务_坐标.svg';
import 餐饮美食_坐标 from '!raw-loader!@a/poi/餐饮美食_坐标.svg';
import 购物服务_坐标 from '!raw-loader!@a/poi/购物服务_坐标.svg';
import 体育休闲_坐标 from '!raw-loader!@a/poi/体育休闲_坐标.svg';
import 医疗保健_坐标 from '!raw-loader!@a/poi/医疗保健_坐标.svg';
import 酒店住宿_坐标 from '!raw-loader!@a/poi/酒店住宿_坐标.svg';
import 商务住宅_坐标 from '!raw-loader!@a/poi/商务住宅_坐标.svg';
import 科教文化_坐标 from '!raw-loader!@a/poi/科教文化_坐标.svg';
import 交通设施_坐标 from '!raw-loader!@a/poi/交通设施_坐标.svg';
import 金融保险_坐标 from '!raw-loader!@a/poi/金融保险_坐标.svg';
import 通用行业_坐标 from '!raw-loader!@a/poi/通用行业_坐标.svg';
const bussines_icon_legend = {
  '00': 通用行业_图例,
  '01': 汽车服务_图例,
  '05': 餐饮美食_图例,
  '06': 购物服务_图例,
  '08': 体育休闲_图例,
  '09': 医疗保健_图例,
  10: 酒店住宿_图例,
  12: 商务住宅_图例,
  14: 科教文化_图例,
  15: 交通设施_图例,
  16: 金融保险_图例,
}
const bussines_icon_point = {
  '00': 通用行业_坐标,
  '01': 汽车服务_坐标,
  '05': 餐饮美食_坐标,
  '06': 购物服务_坐标,
  '08': 体育休闲_坐标,
  '09': 医疗保健_坐标,
  10: 酒店住宿_坐标,
  12: 商务住宅_坐标,
  14: 科教文化_坐标,
  15: 交通设施_坐标,
  16: 金融保险_坐标,
}
const clusterTypeData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
  return {
    id: i,
    render({ count, marker }) {
      marker.setContent(`<div class="business-poi-cluster  chart-bg-${i}">${count}</div>`)
    },
    // ~ 聚合jsapi 2.0
    poiRender(obj) {
      const { data, marker } = obj
      // ~ 设置offset
      var offset = new AMap.Pixel(-11, -25);
      marker.setOffset(offset)
      // ~ 设置content
      if (data && data.length > 0 && data[0]) {
        const poi = data[0]
        if (poi.render) {
          marker.setContent(typeof poi.render === 'function' ? poi.render() : poi.name);
        } else {
          marker.setContent(poi.name)
        }
        marker.setzIndex(poi._sortInx || 1);
        if (poi.funcs && Object.keys(poi.funcs).length) {
          Object.keys(poi.funcs).forEach((key) => {
            marker.on(key, () => {
              poi.funcs[key]()
            })
          })
        }
      }
    }
  }
})

function parseBusiness([b1, b2]) {
  const business1 = businessData.find((b) => b.value === b1)
  let business2
  if (business1) {
    business2 = business1.children.find((b) => b.value === b2)
  }
  return [business1, business2]
}

function getRequestSourceType(businessCode) {
  let sourceType;
  businessData.some((b1) => {
    return b1.children.some((b2) => {
      if (b2.value === businessCode) {
        sourceType = b2.sourceType
        return !0
      }
    });
  });
  return sourceType
}
export default {
  data() {
    return {
      bussines_icon_legend,
      bussines_icon_point,
      showCluster: !0,
      businessPoiData: [],
      businessList: [],
      selectedBusinesss: [],
      businessRequests: new Map(),
      businessMap: new Map(),
      activePoiIndex: -1,
      currentZoom: undefined,
      debounceInit: debounce(this.init, 100),
    }
  },
  components: {
    BusinessMap
  },
  mounted() {
    this.debounceInit()
  },
  methods: {
    init() {
      this.businessMap = new Map(userData.map((b) => [b[1], b]))
      this.businessList = []
      this.businessPoiData = []
      this.selectedBusinesss = []
      this.businessRequests = new Map()
      this.activePoiIndex = -1
      this.currentZoom = undefined
      const businessstr = window.localStorage.getItem('point-detail-business')
      let businesss = []
      if (businessstr) {
        try {
          businesss = JSON.parse(businessstr)
        } catch (e) {
          console.log(e)
        }
      }
      this.selectedBusinesss = businesss
      this.businessChange(businesss)
    },
    businessChange(businesss) {
      // ~ 过滤掉之前选择展示的品牌，后来在配置中删除的
      businesss = businesss.filter(businessCode => this.businessMap.get(businessCode))
      businesss.forEach(businessCode =>
        this.businessRequests.set(businessCode, this.getBusinessData(businessCode)),
      )
      this.businessList = userData.map((b, index) => {
        const [b1, b2] = parseBusiness(b);
        const business = {
          id: index + 1,
          code: b2.value,
          name: b2.label,
          type: b1.value,
          value: undefined
        }
        const businessRequest = this.businessRequests.get(b[1])
        if (businessRequest) {
          businessRequest.then((v) => {
            business.value = v
            this.resetBusinessPoiData()
          })
        }

        return business
      })
      this.resetBusinessPoiData()
      window.localStorage.setItem('point-detail-business', JSON.stringify(businesss))
    },
    barWidth(item) {
      const { code, value } = item;
      if (value && value.length && this.selectedBusinesss.includes(code)) {
        const max = this.businessList
          .filter((b) => this.selectedBusinesss.includes(b.code))
          .reduce((max, item) => {
            if (item.value && item.value.length) {
              max = Math.max(max, item.value.length);
            }
            return max;
          }, 0);
        const percent = (value.length * 100) / max;
        return `${percent}%`;
      } else {
        return '0px';
      }
    },
    getBusinessData(businessCode) {
      // ~ 如果 businessCode 对应的品牌已经发送过请求，用之前的数据
      const businessRequest = this.businessRequests.get(businessCode);
      if (businessRequest) {
        return businessRequest;
      }
      // ~ 如果任务的信息还没有获取到(主要是围栏信息), 不处理
      else if (this.pointFocusAreaInfo && this.pointFocusAreaInfo.path) {
        const pathArr = this.pointFocusAreaInfo.path.map((i) => i.join(' '));
        // 要首尾接上
        if (pathArr[0] !== pathArr.slice(-1)[0]) {
          pathArr.push(pathArr[0]);
        }
        const wkt = pathArr.join(',');
        const sourceType = getRequestSourceType(businessCode);
        const params = { typecode: businessCode.replace(/\,/g, '|') };
        if (sourceType) {
          params.sourceType = sourceType;
        }
        return this.$get('poi', {
          params
        }).then(data => {
          if (data && data.area_data && data.area_data[0]) {
            return data.area_data[0].poi_data
          } else {
            return []
          }
        })
      } else {
        return null
      }
    },
    resetBusinessPoiData() {
      let pois = [];
      this.businessList.forEach((business, index) => {
        if (this.selectedBusinesss.includes(business.code)) {
          pois = pois.concat(
            (business.value || []).map((v) => {
              const temp = {
                clusterId: index + 1,
                lnglat: v.xy.split(';'),
                name: v.name,
                address: v.address,
                render: () =>
                  `<div class='business-poi-marker business-poi-marker-${business.id}'>${
                    bussines_icon_point[business.type] || bussines_icon_point['00']
                  }</div>`,
              };
              return temp
            })
          )
        }
      })
      if (
        this.pointFocusAreaInfo &&
        this.pointFocusAreaInfo.center &&
        this.pointFocusAreaInfo.center.length === 2
      ) {
        pois.push({ lnglat: this.pointFocusAreaInfo.center, noEvents: !0 })
      }
      this.businessPoiData = pois
    },
    handleBusinessClick(businessCode) {
      if (this.selectedBusinesss.includes(businessCode)) {
        this.selectedBusinesss.splice(this.selectedBusinesss.indexOf(businessCode), 1)
      } else {
        this.selectedBusinesss.push(businessCode)
      }
      this.businessChange(this.selectedBusinesss)
    },
    handleSelectPoi(index) {
      this.activePoiIndex = index
    },
    zoomChange(zoom) {
      if (this.currentZoom && this.currentZoom > zoom) {
        this.activePoiIndex = -1
      }
      this.currentZoom = zoom
    }
  },
  watch: {
    pointTaskInfo() {
      this.debounceInit()
    }
  },
  computed: {
    ...mapState(['reportCacheDays']),
    ...mapGetters(['pointFocusAreaInfo', 'pointTaskInfo']),
    infoWindow() {
      if (this.businessPoiData && this.businessPoiData[this.activePoiIndex]) {
        const { name, address, lnglat } = this.businessPoiData[this.activePoiIndex]
        const content = `<div class="info-window">
        <div class="info-title">${name}</div>
          ${
            ![undefined, null, '', '-1', '-'].includes(address)
              ? `<div class="info-content"><div>${address}</div></div>`
              : ''
          }
        </div>`
        return { lnglat, content }
      } else {
        return null
      }
    },
    clusterTypeData() {
      if (this.showCluster) {
        return clusterTypeData
      } else {
        return []
      }
    }
  }
}
</script>