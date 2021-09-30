export const ECHARTS_COLORS = [
  '#3d6eff', '#ffcd61', '#70cb7c', '#4bb3ff', '#afebb6', '#aaaaaa'
]

export const PIE_CONFIG = {
  type: 'pie',
  radius: ['80%', '65%'],
  label: {
    show: !1,
  },
  hoverAnimation:!1,
  color: this.colors,
  labelLine: {
    show: !1
  },
  animation:!1
}

export const PROGRESS_PIE_CONFIG = {
  backgroundColor: 'transparent',
  series: [
    {
      type: 'pie',
      startAngle: 270,
      radius: ["78%", "67%"],
      label: {
        show: !1
      },
      labelLine: {
        show: !1
      },
      hoverAnimation: !1,
      animation:!1,
      width: '100%',
      height: '100%',
      data: [
        {
          value: 39.71,
          name: '39.71',
          itemStyle: {
            normal: {
              color: "#3d6eff"
            }
          }
        },
        {
          value: 60.29,
          itemStyle: {
            normal: {
              color: "transparent"
            }
          },
        }
      ]
    },
    {
      type: 'pie',
      startAngle: 270,
      radius: ['86%', '97%'],
      labelLine: {
        show: !1
      },
      hoverAnimation:!1,
      animation:!1,
      width: '100%',
      height: '100%',
      data: [
        {
          value: 60.29,
          itemStyle: {
            normal: {
                color: "#ffcd61"
            }
          }
        },
        {
          value: 39.71,
          itemStyle: {
            normal: {
              color: "transparent"
            }
          }
        }
      ]
    },
  ]
}

export function DOUBLE_PIE_CONFIG(val1, val2) {
  return {
    backgroundColor: 'transparent',
    series: [
      {
        type: 'pie',
        startAngle: 270,
        radius: ["78%", "67%"],
        label: {
          show: !1
        },
        labelLine: {
          show: !1
        },
        hoverAnimation: !1,
        animation:!1,
        width: '100%',
        height: '100%',
        data: [
          {
            value: val1,
            itemStyle: {
              normal: {
                color: "#3d6eff"
              }
            }
          },
          {
            value: val2,
            itemStyle: {
              normal: {
                color: "transparent"
              }
            },
          }
        ]
      },
      {
        type: 'pie',
        startAngle: 270,
        radius: ['86%', '97%'],
        labelLine: {
          show: !1
        },
        hoverAnimation:!1,
        animation:!1,
        width: '100%',
        height: '100%',
        data: [
          {
            value: val2,
            itemStyle: {
              normal: {
                  color: "#ffcd61"
              }
            }
          },
          {
            value: val1,
            itemStyle: {
              normal: {
                color: "transparent"
              }
            }
          }
        ]
      },
    ]
  }
}

export function BAR_CONFIG(tableData, valData) {
  return {
    grid: {
      bottom: -40,
      containLabel: !0,
      left: 0,
      right: 10,
      top: 20
    },
    tooltip: {
      axis: 'axis',
      borderColor: '#fff',
      axisPointer: {
        shadowStyle: {
            color: 'rgba(245, 248, 252, 0.9)',
            type: 'shadow',
            z: 0
        },
        type: 'shadow'
      },
      confine: 'true',
      extraCssText: "padding: 11px; box-shadow: 0 0 6px 0 rgba(0,0,0,0.12); border-radius: 2px;",
      textStyle: {
        color: "#576176",
        fontSize: 12
      },
      trigger: "axis",
      formatter: '{b} <br> 占比：{c}%',
      backgroundColor: '#fff'
    },
    xAxis: {
      type: 'category',
      data: tableData,
      axisLabel: {
        color: '#aaa',
        formatter: (value) => {
            const strCut = value.length > 8 ? value.substring(0, 7) + '...': value
            return strCut.slice(0, 4) + "\n" + strCut.slice(4)
        },
        interval: 0,
        lineHeight: 36
      },
      axisLine: {
        lineStyle: {
          color: '#C9D0DD'
        }
      },
      axisTick: {
        lineStyle: {
          color: '"#C9D0DD"'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#aaa',
        interval: 0,
        formatter: '{value}%'
      },
      axisLine: {
        show: !1
      },
      axisTick: {
        show: !1
      },
      splitLine: {
        lineStyle: {
            color: '#C9D0DD',
            type: 'dashed'
        }
      }
    },
    series: [
      {
        data: valData,
        type: 'bar',
        zlevel: 1,
        barWidth: 6,
        itemStyle: {
          color: '#3d6eff',
        },
        animation:!1
    }]
  }
}

export function LINE_CONFIG(el, data) {
  return {
    grid: {
      bottom: -45,
      containLabel: !0,
      left: 0,
      right: 10,
      top: 10
    },
    tooltip: {
      axis: 'axis',
      borderColor: '#fff',
      confine: 'true',
      extraCssText: "padding: 11px; box-shadow: 0 0 6px 0 rgba(0,0,0,0.12); border-radius: 2px;",
      textStyle: {
        color: "#576176",
        fontSize: 12
      },
      trigger: "axis",
      formatter: '工作日 {c0} <br/> 周末 {c1} <br/> 平均 {c2} ',
      backgroundColor: '#fff'
    },
    xAxis: {
      type: 'category',
      data: data[el].xAxis,
      axisLabel: {
        color: '#aaa',
        formatter: value => {
            const strCut = value.length > 8 ? value.substring(0, 7) + '...': value
            return strCut.slice(0, 4) + "\n" + strCut.slice(4)
        },
        interval: 0,
        lineHeight: 36
      },
      axisLine: {
        lineStyle: {
          color: '#C9D0DD'
        }
      },
      axisTick: {
        lineStyle: {
          color: '"#C9D0DD"'
        }
      },
      boundaryGap: !1,
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#aaa',
        interval: 0,
      },
      axisLine: {
        show: !1
      },
      axisTick: {
        show: !1
      },
      splitLine: {
        lineStyle: {
            color: '#C9D0DD',
            type: 'dashed'
        }
      }
    },
    series: [
      {
        data: data[el].series[0],
        type: 'line',
        itemStyle: {
          color: ECHARTS_COLORS[0],
        },
        zlevel: 1,
        animation:!1
      },
      {
        data: data[el].series[1],
        type: 'line',
        itemStyle: {
          color: ECHARTS_COLORS[1],
        },
        zlevel: 1,
        animation:!1
      },
      {
        data: data[el].series[2],
        type: 'line',
        itemStyle: {
          color: ECHARTS_COLORS[2],
        },
        zlevel: 1,
        animation:!1
      },
    ]
  }
}