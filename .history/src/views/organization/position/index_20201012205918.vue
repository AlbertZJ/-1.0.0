<template>
  <div class="app-container">
     <el-row :gutter="20">
    <!--用户数据-->
        <!--工具栏-->
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
             <el-input
              v-model="query.name"
              clearable
              size="small"
              placeholder="岗位名称"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
            <rrOperation />
          </div>
          <crudOperation show=""  :permission="permission" />
        </div>
          </el-row>
 <!-- <el-form :model="listQuery" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
       <el-form-item label="岗位编码" prop="postCode">
        <el-input
          v-model="listQuery.postCode"
          placeholder="请输入岗位编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="岗位名称" prop="name">
        <el-input
          v-model="listQuery.name"
          placeholder="请输入岗位名称"
          clearable
          size="small"
          @keyup.enter.native="handleFilter"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="listQuery.status" placeholder="岗位状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleFilter">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>   -->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleCreate"

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
          @click="deletePosition"

        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleDownload"

        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>


    <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%"  @selection-change="handleSelectionChange" >
        <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" width="50" align="center" label="ID" />
      <el-table-column width="180px" align="center" label="职位编号">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="职位名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="职位描述">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="90" align="center" label="修改人">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedBy }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="90" align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.createdBy }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="text" size="mini"   icon="el-icon-edit"
           @click="handleUpdate(scope.row)">
            修改
          </el-button>
          <el-button type="text" size="mini"
           icon="el-icon-delete" @click="deletePosition(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--翻页工具条-->
    <div class="pagination-container">
      <el-pagination
        background
        :current-page="listQuery.current"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!--添加或编辑对话框-->
    <el-dialog title="新增/修改" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        status-icon
        style="width: 80%; margin-left:30px;"
      >
        <el-form-item label="职位名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入职位名称，如：首席执行官" maxlength="40" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
        <el-form-item label="职位描述" prop="description">
          <el-input
            v-model="temp.description"
            type="textarea"
            maxlength="150"
            show-word-limit
            :rows="2"
            placeholder="请输入描述内容"
          />
        </el-form-item>
      </el-form>
      <!--对话框动作按钮-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">创建</el-button>
        <el-button v-else type="primary" @click="updateData">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import crudPosition from '@/api/organization/position'
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

const defaultForm={
   name: '',
  description: ''
}
export default {
  name: 'PositionManagement',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination },
   cruds() {
    return [
      CRUD({ title: '网关',  url: '/gateway-admin/gateway/routes', crudMethod: { ...crudGateway },
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
        permission: {
        add: ['admin'],
        edit: ['admin'],
        del: ['admin']
      },
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
      // 显示搜索条件
      showSearch: true,

      rules: {
        name: [{ required: true, message: '职位名称必填', trigger: 'blur' }]
      },

      temp: {
        name: '',
        description: ''
        // resourceIds: []
      },
      downloadLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'position'
    ])
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
</style>
