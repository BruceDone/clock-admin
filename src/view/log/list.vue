<template>
  <div>
    <div>
      <Modal v-model="showBig" title="日志显示">
        <div>
          <highlight-code lang="shell" :code="showLog" v-model="showLog"/>
        </div>
      </Modal>
    </div>
    <div>
      <i-form :model="page" inline :label-width="80">
        <form-item label="关键字">
          <i-input v-model="page.keyword" type="text" placeholder="名字或描述">
          </i-input>
        </form-item>
        <form-item label="容器ID">
          <InputNumber v-model="page.cid">
          </InputNumber>
        </form-item>
        <form-item label="任务ID">
          <InputNumber v-model="page.tid">
          </InputNumber>
        </form-item>
        <form-item label="排列条件">
          <i-select v-model="page.order" style="width:200px">
            <Option value="cid">CID</Option>
            <Option value="update_at">更新时间</Option>
          </i-select>
        </form-item>
        <form-item label="起始时间">
          <DatePicker type="datetimerange"
                      @on-change="showDate"
                      format="yyyy-MM-dd HH:mm"
                      @on-clear="clearDate"
                      placeholder="起始时间选择">
          </DatePicker>
        </form-item>
        <i-button type="primary" icon="ios-search" @click="loadPage">查询</i-button> &nbsp;&nbsp;
        <i-button type="error" icon="md-close" @click="confirmDeleteLogs">删除</i-button> &nbsp;&nbsp;
      </i-form>
    </div>
    <Table border :columns="columns" :data="logs">
      <template slot-scope="{ row }" slot="action">
        <Button type="info" size="small" @click="viewLog(row)">详情</Button>
      </template>
    </Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="page.total" :page-size="page.count" @on-change="changePageIndex"
              @on-page-size-change="changePageSize" show-sizer/>
      </div>
    </div>
  </div>
</template>

<script>
import { getLogs, deleteLogs } from '@/api/log'
import { getDateTimeStr } from '@/libs/util'

export default {
  name: 'LogList',
  mounted: function () {
    if (this.$route.params.tid) {
      this.page.tid = this.$route.params.tid
    }
    this.loadPage()
  },

  data () {
    return {
      showBig: false,
      showLog: '',
      logs: [],
      selectDate: '',
      page: {
        total: 0,
        index: 1,
        count: 10,
        tid: 0,
        lid: 0,
        cid: 0,
        left_ts: 0,
        right_ts: 0
      },
      columns: [
        {
          title: '#ID',
          key: 'lid',
          width: '100'
        },
        {
          title: '#任务ID',
          key: 'tid',
          width: '100'
        },
        {
          title: '#容器ID',
          key: 'cid',
          width: '100'
        },
        {
          title: '终端错误',
          key: 'std_err',
          tooltip: true
        },
        {
          title: '终端信息',
          key: 'std_out',
          tooltip: true
        },
        {
          title: '运行时间',
          key: 'update_at',
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
          width: '120'
        }

      ]
    }
  },
  methods: {
    loadPage: function () {
      getLogs(this.page).then(data => {
        this.logs = data.items
        this.page.total = data.page.total
      })
    },
    clearDate: function () {
      this.selectDate = []
      this.page.left_ts = 0
      this.page.right_ts = 0
    },
    showDate: function (daterange) {
      if (!daterange) {
        return
      }
      if (daterange.length !== 2) {
        return
      }
      if (!daterange[0] || !daterange[1]) {
        return
      }

      let left = daterange[0]
      left = new Date(left)
      if (left) {
        this.page.left_ts = left.getTime() / 1000
      }

      let right = daterange[1]
      right = new Date(right)
      if (right) {
        this.page.right_ts = right.getTime() / 1000
      }
    },
    confirmDeleteLogs: function () {
      this.$Modal.confirm({
        title: '确认',
        content: '<p>是否删除选中日志?</p>',
        onOk: () => {
          this.dropLogs()
        }
      })
    },
    dropLogs: function () {
      deleteLogs(this.page).then(() => {
        this.$Message.success('删除成功!')
      })
    },
    changePageIndex: function (page) {
      this.page.index = page
      this.loadPage()
    },
    changePageSize: function (size) {
      this.page.count = size
      this.loadPage()
    },
    viewLog: function (row) {
      let log = []
      log.push('===STD_OUT===\n')
      log.push(row.std_out)
      log.push('\n===STD_ERR===\n')
      log.push(row.std_err)
      this.showLog = log.join('')
      this.showBig = true
    }
  }
}
</script>

<style scoped>

</style>
