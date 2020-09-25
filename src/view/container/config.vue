<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="ios-film-outline"></Icon>
        图形关系
      </p>

      <a href="#" slot="extra" @click.prevent="loadData">
        <Icon type="ios-loop-strong"></Icon>
        刷新
      </a>

      <a href="#" slot="extra" @click.prevent="saveData">
        <Icon type="ios-loop-strong"></Icon>
        保存
      </a>

      <simple-flowchart :scene.sync="config" :height="400"
                        @nodeClick.self="nodeClick"
                        @nodeDelete="nodeDelete"
                        @linkBreak="linkBreak"
                        @linkAdded="linkAdded"
                        @canvasClick="canvasClick"
      >
      </simple-flowchart>
    </Card>
    <Card>
      <p slot="title">
        <Icon type="ios-film-outline"></Icon>
        任务编辑
      </p>

      <i-form ref="form" :model="task" :label-width="80">
        <FormItem label="任务名">
          <i-input v-model="task.name"></i-input>
        </FormItem>

        <FormItem label="bash命令">
          <i-input type="textarea" v-model="task.command" clearable></i-input>
        </FormItem>
        <FormItem label="超时时间">
          <InputNumber v-model="task.timeout"></InputNumber>
          <label>秒</label>
        </FormItem>

        <FormItem label="启用日志">
          <i-switch v-model="task.log_enable"></i-switch>
        </FormItem>

        <FormItem label="禁用任务">
          <i-switch v-model="task.disable"></i-switch>
        </FormItem>

        <FormItem label="活动目录">
          <i-input v-model="task.directory"></i-input>
        </FormItem>

        <FormItem>
          <i-button type="primary" @click="putTask">{{ btnText }}</i-button>
          &nbsp;
          <i-button type="error" @click="confirmRemove">删除</i-button>
        </FormItem>

      </i-form>
    </Card>
  </div>
</template>

<script>
import SimpleFlowchart from 'vue-simple-flowchart'
import 'vue-simple-flowchart/dist/vue-flowchart.css'

//
import { getRelations, addRelation, deleteRelation } from '@/api/relation'
import { putTask, getTask, deleteTask } from '@/api/task'
import { putNodes } from '@/api/node'

export default {
  components: { SimpleFlowchart },
  name: 'ContainerConfig',
  mounted: function () {
    this.loadData()
  },
  data () {
    return {
      isAdd: true,
      cid: 0,
      config: {
        centerX: 0,
        centerY: 0,
        scale: 1,
        nodes: [],
        links: []
      },
      container: {
        cid: 0,
        name: '',
        expression: '',
        disable: false
      },
      task: {
        tid: 0,
        name: '',
        expression: '',
        cid: 1,
        command: '',
        timeout: 0,
        log_enable: false,
        disable: false,
        directory: '',
        point_x: 0,
        point_y: 0
      },
      relation: {
        tid: 0,
        next_tid: 0
      },
      status: {
        1: '等待',
        2: '开始',
        3: '成功',
        4: '失败'
      },
      disableTid: true,
      btnText: '新增'
    }
  },
  methods: {
    convertNodes: function (nodes) {
      let arr = []
      let node
      let start = 0
      let stage = 1
      let padding = 100
      for (node of nodes) {
        start += 100
        let tmp = {}
        tmp.id = node.id

        if (node.x === 0) {
          tmp.x = start + stage * padding
        } else {
          tmp.x = node.x
        }

        if (node.y === 0) {
          tmp.y = 20 + stage * padding
        } else {
          tmp.y = node.y
        }
        tmp.type = this.getNodeTitle(node)
        tmp.label = node.name
        arr.push(tmp)
      }
      return arr
    },

    getNodeTitle: function (node) {
      let texts = []
      texts.push('[')
      texts.push(node.id.toString())
      texts.push(']')
      texts.push(this.status[node.status])
      return texts.join('')
    },

    convertLinks: function (links) {
      let arr = []
      for (let i = 0; i < links.length; i++) {
        let temp = {}
        let link = links[i]
        temp.id = link.id
        temp.from = link.tid
        temp.rid = link.id
        temp.to = link.next_tid
        arr.push(temp)
      }
      return arr
    },

    confirmRemove: function () {
      this.$Modal.confirm({
        title: '确认',
        content: '<p>是否删除当前任务</p>',
        onOk: () => {
          deleteTask(this.task.tid).then(() => {
            this.$Message.success('删除成功~')
            this.loadData()
          })
        }
      })
    },
    // 图界面点击
    canvasClick: function (event) {
      // 确认当前事件的点击对象来自本身，而非事件冒泡
      let target = event.target.nodeName.toLowerCase()
      if (target !== 'svg') {
        return
      }
      this.btnText = '新增'
      this.isAdd = true
      this.task.tid = 0
    },
    // 节点点击
    nodeClick: function (taskid) {
      this.isAdd = false
      this.btnText = '更新'
      getTask(taskid).then((data) => {
        this.task = data
      })
    },

    // 确认删除
    nodeDelete: function (taskid) {
      this.$Modal.confirm({
        title: '确认',
        content: '<p>是否删除当前任务</p>',
        onOk: () => {
          deleteTask(taskid).then(() => {
            this.$Message.success('删除成功~')
            this.loadData()
          })
        }
      })
      this.loadData()
    },
    linkAdded: function (link) {
      this.relation.next_tid = link.to
      this.relation.tid = link.from
      this.relation.cid = this.cid

      addRelation(this.relation).then((data) => {
        if (data === -1) {
          this.$Message.warning('当关系存在闭环，无法添加')
          let linkIndex = this.config.links.findIndex(x => x.id === link.id)
          if (linkIndex > -1) {
            this.config.links.splice(linkIndex, 1)
          }
        } else {
          this.$Message.success('添加成功')
          link.rid = data
        }
      })
    },
    linkBreak: function (link) {
      deleteRelation(link.rid).then(() => {
        this.$Message.success('移除成功')
      })
    },
    saveData: function () {
      putNodes(this.config.nodes).then(() => {
        this.$Message.success('保存成功')
      })
    },

    isEmpty: function (val) {
      return !!((val === undefined || val == null || val.length <= 0))
    },
    putTask: function () {
      putTask(this.task).then(() => {
        this.$Message.success('操作成功~')
        this.loadData()
      })
    },
    loadData: function () {
      let cid = this.$route.params.cid
      this.task.cid = cid
      this.cid = cid
      getRelations(cid).then(data => {
        if (!this.isEmpty(data.nodes)) {
          this.config.nodes = this.convertNodes(data.nodes)
        }
        if (!this.isEmpty(data.links)) {
          this.config.links = this.convertLinks(data.links)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
