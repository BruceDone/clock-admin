<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="6" :md="6" :lg="6" v-for="(infor, i) in Cards" :key="`infor-${i}`"
             style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="memData" text="内存使用"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="loadData" text="系统负载" :color="['#3CB371']"/>
        </Card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="cpuData" text="CPU状态" :color="['#3398DB']"/>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import { getMessages } from '@/api/message'
import { getSystem } from '@/api/system'

export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar
  },
  data () {
    return {
      Cards: [],
      memData: [],
      cpuData: {},
      loadData: {}
    }
  },
  mounted () {
    this.loadCounter()
  },
  methods: {
    loadCounter: function () {
      getMessages().then(resp => {
        this.Cards = resp
      })
      getSystem('mem').then(data => {
        this.memData = data
      })
      getSystem('cpu').then(data => {
        this.cpuData = data
      })
      getSystem('load').then(data => {
        this.loadData = data
      })
    }
  }
}
</script>

<style lang="less">
  .count-style {
    font-size: 50px;
  }
</style>
