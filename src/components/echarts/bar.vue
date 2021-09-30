<template>
  <div class="bar" :ref = "echarId"></div>
</template>
<script>
import { BAR_CONFIG } from '@common/utils/echarts'
export default {
  data() {
    return {
    }
  },
  mounted() {
    this.initBar()
  },
  methods: {
    initBar() {
      const bar = this.$echarts.init(this.$refs[this.echarId])
      bar.setOption({ ...BAR_CONFIG(this.barData[0], this.barData[1]) })
      this.$emit('resetShape', bar)
    }
  },
  props: [
    'echarId',
    'barData',
  ]
}
</script>