<template>
  <div class="app-container">
   <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
             <el-input
              v-model="query.code"
              clearable
              size="small"
              placeholder="权限字符"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
             <el-input
              v-model="query.name"
              clearable
              size="small"
              placeholder="角色名称"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
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
          <crudOperation show=""  :permission="permission" />
        </div>

 <el-row :gutter="15">
      <!--角色管理-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
          </div>
   <el-table ref="table" v-loading="crud.loading" highlight-current-row style="width: 100%;" :data="crud.data" @selection-change="crud.selectionChangeHandler" @current-change="handleCurrentChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column  type="index" width="50" align="center" label="ID" />
      <!-- <el-table-column prop="id" align="center" label="编号" /> -->
       <el-table-column prop="code" align="center" label="权限字符" />
      <el-table-column prop="name" align="center" label="角色名称" />
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
      </el-card>
      </el-col>
       <!-- 菜单授权 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
              <span class="role-span">菜单分配</span>
            </el-tooltip>
            <el-button
              v-permission="['admin']"
              :disabled="!showButton"
              :loading="menuLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="saveMenu"
            >保存</el-button>
          </div>
          <!-- <div style="height:650px;">

           <treeselect
                :normalizer="normalizer"
                :default-expend-level="1"
                v-model="menuIds"
                :options="menus"
                :show-count="true"
                :multiple="true"
                placeholder="选择资源"
                alwaysOpen
                :max-height="600"
              />

          </div> -->
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
          <el-checkbox v-model="menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>

              <el-tree
            class="tree-border"
            :data="menus"
            show-checkbox
            ref="menu"
            node-key="id"
             :default-checked-keys="menuIds"
             :check-strictly="!menuCheckStrictly"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
          <!-- <el-tree
            ref="menu"
            lazy
            :data="menus"
            :default-checked-keys="menuIds"
            :load="getMenuDatas"
            :props="defaultProps"
            check-strictly
            accordion
            show-checkbox
            node-key="id"
            @check="menuChange"
          /> -->
        </el-card>
      </el-col>
    </el-row>

    <!--添加或编辑对话框-->
   <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title"  width="500px">
      <el-form ref="form"  :model="form" :rules="rules"  label-width="80px">
        <el-form-item label="权限字符" prop="code">
          <el-input v-model="form.code" placeholder="建议为角色名称的英文，首字母大写" maxlength="60" suffix-icon="el-icon-edit"  clearable />
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" maxlength="40" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
         <el-form-item label="显示顺序" prop="roleSort">
          <el-input-number v-model="form.roleSort" controls-position="right" :min="0" />
        </el-form-item>
         <el-form-item label="状态" prop="enabled">
                      <template slot-scope="scope">
                <el-switch
                  v-model="form.enabled"
                  :disabled="formRead"
                  @change="handleStatusChange(scope.row)"
                />
              </template>
                      </el-form-item>
         <el-form-item label="权限范围">
          <el-select v-model="form.dataScope">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限"  v-show="form.dataScope == 2" >
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
          <el-checkbox v-model="deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">父子联动</el-checkbox>
             <el-tree
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            ref="dept"
            node-key="id"
            :check-strictly="!deptCheckStrictly"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <!-- <el-form-item label="数据范围" prop="dataScope">
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
        </el-form-item> -->
        <!-- <el-form-item v-show="form.dataScope == 2" label="数据权限">
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
        </el-form-item> -->
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
import { queryRole, changeRoleEnabled, createRole, updateRole,  getRole } from '@/api/organization/role'
import {queryResource, getAllResources, fetchResourceByParentId, queryAllResource } from '@/api/organization/resource'
import { queryDept, fetchDeptByParentId } from '@/api/organization/dept'
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

const defaultForm = { id: '', name: '', depts: [], resources: [], code: '', description: '', roleSort: 0, enabled: true,  menuCheckStrictly: true,
		deptCheckStrictly: true}
export default {
  name: 'RoleManagement',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination },
   cruds() {
    return [
      CRUD({ title: '角色',  url: '/organization/role', crudMethod: { ...crudRole },
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
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: false,
      deptNodeAll: false,
      menuCheckStrictly: true, deptCheckStrictly: true,
       // 查询参数
      queryParams: {
        name: undefined,
        visible: undefined
      },
 // 查询参数
      queryDeptParams: {
       name: undefined,
        enabled: undefined
      },
       height: document.documentElement.clientHeight - 180 + 'px;',
      resourceOptions: [],menus: [],menuIds: [],
      menuLoading: false,showButton: false,
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
        code: [{ required: true, message: '权限字符必填', trigger: 'blur' }],
        name: [{ required: true, message: '角色名称必填', trigger: 'blur' }]
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

    this.getResources()
    this.getDept()
  },
   computed: {
    ...mapGetters([
      'position'
    ])
  },
  methods: {
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {

      if (type == 'menu') {
        this.form.menuCheckStrictly = value ? true: false;
      } else if (type == 'dept') {
        this.form.deptCheckStrictly = value ? true: false;
      }
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == 'menu') {
        let treeList = this.menus;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
        }
      } else if (type == 'dept') {
        let treeList = this.deptOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menus: []);
      } else if (type == 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions: []);
      }
    },
     [CRUD.HOOK.afterRefresh]() {
      this.$refs.menu.setCheckedKeys([])
    },
    // 触发单选
    handleCurrentChange(val) {
      if (val) {
        // 清空菜单的选中
        this.$refs.menu.setCheckedKeys([])
        // 保存当前的角色id
        this.currentId = val.id
        // 初始化默认选中的key
        this.menuIds = []
         // 查询角色详细信息，拿到已授权的角色id
      getRole(this.currentId).then(response => {
        this.menuIds = response.data.resourceIds

      })
        .catch(() => {
          console.log('超时4')
        })
        // val.menus.forEach(function(data) {
        //    this.$alert("you6"+data.id)
        //   this.menuIds.push(data.id)
        // })
        this.showButton = true
      }
    },
     menuChange(menu) {
      // 判断是否在 menuIds 中，如果存在则删除，否则添加
      const index = this.menuIds.indexOf(menu.id)
      if (index !== -1) {
        this.menuIds.splice(index, 1)
      } else {
        this.menuIds.push(menu.id)
      }
    },
     getMenuDatas(node, resolve) {
      setTimeout(() => {
        getMenusTree(node.data.id ? node.data.id : 0).then(res => {
          resolve(res)
        })
      }, 100)
    },
     // 改变数据
    update() {
      // 无刷新更新 表格数据
      crudRoles.get(this.currentId).then(res => {
        for (let i = 0; i < this.crud.data.length; i++) {
          if (res.id === this.crud.data[i].id) {
            this.crud.data[i] = res
            break
          }
        }
      })
    },
 // 保存菜单
    saveMenu() {
      this.menuLoading = true
      const role = { id: this.currentId, menus: [] }
      // 得到已选中的 key 值
      this.menuIds.forEach(function(id) {
        const menu = { id: id }
        role.menus.push(menu)
      })
      crudRoles.editMenu(role).then(() => {
        this.crud.notify('保存成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.menuLoading = false
        this.update()
      }).catch(err => {
        this.menuLoading = false
        console.log(err.response.data.message)
      })
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
    /**
       * 资源列表
       */
    getResources() {
      queryResource(this.queryParams).then(response => {
        this.menus = response.data
      })
        .catch(() => {
          console.log('超时8')
        })
    },
    /**
       * 部门列表
       */
    getDept() {
       queryDept(this.queryDeptParams).then(response => {
        this.deptOptions = response.data
      })
        .catch(() => {
          console.log('超时8')
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

    handleDownload() {
      console.log('download')
    }
  }
}
</script>

