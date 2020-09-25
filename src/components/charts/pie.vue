<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { off, on } from '@/libs/tools'

echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartPie',
  props: {
    value: Array,
    text: String,
    subtext: String,
    options: {
      type: Object,
      default () {
        return {
          title: {
            text: this.text,
            subtext: this.subtext,
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: []
          },
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
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
            this.loadDom(newVal)
          } else {
            this.loadDom(oldVal)
          }
        } else {
          this.initDom()
        }
      }
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    initDom () {
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(this.options)
      on(window, 'resize', this.resize)
    },
    loadDom (data) {
      if (!data) {
        return
      }
      this.options.legend.data = data.map(_ => _.name)
      this.options.series[0].data = data
      this.dom.setOption(this.options)
      on(window, 'resize', this.resize)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initDom()
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
