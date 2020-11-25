<template>
  <div class="app-container">
     <!--工具栏-->
   <!-- <div class="head-container"> -->
       <!-- <div v-if="crud.props.searchToggle">

          <el-input v-model="query.code" size="small" clearable placeholder="输入角色代码" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
 <el-input v-model="query.name" size="small" clearable placeholder="输入角色名" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />

        <date-range-picker v-model="query.createdTime" class="date-item" />
         <el-select
              v-model="query.enabled"
              clearable
              size="small"
              placeholder="状态"
              class="filter-item"
              style="width: 90px"
              @change="crud.toQuery"
            >
              <el-option
                v-for="item in enabledTypeOptions"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              />
            </el-select>
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div> -->
     <!-- 表单渲染 -->
    <!-- <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="520px">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">

          <el-form-item  label="角色代码" prop="code">
          <el-input v-model="form.code"  placeholder="请输入账号"  maxlength="20" suffix-icon="el-icon-edit" style="width: 380px;" clearable/>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" style="width: 380px;" suffix-icon="el-icon-edit" clearable   maxlength="20" />
        </el-form-item> -->
         <!-- <el-table-column width="120px" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column> -->

        <!-- <el-form-item label="角色级别" prop="level">
          <el-input-number v-model.number="form.level" :min="1" controls-position="right" style="width: 145px;" />
        </el-form-item> -->
        <!-- <el-form-item label="数据范围" prop="dataScope">
          <el-select v-model="form.dataScope" style="width: 140px" placeholder="请选择数据范围" @change="changeScope">
            <el-option
              v-for="item in dateScopes"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item v-if="form.dataScope === '自定义'" label="数据权限" prop="depts">
          <treeselect
            v-model="form.depts"
            :load-options="loadDepts"
            :options="depts"
            multiple
            style="width: 380px"
            placeholder="请选择"
          />
        </el-form-item> -->
        <!-- <el-form-item label="描述信息" prop="description">
          <el-input v-model="form.description" style="width: 380px;" rows="5" type="textarea" />
        </el-form-item> -->
      <!-- </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
 <el-row :gutter="15"> -->
      <!--角色管理-->
      <!-- <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
          </div>
          <el-table ref="table" v-loading="crud.loading" highlight-current-row style="width: 100%;" :data="crud.data"
           @selection-change="crud.selectionChangeHandler" @current-change="handleCurrentChanged">
            <el-table-column type="selection" width="55" />
            <el-table-column :show-overflow-tooltip="true"  prop="id" label="编号" />
            <el-table-column :show-overflow-tooltip="true"  prop="code" label="编码" />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="dataScope" label="数据权限" />

            <el-table-column :show-overflow-tooltip="true" prop="description" label="描述" />
            <el-table-column :show-overflow-tooltip="true" width="135px" prop="createdTime" label="创建日期">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createdTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column  v-permission="['admin','roles:edit','roles:del']" label="操作" width="130px" align="center" fixed="right">
              <template slot-scope="scope">
                <udOperation

                  :data="scope.row"
                  :permission="permission"
                />
              </template>
            </el-table-column>
          </el-table> -->
          <!--分页组件-->
          <!-- <pagination />
        </el-card>
      </el-col> -->
      <!-- 菜单授权 -->
      <!-- <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
              <span class="role-span">菜单分配</span>
            </el-tooltip>
            <el-button
              :disabled="!showButton"
              :loading="menuLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="saveMenu"
            >保存</el-button>
          </div>
          <el-tree
            class="tree-border"
            :data="resourceOptions"
            show-checkbox
            ref="tree"
            node-key="id"
            :default-checked-keys="temp.resourceIds"
            :default-expand-all="true"
            empty-text="加载中，请稍后"
            :props="defaultProps"
      />
        </el-card>
      </el-col> -->
    <!-- </el-row> -->

     <div class="filter-container">
      <el-input
        v-model="listQuery.code"
        style="width: 200px;"
        class="filter-item"
        placeholder="角色代码"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        style="width: 200px;"
        class="filter-item"
        placeholder="角色名"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        :loading="downloadLoading"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出
      </el-button>
    </div>

    <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50" align="center" label="ID" />
      <el-table-column width="180px" align="center" label="角色号">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="角色代码">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="角色名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色描述">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
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
      <el-table-column width="180px" align="center" label="数据范围">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.dataScope"
          >
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column width="90" align="center" label="修改人">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedBy }}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column width="90" align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.createdBy }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="320">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            修改
          </el-button>
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleAuth(scope.row.id)">
            菜单授权
          </el-button>
          <el-button type="danger" size="mini" @click="deleteRole(scope.row.id)">
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
        style="width: 80%; margin-left:30px;"
      >
        <el-form-item label="角色代码" prop="code">
          <el-input v-model="temp.code" placeholder="建议为角色名的英文，首字母大写" maxlength="60" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
        <el-form-item label="角色名" prop="name">
          <el-input v-model="temp.name" placeholder="请输入角色名" maxlength="40" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
        <el-form-item label="数据范围" prop="dataScope">
          <el-select
            v-model="temp.dataScope"
          >
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="temp.dataScope == 2" label="数据权限">
          <el-tree
            ref="tree"
            class="filter-tree"
            node-key="id"
            lazy
            show-checkbox
            empty-text="加载中，请稍后"
            :load="loadNodes"
            :data="treeDatas"
            :props="defaultProps"
            :default-checked-keys="temp.deptIds"
            :default-expand-all="true"
          />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="temp.description"
            type="textarea"
            :rows="2"
            maxlength="150"
            show-word-limit
            placeholder="请输入描述内容"
          />
        </el-form-item>
      </el-form>
      <!--对话框动作按钮-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">创建</el-button>
        <el-button v-else type="primary" @click="updateData">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="授权" :visible.sync="authFormVisible">
      <el-tree
       class="tree-border"
            :data="resourceOptions"
            show-checkbox
            ref="tree"
            node-key="id"
             :default-checked-keys="temp.resourceIds"
            :default-expand-all="true"
            empty-text="加载中，请稍后"
            :props="defaultProps"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateAuth">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import crudRole from '@/api/organization/role'
import { queryRole, changeRoleEnabled, createRole, updateRole, deleteRole, getRole } from '@/api/organization/role'
import {queryResource, getAllResources, fetchResourceByParentId, queryAllResource } from '@/api/organization/resource'
import { getAllDepts, fetchDeptByParentId, queryAllDept } from '@/api/organization/group'
import CRUD, { presenter, header, form, crud } from '../../../components/Crud/crud'
import rrOperation from '@/components/Crud/RR.operation'
import crudOperation from '@/components/Crud/CRUD.operation'
import udOperation from '@/components/Crud/UD.operation'
import pagination from '@/components/Crud/Pagination'
import Treeselect from '@riophae/vue-treeselect'
import waves from '@/directive/waves' // 水波纹指令
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import DateRangePicker from '@/components/DateRangePicker'

const defaultForm = { id: null, name: null, code:null, description: null }
export default {
  name: 'RoleManagement',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination },
  cruds() {
    return CRUD({ title: '角色', url: '/organization/role', crudMethod: { ...crudRole }})
  },
   mixins: [presenter(), header(), form(defaultForm), crud()],
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        deleted: 'info',
        ok: 'success'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
       showButton: false,
      currentId: 0,
      resourceOptions: [],
        enabledTypeOptions: [
        { key: 'true', display_name: '正常' },
        { key: 'false', display_name: '无效' }
      ],
       permission: {
        add: ['admin', 'roles:add'],
        edit: ['admin', 'roles:edit'],
        del: ['admin', 'roles:del']
      },
      // 部门列表
      deptOptions: [],
      list: [],
      total: 0,
      listLoading: true,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      // 数据范围选项
      dataScopeOptions: [
        {
          value: 1,
          label: '全部数据权限'
        },
        {
          value: 2,
          label: '自定数据权限'
        },
        {
          value: 3,
          label: '本部门数据权限'
        },
        {
          value: 4,
          label: '本部门及以下数据权限'
        },
        {
          value: 5,
          label: '仅本人数据权限'
        }
      ],
      listQuery: {
        status: 'ok',
        current: 1,
        size: 10
      },
      form: {
        parentId: undefined,
        id: undefined,
        name: '',
        code: '',
        type: '',
        url: '',
        method: '',
        dataScope: '',
        description: '',
        createdTime: '',
        createdBy: '',
        updatedTime: '',
        updatedBy: ''
      },
      // 树数据
      treeData: [],
      treeDatas: [],
      labelPosition: 'right',
      resourceList: [],
      groupList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dialogStatus: 'create',
      dialogFormVisible: false,
      authFormVisible: false,
      rules: {
        code: [{ required: true, message: '角色代码必填', trigger: 'blur' }],
        name: [{ required: true, message: '角色名必填', trigger: 'blur' }]
      },
      checkAll: false,
      resources: [],
      isIndeterminate: true,
      temp: {
        code: '',
        name: '',
        dataScope: 0,
        description: '',
        resourceIds: [],
        deptIds: []
      },
      downloadLoading: false
    }
  },
  created() {
    this.queryRole()
    this.getResources()
    this.getDept()
  },
  methods: {
 [CRUD.HOOK.afterRefresh]() {
      this.$refs.tree.setCheckedKeys([])
    },
    // 编辑前
    [CRUD.HOOK.beforeToEdit](crud, form) {
       this.$alert(form.id)
      // if (form.dataScope === '自定义') {
      //   if (form.id == null) {
      //     this.getDepts()
      //   } else {
      //     this.getSupDepts(form.depts)
      //   }
      // }
      // const depts = []
      // form.depts.forEach(function(dept) {
      //   depts.push(dept.id)
      // })
      // form.depts = depts
    },
     // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (crud.form.dataScope === '自定义' && crud.form.depts.length === 0) {
        this.$message({
          message: '自定义数据权限不能为空',
          type: 'warning'
        })
        return false
      } else if (crud.form.dataScope === '自定义') {
        const depts = []
        crud.form.depts.forEach(function(data) {
          const dept = { id: data }
          depts.push(dept)
        })
        crud.form.depts = depts
      } else {
        crud.form.depts = []
      }
      return true
    },
    [CRUD.HOOK.afterAddError](crud) {
      this.afterErrorMethod(crud)
    },
    [CRUD.HOOK.afterEditError](crud) {
      this.afterErrorMethod(crud)
    },
 /** 查询菜单树结构 */
    getResourceTree() {
      queryAllResource().then(response => {
        this.resourceOptions = response.data
      });
    },
    /**
       * 根据父节点id，查询子节点
       * @param parentId 父节点id
       */
    fetchResourceByParentId(parentId) {
      fetchResourceByParentId(parentId).then(response => {
        this.treeData = response.data
      })
        .catch(() => {
          console.log('超时')
        })
    },
    // 触发单选
    handleCurrentChanged(val) {
      if (val) {
        const _this = this
        // 清空菜单的选中
        this.$refs.tree.setCheckedKeys([])
        // 保存当前的角色id
        this.currentId = val.id
        // 初始化默认选中的key
        this.temp.resourceIds = []
        val.menus.forEach(function(data) {
          _this.temp.resourceIds.push(data.id)
        })
        this.showButton = true
      }
    },

    //  handleAuth(id) {
    //   this.getResourceTree()

    //   this.temp.id = id
    //   this.temp.resourceIds = []
    //   this.temp.deptIds = []

    //   this.fetchResourceByParentId('-1')
    //   this.authFormVisible = true

    //   getRole(id).then(response => {
    //     this.temp.resourceIds = response.data.resourceIds
    //     this.temp.deptIds = response.data.deptIds
    //   })
    //     .catch(() => {
    //       console.log('超时4')
    //     })
    // },
    /**
       * 根据父节点id，查询子节点
       * @param parentId 父节点id
       */
    fetchDeptByParentId(parentId) {
      fetchDeptByParentId(parentId).then(response => {
        this.treeDatas = response.data
      })
        .catch(() => {
          console.log('超时1')
        })
    },
    /**
       * 搜索node节点
       */
    filterNode() {
    },
    getCurrentKey(data) {

    },
    /**
       * 获取节点数据
       * @param data
       */
    getNodeData(currentData, isCheck) {
      if (!currentData.children.length && isCheck) {
        const currentCode = currentData.code
        const $current = Array.from(this.$refs.dataTree.$children).filter($child => { return $child.node.data.code === currentCode })[0]
        $current.$el.childNodes[0].childNodes[0].click()
      }
    },
    /**
       * 查询列表
       */
    queryRole() {
      this.listLoading = true
      queryRole(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
        .catch(() => {
          console.log('超时7')
        })
    },

    // 用户状态修改
    handleStatusChange(row) {
      const text = row.enabled === true ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.name + '"角色吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeRoleEnabled(row.id, row.enabled)
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
    handleFilter() {
      this.listQuery.current = 1
      this.queryRole()
    },
    /**
       * 资源列表
       */
    getResources() {
      getAllResources().then(response => {
        this.resourceList = response.data
      })
        .catch(() => {
          console.log('超时8')
        })
    },
    /**
       * 部门列表
       */
    getDept() {
      getAllDepts().then(response => {
        this.groupList = response.data
      })
    },

    /**
       * 修改每页显示条数
       */
    handleSizeChange(val) {
      this.listQuery.size = val
      this.queryRole()
    },
    /**
       * 跳转到指定页
       */
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.queryRole()
    },
    /**
       * 弹出新增角色对话框
       */
    handleCreate() {
      this.temp = {}
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
       * 新增角色
       */
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createRole(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '创建成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.queryRole()
          })
        }
      })
    },
    /**
       * 点击授权按钮
       */
    handleAuth(id) {
      this.getResourceTree()
      // this.fetchResourceByParentId('-1')
      this.temp.id = id
      this.temp.resourceIds = []
      this.temp.deptIds = []
      // 查询所有资源
      this.fetchResourceByParentId('-1')
      this.authFormVisible = true
      // 查询角色详细信息，拿到已授权的角色id
      getRole(id).then(response => {
        this.temp.resourceIds = response.data.resourceIds
        this.temp.deptIds = response.data.deptIds
      })
        .catch(() => {
          console.log('超时4')
        })
    },
    /**
       * 加载树数据
       * @param node 树节点
       * @param resolve
       *
       */
    loadNode(node, resolve) {
      fetchResourceByParentId(node.data.id).then(response => {
        resolve(response.data)
      })
        .catch(() => {
          console.log('超时2')
        })
    },
    /**
       * 加载树数据
       * @param node 树节点
       * @param resolve
       *
       */
    loadNodes(node, resolve) {
      fetchDeptByParentId(node.data.id).then(response => {
        resolve(response.data)
      })
        .catch(() => {
          console.log('超时5')
        })
    },
    /**
       * 更新权限
       */
    updateAuth() {
      const temp = {
        id: this.temp.id,
        resourceIds: this.$refs.tree.getCheckedKeys()
      }
      console.log(temp)

      updateRole(temp).then(() => {
        this.authFormVisible = false
        this.$notify({
          title: '权限编辑成功s',
          message: '权限编辑成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    /**
       * 点击更新按钮
       */
    handleUpdate(row) {
      this.temp = Object.assign({}, row)// copy obj
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.temp.deptIds = []
      this.fetchDeptByParentId('-1')
      getRole(row.id).then(response => {
        this.temp.deptIds = response.data.deptIds
      })
        .catch(() => {
          console.log('超时6')
        })
    },
    /**
       * 更新角色
       */
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.deptIds = this.$refs.tree.getCheckedKeys()
          updateRole(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '编辑成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
            this.queryRole()
          })
        }
      })
    },
    /**
       * 删除角色
       * @param id
       */
    deleteRole(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(id).then(() => {
          this.$notify({
            title: '删除成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.queryRole()
        })
      })
    },
    handleDownload() {
      console.log('download')
    }
  }
}
</script>

