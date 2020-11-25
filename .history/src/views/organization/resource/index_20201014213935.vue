<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="资源名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入资源名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="enabled">
        <el-select v-model="queryParams.enabled" placeholder="菜单状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
       <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:post:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:post:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="resourceList"
      row-key="id"
      empty-text="暂无数据"
       @selection-change="handleSelectionChange"
    >
     <el-table-column
      type="selection"
      width="55" />
      <el-table-column prop="t.name" label="资源名称" :show-overflow-tooltip="true"  />
       <el-table-column prop="t.code" label="资源编码" :show-overflow-tooltip="true"  />
        <el-table-column prop="t.parentId" label="父级节点编号" :show-overflow-tooltip="true"  />
         <el-table-column prop="t.type" label="资源类型" :show-overflow-tooltip="true"  />
         <el-table-column prop="t.url" label="资源路径" :show-overflow-tooltip="true"  />
         <el-table-column prop="t.method" label="资源方法" :show-overflow-tooltip="true"  />
         <el-table-column prop="t.description" label="资源描述" :show-overflow-tooltip="true"  />
      <!-- <el-table-column prop="icon" label="图标" align="center" width="100">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="orderNum" label="排序" width="60"></el-table-column> -->
      <!-- <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column> -->
      <!-- <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column> -->
      <!-- <el-table-column prop="enabled" label="状态" :formatter="statusFormat" width="80"></el-table-column> -->
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.t.createdTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"

          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"

          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"

          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="父级节点" prop="parentId" >
              <treeselect
                v-model="form.parentId"
                :options="resourceOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择父级节点"
              />
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="资源代码" prop="code">
              <el-input v-model="form.code"  placeholder="如:user_manager:btn_add" maxlength="40" suffix-icon="el-icon-edit" clearable />
            </el-form-item>
          </el-col>
           <el-col :span="12">
           <el-form-item label="资源类型" prop="type">
              <el-input v-model="form.type" :disabled="formRead" placeholder="请输入资源类型,如：user" maxlength="40" suffix-icon="el-icon-edit" clearable />
            </el-form-item>
          </el-col>

      <el-col :span="12">
            <el-form-item label="组名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入资源名称" />
            </el-form-item>
          </el-col>
<el-col :span="12">
           <el-form-item label="资源url" prop="url">
              <el-input v-model="form.url" :disabled="formRead" placeholder="请输入资源url,如：/user" maxlength="60" suffix-icon="el-icon-edit" clearable />
            </el-form-item>
          </el-col>
<el-col :span="12">
           <el-form-item label="资源状态" prop="enabled">
              <!-- <el-table-column width="120px" label="状态" align="center"> -->
              <template slot-scope="scope">
                <el-switch
                  v-model="form.enabled"
                  :disabled="formRead"
                  @change="handleStatusChange(scope.row)"
                />
              </template>
              <!-- </el-table-column> -->
              <!-- <el-input v-model="form.enabled" :disabled="formRead" placeholder="请输入资源url,如：/user" maxlength="60" suffix-icon="el-icon-edit" clearable /> -->
            </el-form-item>
          </el-col>
<el-col :span="12">
           <el-form-item label="资源方法" prop="method">
              <el-select v-model="form.method" filterable placeholder="请选择资源方法" :disabled="formRead">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <!-- <el-input v-model="form.method" :disabled="formRead" placeholder="请输入资源方法,如：GET" clearable /> -->
            </el-form-item>
          </el-col>
<el-col :span="24">
   <el-form-item label="简介" prop="description">
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="2"
                maxlength="150"
                show-word-limit
                placeholder="请输入描述内容"
                :disabled="formRead"
              />
            </el-form-item>
   </el-col>
<el-col :span="12">
   <el-form-item label="创建时间" prop="description">
              <el-input v-model="form.createdTime" disabled />
            </el-form-item>
   </el-col>
   <el-col :span="12">
   <el-form-item label="创建人" prop="description">
              <el-input v-model="form.createdBy" disabled />
            </el-form-item>
   </el-col>
   <el-col :span="12">
   <el-form-item label="修改时间" prop="description">
              <el-input v-model="form.updatedTime" disabled />
            </el-form-item>
   </el-col>
   <el-col :span="12">
  <el-form-item label="修改人" prop="description">
              <el-input v-model="form.updatedBy" disabled />
            </el-form-item>
   </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { queryResource, getMenu, delMenu, addMenu, updateMenu } from "@/api/organization/menu"
import { queryResource, getAllResources, del, fetchResourceByParentId, getResource, createResource, updateResource, deleteResource } from '@/api/organization/resource'

import Treeselect from "@riophae/vue-treeselect"
import "@riophae/vue-treeselect/dist/vue-treeselect.css"
// import IconSelect from "@/components/IconSelect"

export default {
  name: "resourceManagement",
  components: { Treeselect },
  data() {
    return {
// 非单个禁用
      single: true,
       options: [{
        value: '选项1',
        label: '/'
      }, {
        value: '选项2',
        label: 'GET'
      }, {
        value: '选项3',
        label: 'POST'
      }, {
        value: '选项4',
        label: 'PUT'
      }, {
        value: '选项5',
        label: 'DELETE'
      }, {
        value: '选项6',
        label: 'OPTIONS'
      }, {
        value: '选项7',
        label: 'HEAD'
      }, {
        value: '选项8',
        label: 'TRACE'
      }, {
        value: '选项9',
        label: 'CONNECT'
      }],
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 菜单表格树数据
      resourceList: [],
      // 菜单树选项
      resourceOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 显示状态数据字典
      visibleOptions: [],
      // 菜单状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        name: undefined,
        visible: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "资源名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" }
        ],
        path: [
          { required: true, message: "路由地址不能为空", trigger: "blur" }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts("sys_show_hide").then(response => {
      this.visibleOptions = response.data
    })
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data
    })
  },
  methods: {
    // 选择图标
    selected(name) {
      this.form.icon = name
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true
      queryResource(this.queryParams).then(response => {
        this.resourceOptions = []
        const resource = { id: '-1', label: '主类目', children: [] }
      resource.children = this.handleTree(response.data, "id")
        this.resourceOptions.push(resource)
        this.resourceList = this.handleTree(response.data, "id")

        this.loading = false
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

    /** 查询菜单下拉树结构 */
    getTreeselect() {
      queryResource(this.queryParams).then(response => {
        this.resourceOptions = []
        const resource = { id: '-1', label: '主类目', children: [] }
      resource.children = this.handleTree(response.data, "id")
        this.resourceOptions.push(resource)
      })
    },
    // 显示状态字典翻译
    visibleFormat(row, column) {
      if (row.menuType == "F") {
        return ""
      }
      return this.selectDictLabel(this.visibleOptions, row.visible)
    },
    // 菜单状态字典翻译
    statusFormat(row, column) {
      if (row.menuType == "F") {
        return ""
      }
      return this.selectDictLabel(this.statusOptions, row.enabled)
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        parentId: 0,
        name: undefined,
        enabled: true
      }
      this.resetForm("form")
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()

      this.getTreeselect()

      if (row != null && row.id) {
        this.form.parentId = row.id
      } else {

        this.form.parentId = "-1"
      }
      this.open = true
      this.title = "添加菜单"
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      getResource(row.t.id).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改菜单"
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateResource(this.form).then(response => {
              if (response.code === "000000") {
                this.msgSuccess("修改成功")
                this.open = false
                this.getList()
              }
            })
          } else {
            createResource(this.form).then(response => {
              if (response.code ===  "000000") {
                this.msgSuccess(response.mesg)
                this.open = false
                this.getList()
              }else if(response.code ===  "050000"){
                this.msgWarning(response.mesg)
                this.open = false
                this.getList()
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.t.name + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          var ids=[row.id]
          return del(ids)
        }).then(() => {

          this.getList()
          this.msgSuccess("删除成功")
        }).catch(function() {})
    }
  }
}
</script>
