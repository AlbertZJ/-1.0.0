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
      <crudOperation show="" :permission="permission" />
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
            <el-table-column type="index" width="50" align="center" label="ID" />
            <!-- <el-table-column prop="id" align="center" label="编号" /> -->
            <el-table-column prop="code" align="center" label="权限字符" />
            <el-table-column prop="name" align="center" label="角色名称" />
            <el-table-column :show-overflow-tooltip="true" prop="description" align="center" label="角色描述" />
            <el-table-column width="120px" label="状态" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enabled"
                  @change="handleStatusChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" width="180px" align="center" label="数据范围">
              <template slot-scope="scope">
                <treeselect
                  v-model="scope.row.depts"
                  :normalizer="normalizer"
                  :default-expend-level="1"
                  :options="deptOptions"
                  :show-count="true"
                  :multiple="true"
                  placeholder="选择部门"
                />
              </template>
            </el-table-column>

            <el-table-column :show-overflow-tooltip="true" width="160px" align="center" label="修改时间">
              <template slot-scope="scope">
                <span>{{ scope.row.updatedTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
              </template>
            </el-table-column>
            <el-table-column width="90" align="center" label="修改人">
              <template slot-scope="scope">
                <span>{{ scope.row.updatedBy }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" width="160px" align="center" label="创建时间">
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
              v-permission="['admin']"
              :show-overflow-tooltip="true"
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

          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
          <el-checkbox v-model="resourceCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
          <el-tree
            ref="menu"
            class="tree-border"
            :data="menus"
            show-checkbox
            node-key="id"
            accordion
            :check-strictly="!resourceCheckStrictly"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          />
        </el-card>
      </el-col>
    </el-row>

    <!--添加或编辑对话框-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="权限字符" prop="code">
          <el-input v-model="form.code" placeholder="建议为角色名称的英文，首字母大写" maxlength="60" suffix-icon="el-icon-edit" clearable />
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
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="form.dataScope == '2'" label="数据权限" prop="depts">
          <treeselect
            v-model="form.depts"
            :normalizer="normalizer"
            :default-expend-level="1"
            :options="deptOptions"
            :show-count="true"
            :multiple="true"
             :noOptionsText="暂无数据"
                  :noResultsText="暂无该选项"
            placeholder="选择部门"
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

  </div>
</template>

<script>

import crudRole from '@/api/organization/role'
import { changeRoleEnabled,  getRole } from '@/api/organization/role'
import { queryResource } from '@/api/organization/resource'
import { queryDept } from '@/api/organization/dept'
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

const defaultForm = { id: '', name: '', depts: [], resources: [], code: '', description: '', roleSort: 0, enabled: true, resourceCheckStrictly: true,
  deptCheckStrictly: true }
export default {
  name: 'RoleManagement',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination },
  cruds() {
    return [
      CRUD({ title: '角色', url: '/organization/role', crudMethod: { ...crudRole },
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
      currentId: 0,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      resourceCheckStrictly: true,
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
      resourceOptions: [], menus: [], menuIds: [],
      menuLoading: false, showButton: false,
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
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rules: {
        code: [{ required: true, message: '权限字符必填', trigger: 'blur' }],
        name: [{ required: true, message: '角色名称必填', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getResources()
    this.getDept()
  },
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  methods: {
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type == 'menu') {
        this.resourceCheckStrictly = !!value
      } else if (type == 'dept') {
        this.form.deptCheckStrictly = !!value
      }
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == 'menu') {
        const treeList = this.menus
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value
        }
      } else if (type == 'dept') {
        const treeList = this.deptOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menus : [])
      } else if (type == 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : [])
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
        // this.menuIds = response.data.resourceIds
          this.$refs.menu.setCheckedKeys(response.data.resources)
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
    // 改变数据
    update() {
      // 无刷新更新 表格数据
      crudRole.get(this.currentId).then(res => {
        for (let i = 0; i < this.crud.data.length; i++) {
          if (res.id === this.crud.data[i].id) {
            this.crud.data[i] = res
            break
          }
        }
      })
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getHalfCheckedKeys()
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.menu.getCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    // 保存菜单
    saveMenu() {
      this.menuLoading = true
      const role = { id: this.currentId, resources: [] }
      // 得到已选中的 key 值
      role.resources = this.getMenuAllCheckedKeys()
      crudRole.editMenu(role).then((response) => {
        if (response.code == '000000') {
          this.crud.notify(response.mesg, CRUD.NOTIFICATION_TYPE.SUCCESS)
        } else {
          this.crud.notify(response.mesg, CRUD.NOTIFICATION_TYPE.WARNING)
        }
        // this.crud.notify('保存成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.menuLoading = false
        this.update()
      }).catch(err => {
        this.menuLoading = false
        console.log(err.response.data.message)
      })
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
    }
  }
}
</script>

