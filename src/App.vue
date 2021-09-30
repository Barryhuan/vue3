<style lang="less">
#app {
  .wh(100%, 100%);
  .over(at);
}
</style>

<template>
  <router-view></router-view>
</template>

<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'APP',
  setup() {
  }
})
</script>