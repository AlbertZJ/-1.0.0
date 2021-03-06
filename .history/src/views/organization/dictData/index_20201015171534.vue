<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <!--工具栏-->
      <div class="head-container">
        <div v-if="crud.props.searchToggle">
          <!-- 搜索 -->
          <el-input
            v-model="query.dictLabel"
            clearable
            size="small"
            placeholder="字典标签"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
            <el-input
            v-model="query.dictValue"
            clearable
            size="small"
            placeholder="字典键值"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
            <el-input
            v-model="query.dictType"
            clearable
            size="small"
            placeholder="字典类型"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
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
    </el-row>

    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :show-overflow-tooltip="true" type="index" width="50" align="center" label="ID" />
      <!-- <el-table-column  :show-overflow-tooltip="true" prop="id" label="编号" /> -->
      <el-table-column :show-overflow-tooltip="true" prop="name" label="职位名称" />
      <el-table-column :show-overflow-tooltip="true" prop="description" label="职位描述" />
      <el-table-column :show-overflow-tooltip="true" width="160px" align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" width="90" align="center" label="修改人">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedBy }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" width="160px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" width="90" align="center" label="创建人">
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

    <!--添加或编辑对话框-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="65%">
      <el-form
        ref="form"
        :model="form"
        label-position="right"
        status-icon
        style="width: 80%; margin-left:30px;"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="职位名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入职位名称，如：首席执行官" maxlength="40" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
        <el-form-item label="职位描述" prop="description">
          <el-input
            v-model="form.description"
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
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
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

const defaultForm = {
  name: '',
  description: ''
}
export default {
  name: 'PositionManagement',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination },
  cruds() {
    return [
      CRUD({ title: '职位', url: '/organization/position', crudMethod: { ...crudPosition },
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
