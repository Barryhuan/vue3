<style lang="less" scope>
.user {
  .pd(t, 48px);
  .user-container {
    .h(100%);
    .user-aside {
      .ps(rt);
      .h(100%);
      user-select: none;
      .wrapper {
        .pd(8px 20px 0);
      }
      .el-menu-vertical {
        .bd(r, none);
        .el-menu-item {
          .h(54px);
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
      .pd(20px);
      .bg-c(#fafbfc);
    }
  }
}
</style>
<template>
  <div class="user full-screen" v-loading="pageLoading">
    <Nav/>
    <el-container class="user-container" v-loading="loadingStatus">
      <el-aside width="180px" class="user-aside">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical"
          active-text-color="#3d6eff"
          unique-opened
          router
        >
          <el-menu-item index="/user/task">
            <span slot="title">区域概况</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main style="position: relative;">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import Nav from '@com/nav'
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      pageLoading: !1
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions(['changeLoadingStatus']),
    init() {
      if (
        !this.pointList.length &&
        !this.cityList.length &&
        this.cityId === '' &&
        this.pointId === ''
      ) {
        this.pageLoading = !0
      }
    },
  },
  computed: {
    ...mapGetters([
      'loadingStatus',
      'pointId',
      'pointList',
      'cityId',
      'cityList'
    ])
  },
  watch: {
    loadingStatus: newVal => newVal,
    async cityId(newVal) {
      console.log(1)
      return newVal
    },
    pointList: {
      handler(val) {
        console.log(2)
        this.changeLoadingStatus(!1)
        this.pageLoading = !1
        return val
      },
      deep: !0
    }
  },
  components: {
    Nav
  }
}
</script>
