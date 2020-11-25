<template>
  <div class="app-container">
    <div class="filter-container">
      <!--查询条件-->
      <el-input
        v-model="listQuery.username"
        style="width: 200px;"
        class="filter-item"
        placeholder="账号"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.mobile"
        style="width: 200px;"
        class="filter-item"
        placeholder="手机号"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        clearable
        style="width: 90px"
        class="filter-item"
        placeholder="账号状态"
      >
        <el-option
          v-for="item in userStatus"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>

      <!--动作按钮-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        :loading="downloadLoading"
        @click="handleDownload"
      >
        导出
      </el-button>
    </div>

    <!--列表-->
    <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50" align="center" label="ID" />
      <el-table-column width="180px" align="center" label="编号">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="账号">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="昵称">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column width="120px" label="是否已删除" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.deleted"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column> -->
      <el-table-column width="120px" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column width="120px" label="账号是否未过期" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.account_non_expired"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column width="120px" label="密码是否未过期" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.credentials_non_expired"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column width="120px" label="是否未锁定" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.account_non_locked"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column> -->
      <el-table-column width="160px" align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="修改人">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedBy }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.createdBy }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-permission="['admin']" type="primary" size="mini" @click="handleUpdate(scope.row.id)">
            修改
          </el-button>
          <el-button type="danger" size="mini" @click="deleteData(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--翻页工具条-->
    <div class="pagination-container">
      <el-pagination
        background
        :current-page="listQuery.current"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!--添加或编辑对话框-->
    <el-dialog title="新增/修改" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        status-icon
        style="width: 80%; margin-left:60px;"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="temp.username" placeholder="请输入账号" maxlength="20" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
        <el-form-item v-if="temp.id==undefined" label="密码" prop="password">
          <!--:disabled="dialogStatus=='edit'"-->
          <el-input
            v-model="temp.password"
            placeholder="请输入账号密码"
            maxlength="20"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="temp.nickname" placeholder="请输入昵称" maxlength="20" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="temp.mobile" placeholder="请输入手机号" maxlength="14" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" placeholder="请输入邮箱" maxlength="18" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select
            v-model="temp.roleIds"
            multiple
            clearable
            style="width: 100%;"
            placeholder="请选择角色"
            filterable
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="部门" prop="groups">
          <el-select
            v-model="temp.groupIds"
            multiple
            clearable
            style="width: 100%;"
            placeholder="请选择部门"
            filterable
            @visible-change="getDepts"
          >
            <el-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="positions">
          <el-select
            v-model="temp.positionIds"
            multiple
            clearable
            style="width: 100%;"
            placeholder="请选择职位"
            filterable
            @visible-change="getPositions"
          >
            <el-option
              v-for="item in positionList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="自我简介" prop="description">
          <el-input
            v-model="temp.description"
            :rows="5"
            type="textarea"
            maxlength="150"
            show-word-limit
            placeholder="请输入自我简介"
          />
        </el-form-item>
      </el-form>
      <!--对话框动作按钮-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">创建</el-button>
        <el-button v-if="dialogStatus=='edit'" type="primary" @click="updateData">修改</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { queryUser, getUser, createUser, updateUser, deleteUser, changeUserEnabled } from '@/api/organization/user'
import { getAllRoles } from '@/api/organization/role'
import { getAllPositions } from '@/api/organization/position'
import { getAllDepts } from '@/api/organization/group'
import permission from '@/directive/permission/index.js' // 权限判断指令
import waves from '@/directive/waves'

export default {
  name: 'UserManagement',
  directives: { permission },
  // 水波文效果
  directives: {
    waves
  },
  filters: {
    // 账号状态标签样式
    statusFilter(status) {
      const statusMap = {
        lock: 'danger',
        deleted: 'info',
        ok: 'success'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      downloadLoading: false,
      // 查询参数
      listQuery: {
        status: 'ok',
        current: 1,
        size: 10
      },
      // 账号状态
      userStatus: ['lock', 'deleted', 'ok'],
      roleList: [],
      groupList: [],
      positionList: [],
      dialogStatus: 'create',
      dialogFormVisible: false,
      // 表单校验规则
      rules: {
        username: [
          { required: true, message: '账号必填', trigger: 'blur' },
          { min: 3, max: 20, message: '账号长度在3到20个字符', trigger: 'blur' }
        ],
        mobile: [
          { max: 16, required: true, message: '手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        email: [
          { max: 18, message: '邮箱长度在不能超过18个字符', trigger: 'blur' },
          {
            type: 'email',
            message: "'请输入正确的邮箱地址",
            trigger: ['blur', 'change']
          }
        ],
        password: [
          { required: true, message: '账号密码为必填', trigger: 'blur' },
          { min: 6, max: 20, message: '账号密码长度在6到20个字符', trigger: 'blur' }
        ]
      },
      // 创建或修改账号临时对象
      temp: {}
    }
  },
  // 页面加载完成后显示列表页
  created() {
    this.queryUser()
    this.resetForm()
    this.getRoles()
  },
  methods: {
    /**
       * 账号列表
       */
    queryUser() {
      this.listLoading = true
      queryUser(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    /**
       * 角色列表
       */
    getRoles() {
      getAllRoles().then(response => {
        this.roleList = response.data
      })
    },
    /**
       * 职位列表
       */
    getDepts() {
      getAllDepts().then(response => {
        this.groupList = response.data
      })
    },
    /**
       * 职位列表
       */
    getPositions() {
      getAllPositions().then(response => {
        this.positionList = response.data
      })
    },
    // 查询过滤器
    handleFilter() {
      this.listQuery.current = 1
      this.queryUser()
    },
    /**
       * 修改每页显示条数
       */
    handleSizeChange(val) {
      this.listQuery.size = val
      this.queryUser()
    },
    /**
       * 跳转到指定页
       */
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.queryUser()
    },
    /**
       * 重置添加表单
       */
    resetForm() {
      this.temp = {
        username: '',
        nickname: '',
        password: '',
        roleIds: [],
        groupIds: [],
        positionIds: [],
        description: '',
        emial: '',
        mobile: ''
      }
    },
    // 账号状态修改
    handleStatusChange(row) {
      const text = row.enabled === true ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.nickname + '"账号吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeUserEnabled(row.id, row.enabled)
      }).then(() => {
        this.$notify({
          title: '编辑成功',
          message: '编辑成功',
          type: 'success',
          duration: 2000
        })
      }).catch(function() {
        row.enabled = row.enabled === false
      })
    },
    /**
       * 弹出创建账号表单
       */
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.resetForm()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
       * 创建账号
       */
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUser(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '创建成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.temp.roleIds = []
            this.temp.groupIds = []
            this.temp.positionIds = []
            this.queryUser()
          })
        }
      })
    },
    /**
       * 弹出修改账号表单
       */
    handleUpdate(id) {
      this.listLoading = true
      this.getRoles()
      this.getDepts()
      this.getPositions()
      getUser(id).then(response => {
        this.temp = response.data
        this.listLoading = false
        this.dialogStatus = 'edit'
        this.dialogFormVisible = true
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
       * 修改账号信息
       */
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateUser(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '编辑成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
            this.temp.roleIds = []
            this.temp.groupIds = []
            this.temp.positionIds = []
            this.queryUser()
          })
        }
      })
    },
    /**
       * 删除账号
       */
    deleteData(id) {
      this.$confirm('此操作将删除该账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        type: 'warning'
      }).then(() => {
        deleteUser(id).then(() => {
          this.$notify({
            title: '删除成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.queryUser()
        })
      })
    },
    /**
       * 重置账号密码
       */
    resetPass(id) {

    },
    /**
       * 导出列表
       */
    handleDownload() {
      console.log('download')
    }
  }
}
</script>

