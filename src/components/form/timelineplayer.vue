<style lang="less" scope>
.outer {
  .w(100%);
  .dp(f);
  .a-i(c);
  .j-c(sb);
  .play-btn {
    .dp(b);
    .w(40px);
    .min-h(40px);
    .bg-i('../../assets/images/overview/play_icon.png');
    .bg-s(cover);
    cursor: pointer;
    &:hover {
      .bg-i('../../assets/images/overview/play_icon_hover.png');
      .bg-s(cover);
    }
    &:active {
      .tranf(scale(.8));
    }
    &.on {
      .bg-i('../../assets/images/overview/suspend_icon.png');
      .bg-s(cover);
      &:hover {
        .bg-i('../../assets/images/overview/suspend_icon_hover.png');
        .bg-s(cover);
      }
    }
  }
  .slider {
    .w(100%);
    .mg(l, 13px);
  }
}
</style>
<template>
  <div class="outer">
    <a class="play-btn" :class="{ on: playSwitchOn }" @click=" playSwitchOn = !playSwitchOn "></a>
    <Slider
      class="slider"
      :min="0"
      :max="23"
      :steps="1"
      :marks="new Array(24).fill().map((_, i) => ({ value: i, label: i + ':00' }))"
      v-model="currentHour"
    />
  </div>
</template>
<script>
const Slider = () => import('@com/form/slider')
import { setStableInterval, clearStableInterval } from '@common/utils/'
let interval
export default {
  data() {
    return {
      currentHour: 0,
      playSwitchOn: !1
    }
  },
  methods: {
    addHour() {
      const nextHour = this.currentHour + 1;
      this.currentHour = nextHour
      // 到23点后，停止播放并跳回员店
      if (nextHour === 23 && !isNaN(+interval)) {
        clearStableInterval(interval);
        this.playSwitchOn = !1;
        window.setTimeout(() => { this.currentHour = 0 }, 1000)
      }
    }
  },
  watch: {
    playSwitchOn(newVal) {
      // 开启之后，打开计时器
      if (newVal && this.currentHour < 23) {
        interval = setStableInterval(this.addHour, 1000);
      } else {
        clearStableInterval(interval);
        this.playSwitchOn = !1;
      }
    },
    currentHour(newVal) {
      this.$emit("change", newVal);
    }
  },
  components: {
    Slider
  }
}
</script>

