<template>
  <div class="app-container">
   <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
             <el-input
              v-model="query.code"
              clearable
              size="small"
              placeholder="角色代码"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
             <el-input
              v-model="query.name"
              clearable
              size="small"
              placeholder="角色名"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
            <rrOperation />
          </div>
          <crudOperation show=""  :permission="permission" />
        </div>

    <el-table  ref="table" v-loading="crud.loading"  :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">    <el-table-column type="index" width="50" align="center" label="ID" />
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="id" align="center" label="角色号" />
       <el-table-column prop="code" align="center" label="角色代码" />
      <el-table-column prop="name" align="center" label="角色名" />
      <el-table-column  :show-overflow-tooltip="true" prop="description" align="center" label="角色描述" />
      <el-table-column  width="120px" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column  :show-overflow-tooltip="true" width="180px" align="center" label="数据范围">
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
      <el-table-column  :show-overflow-tooltip="true" width="160px" align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column width="90" align="center" label="修改人">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedBy }}</span>
        </template>
      </el-table-column>
      <el-table-column  :show-overflow-tooltip="true" width="160px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column width="90" align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.createdBy }}</span>
        </template>
      </el-table-column>
      <el-table-column
     :show-overflow-tooltip="true"
            v-permission="['admin']"
            label="操作"
            width="115"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <udOperation
                :data="scope.row"
                :permission="permission"
              />
             </template>
          </el-table-column>
    </el-table>
    <!--翻页工具条-->
     <pagination />

    <!--添加或编辑对话框-->
   <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="65%">
       <el-form ref="form"  :model="form"
           label-position="right"  status-icon  style="width: 80%; margin-left:30px;"
          :rules="rules" label-width="120px" >
        <el-form-item label="角色代码" prop="code">
          <el-input v-model="form.code" placeholder="建议为角色名的英文，首字母大写" maxlength="60" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
        <el-form-item label="角色名" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名" maxlength="40" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
        <el-form-item label="数据范围" prop="dataScope">
          <el-select
            v-model="form.dataScope"
          >
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="form.dataScope == 2" label="数据权限">
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
            :default-checked-keys="form.deptIds"
            :default-expand-all="true"
          />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="form.description"
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
            <el-button type="text" @click="crud.cancelCU">取消</el-button>
            <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
          </div>
    </el-dialog>

    <el-dialog title="授权" :visible.sync="authFormVisible">
      <treeselect
                :normalizer="normalizer"
                :default-expend-level="1"
                v-model="temp.resourceIds"
                :options="resourceOptions"
                :show-count="true"
                :multiple="true"
                placeholder="选择资源"

              />
      <!-- <el-tree
       class="tree-border"
            :data="resourceOptions"
            show-checkbox
            ref="tree"
            node-key="id"
             :default-checked-keys="temp.resourceIds"
            :default-expand-all="true"
            empty-text="加载中，请稍后"
            :props="defaultProps"
      > -->

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
import { getAllDepts, fetchDeptByParentId, queryAllDept } from '@/api/organization/dept'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import Treeselect from '@riophae/vue-treeselect'
import { mapGetters } from 'vuex'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'

const defaultForm = { id: null, name: null, code:null, description: null }
export default {
  name: 'RoleManagement',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination },
   cruds() {
    return [
      CRUD({ title: '职位',  url: '/organization/position', crudMethod: { ...crudPosition },
            optShow: {
              add: true,
              edit: true,
              del: true,
              reset: true,
              download: false
            }})
    ]
  },
   mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
       height: document.documentElement.clientHeight - 180 + 'px;',
       showButton: false,
      currentId: 0,
      resourceOptions: [],
        enabledTypeOptions: [
        { key: 'true', display_name: '正常' },
        { key: 'false', display_name: '无效' }
      ],
       permission: {
        add: ['admin'],
        edit: ['admin'],
        del: ['admin']
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
   computed: {
    ...mapGetters([
      'position'
    ])
  },
  methods: {
 [CRUD.HOOK.afterRefresh]() {
      this.$refs.tree.setCheckedKeys([])
    },
    // 编辑前
    [CRUD.HOOK.beforeToEdit](crud, form) {

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
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children
      }
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

