<template>
  <div class="app-container">
    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div slot="tip" class="el-upload__tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div slot="tip" class="el-upload__tip" style="color:red">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-row :gutter="20">

      <!--侧边部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input v-model="deptName" placeholder="请输入部门名称" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 20px" />
        </div>
        <div class="head-container">
          <el-tree ref="tree" :data="deptDatas" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" default-expand-all @node-click="handleNodeClick" />
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
          <span class="crud-opts-left">
            <el-button type="info" icon="el-icon-upload2" class="filter-item" size="mini" @click="handleImport">导入</el-button>
          </span>
        </div>
        <!--表单渲染-->
        <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="570px">
          <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="50px">
            <el-form-item v-if="form.id==undefined" label="账号" prop="username">
              <el-input v-model="form.username" placeholder="请输入账号" maxlength="20" suffix-icon="el-icon-edit" clearable />
            </el-form-item>
            <el-form-item v-if="form.id==undefined" label="密码" prop="password">
              <el-input
                v-model="form.password"
                placeholder="请输入密码"
                type="password"
                show-password
                clearable
                maxlength="20"
              />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="form.nickname" placeholder="请输入昵称" suffix-icon="el-icon-edit" clearable maxlength="20" />
            </el-form-item>
            <el-form-item label="部门" prop="depts">
              <treeselect
                v-model="form.depts"
                :normalizer="normalizer"
                :default-expend-level="1"
                :options="deptDatas"
                :show-count="true"
                :multiple="true"

                placeholder="选择部门"
              />
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
              <el-input v-model.number="form.mobile" placeholder="请输入电话" suffix-icon="el-icon-edit" clearable maxlength="20" />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" suffix-icon="el-icon-edit" clearable maxlength="20" />
            </el-form-item>
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="form.idCard" placeholder="请输入身份证号" suffix-icon="el-icon-edit" clearable maxlength="20" />
            </el-form-item>

            <el-form-item label="性别">
              <el-radio-group v-model="form.sex" style="width: 200px">
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
            <el-form-item style="margin-bottom: 0;" label="岗位" prop="roles">
              <el-select
                v-model="form.positions"
                style="width: 178px"
                multiple
                clearable
                placeholder="请选择"
                filterable
              >
                <el-option
                  v-for="item in positions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item style="margin-bottom: 0;" label="角色" prop="roles">
              <el-select
                v-model="form.roles"
                style="width: 178px"
                multiple
                clearable
                placeholder="请选择"
                filterable
              >
                <el-option
                  v-for="item in roles"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="备注">

              <el-input
                v-model="form.description"
                style="width:450px;"
                :rows="5"
                type="textarea"
                maxlength="150"
                show-word-limit
                placeholder="请输入备注"
              />
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="crud.cancelCU">取消</el-button>
            <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
          </div>
        </el-dialog>
        <!--表格渲染-->
        <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
          <el-table-column type="selection" width="55" />
 <el-table-column  fixed type="index" width="50" align="center" label="ID" />
          <!-- <el-table-column :show-overflow-tooltip="true" prop="id" label="编号" /> -->
          <el-table-column :show-overflow-tooltip="true" prop="username" label="账号" />
          <el-table-column :show-overflow-tooltip="true" prop="nickname" label="昵称" />
          <el-table-column prop="sex" label="性别" />
          <el-table-column :show-overflow-tooltip="true" prop="mobile" width="100" label="电话" />
          <el-table-column :show-overflow-tooltip="true" width="135" prop="email" label="邮箱" />

          <el-table-column width="120px" label="状态" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enabled"
                @change="handleStatusChange(scope.row)"
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
              <el-button size="mini" type="text" icon="el-icon-key" @click="handleResetPwd(scope.row)">重置</el-button>
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

import { getToken } from '@/utils/auth'
import crudUser from '@/api/organization/user'
import { resetUserPwd, exportUser, importTemplate, changeUserEnabled } from '@/api/organization/user'
import { isvalidPhone } from '@/utils/validate'
import { getDepts, getDeptSuperior } from '@/api/organization/dept'
import { getAllRoles } from '@/api/organization/role'
import { getAllPositions } from '@/api/organization/position'
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
const userRoles = []
let userPositions = []
const defaultForm = { id: null, username: null, nickname: null, sex: '男', email: null, enabled: 'true', roles: [], positions: [], depts: [], mobile: null }
export default {
  name: 'UserManagement',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination },
  cruds() {
    return CRUD({ title: '用户', url: '/organization/user', crudMethod: { ...crudUser }})
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
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/organization/user/excel/importData'
      },
      deptQuery: {

      },
      height: document.documentElement.clientHeight - 180 + 'px;',
      deptName: '', deptDatas: [], positions: [], level: 3, roles: [],
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
          { message: '请输入邮箱地址', trigger: 'blur' },
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
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getDepts()
    this.crud.msg.add = '新增成功，默认密码：123456789'
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    /**
       * 部门列表
       */
    getDepts() {
      getDepts(this.deptQuery).then(response => {
        this.deptDatas = this.handleTree(response.data, 'id')
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
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '用户导入'
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        this.download(response.msg)
      })
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true })
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
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
        initRoles.push(role.id)
      })
      userPositions.forEach(function(position, index) {
        initPositions.push(position.id)
      })
      crud.form.roles = initRoles
      crud.form.positions = initPositions
    },
    // deleteTag(value) {
    //   userRoles.forEach(function(data, index) {
    //     if (data.id === value) {
    //       userRoles.splice(index, value)
    //     }
    //   })
    // },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.getRoles()
      this.getPositions()
      if (form.id == null) {
        this.getDepts()
      } else {
        this.getSupDepts(form.depts)
      }
      this.getRoleLevel()
      form.enabled = form.enabled.toString()
    },
    // 打开编辑弹窗前做的操作
    // [CRUD.HOOK.beforeToEdit](crud, form) {
    //   this.getPositions(this.form.depts)
    //   userRoles = []
    //   userPositions = []
    //   const roles = []
    //   const positions = []
    //   form.roles.forEach(function(role, index) {
    //     roles.push(role.id)
    //     // 初始化编辑时候的角色
    //     const rol =  role.id
    //     userRoles.push(rol)
    //   })
    //   form.positions.forEach(function(position, index) {
    //     positions.push(position.id)
    //     // 初始化编辑时候的岗位
    //     const data = { id: position.id }
    //     userPositions.push(data)
    //   })
    //   form.roles = roles
    //   form.positions = positions
    // },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      // if (!crud.form.depts) {
      //   this.$message({
      //     message: '部门不能为空',
      //     type: 'warning'
      //   })
      //   return false
      // } else if (crud.form.positions.length === 0) {
      //   this.$message({
      //     message: '岗位不能为空',
      //     type: 'warning'
      //   })
      //   return false
      // } else if (crud.form.roles.length === 0) {
      //   this.$message({
      //     message: '角色不能为空',
      //     type: 'warning'
      //   })
      //   return false
      // }
      // crud.form.roles = userRoles
      // crud.form.positions = userPositions
      return true
    },
    // 切换部门
    handleNodeClick(data) {
      if (data.parentId === 0) {
        this.query.deptId = null
      } else {
        this.query.deptId = data.id
      }
      this.crud.toQuery()
    },

    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入账号为"' + row.username + '"的新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          resetUserPwd(row.id, value).then(response => {
             if (response.code === '000000') {
                this.msgSuccess(response.mesg)
              } else if (response.code === '050000') {
                this.msgWarning(response.mesg)
              }
          }
          )
        })
        .catch(() => {})
    },
    // 改变状态
    // changeEnabled(data, val) {
    //   this.$confirm('此操作将改变"'  + data.username + '账号, 是否继续？', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     crudUser.edit(data).then(res => {
    //       this.crud.notify( '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
    //     }).catch(() => {
    //       data.enabled = !data.enabled
    //     })
    //   }).catch(() => {
    //     data.enabled = !data.enabled
    //   })
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
      }).then(response => {
         if (response.code === '000000') {
                this.msgSuccess(response.mesg)
              } else if (response.code === '050000') {
                this.msgWarning(response.mesg)
              }
      }).catch(function() {
        row.enabled = row.enabled === false
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
