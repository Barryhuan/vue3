<style lang="less" scope>
.home {
  &::-webkit-scrollbar {
    .dp(none);
  }
  .pd(t, 48px);
  .home-container {
    .h(100%);
    .home-aside {
      .ps(rt);
      .h(100%);
      .pd(8px 0 0);
      .wrapper {
        .pd(8px 20px 0);
      }
      .create-case {
        .w(100%);
        .c(#fff);
        .bg-c(#3d6eff);
      }
      .wrapper-select {
        .el-input {
          .h(32px);
          .el-input__inner {
            .ft-s(12px);
            .h(32px);
          }
          .el-icon-arrow-up {
            .dp(n);
          }
        }
      }
      .el-menu-vertical {
        .mg(t, 15px);
        .bd(r, none);
        .el-menu-item-group__title {
          .pd(0);
        }
        ul {
          .bg-c(#fafbfc);
          .el-menu-item {
            .min-w(180px);
          }
        }
      }
      &::before {
        content: '';
        .ps(ab);
        top: 0;
        right: 0;
        .z(10);
        .wh(1px, 100%);
        .bg-c(#e6e6e6);
      }
    }
    & > .el-main {
      .pd(16px);
      .bg-c(#fafbfc);
    }
    & > .load-mask {
      .ps(ab);
      left: 180px;
      .wh(calc(100% - 180px), 100%);
      .el-loading-mask {
        .bg-c(rgba(255, 255, 255, .7));
      }
    }
    &.show {
      .ps(rt);
    }
  }
}
.select-dropdown {
  .max-w(140px);
  .el-select-dropdown__item span {
    .dp(ib);
    .w(100%);
    .ellipsis();
  }
}
</style>
<template>
  <div class="home full-screen" v-loading="homeLoading">
    <Nav></Nav>
    <el-container class="home-container" v-loading="loadingStatus" :class="{ show: crowdLoad}">
      <el-aside width="180px" class="home-aside">
        <div class="wrapper-create wrapper">
          <router-link to="/point/create">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-circle-plus-outline"
              class="create-case">新建报告</el-button>
          </router-link>
        </div>
        <div class="wrapper-select wrapper">
          <el-select
            v-model="pointVal"
            filterable
            clearable
            popper-class="select-dropdown"
            placeholder="请选择任务名称"
            size="small"
            @change="selectChange"
          >
            <el-option
              v-for="item in pointList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical"
          active-text-color="#3d6eff"
          unique-opened
          router
        >
          <el-menu-item :index="`/home/overview?id=${pointId}`">
            <span slot="title">区域概况</span>
          </el-menu-item>
          <el-submenu index="crowd">
            <span slot="title">人群画像</span>
            <el-menu-item-group>
              <el-menu-item :index="`/home/crowd/home?id=${pointId}`">居住人口</el-menu-item>
              <el-menu-item :index="`/home/crowd/company?id=${pointId}`">工作人口</el-menu-item>
              <el-menu-item :index="`/home/crowd/flow?id=${pointId}`">客流人口</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item :index="`/home/heatmap?id=${pointId}`">
            <span slot="title">区域客流</span>
          </el-menu-item>
          <el-submenu index="distribution">
            <span slot="title">职住分布</span>
            <el-menu-item-group>
              <el-menu-item :index="`/home/distribution/home?id=${pointId}`">居住地</el-menu-item>
              <el-menu-item :index="`/home/distribution/company?id=${pointId}`">工作地</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="environment">
            <span slot="title">商业环境</span>
            <el-menu-item-group>
              <el-menu-item :index="`/home/environment/business?id=${pointId}`">行业配套</el-menu-item>
              <el-menu-item :index="`/home/environment/brand?id=${pointId}`">热门品牌</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main style="position: relative;">
        <router-view></router-view>
      </el-main>
      <div class="load-mask" v-show="crowdLoad" v-loading="crowdLoad"></div>
    </el-container>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { CONFIG_MESSAGE_WARNING } from '@common/utils/const'
import Nav from '@com/nav'
export default {
  data() {
    return {
      pointVal: '',
      homeLoading: !1,
      crowdLoad: !1
    }
  },
  provide() {
    return {
      openLoading: this.openLoading,
      closeLoading: this.closeLoading
    }
  },
  mounted() {
    this.changeLoadingStatus(!1)
  },
  methods: {
    ...mapActions([
      'setPointCenter',
      'setPointId',
      'getPointList',
      'getCityList',
      'setCityId',
      'changeLoadingStatus'
    ]),
    selectChange(item) {
      if (item !== '') {
        this.setPointId(item)
      }
    },
    openLoading() {
      this.crowdLoad = !0
    },
    closeLoading() {
      this.crowdLoad = !1
    }
  },
  computed: {
    ...mapGetters([
      'pointList',
      'pointId',
      'loadingStatus',
      'cityId',
      'cityList'
    ])
  },
  watch: {
    $route: {
      handler(newVal) {
        console.log(newVal)
        console.log('home路由进来了')
        if (!this.pointList.length && this.cityList.length === 1) {
          this.$router.push('/point/create')
        } else if (
          !this.pointList.length &&
          !this.cityList.length &&
          this.cityId === '' &&
          this.pointId === ''
        ) {
          this.homeLoading = !0
        } else {
          console.log('我传值了')
          let filterResult = this.pointList.find(el => el.id === this.pointId)
          this.pointVal = filterResult.name
          this.setPointCenter(filterResult.lon_lat.split(','))
        }
        return newVal
      },
      deep: !0,
      immediate: !0
    },
    pointId(newVal) {
      console.log(newVal)
      console.log('pointId数据更新')
      this.homeLoading = !1
      if (this.pointVal === '') {
        // this.pointVal = this.pointList.find(el => el.id === this.pointId).name
        let filterResult = this.pointList.find(el => el.id === this.pointId)
        this.pointVal = filterResult.name
        this.setPointCenter(filterResult.lon_lat.split(','))
      }
      this.$router.push({ path: this.$route.path, query: { id: newVal } })
      return newVal
    },
    pointList: {
      handler(val) {
        console.log('pointList数据更新')
        this.changeLoadingStatus(!1)
        if (!val.length) {
          this.pointVal = '暂无数据'
          this.$message({...CONFIG_MESSAGE_WARNING('当前城市没有商圈数据，请创建新的任务！')})
          setTimeout(() => {
            this.$router.push({ path: '/point/create' })
          }, 2000)
          return val
        }
        return val
      },
      deep: !0
    },
    cityId: newVal => newVal,
    cityList: newVal => newVal,
    loadingStatus: newVal => newVal
  },
  components: {
    Nav
  }
}
</script>

