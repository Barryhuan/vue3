<style lang="less" scope>
.my-slider {
  .ps(rt);
  .h(12px);
  .mg(8px);
  .mg(b, 16px);
  input[type=range], .slider-outer {
    .ps(ab);
    top: 0;
    .wh(100%, 12px);
    .mg(0);
  }
  input[type=range] {
    cursor: pointer;
    opacity: 0;
  }
  .slider-outer {
    pointer-events: none;
    .track, .track-already {
      .ps(ab);
      top: calc(50% - 1px);
      .h(2px);
      .bdr(1px);
      .bg-c(rgba(0, 0, 0, .12));
    }
    .track {
      .w(100%);
    }
    .track-already {
      .bg-c(#3d6eff);
    }
    .block {
      .ps(ab);
      top: 0;
      .wh(12px, 12px);
      .mg(l, -6px);
      .bd(2px solid #3d6eff);
      .bdr(50%);
      .bg-c(#fff);
    }
    .graduation {
      .ps(ab);
      top: 8px;
      .w(100%);
      li {
        .dp(f);
        .f-d(c);
        .a-i(c);
        .ps(ab);
        .tranf(translateX(-50%));
        &:first-child {
          .label {
            .ps(rt);
            left: 8px;
          }
        }
         &:last-child {
          .label {
            .ps(rt);
            right: 8px;
          }
        }
        .label {
          .pd(t, 5px);
          .l-h(14px);
          .ft-s(12px);
          .c(rgba(0, 0, 0, .28));
        }
        .line {
          .dp(b);
          .wh(1px, 4px);
          .bg-c(rgba(0, 0, 0, .12));
        }
      }
    }
  }

  &:hover {
    .slider-outer .block {
      .tranf(scale(1.2));
    }
  }
}
</style>
<template>
  <div class="my-slider">
    <div class="slider-outer">
      <!-- 滑轨 -->
      <div class="track"></div>
      <div class="track-already" :style="{ width: percent + '%' }"></div>
      <!-- 滑块 -->
      <div class="block"  :style="{ left: percent + '%' }"></div>
      <!-- 刻度 -->
      <ul class="graduation">
        <li v-for="(item, $index) in marks" :key="$index" :style="{ left: (item.value - min) / (max - min) * 100 + '%' }">
          <span class="line"></span><span class="label">{{item.label}}</span>
        </li>
      </ul>
    </div>
    <!-- 隐藏的原生input -->
    <input
      type="range"
      :min="min"
      :max="max"
      :value="value"
      @change="handleChange"
      @input="handleChange"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentValue: this.value
    }
  },
  props: {
    min: Number,
    max: Number,
    value: Number,
    marks: Array,
    steps: [ Number, Array ]
  },
  methods: {
    handleChange ({ target: { value } }) {
      if (this.needForcedSteps) {
        this.$emit("input", this.getClosestStep(+value))
      } else {
        this.$emit("input", +value)
      }
    },
    getClosestStep (value) {
      if (Array.isArray(this.steps)) {
        return this.steps.reduce((lastClosest, current) => {
          return Math.abs(current - value) < Math.abs(lastClosest - value) ? current : lastClosest
        }, Infinity)
      }
      return value
    }
  },
  computed: {
    percent () {
      return (this.currentValue - this.min) / (this.max - this.min) * 100
    },

    needForcedSteps () {
      return Array.isArray(this.steps)
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    }
  },
}
</script>

