<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item  prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入资源名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item  prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入资源编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item  prop="type">
        <el-input
          v-model="queryParams.type"
          placeholder="请输入资源类型"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item  prop="url">
        <el-input
          v-model="queryParams.url"
          placeholder="请输入资源路径"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="method"   >
              <el-select v-model="queryParams.method" filterable placeholder="请选择资源方法" clearable :disabled="formRead">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
      <el-form-item label="" prop="enabled">
        <el-select v-model="queryParams.enabled" placeholder="资源状态"  class="filter-item"
              style="width: 90px" clearable size="small">
          <el-option
                v-for="item in enabledTypeOptions"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
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
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table
    ref="multipleTable"
    :data="resourceList"
      v-loading="loading"
        tooltip-effect="dark"
        style="width: 100%"
      row-key="id"
      empty-text="暂无数据"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
      />
      <el-table-column align="center" prop="name" label="资源名称" :show-overflow-tooltip="true" />
      <el-table-column align="center" prop="code" label="资源编码" :show-overflow-tooltip="true" />
      <!-- <el-table-column align="center" prop="parentId" label="父级节点编号" :show-overflow-tooltip="true" /> -->
      <el-table-column align="center" prop="type" label="资源类型" :show-overflow-tooltip="true" />
      <el-table-column align="center" prop="url" label="资源路径" :show-overflow-tooltip="true" />
      <el-table-column align="center" prop="method" label="资源方法" :show-overflow-tooltip="true" />
      <el-table-column align="center" prop="description" label="资源描述" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
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

    <!-- 添加或修改资源对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="父级节点" prop="parentId">
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
              <el-input v-model="form.code" placeholder="如:user_manager:btn_add" maxlength="40" suffix-icon="el-icon-edit" clearable />
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
              <template slot-scope="scope">
                <el-switch
                  v-model="form.enabled"
                  :disabled="formRead"
                  @change="handleStatusChange(scope.row)"
                />
              </template>
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
          <!-- <el-col :span="12">
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
          </el-col> -->
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

import { searchResource, queryResource, getAllResources, del, fetchResourceByParentId, getResource, createResource, updateResource, deleteResource } from '@/api/organization/resource'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'ResourceManagement',
  components: { Treeselect },
  data() {
    return {
       enabledTypeOptions: [
        { key: 'true', display_name: '正常' },
        { key: 'false', display_name: '无效' }
      ],
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      options: [{
        value: '/',
        label: '/'
      }, {
        value: 'GET',
        label: 'GET'
      }, {
        value: 'POST',
        label: 'POST'
      }, {
        value: 'PUT',
        label: 'PUT'
      }, {
        value: 'DELETE',
        label: 'DELETE'
      }, {
        value: 'OPTIONS',
        label: 'OPTIONS'
      }, {
        value: 'HEAD',
        label: 'HEAD'
      }, {
        value: 'TRACE',
        label: 'TRACE'
      }, {
        value: 'CONNECT',
        label: 'CONNECT'
      }],
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 资源表格树数据
      resourceList: [],
      // 资源树选项
      resourceOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 显示状态数据字典
      visibleOptions: [],
      // 资源状态数据字典
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
          { required: true, message: '资源名称不能为空', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '资源顺序不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '路由地址不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_show_hide').then(response => {
      this.visibleOptions = response.data
    })
    this.getDicts('sys_normal_disable').then(response => {
      this.statusOptions = response.data
    })
  },
  methods: {
    toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    // 选择图标
    selected(name) {
      this.form.icon = name
    },
    /** 查询资源列表 */
    getList() {
      this.loading = true
      searchResource(this.queryParams).then(response => {
        this.resourceOptions = []
        const resource = { id: '-1', name: '主类目', children: [] }
        resource.children = this.handleTree(response.data, 'id')
        this.resourceOptions.push(resource)
        this.resourceList = this.handleTree(response.data, 'id')

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
        label: node.name,
        children: node.children
      }
    },
    /** 查询资源下拉树结构 */
    getTreeselect() {
      searchResource(this.queryParams).then(response => {
        this.resourceOptions = []
        const resource = { id: '-1', name: '主类目', children: [] }
        resource.children = this.handleTree(response.data, 'id')
        this.resourceOptions.push(resource)
      })
    },
    // 显示状态字典翻译
    visibleFormat(row, column) {
      if (row.menuType == 'F') {
        return ''
      }
      return this.selectDictLabel(this.visibleOptions, row.visible)
    },
    // 资源状态字典翻译
    statusFormat(row, column) {
      if (row.menuType == 'F') {
        return ''
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
        name: undefined,
        parentId: -1,
        code: undefined,
        type: undefined,
        url: undefined,
        method: undefined,
        description: undefined,
        enabled: true
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      this.getTreeselect()
      if (row != null && row.id) {
        this.form.parentId = row.id
      } else {
        this.form.parentId = '-1'
      }
      this.open = true
      this.title = '添加资源'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const resources = row.id || this.ids
      getResource(resources).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改资源'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateResource(this.form).then(response => {
              if (response.code === '000000') {
                this.msgSuccess(response.mesg)
                this.open = false
                this.getList()
              }else if (response.code === '050000') {
                this.msgWarning(response.mesg)
                this.open = false
                this.getList()
              }
            })
          } else {
            createResource(this.form).then(response => {
              if (response.code === '000000') {
                this.msgSuccess(response.mesg)
                this.open = false
                this.getList()
              } else if (response.code === '050000') {
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
       const resources = row.id || this.ids
      this.$confirm('是否确认删除选中的资源数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return del(resources)
      }).then(response => {
         if (response.code === '000000') {
                this.msgSuccess(response.mesg)
                this.open = false
                this.getList()
              } else if (response.code === '050000') {
                this.msgWarning(response.mesg)
                this.open = false
                this.getList()
              }
        this.getList()
      }).catch(function() {})
    }
  }
}
</script>
