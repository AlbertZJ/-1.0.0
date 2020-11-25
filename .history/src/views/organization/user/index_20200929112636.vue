<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--侧边部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input v-model="deptName"  placeholder="请输入部门名称" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 20px" />
        </div>
        <div class="head-container">
          <el-tree :data="deptDatas"   :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" default-expand-all @node-click="handleNodeClick" />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :xs="15" :sm="18" :md="19" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <el-input
              v-model="query.username"
              clearable
              size="small"
              placeholder="请输入账号"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
            <el-input
              v-model="query.nickname"
              clearable
              size="small"
              placeholder="请输入昵称"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
            <el-input
              v-model="query.mobile"
              clearable
              size="small"
              placeholder="请输入手机号码"
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
            <el-select
              v-model="query.deleted"
              clearable
              size="small"
              placeholder="删除"
              class="filter-item"
              style="width: 90px"
              @change="crud.toQuery"
            >
              <el-option
                v-for="item in deletedTypeOptions"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              />
            </el-select>
 <el-select
              v-model="query.accountNonLocked"
              clearable
              size="small"
              placeholder="锁定"
              class="filter-item"
              style="width: 90px"
              @change="crud.toQuery"
            >
              <el-option
                v-for="item in accountNonLockedTypeOptions"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              />
            </el-select>
            <rrOperation />
          </div>
          <crudOperation show="" :permission="permission" />
        </div>
        <!--表单渲染-->
        <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="570px">
          <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="66px">
            <el-form-item label="账号" prop="username">
              <el-input v-model="form.username" />
            </el-form-item>
             <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" />
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
              <el-input v-model.number="form.mobile" />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="form.nickname" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" />
            </el-form-item>
           <el-form-item label="部门" prop="depts">
              <treeselect

                v-model="form.depts"
                :options="deptDatas"
                :show-count="true"
                :multiple="true"
                style="width: 178px"
                placeholder="选择部门"
              />
            </el-form-item>

          <!--    <el-form-item label="岗位" prop="positions">
              <el-select
                v-model="form.positions"
                style="width: 178px"
                multiple
                placeholder="请选择"
                @remove-tag="deleteTag"
                @change="changePosition"
              >
                <el-option
                  v-for="item in positions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>   -->
              <el-form-item label="性别">
              <el-radio-group v-model="form.sex" style="width: 218px">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
                 <el-radio label="未知">未知</el-radio>
              </el-radio-group>
            </el-form-item>
             <!-- <el-form-item label="状态">
              <el-radio-group v-model="form.enabled" :disabled="form.id === user.id">
                <el-radio
                  v-for="item in dict.user_status"
                  :key="item.id"
                  :label="item.value"
                >{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item> -->

              <el-form-item style="margin-bottom: 0;" label="角色" prop="roles">
              <el-select
                v-model="form.roles"
                style="width: 437px"
                multiple
                placeholder="请选择"
                @remove-tag="deleteTag"
                @change="changeRole"
              >
                <el-option
                  v-for="item in roles"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="crud.cancelCU">取消</el-button>
            <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
          </div>
        </el-dialog>
        <!--表格渲染-->
        <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
          <el-table-column  type="selection" width="55" />
           <el-table-column :show-overflow-tooltip="true" prop="id" label="用户名" />
          <el-table-column :show-overflow-tooltip="true" prop="username" label="用户名" />
          <el-table-column :show-overflow-tooltip="true" prop="nickname" label="昵称" />
          <el-table-column prop="sex" label="性别" />
          <el-table-column :show-overflow-tooltip="true" prop="mobile" width="100" label="电话" />
          <el-table-column :show-overflow-tooltip="true" width="135" prop="email" label="邮箱" />

          <el-table-column label="状态" align="center" prop="enabled">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enabled"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                @change="changeEnabled(scope.row, scope.row.enabled)"
              />
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="createdTime" width="135" label="创建日期">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createdTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-permission="['admin','user:edit','user:del']"
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
        <!--分页组件-->
        <pagination />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crudUser from '@/api/organization/user'
import { isvalidPhone } from '@/utils/validate'
import { getDepts, getDeptSuperior } from '@/api/organization/group'
import { getAllRoles} from '@/api/organization/role'
import { getAllPositions } from '@/api/organization/position'
import CRUD, { presenter, header, form, crud } from '../../../components/Crud/crud'
import rrOperation from '@/components/Crud/RR.operation'
import crudOperation from '@/components/Crud/CRUD.operation'
import udOperation from '@/components/Crud/UD.operation'
import pagination from '@/components/Crud/Pagination'
import Treeselect from '@riophae/vue-treeselect'
import { mapGetters } from 'vuex'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
let userRoles = []
let userPositions = []
const defaultForm = { id: null, username: null, nickname: null, sex: '男', email: null, enabled: 'true', roles: [], positions: [], depts: [], mobile: null }
export default {
  name: 'User',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination },
  cruds() {
    return CRUD({ title: '用户',  url: '/organization/user/conditions', crudMethod: { ...crudUser }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ['user_status'],
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
groupQuery:{

      },
      height: document.documentElement.clientHeight - 180 + 'px;',
      deptName: '',  deptDatas: [], positions: [], level: 3, roles: [],
      defaultProps: { children: 'children', label: 'label' },
      permission: {
        add: ['admin', 'user:add'],
        edit: ['admin', 'user:edit'],
        del: ['admin', 'user:del']
      },
      enabledTypeOptions: [
        { key: 'true', display_name: '正常' },
        { key: 'false', display_name: '无效' }
      ],
      accountNonLockedTypeOptions: [
        { key: 'true', display_name: '激活' },
        { key: 'false', display_name: '锁定' }
      ],
      deletedTypeOptions: [
        { key: 'N', display_name: '未删除' },
        { key: 'Y', display_name: '已删除' }
      ],
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 20, message: '账号长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '账号密码为必填', trigger: 'blur' },
          { min: 8, max: 20, message: '账号密码长度在8到20个字符', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        mobile: [
          { required: true, trigger: 'blur', validator: validPhone }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
   watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getDepts()
    // this.$alert(this.crud.cancelCU)
    this.crud.msg.add = '新增成功，默认密码：123456789'
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    changeRole(value) {
      userRoles = []
      value.forEach(function(data, index) {
        const role = { id: data }
        userRoles.push(role)
      })
    },
     /**
       * 部门列表
       */
    getDepts() {
      getDepts(this.groupQuery).then(response => {
        this.deptDatas = response.data
      })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    changePosition(value) {
      userPositions = []
      value.forEach(function(data, index) {
        const position = { id: data }
        userPositions.push(position)
      })
    },
    [CRUD.HOOK.afterAddError](crud) {
      this.afterErrorMethod(crud)
    },
    [CRUD.HOOK.afterEditError](crud) {
      this.afterErrorMethod(crud)
    },
    afterErrorMethod(crud) {
      // 恢复select
      const initRoles = []
      const initPositions = []
      userRoles.forEach(function(role, index) {
        initRoles.push(roles)
      })
      userPositions.forEach(function(position, index) {
        initPositions.push(positions)
      })
      crud.form.roles = initRoles
      crud.form.positions = initPositions
    },
    deleteTag(value) {
      userRoles.forEach(function(data, index) {
        if (data.id === value) {
          userRoles.splice(index, value)
        }
      })
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.getRoles()
      if (form.id == null) {
        this.getDepts()
      } else {
        this.getSupDepts(form.depts)
      }
      this.getRoleLevel()
      this.getPositions()
      form.enabled = form.enabled.toString()
    },
    // 打开编辑弹窗前做的操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.getPositions(this.form.depts)
      userRoles = []
      userPositions = []
      const roles = []
      const positions = []
      form.roles.forEach(function(role, index) {
        roles.push(roles)
        // 初始化编辑时候的角色
        const rol = { id: roles }
        userRoles.push(rol)
      })
      form.positions.forEach(function(position, index) {
        positions.push(positions)
        // 初始化编辑时候的岗位
        const data = { id: positions }
        userPositions.push(data)
      })
      form.roles = roles
      form.positions = positions
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (!crud.form.depts) {
        this.$message({
          message: '部门不能为空',
          type: 'warning'
        })
        return false
      } else if (crud.form.positions.length === 0) {
        this.$message({
          message: '岗位不能为空',
          type: 'warning'
        })
        return false
      } else if (crud.form.roles.length === 0) {
        this.$message({
          message: '角色不能为空',
          type: 'warning'
        })
        return false
      }
      crud.form.roles = userRoles
      crud.form.positions = userPositions
      return true
    },
    // 切换部门
    handleNodeClick(data) {
      if (data.parentId === 0) {
        this.query.depts = null
      } else {
        this.query.depts = data.id
      }
      this.crud.toQuery()
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将改变"'  + data.username + '账号, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudUser.edit(data).then(res => {
          this.crud.notify( '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(() => {
          data.enabled = !data.enabled
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    // 获取弹窗内角色数据
    getRoles() {
      getAllRoles().then(res => {
        this.roles = res.data
      }).catch(() => { })
    },
    // 获取弹窗内岗位数据
    getPositions() {
      getAllPositions().then(res => {
        this.positions = res.data
      }).catch(() => { })
    },
    // 获取权限级别
    getRoleLevel() {
      // getLevel().then(res => {
      //   this.level = res.level
      // }).catch(() => { })
    },
    checkboxT(row, rowIndex) {
      return row.id !== this.user.id
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
</style>
