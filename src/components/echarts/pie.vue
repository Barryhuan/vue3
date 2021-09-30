<template>
  <div class="info-message">
    <div class="pie" :ref="echarId"></div>
    <div class="legend">
      <div class="line"  v-for="(item, index) of legendData" :key="index" :class="{ active: isActive && isActiveIndex === echarId + index}">
        <span>{{item.name}}</span>
        <div class="track">
          <span :style="{ width: item.value + '%', backgroundColor: ECHARTS_COLORS[index]}"></span>
        </div>
        <span>{{item.value + '%'}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { PIE_CONFIG, ECHARTS_COLORS } from '@common/utils/echarts'
export default {
  data() {
    return {
      ECHARTS_COLORS
    }
  },
  mounted() {
    this.initPie()
  },
  methods: {
    initPie() {
      const pie = this.$echarts.init(this.$refs[this.echarId])
      pie.setOption({
        series: [
          {
            ...PIE_CONFIG,
            color: this.ECHARTS_COLORS,
            data: [...this.pieData]
          }
        ]
      })
      pie.on('mouseover', params => {
        pie.dispatchAction({
          type: 'downplay'
        })
        this.$emit('pieMouseOver', params, this.echarId)
      })
      pie.on('mouseout', () => {
        this.$emit('pieMouseOut')
      })
      this.$emit('resetShape', pie)
    }
  },
  props: [
    'echarId',
    'legendData',
    'pieData',
    'isActive',
    'isActiveIndex'
  ]
}
</script>