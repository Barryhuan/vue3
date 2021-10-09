<style lang="less" scoped>
  .login-container {
    .wh(100%, 100%);
    .nav {
      .bd(b, 1px solid #dcdfe6);
      .el-menu {
        .h(55px);
        li {
          .h(54px);
          .el-sub-menu__title{

          }
        }
      }
    }
  }
  .el-sub-menu__title {
    .h(54px);
  }
</style>

<template>
  <el-container class="login-container full-screen">
    <el-header class="nav" height="55px">
      <el-row :gutter="10" justify="space-between">
        <el-col :span="4">
          <div class="logo">
          </div>
        </el-col>
        <el-col :span="12">
          <el-menu
            :default-active="activeIndex"
            @select="handleSelect"
            mode="horizontal"
            menu-trigger="click"
          >
            <el-menu-item index="1">指南</el-menu-item>
            <el-menu-item index="2">组件</el-menu-item>
            <el-menu-item index="3">资源</el-menu-item>
             <el-sub-menu index="4">
              <template #title>语言</template>
              <el-menu-item index="4-1">English</el-menu-item>
              <el-menu-item index="4-2">日本語</el-menu-item>
              <el-menu-item index="4-3">简体中文</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-col>
      </el-row>
    </el-header>
    <el-main></el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<script setup>
  import { ref, reactive, toRefs } from 'vue'
  let activeIndex = ref('1')
  let handleSelect = (key, path) => {
    console.log(key, path)
  }
</script>
