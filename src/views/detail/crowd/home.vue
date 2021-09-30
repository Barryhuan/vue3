<style lang="less" scope>
.rows {
  .message-wrapper {
    .mg(b, 16px);
    .info-wrapper {
      .dp(f);
      .f-g(c);
      .h(240px);
      .pd(8px 4px 20px);
      .bd(1px solid #e0e0e0);
      .bg-c(#fff);
      .c(rgba(0,0,0,.65));
      .info-title {
        .dp(f);
        .a-i(c);
        .min-h(48px)!important;
        .h(48px)!important;
        .pd(0 16px);
        .ft-s(14px);
      }
      .info {
        .pd(0);
        .info-content {
          .flex-hv();
          .f-d(c);
          .h(100%);
          .pd(0 16px);
          .sex-wrapper {
            .dp(f);
            .w(100%);
            p {
              .flex-hv();
              .wh(50%, 22px);
              .mg(b, 24px);
              .c(rgba(0, 0, 0, .6));
              span {
                .ft-s(14px);
                .h(100%);
                .pd(0 4px);
              }
              & span:nth-of-type(3) {
                .wh(20px, 20px);
                .mg(0 6px);
                .bg-s(100% 100%);
              }
            }
            p.male span:nth-of-type(3){
              .bg-i('../../../assets/images/male_icon.svg');
            }
            p.female span:nth-of-type(3){
              .bg-i('../../../assets/images/female_icon.svg');
            }
            & p:nth-of-type(2) {
              .f-d(rs);
            }
          }
          .sex-proportion {
            .dp(f);
            .wh(100%, 6px);
            span {
              .h(100%);
            }
          }
          .info-message {
            .ps(rt);
            .dp(f);
            .j-c(c);
            .wh(100%, 100%);
            .pie {
              .wh(60%, 100%);
            }
            .double-pie {
              .wh(145px, 145px);
            }
            .right-legend {
              .flex-hv();
              .f-d(c);
              .min-w(85px);
              .c(rgba(0, 0, 0, .6));
              .ft-s(14px);
              .line-legend {
                .dp(f);
                .a-i(c);
                span {
                  .wh(6px, 6px);
                  .mg(r, 8px);
                  .bdr(50%);
                }
              }
            }
            .pie-values {
              .dp(f);
              .f-d(c);
              bottom: 9%;
              left: 50%;
              .tranf(translateX(-80%));
              .ps(ab);
              .ft-s(12px);
              user-select: none;
            }
            .legend {
              .dp(f);
              .f-d(c);
              .a-i(fe);
              .j-c(c);
              // .wh(40%, 100%);
              .h(100%);
              .ft-s(12px);
              .line {
                .dp(f);
                .j-c(c);
                .a-i(c);
                .min-w(150px);
                .pd(3px 0);
                .l-h(1.5);
                & > span:nth-of-type(1) {
                  .w(40%);
                  .pd(r, 8px);
                  .txt-a(r);
                  .min-w(55px);
                }
                & > span:nth-of-type(2) {
                  .w(35%);
                  .pd(l, 8px);
                  .txt-a(l);
                  .min-w(55px);
                }
                .track {
                  .dp(f);
                  .wh(16%, 6px);
                  .bg-c(rgba(0, 0, 0, .05));
                  span {
                    .h(100%);
                  }
                }
                &.active {
                  .bg-c(#f5f8fc);
                }
              }
            }
          }
          .bar {
            .wh(100%, 100%);
          }
        }
      }
    }
  }
  & .message-wrapper:nth-last-of-type(1) {
    .mg(b, 0);
  }
}
</style>
<template>
  <div class="rows" ref="pdfPage">
    <el-row :gutter="16" class="message-wrapper" v-if="data.length">
      <el-col :span="6" class="message-item" v-for="(item, index) of data" :key="index">
        <el-container class="info-wrapper">
          <el-header class="info-title">
            <div>{{item.title}}</div>
          </el-header>
          <el-main class="info">
            <div class="info-content" v-if="!index">
              <div class="sex-wrapper">
                <p class="male">
                  <span>{{item.data[0].value}}</span>
                  <span>{{item.data[0].name}}</span>
                  <span></span>
                </p>
                <p class="female">
                  <span>{{item.data[1].value}}</span>
                  <span>{{item.data[1].name}}</span>
                  <span></span>
                </p>
              </div>
              <div class="sex-proportion">
                <span class="male-bar" :style="{ width: item.data[0].value + '%', backgroundColor: ECHARTS_COLORS[0]}"></span>
                <span class="female-bar" :style="{ width: item.data[1].value + '%', backgroundColor: ECHARTS_COLORS[1]}"></span>
              </div>
            </div>
            <div class="info-content" v-if="index">
              <Pie
                :echarId = "item.echart_Id"
                :legendData = "item.data"
                :pieData = "item.data.map(el => ({ value: el.value}))"
                :isActive = "isActive"
                :isActiveIndex = "isActiveIndex"
                @pieMouseOver = "pieMouseOver"
                @pieMouseOut = "pieMouseOut"
                @resetShape = "resetShape"
              />
            </div>
          </el-main>
        </el-container>
      </el-col>
    </el-row>
    <el-row :gutter="16" class="message-wrapper" v-if="data.length">
      <el-col :span="8" v-for="(doubleItem, doubleIndex) of doublePie" :key="doubleIndex">
        <el-container class="info-wrapper">
          <el-header class="info-title">
            <div>{{doubleItem.title}}</div>
          </el-header>
          <el-main class="info">
            <div class="info-content">
              <DoublePie
                :echarId = "doubleItem.echart_Id"
                :doublePieData = "doubleItem.data"
                @resetShape = "resetShape"
              />
            </div>
          </el-main>
        </el-container>
      </el-col>
    </el-row>
    <el-row class="message-wrapper" v-for="(barItem, barIndex) of barData" :key="barIndex">
      <el-col :span="24">
        <el-container class="info-wrapper">
          <el-header class="info-title">
            <div>{{barItem.title}}</div>
          </el-header>
          <el-main class="info">
            <div class="info-content">
              <Bar
                :echarId = "barItem.echart_Id"
                :barData = "barItem.data"
                @resetShape = "resetShape"
              />
            </div>
          </el-main>
        </el-container>
      </el-col>
    </el-row>
    <el-button @click="makePDF">生成PDF</el-button>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Pie from '@com/echarts/pie'
import Bar from '@com/echarts/bar'
import DoublePie from '@com/echarts/double_pie'
import { ECHARTS_COLORS } from '@common/utils/echarts'
import { GET_CROWD } from '@api'
import html2PDF from 'jspdf-html2canvas'
const pageList = ['home', 'company', 'flow']
export default {
  data() {
    return {
      data: [],
      doublePie: [],
      barData: [],
      barList: [],
      ECHARTS_COLORS,
      isActive: !1,
      isActiveIndex: 0,
      pageIndex: 1,
    }
  },
  inject: ['openLoading', 'closeLoading'],
  mounted() {
    this.initHome()
  },
  methods: {
    async initHome() {
      if (!this.pointList.length) return !1
      this.openLoading()
      let { data } = await GET_CROWD(this.$getItem('STATUS_HSH'), this.pointId, this.pageIndex)
      this.data = []
      this.doublePie = []
      this.barData = []
      let dataKeyName = Object.keys(data.data)[0]
      let {
        sex_ratio,
        distribution,
        status,
        statistics
      } = data.data[dataKeyName]
      this.data.push(sex_ratio, ...distribution)
      this.doublePie.push(...status)
      this.barData.push(...statistics)
      this.closeLoading()
      window.scrollTo(0, 0)
      window.onresize = () => {
        this.barList.forEach(el => {
          el.resize()
        })
      }
    },
    pieMouseOver(params, id) {
      this.isActive = !0
      this.isActiveIndex = id + params.dataIndex
    },
    pieMouseOut() {
      this.isActive = !1
    },
    resetShape(echartItem) {
      this.barList.push(echartItem)
    },
    makePDF() {
      html2PDF(this.$refs.pdfPage, {
        jsPDF: {
          format: 'a4',
        },
        imageType: 'image/jpeg',
        output: '报告文件.pdf'
      })
    }
  },
  computed: {
    ...mapGetters(['pointId', 'pointList']),
  },
  watch: {
     $route: {
      handler(newVal) {
        this.pageIndex = pageList.findIndex(el => el === newVal.path.split('/').slice(-1)[0]) + 1
        return newVal
      },
      deep: !0,
      immediate: !0
    },
    pointId(newVal) {
      console.log('数据更新了')
      this.initHome()
      return newVal
    },
    pageIndex(newVal) {
      this.initHome()
      return newVal
    },
    pointList: newVal => newVal
  },
  components: {
    Pie,
    DoublePie,
    Bar
  }
}
</script>

