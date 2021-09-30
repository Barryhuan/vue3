<style lang="less">
#app {
  .wh(100%, 100%);
  .over(at);
}
.full-screen {
  .wh(100%, 100%);
  .over(at);
}
::-webkit-scrollbar {
  .wh(6px, 6px);
  cursor: pointer;
}
::-webkit-scrollbar-button {
  .h(0);
}
::-webkit-scrollbar-corner {
  .bg-c(transparent);
}
::-webkit-scrollbar-thumb {
  .bg-c(rgba(0,0,0,.2));
  .bdr(2px);
}
::-webkit-scrollbar-track {
  .bg-c(transparent);
  opacity: 0;
}
::selection {
  .c(#fff);
  .bg-c(#1890ff);
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