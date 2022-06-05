<template>
  <div class="app-container">
    <div class="filter-container">
      <span>资源名：</span>
      <el-input v-model="listQuery.resources_name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <br/>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源名称" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.resources_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编号" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.resources_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="父结点" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.parent_node }}</span>
        </template>
      </el-table-column>
      <el-table-column label="子系统" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sub_system }}</span>
        </template>
      </el-table-column>
      <el-table-column label="URL" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.resources_url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="API" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.resources_api }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源类型" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.resources_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可见性" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.resources_visibility | statusFilter">
            {{ row.resources_visibility }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <!--<el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">-->
          <!--  Publish-->
          <!--</el-button>-->
          <!--<el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">-->
          <!--  Draft-->
          <!--</el-button>-->
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="资源名" prop="resources_name">
          <el-input v-model="temp.resources_name" />
        </el-form-item>
        <el-form-item label="编号" prop="resources_no">
          <el-input v-model="temp.resources_no" />
        </el-form-item>
        <el-form-item label="父结点" prop="parent_node">
          <el-select v-model="temp.parent_node" class="filter-item" placeholder="请选择">
            <el-option v-for="item in parentNodeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="子系统" prop="sub_system">
          <el-select v-model="temp.sub_system" class="filter-item" placeholder="请选择">
            <el-option v-for="item in subSystemOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="URL" prop="resources_url">
          <el-input v-model="temp.resources_url" />
        </el-form-item>
        <el-form-item label="API" prop="resources_api">
          <el-input v-model="temp.resources_api" />
        </el-form-item>
        <el-form-item label="资源类型" prop="resources_type">
          <el-select v-model="temp.resources_type" class="filter-item" placeholder="请选择">
            <el-option v-for="item in resourcesTypeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="可见性" prop="resources_visibility">
          <el-select v-model="temp.resources_visibility" class="filter-item" placeholder="请选择">
            <el-option v-for="item in resourcesVisibilityOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createResources, updateResources } from '@/api/resources-table'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

// const calendarTypeOptions = [
//   { key: 'CN', display_name: 'China' },
//   { key: 'US', display_name: 'USA' },
//   { key: 'JP', display_name: 'Japan' },
//   { key: 'EU', display_name: 'Eurozone' }
// ]
//
// // arr to obj, such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '是': 'success',
        '否': 'danger'
      }
      return statusMap[status]
    }
    // typeFilter(type) {
    //   return calendarTypeKeyValue[type]
    // }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,

      // 新添加
      parentNodeOptions: ['在线客服', '基础数据管理'],
      subSystemOptions: ['业务管理系统', '宿舍管理系统'],
      resourcesTypeOptions: ['菜单', '导航栏', '组件'],
      resourcesVisibilityOptions: ['是', '否'],

      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        resources_name: [{ required: true, message: '资源类型不能为空！' }],
        resources_no: [
          { required: true, message: '编号不能为空！' },
          { len: 10, message: '编号长度必须为10！' },
          { pattern: /\d+/, message: '编号必须为纯数字！' }
        ],
        resources_url: [
          { required: true, message: 'URL不能为空！' }
        ],
        resources_api: [
          { required: true, message: 'API不能为空！' },
          { pattern: /^[\/]{1}[^\/]*$/, message: 'API必须以/开头！' },
          { pattern: /^[\/]{1}[^\/]+$/, message: 'API必须有内容！' },
          { pattern: /^[\/]{1}[a-z]+$/, message: 'API只能包含小写字母！' },
          { pattern: /^[\/]{1}[a-z]{4,}$/, message: 'API长度至少为4位！' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        parent_node: '在线客服',
        sub_system: '业务管理系统',
        resources_type: '菜单',
        resources_visibility: '否'
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createResources(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateResources(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
