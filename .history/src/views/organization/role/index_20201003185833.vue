<template>
  <div class="app-container">
     <!--工具栏-->
   <div class="head-container">
       <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
          <el-input v-model="query.name" size="small" clearable placeholder="输入名称或者描述搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />

        <!-- <date-range-picker v-model="query.createdTime" class="date-item" /> -->
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
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
        ref="tree"
        class="filter-tree"
        node-key="id"
        lazy
        show-checkbox
        empty-text="加载中，请稍后"
        :load="loadNode"
        :data="treeData"
        :props="defaultProps"
        :default-checked-keys="temp.resourceIds"
        :default-expand-all="true"
      />
      <!-- :default-expand-all="true" -->
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
import { getAllResources, fetchResourceByParentId, queryAllResource } from '@/api/organization/resource'
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

const defaultForm = { id: null, name: null, code:null, description: null, dataScope: '全部', level: 3 }
export default {
  name: 'RoleManagement',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination },
  cruds() {
    return CRUD({ title: '角色', url: '/organization/role', crudMethod: { ...crudRole }})
  },
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
        label: 'name'
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

