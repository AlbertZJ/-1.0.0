<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="流程类型名称" prop="type_name">
        <el-input
          v-model="queryParams.type_name"
          placeholder="请输入流程类型名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
       <el-form-item label="状态" prop="status">
        <el-select
        @change="handleQuery"
        v-model="queryParams.status" placeholder="状态" clearable size="small">
          <el-option
            v-for="item in statusOptions"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <date-range-picker  @change="handleQuery" v-model="queryParams.createdTime" class="date-item" />
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:actCnFlowType:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
        <!-- <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="handleAdd">
        新增
      </el-button> -->
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table
      v-loading="loading"
      :data="actCnFlowTypeList"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <!-- <el-table-column prop="id" label="类型编号" sortable width="260"></el-table-column> -->
      <!-- <el-table-column prop="parent_id" label="父类型ID" sortable width="160"></el-table-column> -->

      <el-table-column prop="type_name" label="流程类型名称" sortable width="160" />
      <el-table-column prop="remark" label="备注" sortable width="160" />
      <el-table-column prop="ancestors" label="祖级列表" sortable width="160" />
      <el-table-column prop="order_num" label="显示顺序" sortable width="160" />

      <el-table-column prop="order_num" label="排序" sortable width="100" />
      <el-table-column :show-overflow-tooltip="true" label="状态" align="center" prop="status" :formatter="statusFormat" />
       <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['system:actCnFlowType:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['system:actCnFlowType:add']"
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
          >新增</el-button>
          <el-button
            v-if="scope.row.parent_id != 0"
            v-hasPermi="['system:actCnFlowType:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改流程类型对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col v-if="form.id !== 0" :span="24">
            <el-form-item label="类型编号" prop="id">
              <treeselect v-model="form.id" :options="actCnFlowTypeOptions" :normalizer="normalizer" placeholder="选择上级流程类型" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.parent_id !== 0" :span="24">
            <el-form-item label="父类型ID" prop="parent_id">
              <treeselect v-model="form.parent_id" :options="actCnFlowTypeOptions" :normalizer="normalizer" placeholder="选择上级流程类型" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="deptName">
              <el-input v-model="form.type_name" placeholder="请输入流程类型名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="order_num">
              <el-input-number v-model="form.order_num" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="祖级列表" prop="ancestors">
              <el-input-number v-model="form.ancestors" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型状态" prop="status">
              <el-input-number v-model="form.status" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>

          <!-- <el-col :span="12">
            <el-form-item label="流程类型状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
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
import { queryFlowtype, createFlowtype, updateFlowtype, deleteFlowtype, getFlowtype, getAllFlowtypes } from '@/api/flowables/flowtype'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'FlowType',
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      actCnFlowTypeList: [],
      // 流程类型树选项
      actCnFlowTypeOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        type_name: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parent_id: [
          { required: true, message: '上级流程类型不能为空', trigger: 'blur' }
        ],
        type_name: [
          { required: true, message: '流程类型名称不能为空', trigger: 'blur' }
        ],
        order_num: [
          { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('job_status').then(response => {
      this.statusOptions = response.data
    })
  },
  methods: {
     // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    /** 查询流程类型列表 */
    getList() {
      this.loading = true
      queryFlowtype(this.queryParams).then(response => {
        // this.actCnFlowTypeList = this.handleTree(response.data, "id")
        this.actCnFlowTypeList = response.data
        // this.$alert(this.actCnFlowTypeList)
        this.loading = false
      })
    },
    /** 转换流程类型数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.type_name,
        children: node.children
      }
    },
    // 字典状态字典翻译
    // statusFormat(row, column) {
    //   console.log(row.status)
    //   if (row.status === '0') {
    //     return '正常'
    //   } else if (row.status === '1') {
    //     return '停用'
    //   } else if (row.status === '2') {
    //     return '删除'
    //   }
    // },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        parent_id: undefined,
        type_name: undefined,
        order_num: undefined,
        remark: undefined,
        ancestors: undefined,
        status: '0',
        createdTime: undefined
      }
      // this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      // this.resetForm("queryForm")
      this.queryParams.type_name = undefined
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      if (row != undefined) {
        this.form.parent_id = row.id
      }
      this.open = true
      this.title = '添加流程类型'
      queryFlowtype(this.queryParams).then(response => {
	        this.actCnFlowTypeOptions = response.data
      })
    }
    /** 修改按钮操作 */
    // handleUpdate(row) {
    //   this.reset();
    //   getDept(row.id).then(response => {
    //     this.form = response.data;
    //     this.open = true;
    //     this.title = "修改流程类型";
    //   });
    //   listDeptExcludeChild(row.id).then(response => {
	  //       this.actCnFlowTypeOptions = this.handleTree(response.data, "id");
    //   });
    // },
    /** 提交按钮 */
    // submitForm: function() {
    //   this.$refs["form"].validate(valid => {
    //     if (valid) {
    //       if (this.form.id != undefined) {
    //         updateDept(this.form).then(response => {
    //           if (response.code.equals("000000")) {
    //             this.msgSuccess("修改成功");
    //             this.open = false;
    //             this.getList();
    //           }
    //         });
    //       } else {
    //         addDept(this.form).then(response => {
    //           if (response.code.equals("000000")) {
    //             this.msgSuccess("新增成功");
    //             this.open = false;
    //             this.getList();
    //           }
    //         });
    //       }
    //     }
    //   });
    // },
    /** 删除按钮操作 */
    // handleDelete(row) {
    //   this.$confirm('是否确认删除名称为"' + row.typeName + '"的数据项?', "警告", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     }).then(function() {
    //       return delDept(row.id);
    //     }).then(() => {
    //       this.getList();
    //       this.msgSuccess("删除成功");
    //     }).catch(function() {});
    // }
  }
}
</script>

