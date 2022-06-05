<template>
  <div class="app-container">
    <div class="filter-container">
      <span>用户名：</span>
      <el-input v-model="listQuery.user_name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <span>工号：</span>
      <el-input v-model="listQuery.job_no" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <span>电话：</span>
      <el-input v-model="listQuery.phone_num" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <span>角色：</span>
      <el-select v-model="listQuery.role" placeholder="请选择" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in roleOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <!--<el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">-->
      <!--  <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />-->
      <!--</el-select>-->
      <!--<el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">-->
      <!--  <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />-->
      <!--</el-select>-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <br>
      <span>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
          添加
        </el-button>
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
          导出为Excel
        </el-button>
      </span>
      <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">-->
      <!--  reviewer-->
      <!--</el-checkbox>-->
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
      <el-table-column label="工号" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.job_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属公司" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.company }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属部门" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.department }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职位" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.position }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生日" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.birthday | parseTime('{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column label="DateXXXXX" width="150px" align="center">-->
      <!--  <template slot-scope="{row}">-->
      <!--    <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
      <!--  </template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="Title" min-width="150px">-->
      <!--  <template slot-scope="{row}">-->
      <!--    <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>-->
      <!--    <el-tag>{{ row.type | typeFilter }}</el-tag>-->
      <!--  </template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="Author" width="110px" align="center">-->
      <!--  <template slot-scope="{row}">-->
      <!--    <span>{{ row.author }}</span>-->
      <!--  </template>-->
      <!--</el-table-column>-->
      <!--<el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">-->
      <!--  <template slot-scope="{row}">-->
      <!--    <span style="color:red;">{{ row.reviewer }}</span>-->
      <!--  </template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="Imp" width="80px">-->
      <!--  <template slot-scope="{row}">-->
      <!--    <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon"/>-->
      <!--  </template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="Readings" align="center" width="95">-->
      <!--  <template slot-scope="{row}">-->
      <!--    <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>-->
      <!--    <span v-else>0</span>-->
      <!--  </template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="Status" class-name="status-col" width="100">-->
      <!--  <template slot-scope="{row}">-->
      <!--    <el-tag :type="row.status | statusFilter">-->
      <!--      {{ row.status }}-->
      <!--    </el-tag>-->
      <!--  </template>-->
      <!--</el-table-column>-->
      <el-table-column label="操作" align="center" width="330" class-name="small-padding fixed-width">
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
        <el-form-item label="工号" prop="job_no">
          <el-input v-model="temp.job_no" />
        </el-form-item>
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="temp.user_name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item label="所属公司">
          <el-select v-model="temp.company" class="filter-item" placeholder="请选择">
            <el-option v-for="item in companyOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-select v-model="temp.department" class="filter-item" placeholder="请选择">
            <el-option v-for="item in departmentOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="职位">
          <el-select v-model="temp.position" class="filter-item" placeholder="请选择">
            <el-option v-for="item in positionOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="temp.sex" class="filter-item" placeholder="请选择">
            <el-option v-for="item in sexOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker v-model="temp.birthday" type="datetime" placeholder="请选择生日" />
        </el-form-item>
        <el-form-item label="电话" prop="phone_num">
          <el-input v-model="temp.phone_num" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      <!--  <el-form-item label="Datehahahaha" prop="timestamp">-->
      <!--    <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date"/>-->
      <!--  </el-form-item>-->
      <!--  <el-form-item label="Title" prop="title">-->
      <!--    <el-input v-model="temp.title"/>-->
      <!--  </el-form-item>-->
      <!--  <el-form-item label="Status">-->
      <!--    <el-select v-model="temp.status" class="filter-item" placeholder="Please select">-->
      <!--      <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>-->
      <!--    </el-select>-->
      <!--  </el-form-item>-->
      <!--  <el-form-item label="Imp">-->
      <!--    <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;"/>-->
      <!--  </el-form-item>-->
      <!--  <el-form-item label="Remark">-->
      <!--    <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input"/>-->
      <!--  </el-form-item>-->
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
import { fetchList, fetchPv, createUser, updateUser } from '@/api/user-management'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '启用': 'success',
        // draft: 'info',
        '禁用': 'danger'
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
        user_name: undefined,
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      // 新加入
      roleOptions: ['会员', '测试人员', 'HR', '总管'],
      companyOptions: ['公司1', '公司2', '公司3', '公司4', '公司5'],
      departmentOptions: ['部门1', '部门2', '部门3', '部门4', '部门5', '部门6'],
      positionOptions: ['财务', '销售', '技术'],
      sexOptions: ['男', '女'],
      // 新加入end

      importanceOptions: [1, 2, 3],
      // calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['启用', '禁用'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        // status: 'published',
        // 新加入
        password: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        // 新加入
        user_name: [
          { required: true, message: '用户名不能为空！', trigger: ['change', 'blur'] },
          { message: '用户名不能全为空格！', trigger: ['blur', 'change'], whitespace: true }
        ],
        password: [
          { required: true, message: '密码不能为空！', trigger: 'blur' },
          { message: '密码长度必须在6到16之间！', min: 6, max: 12 },
          { message: '密码必须同时包含字母和数字！', pattern: /^(?=.*\d+)(?=.*[A-Za-z]+)[\w]{6,16}$/ }
        ],
        birthday: [
          { required: true, message: '生日不能为空！', trigger: 'blur' },
          { type: 'date', message: '必须为日期类型！', trigger: 'blur' }
        ],
        phone_num: [
          { required: true, message: '电话号不能为空！', trigger: 'blur' },
          { message: '电话号必须为11位', len: 11 },
          { message: '电话号必须为纯数字！', pattern: /\d{11}/ },
          { message: '电话号不合法！', pattern: /1[358]\d+/ }
        ],
        job_no: [
          { required: true, message: '工号不能为空！' },
          { min: 10, max: 10, message: '长度必须为10！' },
          { message: '必须为纯数字！', trigger: 'blur', pattern: /^\d+$/ }
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
        id: undefined,
        user_name: '',
        status: '启用',
        // 新加入
        company: '公司1',
        department: '部门1',
        position: '财务',
        sex: '男'
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
          createUser(this.temp).then(() => {
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
      // this.temp.timestamp = new Date(this.temp.timestamp)
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
          updateUser(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '修改成功！',
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
        message: '删除成功！',
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
