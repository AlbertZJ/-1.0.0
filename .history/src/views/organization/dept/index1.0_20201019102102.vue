<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" icon="edit" @click="handlerUpdate">编辑</el-button>
      <el-button type="primary" icon="delete" @click="handlerDelete(form.id)">删除</el-button>
    </div>

    <el-row>
      <el-col :span="8" style="margin-top:15px;">
        <el-tree
          class="filter-tree"
          node-key="id"
          highlight-current
          lazy
          :load="loadNode"
          :data="treeData"
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="getNodeData"
        />
      </el-col>

      <el-col :span="14" style="margin-top:15px;">
        <el-card class="box-card">
          <el-form ref="form" :label-position="labelPosition" label-width="100px" :model="form">
            <el-form-item label="节点编号" prop="id">
              <el-input v-model="form.id" disabled />
            </el-form-item>
            <el-form-item label="父级节点" prop="parentId">
              <el-select
                v-model="form.parentId"
                :disabled="formRead"
                clearable
                style="width: 100%;"
                placeholder="请选择部门"
                filterable
                @visible-change="getDepts"
              >
                <el-option
                  v-for="item in deptList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="form.name" :disabled="formRead" placeholder="请输入名称" maxlength="40" suffix-icon="el-icon-edit" clearable />
            </el-form-item>
            <el-form-item label="简介" prop="description">
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="2"
                maxlength="150"
                show-word-limit
                placeholder="请输入简介"
                :disabled="formRead"
              />
            </el-form-item>
            <el-form-item label="创建时间" prop="description">
              <el-input v-model="form.createdTime" disabled />
            </el-form-item>
            <el-form-item label="创建人" prop="description">
              <el-input v-model="form.createdBy" disabled />
            </el-form-item>
            <el-form-item label="修改时间" prop="description">
              <el-input v-model="form.updatedTime" disabled />
            </el-form-item>
            <el-form-item label="修改人" prop="description">
              <el-input v-model="form.updatedBy" disabled />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="plus" @click="handleCreate">新增</el-button>
              <el-button type="primary" @click="saveDept">保存</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <!--添加对话框-->
    <el-dialog title="新增" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        status-icon
        style="width: 80%; margin-left:60px;"
      >
        <el-form-item label="父级节点编号" prop="parentId">
          <el-input v-model="temp.parentId" disabled />
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入部门名称" maxlength="40" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input
            v-model="temp.description"
            type="textarea"
            :rows="2"
            maxlength="150"
            show-word-limit
            placeholder="请输入简介"
          />
        </el-form-item>
      </el-form>
      <!--对话框动作按钮-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">创建</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryDept, getAllDepts, fetchDeptByParentId, getDept, createDept, updateDept, del } from '@/api/organization/dept'

export default {
  name: 'GroupManagement',
  filters: {},
  data() {
    return {
      total: 0,
      listLoading: true,
      dialogFormVisible: false,
      // 当前选中的节点id
      currentId: '',
      formEdit: false,
      formRead: !this.formEdit,
      formStatus: '',
      // 树数据
      treeData: [],
      deptList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      labelPosition: 'right',
      form: {
        parentId: undefined,
        id: undefined,
        name: '',
        description: '',
        createdTime: '',
        createdBy: '',
        updatedTime: '',
        updatedBy: ''
      },
      // 表单校验规则
      rules: {
        // id: [{ required: true, message: '节点编号必填', trigger: 'blur' }],
        parentId: [{ required: true, message: '父级节点编号必填', trigger: 'blur' }],
        name: [{ required: true, message: '组织名必填', trigger: 'blur' }]
      },
      // 创建或修改用户临时对象
      temp: {
        parentId: undefined,
        id: undefined,
        name: '',
        description: '',
        createdTime: '',
        createdBy: '',
        updatedTime: '',
        updatedBy: ''
      }
    }
  },
  created() {
    this.fetchDeptByParentId('-1')
  },
  methods: {
    /**
       * 根据父节点id，查询子节点
       * @param parentId 父节点id
       */
    fetchDeptByParentId(parentId) {
      fetchDeptByParentId(parentId).then(response => {
        this.treeData = response.data
      })
    },
    /**
       * 保存组
       */
    // saveDept() {

    // },
    /**
       * 修改组织信息
       */
    saveDept() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          updateDept(this.form).then(() => {
            this.$notify({
              title: '编辑成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
            this.queryDept()
          })
        }
      })
    },
    /**
       * 弹出创建组织表单
       */
    handleCreate() {
      this.dialogFormVisible = true
      this.resetForm()
      this.temp.parentId = this.form.id
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
       * 创建组织
       */
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createDept(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '创建成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.queryDept()
          })
        }
      })
    },
    /**
       * 重置添加表单
       */
    resetForm() {
      this.temp = {
        username: '',
        nickname: '',
        password: '',
        roleIds: [],
        description: '',
        mobile: ''
      }
    },
    handlerAdd() {
      this.formEdit = true
    },
    handlerUpdate() {
      this.formEdit = true
      this.formRead = false
    },
    // 查询过滤器
    handleFilter() {
      this.listQuery.current = 1
      this.queryDept()
    },
    /**
       * 组织列表
       */
    getDepts(isShow) {
      if (isShow) {
        getAllDepts().then(response => {
          this.deptList = response.data
        })
      }
    },
    /**
       * 删除组织
       */
    handlerDelete(id) {
      this.$confirm('此操作将删除该组织, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        type: 'warning'
      }).then(() => {
        del(id).then(() => {
          this.$notify({
            title: '删除成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.queryDept()
        })
      })
    },
    onCancel() {
    },
    /**
       * 加载树数据
       * @param node 树节点
       * @param resolve
       *
       */
    loadNode(node, resolve) {
      fetchDeptByParentId(node.data.id).then(response => {
        resolve(response.data)
      })
    },
    /**
       * 获取节点数据
       * @param data
       */
    getNodeData(data) {
      if (!this.formEdit) {
        this.formStatus = 'update'
      }
      getDept(data.id).then(response => {
        this.form = response.data
      })
      this.currentId = data.id
    },
    /**
       * 搜索node节点
       */
    filterNode() {
    }
  }
}
</script>
