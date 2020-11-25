<template>
  <div class="app-container">
     <el-row :gutter="20">
    <!--用户数据-->
      <el-col :xs="15" :sm="18" :md="19" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <!-- <el-input
              v-model="query.code"
              clearable
              size="small"
              placeholder="请输入路由id"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            /> -->
             <el-input
              v-model="query.uri"
              clearable
              size="small"
              placeholder="请输入网关uri"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
           <!-- <el-input
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
            </el-select> -->
            <rrOperation />
          </div>
          <crudOperation show="" :permission="permission" />

        </div>
        <!--表单渲染-->
        <!-- <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="570px">
          <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="50px">
            <el-form-item v-if="form.id==undefined" label="账号" prop="username">
              <el-input v-model="form.username" placeholder="请输入账号"  maxlength="20" suffix-icon="el-icon-edit" clearable/>
            </el-form-item>
             <el-form-item   v-if="form.id==undefined" label="密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入密码"   type="password"
            show-password
            clearable  maxlength="20" />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="form.nickname" placeholder="请输入昵称" suffix-icon="el-icon-edit" clearable   maxlength="20" />
            </el-form-item>
            <el-form-item label="部门" prop="depts">
              <treeselect
                :normalizer="normalizer"
                :default-expend-level="1"
                v-model="form.depts"
                :options="deptDatas"
                :show-count="true"
                :multiple="true"

                placeholder="选择部门"

              />
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
              <el-input v-model.number="form.mobile" placeholder="请输入电话" suffix-icon="el-icon-edit" clearable   maxlength="20" />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" suffix-icon="el-icon-edit" clearable   maxlength="20" />
            </el-form-item>
<el-form-item label="身份证号" prop="idCard">
              <el-input v-model="form.idCard" placeholder="请输入身份证号" suffix-icon="el-icon-edit" clearable   maxlength="20" />
            </el-form-item>

              <el-form-item label="性别">
              <el-radio-group v-model="form.sex" style="width: 200px">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
                 <el-radio label="未知">未知</el-radio>
              </el-radio-group>
            </el-form-item>

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
          <el-form-item  label="备注">

               <el-input
               style="width:450px;"
            v-model="form.description"
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
        </el-dialog> -->
        <!--表格渲染-->
        <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
          <el-table-column  type="selection" width="55" />
           <el-table-column :show-overflow-tooltip="true" prop="id" label="编号" />
          <el-table-column :show-overflow-tooltip="true" prop="routeId" label="路由id" />
          <el-table-column :show-overflow-tooltip="true" prop="uri" label="uri路径" />
           <el-table-column width="50" align="center" label="状态">
               <el-table-column width="220px" align="left" label="predicates">
        <template slot-scope="scope">
          <span>
            <li v-for="(predicates, index) in scope.row.predicates" :key="index">
              {{ predicates.name }}
              <ul>
                <li v-for="(args, index) in predicates.args" :key="index">
                  {{ args }}
                </li>
              </ul>
            </li>
          </span>
        </template>
      </el-table-column>

      <el-table-column width="130px" align="left" label="filters">
        <template slot-scope="scope">
          <span>
            <li v-for="(filters,index) in scope.row.filters" :key="index">
              {{ filters.name }}
              <ul>
                <li v-for="(args,index) in filters.args" :key="index">
                  {{ args }}
                </li>
              </ul>
            </li>
          </span>
        </template>
      </el-table-column>
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>

 <el-table-column :show-overflow-tooltip="true" prop="description" align="center" label="描述" />
           <!-- <el-table-column width="120px" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column> -->
      <el-table-column width="160px" align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="85" align="center" label="修改人">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedBy }}</span>
        </template>
      </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="createdTime" width="135" label="创建日期">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createdTime) }}</span>
            </template>
          </el-table-column>
           <el-table-column width="85" align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.createdBy }}</span>
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

import { getToken } from "@/utils/auth"
import { crudGateway} from '@/api/organization/gateway'
import { crudUser, resetUserPwd, exportUser, importTemplate, changeUserEnabled} from '@/api/organization/user'
import { isvalidPhone } from '@/utils/validate'
import { getDepts, getDeptSuperior } from '@/api/organization/dept'
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
const defaultForm = { id: null,routeId:null, uri路径: null, description: null }
export default {
  name: 'GatewayManagement',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination },
  cruds() {
    return CRUD({ title: '网关',  url: '/gateway-admin/gateway/routes', crudMethod: { ...crudGateway }})
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
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/organization/user/excel/importData",
      },
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
        routeId: [{ required: true, message: '路由id必填', trigger: 'blur' }],
        uri: [{ required: true, message: 'uri路径必填', trigger: 'blur' }]
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
    // changeRole(value) {
    //   userRoles = []
    //   value.forEach(function(data, index) {
    //     const role = { id: data }
    //     userRoles.push(role)
    //   })
    // },
     /**
       * 部门列表
       */
    getDepts() {
      getDepts(this.groupQuery).then(response => {
        this.deptDatas = this.handleTree(response.data,"id")
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
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
     /** 导入按钮操作 */
    handleImport() {

      this.upload.title = "用户导入"
      this.upload.open = true
    },
     /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
     // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
     // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
     // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
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

      this.$prompt('请输入账号为"' + row.username + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          resetUserPwd(row.id, value).then((response) => {
            if (response.code=="000000") {
              this.msgSuccess("修改成功，新密码是：" + value)
            }
          })
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
