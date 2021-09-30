<template>
  <div class="info-message">
    <div class="double-pie" :ref="echarId"></div>
    <div class="right-legend">
      <div class="line-legend">
        <span style="background-color: rgb(61, 110, 255)"></span>{{doublePieData[0].name}}
      </div>
      <div class="line-legend">
        <span style="background-color: rgb(255, 205, 97)"></span>{{doublePieData[1].name}}
      </div>
    </div>
    <div class="pie-values">
      <span>{{doublePieData[0].value}}%</span>
      <span>{{doublePieData[1].value}}%</span>
    </div>
  </div>
</template>
<script>
import { DOUBLE_PIE_CONFIG } from '@common/utils/echarts'
export default {
  data() {
    return {
    }
  },
  mounted() {
    this.initDoublePie()
  },
  methods: {
    initDoublePie() {
      const doublePie = this.$echarts.init(this.$refs[this.echarId])
      doublePie.setOption({...DOUBLE_PIE_CONFIG(this.doublePieData[0].value, this.doublePieData[1].value)})
      this.$emit('resetShape', doublePie)
    },
  },
  props: [
    'echarId',
    'doublePieData',
  ]
}
</script>