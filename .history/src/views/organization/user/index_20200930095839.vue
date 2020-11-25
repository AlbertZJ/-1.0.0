<template>
  <div class="app-container">

 <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input v-model="deptName" placeholder="请输入部门名称" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 20px" />
        </div>
        <div class="head-container">
          <el-tree :data="groupList" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" default-expand-all @node-click="handleNodeClick" />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="listQuery" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="账号" prop="username">
            <el-input v-model="listQuery.username" placeholder="请输入账号" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="listQuery.nickname" placeholder="请输入昵称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="listQuery.mobile" placeholder="请输入手机号码" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
        v-model="listQuery.status"
        clearable
        style="width: 90px"
        class="filter-item"
        placeholder="账号状态"
      >    <el-option
          v-for="item in userStatus"
          :key="item"
          :label="item"
          :value="item"
        />
                </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <date-range-picker v-model="dateRange" class="date-item" />
            <!-- <el-date-picker v-model="dateRange" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker> -->
          </el-form-item>

          <el-form-item>
 <!-- <rrOperation /> -->
            <el-button style="background-color:#20B2AA;
  border-color: #20B2AA;
  color: #FFFFFF;" icon="el-icon-search" size="mini" @click="handleFilter">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>

          </el-form-item>
        </el-form>

         <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleCreate" v-hasPermi="['system:user:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="deleteData" v-hasPermi="['system:user:remove']">删除</el-button>
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['system:user:import']">导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:user:export']">导出</el-button>
          </el-col> -->
          <right-toolbar  :showSearch.sync="showSearch" @queryTable="getUserList"></right-toolbar>
        </el-row>

    <!--列表-->
    <el-table v-loading.body="listLoading" :data="list" @selection-change="handleSelectionChange" border fit highlight-current-row style="width: 100%">
      <el-table-column type="selection" v-if="showOptions" width="50" align="center"  label="ID" />
      <el-table-column width="180px" align="center"  label="编号">
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

      <el-table-column width="120px" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="handleStatusChange(scope.row)"
          />
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

      <el-table-column align="center" label="操作" width="180" class-name="small-padding fixed-width" >
        <template slot-scope="scope">
          <el-button v-permission="['admin']" type="primary" size="mini"  icon="el-icon-edit" @click="handleUpdate(scope.row)"  v-hasPermi="['system:user:edit']" >

          </el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteData(scope.row.id)"  v-hasPermi="['system:user:remove']" >

          </el-button>
        </template>
      </el-table-column>
    </el-table>
   <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getUserList" />
    </el-col>
 </el-row>
    <!--翻页工具条-->
    <!-- <div class="pagination-container">
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
    </div> -->

    <!--添加或编辑对话框-->
    <el-dialog title="新增/修改" :visible.sync="dialogFormVisible"  width="600px" append-to-body>
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-width="80px"
        status-icon
      >
      <el-row>
        <el-col :span="12">
 <el-form-item label="账号" prop="username">
          <el-input v-model="temp.username" placeholder="请输入账号" maxlength="20" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
        </el-col>
       <el-col :span="12">
  <el-form-item v-if="temp.id==undefined" label="密码" prop="password">
          <!--:disabled="dialogStatus=='edit'"-->
          <el-input
            v-model="temp.password"
            placeholder="请输入账号密码"
            maxlength="20"
            type="password"
            show-password
            clearable
          />
        </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="昵称" prop="nickname">
          <el-input v-model="temp.nickname" placeholder="请输入昵称" maxlength="20" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
        </el-col>
         <el-col :span="12">
            <el-form-item label="手机号" prop="mobile">
          <el-input v-model="temp.mobile" placeholder="请输入手机号" maxlength="14" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
        </el-col>
         <el-col :span="12">
           <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" placeholder="请输入邮箱" maxlength="18" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
        </el-col>
         <el-col :span="12">
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
        </el-col>
         <el-col :span="12">
           <el-form-item label="部门" prop="groups">
          <el-select
            v-model="temp.deptIds"
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
        </el-col>
         <el-col :span="12">
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
         </el-col>
         <el-col :span="12">
          <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="temp.idCard" placeholder="请输入身份证号" maxlength="20" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
         </el-col>
          <el-col :span="12">
          <el-form-item label="微信号" prop="wechatId">
          <el-input v-model="temp.wechatId" placeholder="请输入微信号" maxlength="20" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
         </el-col>

          <el-col :span="12">
            <!-- <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option v-for="dict in sexOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
              </el-select>
            </el-form-item> -->
         </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="description">
          <el-input
            v-model="temp.description"
            :rows="5"
            type="textarea"
            maxlength="150"
            show-word-limit
            placeholder="请输入备注"
          />
        </el-form-item>
         </el-col>
             </el-row>











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

import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
import rrOperation from '@/components/Crud/RR.operation'
// '@/components/Crud/crud/RR.operation'
import { queryUser, getUser, createUser, updateUser, deleteUser, changeUserEnabled } from '@/api/organization/user'
import { getAllRoles } from '@/api/organization/role'
import { getAllPositions } from '@/api/organization/position'
import { queryDept } from '@/api/organization/group'
import permission from '@/directive/permission/index.js' // 权限判断指令
import waves from '@/directive/waves'

export default {
  name: 'UserManagement',
  components:{rrOperation},
  //   cruds() {
  //   return CRUD({ title: '用户', url: 'api/users', crudMethod: { ...crudUser }})
  // },
  // mixins: [presenter(), header(), form(defaultForm), crud()],
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
       // 显示搜索条件
      showSearch: true,
      // 显示搜索条件
      showOptions: true,
      // 非多个禁用
      multiple: true,
      // 非单个禁用
      single: true,
      list: null,
       // 日期范围
      dateRange: [],
       // 部门名称
      deptName: undefined,
       // 部门树选项
      deptOptions: undefined,
       defaultProps: {
        children: "children",
        label: "label"
      },
      total: 0,
      listLoading: true,
      downloadLoading: false,
      groupQuery:{

      },
      // 查询参数
      listQuery: {
        status: 'ok',
        current: 1,
        size: 10
      },
      // 账号状态
      userStatus: ['lock', 'deleted', 'ok','blockUp'],
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
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  // 页面加载完成后显示列表页
  created() {
    this.getUserList()
    this.getDepts()
    this.resetForm()
    this.getRoles()
  },
  methods: {
    /**
       * 账号列表
       */
    getUserList() {
      this.listLoading = true
      queryUser(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total

      })
       this.listLoading = false
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.listQuery.deptId = data.id
      this.getUserList()
    },
     // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
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
       * 部门列表
       */
    getDepts() {
      queryDept(this.groupQuery).then(response => {
        this.groupList = response.data
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.listQuery.createdTimeStart = []
      this.listQuery.createdTimeEnd = []
      this.listQuery.deptId=""
      this.resetForm("queryForm")
      this.handleFilter()
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
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
      if(this.listQuery.status==="deleted"){
         this.showOptions=false
        this.listQuery.enabled="true"
        this.listQuery.deleted="Y"
        this.listQuery.accountNonLocked="true"
      }else if(this.listQuery.status==="lock"){
         this.showOptions=false
        this.listQuery.enabled="true"
        this.listQuery.deleted="N"
      this.listQuery.accountNonLocked="false"
      }else if(this.listQuery.status==="ok"){
         this.showOptions="true"
      this.listQuery.enabled="true"
        this.listQuery.deleted="N"
      this.listQuery.accountNonLocked="true"
      } if(this.listQuery.status==="blockUp"){
        this.showOptions=false
        this.listQuery.enabled="false"
        this.listQuery.deleted="N"
      this.listQuery.accountNonLocked="true"
      }

      this.listQuery.createdTimeStart = this.dateRange[0]
		  this.listQuery.createdTimeEnd = this.dateRange[1]
      this.listQuery.current = 1
      this.getUserList()
    },
    /**
       * 修改每页显示条数
       */
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getUserList()
    },
    /**
       * 跳转到指定页
       */
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getUserList()
    },
    /**
       * 重置添加表单
       */
    // resetForm() {
    //   this.temp = {
    //     username: '',
    //     nickname: '',
    //     password: '',
    //     roleIds: [],
    //     deptIds: [],
    //     positionIds: [],
    //     description: '',
    //     emial: '',
    //     mobile: ''
    //   }
    //   this.
    // },
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
            this.temp.deptIds = []
            this.temp.positionIds = []
            this.getUserList()
          })
        }
      })
    },
    // 表单重置
    reset() {
      this.temp = {
        id: undefined,
        deptId: undefined,
        username: '',
        nickname: undefined,
        password: undefined,
        mobile: undefined,
        email: undefined,
        sex: undefined,
        status: "ok",
        remark: undefined,
        deptIds: [],
        idCard:undefined,
        wechatId:undefined,
        roleIds: [],
        positionIds:[]
      };
      this.resetForm("temp");
    },
    /**
       * 弹出修改账号表单
       */
    handleUpdate(row) {
      this.listLoading = true
      this.reset()
      this.getRoles()
      this.getDepts()
      this.getPositions()
      const id=row.id||this.ids
      getUser(id).then(response => {
        this.temp = response.data
        this.dialogStatus = 'edit'
        this.dialogFormVisible = true
      })
      this.listLoading = false
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
            this.temp.deptIds = []
            this.temp.positionIds = []
            this.getUserList()
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
          this.getUserList()
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

