<style lang="less" scope>
.create-nav {
  .z(10);
}
.create-map {
  .ps(rt);
  .pd(t, 48px);
  .over(h);
  .create-project {
    .ps(ab);
    .wh(310px, auto);
    left: 20px;
    top: 68px;
    .bdr(4px);
    .pd(0 16px 16px);
    .ft-w(100);
    .ft-s(14px);
    .bg-c(hsla(0,0%,100%,.97));
    box-shadow: 0 0 6px 0 rgb(0 0 0 / 28%);
    .over(h);
    .project-title {
      .dp(f);
      .a-i(c);
      .pd(0 16px);
      .min-h(48px);
      word-break: keep-all;
      white-space: nowrap;
      .c(rgba(0,0,0,.65));
    }
    .el-main {
      .pd(0 16px);
      .project-container {
        .mg(b, 10px);
        .title {
          .dp(f);
          .a-i(c);
          .h(40px);
          .c(#3d6eff);
          .ft-w(400);
          p {
            .dp(f);
            .a-i(c);
            .ps(rt);
            .h(100%);
            &::before {
              content: '';
              .ps(ab);
              bottom: 0;
              left: 0;
              .wh(100%, 2px);
              .bg-c(#3d6eff);
            }
          }
        }
        .el-select {
          .mg(t, 15px);
          .w(100%);
        }
        .count-tips {
          .ft-s(12px);
          .c(rgba(0, 0, 0, .48));
          .mg(b, 15px);
        }
      }
      & .project-container:nth-of-type(1) {
        .el-autocomplete {
          .mg(t, 15px);
          .w(100%);
        }
      }
      .surplus-count {
        .h(40px);
        .l-h(40px);
        .pd(b, 10px);
        .c(rgba(0, 0, 0, .85));
        .ft-s(14px);
        .ft-w(100);
        span {
          .pd(0 5px);
          .ft-s(18px);
          .c(#3d6eff);
        }
      }
    }
    .el-footer {
      .dp(f);
      .j-c(sb);
      .pd(0 16px);
      .mg(t, 10px);
      .el-button--primary {
        .bg-c(#3d6eff);
        border-color: #3d6eff;
      }
      .el-button--primary:focus, .el-button--primary:hover {
        .bg-c(#66b1ff);
        border-color: #66b1ff;
      }
    }
  }
}
.el-icon-search {
  cursor: pointer;
}
.el-autocomplete-suggestion {
  li {
    .h(52px);
    .l-h(normal)!important;
    .pd(7px)!important;
    .name {
      .ellipsis()
    }
    .address {
      .ft-s(12px);
      .c(#b4b4b4);
    }

    .highlighted .addr {
      .c(#b4b4b4);
    }
  }
}
.amap-marker img {
  .w(auto);
}
</style>
<template>
  <div class="full-screen">
    <Nav class="create-nav"/>
    <div class="create-map full-screen">
      <CrateMap
        @getMap="getMap"
      />
      <el-container class="create-project">
        <el-header class="project-title" height="48px">新建任务</el-header>
        <el-main>
          <div class="project-main">
            <div class="project-container">
              <div class="title">
                <p>自定义区域</p>
              </div>
              <el-autocomplete
                size="small"
                popper-class="select-autocomplete"
                :hide-loading="searchLoading"
                :trigger-on-focus="!1"
                :fetch-suggestions="querySearch"
                v-model="contentDiy"
                placeholder="请输入内容"
                @select="selectItem"
              >
                <template slot-scope="{ item }" v-if="restaurants.length">
                  <div class="name">{{ item.value }}</div>
                  <span class="address">{{ item.address }}</span>
                </template>
              </el-autocomplete>
            </div>
            <div class="project-container">
              <div class="title">
                <p>项目</p>
              </div>
              <el-select
                v-model="projectVal"
                placeholder="请选择项目"
                size="small"
                class="change-select"
              >
                <el-option
                  v-for="item in user.proj_list"
                  :key="item.project_id"
                  :value="item.project_name">
                </el-option>
              </el-select>
            </div>
            <p class="surplus-count">您剩余<span>{{ user.comment_position_num }}</span>次评点位服务</p>
            <div class="project-container">
              <p class="count-tips">点击确认提交将扣除1次服务次数</p>
              <el-input placeholder="请输入任务名称" size="small" v-model="projectName"></el-input>
            </div>
          </div>
        </el-main>
        <el-footer height="30px">
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button type="primary" size="small" @click="submitProject">确认提交</el-button>
        </el-footer>
      </el-container>
    </div>
  </div>
</template>
<script>
import Nav from '@com/nav'
import CrateMap from '@com/map'
import { mapActions, mapGetters } from 'vuex'
import { CONFIG_MESSAGE_SUCCESS, CONFIG_MESSAGE_WARNING } from '@common/utils/const'
import { CREATE_POINT_PROJECT } from '@api'
export default {
  data() {
    return {
      projectVal: '',
      contentDiy: '',
      projectName: '',
      currentCity: '',
      address: '',
      geohash: [],
      restaurants: [],
      placeSearch: null,
      marker: null,
      searchLoading: !0,
      timeout: null,
      clickCount: !1,
      // polygonData: []
    }
  },
  mounted() {
    this.initCreate()
  },
  methods: {
    ...mapActions([
      'setPointId',
      'getPointList',
      'getUserInfo',
      'setCityId',
      'getCityList'
    ]),
    async initCreate() {
      await this.getUserInfo(this.$getItem('STATUS_HSH'))
    },
    querySearch(str, callback) {
      let municipal = ['北京市', '深圳市', '天津市', '重庆市', '上海市', '香港特别行政区','澳门特别行政区']
      if (str && str.length) {
        this.placeSearch.search(str, (status, data) => {
          this.restaurants = []
          if (status === 'complete' && data.info === 'OK' && data.poiList.pois.length) {
            data.poiList.pois.forEach(item => {
              this.restaurants.push({
                addressId: item.id,
                value: item.name,
                address: item.address,
                location: {
                  lng: item.location.lng,
                  lat: item.location.lat,
                },
                type: item.type
            })})
            this.restaurants.forEach(item => {
              this.geoCoder.getAddress(item.location, (status, result) => {
                if (status === 'complete' && result.info === 'OK') {
                  let { city, citycode, province, adcode, district, street, streetNumber, township } = result.regeocode.addressComponent
                  let isProvince = municipal.some(el => el === province)
                  item.address = result.regeocode.formattedAddress
                  item.city = !isProvince ? city : province
                  item.cityCode = citycode
                  item.adcode = adcode
                  item.province = province
                  item.district = district
                  item.street = street
                  item.streetNumber = streetNumber
                  item.township = township
                }
              })
            })
          } else {
            this.restaurants.push({
              value: '暂无数据',
              address: '暂无地址'
            })
          }
          callback(this.restaurants)
        })
      }
    },
    getMap(AMap, map) {
      this.AMap = AMap
      this.map = map
      let isCity = (this.cityId === '' && !this.cityList.length) ? {} : { city: this.cityList.find(el => el.id === this.cityId).name }
      this.placeSearch = new AMap.PlaceSearch(Object.assign(isCity, { pageSize: 50, citylimit: !0 }))
      this.geoCoder = new AMap.Geocoder(isCity)
      this.districtSearch = new AMap.DistrictSearch({
        level: 'city',
        extensions: 'all',
        subdistrict: 3
      })
    },
    selectItem(item) {
      this.geohash = Object.values(item.location)
      this.address = item.address
      this.map.clearMap()
      this.marker = new this.AMap.Marker({
        position: this.geohash,
        title: item.value
      })
      this.infoWindow = new this.AMap.InfoWindow({
        isCustom: true,
        position: this.geohash,
        offset: new this.AMap.Pixel(0, -40),
        content: `<div class="info-window"><div class="info-title">${ item.value }</div><div class="info-content"><div>${ item.address }</div></div></div>`
      })
      this.infoWindow.open(this.map)
      this.map.add(this.marker)
      this.map.setCenter(this.geohash)
      this.map.setFitView([this.marker], false, [60,60,60,60], 15)
      this.currentCity = item.city
    },
    async submitProject() {
      this.$message.closeAll()
      if (!this.contentDiy.trim()) {
        this.$message({...CONFIG_MESSAGE_WARNING('请输入自定义区域内容')})
        return !1
      }
      if (!this.projectVal.trim()) {
        this.$message({...CONFIG_MESSAGE_WARNING('请选择项目')})
        return !1
      }
      if (!this.projectName.trim()) {
        this.$message({...CONFIG_MESSAGE_WARNING('请输入任务名称')})
        return !1
      }
      if (!this.user.comment_position_num) {
        this.$message({...CONFIG_MESSAGE_WARNING('没有剩余任务次数')})
        return !1
      }
      if (!this.clickCount) {
        this.clickCount = !0
        let res = await CREATE_POINT_PROJECT({
          token: this.$getItem('STATUS_HSH'),
          city_name: this.currentCity,
          location_name: this.contentDiy.trim(),
          lon_lat: this.geohash.join(),
          name: this.projectName.trim(),
          project_id: this.user.proj_list.find(item => item.project_name === this.projectVal).project_id,
          address: this.address
        })
        if (res.code === -1) {
          this.$message({...CONFIG_MESSAGE_WARNING(res.msg)})
          return !1
        }
        if (res.code === 200) {
          this.$message({...CONFIG_MESSAGE_SUCCESS(`${'任务：' + this.projectName.trim() + ' 创建成功！'}`)})
          await this.getPointList({ token: this.$getItem('STATUS_HSH'), cityId: this.cityId})
          await this.getCityList(this.$getItem('STATUS_HSH'))
          this.setPointId(res.data.id)
          this.$setItem('pointId', res.data.id)
          let cityListEnd = this.cityList.slice(-1)[0].id
          if (!(this.cityId === cityListEnd)) {
            this.setCityId(cityListEnd)
            this.$setItem('cityId', cityListEnd)
            await this.getPointList({ token: this.$getItem('STATUS_HSH'), cityId: this.cityId})
          }
          this.$router.push({ path: '/home/overview', query: {id: res.data.id }})
        }
      }
    },
    cancel() {
      this.$message.closeAll()
      if (!this.pointList.length && this.cityList.length === 1) {
        this.$message({...CONFIG_MESSAGE_WARNING('您得先创建一个任务才能进行下一步的操作！')})
        return !1
      }
      this.$router.push({ path: '/home/overview', query: { id: this.pointId }})
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'pointId',
      'pointList',
      'cityId',
      'cityList'
    ])
  },
  watch: {
    contentDiy() {
      this.searchLoading = !1
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.searchLoading = !0
      }, 500)
    },
    cityId(newVal) {
      let currentCity = this.cityList.find(el => el.id === newVal).name
      if (!newVal) {
        this.placeSearch = new AMap.PlaceSearch({ pageSize: 10, citylimit: !0 })
      } else {
        this.placeSearch.setCity(currentCity)
        this.geoCoder.setCity(currentCity)
      }
      return newVal
    },
    cityList: newVal => newVal
  },
  components: {
    Nav,
    CrateMap
  }
}
</script>