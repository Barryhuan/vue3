<style lang="less" scoped>
  #login {
    .login-container {
      .wh(100%, 100%);
    }
  }
</style>

<template>
  <div id="login" class="full-screen">
    <el-container class="login-container">
      <el-header></el-header>
      <el-main ref="echartsId"></el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script setup>
console.log(import.meta.env.DEV)
</script>
