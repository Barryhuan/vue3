<style lang="less" scope>
.nav-conatiner {
  .ps(ab);
  top: 0;
  left: 0;
  .dp(f);
  .j-c(sb);
  .wh(100%, 48px);
  .min-w(750px);
  .pd(0 16px);
  .bg-c(#3d6eff);
  box-shadow: 0 0 8px 2px rgb(0 0 0 / 25%);
  .nav-l {
    .wh(600px, 100%);
    .dp(f);
    .a-i(c);
    .nav-logo {
      .w(100px);
      cursor: pointer;
    }
    .nav-search-select {
      .w(100px);
      .c(#fff);
      .el-input__inner {
        .ft-s(12px);
        .c(#fff);
        .bd(none);
        .bg-c(transparent);
        &::-webkit-input-placeholder {
          .ft-s(12px);
          .c(#c5d4ff);
        }
      }
      .el-select__caret {
        .c(#fff);
      }
    }
    .nav-links {
      .link-item {
        .dp(b);
        .ft-s(14px);
        .c(#c5d4ff);
        cursor: pointer;
        .mg(l, 48px);
        &.router-link-active {
        .c(#fff);
      }
      }
    }
  }
  .nav-r {
    .dp(f);
    .a-i(c);
    .wh(70px, 100%);
    .el-dropdown-link {
      .ft-s(12px);
      .c(#c5d4ff);
      cursor: pointer;
    }
  }
}
</style>
<template>
  <nav class="nav-conatiner">
      <div class="nav-l">
        <div class="nav-logo" @click="$router.push({ path: '/home/overview', query: { id: pointId } })">
          <img src="../assets/images/overview/logo.png" alt="" class="logo">
        </div>
        <div class="nav-search-select">
          <el-select
            v-model="value"
            filterable
            :placeholder="placeholderName"
            @change="changeCity"
          >
            <el-option
              v-for="item in cityList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="nav-links">
          <router-link :to="{ path: '/home/overview', query: { id: pointId } }" class="link-item" tag="span">评点位</router-link>
        </div>
      </div>
      <div class="nav-r">
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            个人中心 <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="task">任务管理</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
  </nav>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { CONFIG_MESSAGE_SUCCESS } from '@common/utils/const'
import { LOGIN_OUT } from '@api'
export default {
  data() {
    return {
      value: '',
      placeholderName: ''
    }
  },
  mounted() {
    this.initNav()
  },
  methods: {
    ...mapActions([
      'getCityList',
      'setCityId',
      'getPointList',
      'setPointId',
      'changeLoadingStatus'
    ]),
    async initNav() {
      console.log('-------------')
      console.log(this.pointId)
      console.log(this.pointList)
      console.log(this.cityId)
      console.log(this.cityList)
      console.log('-------------')
      if (
        !this.pointList.length &&
        !this.cityList.length &&
        this.cityId === '' &&
        this.pointId === ''
      ) {
        await this.getCityList(this.$getItem('STATUS_HSH'))
        this.setCityId(JSON.parse(this.$getItem('cityId')))
        await this.getPointList({ token: this.$getItem('STATUS_HSH'), cityId: this.$getItem('cityId') })
        this.setPointId(JSON.parse(this.$getItem('pointId')))
      }
      console.log('我干')
      this.value = parseInt(this.cityId)
      this.placeholderName = this.cityList.find(el => {
        return el.id === this.cityId
      }).name
    },
    async handleCommand(command) {
      if (command === 'logout') {
        let res = await LOGIN_OUT(this.$getItem('STATUS_HSH'))
        if (!res.data.length) {15622351513
          this.$removeItem('STATUS_HSH')
          this.$removeItem('pointId')
          this.$removeItem('cityId')
          this.$message({ ...CONFIG_MESSAGE_SUCCESS('退出登录成功'), duration: 1000 })
          setTimeout(() => {
            this.$store = null
            this.$router.push({ path: '/'})
          }, 1500)
        }
      } else {
        this.$router.push({ path: `/user/${command}` })
      }
    },
    async changeCity(cityId) {
      this.changeLoadingStatus(!0)
      this.setCityId(cityId)
			this.$setItem('cityId', cityId)
      await this.getPointList({ token: this.$getItem('STATUS_HSH'), cityId })
      this.setPointId(this.pointList[0].id)
      this.$setItem('pointId', this.pointList[0].id)
    },
    currentCityName() {
      this.value = JSON.parse(this.cityId)
      return this.cityList.find(el => el.id === this.cityId).name
    }
  },
  computed: {
    ...mapGetters([
      'pointId',
      'pointList',
      'cityId',
      'cityList',
    ]),
    // currentCityName() {
    //   if (this.currentCityId) {
    //     this.value = this.currentCityId
    //   } else {
    //     this.setCityId(JSON.parse(this.$getItem('cityId')))
    //     this.$setItem('cityId', JSON.parse(this.$getItem('cityId')))
    //     this.value = JSON.parse(this.$getItem('cityId'))
    //   }
    //   // this.value = this.currentCityId ? this.currentCityId : JSON.parse(this.$getItem('cityId'))
    //   return this.cityList.find(el => el.id === this.cityId).name
    // }
  },
  watch: {
    cityId: newVal => newVal,
    pointId: newVal => newVal,
    loadingStatus: newVal => newVal
  },
  // props: [
  //   'currentCityId'
  // ]
}
</script>
