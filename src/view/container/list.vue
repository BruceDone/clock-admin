<template>
  <div>

    <div>
      <i-form :model="page" inline :label-width="80">
        <form-item label="名字">
          <i-input v-model="page.name" type="text" placeholder="名字">
          </i-input>
        </form-item>
        <form-item label="表达式">
          <i-input v-model="page.expression" type="text" placeholder="表达式">
          </i-input>
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
        <i-button type="success" v-model="showPut" icon="ios-add-circle" @click="windowAddContainer">新增
        </i-button>
      </i-form>
    </div>
    <div>
      <Table border :columns="columns" :data="containers">
        <template slot-scope="{ row }" slot="disable">
          <i-switch size="large" v-model="row.disable" @on-change="changeContainer(row)">
          </i-switch>
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button type="info" size="small" @click="viewConfig(row)">配置</Button>
          <Button type="primary" size="small" @click="rowPutContainer(row)">编辑</Button>
          <Button type="error" size="small" @click="confirmRemove(row)">删除</Button>
          <Button type="info" size="small" @click="runContainer(row)">运行</Button>
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
      <Modal v-model="showPut" title="编辑" @on-ok="updateContainer">
        <i-form ref="form" :model="container" :label-width="80">
          <FormItem label="容器ID">
            <i-input v-model="container.cid" disabled></i-input>
          </FormItem>
          <FormItem label="任务描述">
            <i-input v-model="container.name"></i-input>
          </FormItem>

          <FormItem label="表达式">
            <i-input v-model="container.expression"></i-input>
          </FormItem>
          <FormItem label="禁用任务">
            <i-switch v-model="container.disable"></i-switch>
          </FormItem>
        </i-form>
      </Modal>
    </div>
  </div>
</template>

<script>
import { getContainers, putContainer, deleteContainer, runContainer } from '../../api/container'
import { getDateTimeStr } from '@/libs/util'

export default {
  name: 'ContainerList',
  mounted: function () {
    this.loadPage()
  },

  data () {
    return {
      containers: [],
      showPut: false,
      page: {
        expression: '',
        name: '',
        order: 'cid',
        status: 0,
        total: 0,
        index: 1,
        count: 20
      },
      container: {
        cid: 0,
        name: '',
        expression: '',
        disable: false
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
          title: '容器ID',
          key: 'cid',
          width: '80'
        },
        {
          title: '操作时间',
          key: 'update_at',
          render: (h, params) => {
            let status = params.row.update_at
            console.log(status)
            let p = getDateTimeStr(status)
            return h('Span', {}, p)
          }
        },
        {
          title: '禁用任务',
          key: 'disable',
          slot: 'disable',
          width: '100'
        },

        {
          title: '容器名',
          key: 'name',
          tooltip: true
        },
        {
          title: '表达式',
          key: 'expression'
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
      getContainers(this.page).then(data => {
        this.containers = data.items
        this.page.total = data.page.total
      })
    },
    // 新增or修改任务
    updateContainer: function () {
      putContainer(this.container).then(() => {
        this.$Message.success('操作成功~')
        this.loadPage()
      }
      )
    },
    // 行编辑任务
    rowPutContainer: function (row) {
      this.container = row
      this.showPut = true
    },
    windowAddContainer: function () {
      this.container = {
        cid: 0,
        name: '',
        expression: '',
        disable: false
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
    runContainer: function (container) {
      this.$Message.info('开启任务')
      runContainer(container).then(() => {
        this.$Message.success('运行成功')
      })
      this.loadPage()
    },
    confirmRemove: function (container) {
      let cur = this
      this.$Modal.confirm({
        title: '确认',
        content: '<p>是否删除当前任务</p>',
        onOk: () => {
          cur.remove(container)
        }
      })
    },
    remove: function (container) {
      deleteContainer(container.cid).then(() => {
        this.$Message.success('删除成功~')
        this.loadPage()
      })
    },
    changeContainer: function (container) {
      putContainer(container).then(() => {
        this.$Message.success('操作成功~')
        this.loadPage()
      }
      )
    },
    viewConfig: function (container) {
      this.$router.push({ name: 'container-config', params: { cid: container.cid } })
    }
  }
}
</script>
