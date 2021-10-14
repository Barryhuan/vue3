<style lang="less">
  #app {
    .wh(100%, 100%);
    .over(at);
  }
  .full-screen {
    .wh(100%, 100%);
    .over(at);
  }
</style>

<template>
  <router-view />
</template>

<script>
  import { defineComponent } from 'vue'
  export default defineComponent({
    name: 'App',
    setup() {}
  })
</script>
