<template>
    <div>

        <div>
          <i-form :model="page" inline :label-width="80">
            <form-item label="名字">
              <i-input v-model="page.name" type="text" placeholder="名字">
              </i-input>
            </form-item>
            <form-item label="命令">
              <i-input v-model="page.command" type="text" placeholder="命令">
              </i-input>
            </form-item>
            <form-item label="容器ID">
              <InputNumber v-model="page.cid" :min="0">
              </InputNumber>
            </form-item>
            <form-item label="当前状态">
              <i-select v-model="page.status" style="width:200px">
                <Option value="0">全部</Option>
                <Option value="1">等待</Option>
                <Option value="2">开始</Option>
                <Option value="3">成功</Option>
                <Option value="4">失败</Option>
              </i-select>
            </form-item>
                <i-button type="primary" icon="ios-search" @click="loadPage">查询</i-button> &nbsp;&nbsp;
                <i-button type="success" v-model="showPut" icon="ios-add-circle" @click="windowAddTask">新增</i-button>
            </i-form>
        </div>
        <div>
            <Table border :columns="columns" :data="tasks">
                <template slot-scope="{ row }" slot="disable">
                    <i-switch size="large" v-model="row.disable" @on-change="switchTaskStatus(row)">
                    </i-switch>
                </template>
                <template slot-scope="{ row }" slot="log_enable">
                    <i-switch size="large" v-model="row.log_enable" @on-change="switchTaskStatus(row)">
                    </i-switch>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <Button type="info" size="small" @click="viewLog(row)">日志</Button>
                    <Button type="primary" size="small" @click="rowPutTask(row)">编辑</Button>
                    <Button type="error" size="small" @click="confirmRemove(row)">删除</Button>
                    <Button type="info" size="small" @click="runTask(row)">运行</Button>
                </template>
            </Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="page.total" :page-size="page.count" @on-change="changePageIndex"
                          @on-page-size-change="changePageSize" show-sizer/>
                </div>
            </div>
        </div>
        <div>
            <Modal v-model="showPut" title="操作任务" @on-ok="putTask">
                <div>
                    <i-form ref="form" :model="task" :label-width="80">
                        <FormItem label="任务ID">
                            <i-input v-model="task.tid" disabled></i-input>
                        </FormItem>
                        <FormItem label="任务名">
                            <i-input v-model="task.name"></i-input>
                        </FormItem>
                        <FormItem label="bash命令">
                            <i-input type="textarea" v-model="task.command" clearable></i-input>
                        </FormItem>
                        <FormItem label="超时时间">
                            <i-input v-model="task.timeout"></i-input>
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
                    </i-form>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
import { getTasks, putTask, deleteTask, runTask } from '../../api/task'
import { getDateTimeStr } from '@/libs/util'

export default {
  name: 'TaskList',
  mounted: function () {
    this.loadPage()
  },

  data () {
    return {
      tasks: [],
      showPut: false,
      page: {
        order: 'tid',
        name: '',
        command: '',
        cid: 0,
        status: 0,
        total: 0,
        index: 1,
        count: 20
      },
      task: {
        tid: 0,
        name: '',
        command: '',
        timeout: 0,
        log_enable: false,
        disable: false,
        directory: ''
      },
      statusBtn: {
        1: {
          props: {
            type: 'info',
            size: 'small',
            icon: 'md-arrow-down'
          },
          text: '等待'
        },
        2: {
          props: {
            type: 'primary',
            size: 'small',
            loading: true
          },
          text: '进行'
        },
        3: {
          props: {
            type: 'success',
            size: 'small',
            icon: 'md-checkmark'
          },
          text: '成功'
        },
        4: {
          props: {
            size: 'small',
            type: 'error',
            icon: 'md-close'
          },
          text: '失败'
        }
      },
      search: '',
      columns: [
        {
          title: '状态',
          key: 'status',
          width: '120',
          render: (h, params) => {
            let status = params.row.status
            let p = this.statusBtn[status.toString()]
            return h('Button', {
              props: p.props
            }, p.text)
          }
        },
        {
          title: '任务名',
          key: 'name',
          tooltip: true,
          width: '200'
        },
        {
          title: '容器ID',
          key: 'cid',
          width: '80'
        },
        {
          title: '禁用任务',
          key: 'disable',
          slot: 'disable',
          width: '100'
        },
        {
          title: 'bash命令',
          key: 'command',
          resizable: true,
          tooltip: true
        },
        {
          title: '启用日志',
          slot: 'log_enable',
          key: 'log_enable',
          width: '100'
        },
        {
          title: '操作时间',
          key: 'update_at',
          width: '150',
          render: (h, params) => {
            let status = params.row.update_at
            let p = getDateTimeStr(status)
            return h('Span', {}, p)
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          slot: 'action',
          width: '240'
        }
      ]
    }
  },

  methods: {
    loadPage: function () {
      getTasks(this.page).then(data => {
        this.tasks = data.items
        this.page.total = data.page.total
      })
    },
    // 新增or修改任务
    putTask: function () {
      putTask(this.task).then(() => {
        this.$Message.success('操作成功~')
        this.loadPage()
      }
      )
    },
    // 行编辑任务
    rowPutTask: function (row) {
      this.task = row
      this.showPut = true
    },
    windowAddTask: function () {
      this.task = {
        tid: 0,
        name: '',
        expression: '',
        command: '',
        timeout: 0,
        log_enable: false,
        disable: false,
        directory: ''
      }
      this.showPut = true
    },
    changePageIndex: function (page) {
      this.page.index = page
      this.loadPage()
    },
    changePageSize: function (size) {
      // 默认页面大小变化切入到第一页
      this.page.index = 1
      this.page.count = size
      this.loadPage()
    },
    runTask: function (task) {
      this.$Message.info('开启任务')
      runTask(task).then(() => {
        this.$Message.info('运行成功')
      })
      this.loadPage()
    },
    confirmRemove: function (task) {
      let cur = this
      this.$Modal.confirm({
        title: '确认',
        content: '<p>是否删除当前任务</p>',
        onOk: () => {
          cur.remove(task)
        }
      })
    },
    remove: function (task) {
      deleteTask(task.tid).then(() => {
        this.$Message.success('删除成功~')
        this.loadPage()
      })
    },
    switchTaskStatus: function (task) {
      putTask(task).then(() => {
        this.$Message.success('操作成功~')
        this.loadPage()
      }
      )
    },
    viewLog: function (task) {
      this.$router.push({ name: 'log-list', params: { tid: task.tid } })
    }
  }
}
</script>
