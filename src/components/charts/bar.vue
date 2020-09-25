<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)

export default {
  name: 'ChartBar',
  props: {
    value: Object,
    text: String,
    subtext: String,
    color: Object,
    option: {
      type: Object,
      default () {
        return {
          title: {
            text: this.text,
            subtext: this.subtext,
            x: 'center'
          },
          color: this.color,
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [],
            type: 'bar'
          }]
        }
      }
    }
  },
  data () {
    return {
      dom: null
    }
  },
  watch: {
    value: {
      handler (newVal, oldVal) {
        if (this.dom) {
          if (newVal) {
            this.loadData(newVal)
          } else {
            this.loadData(oldVal)
          }
        } else {
          this.initChart()
        }
      }
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    loadData (val) {
      if (val) {
        let xAxisData = Object.keys(val)
        let seriesData = Object.values(val)
        this.option.xAxis.data = xAxisData
        this.option.series[0].data = seriesData
        this.dom.setOption(this.option)
      }
      on(window, 'resize', this.resize)
    },
    initChart () {
      // this.option.xAxisData = []
      // this.option.series[0].data = []
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(this.option)
      on(window, 'resize', this.resize)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
