<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <!--工具栏-->
      <div class="head-container">
        <div v-if="crud.props.searchToggle">
          <!-- 搜索 -->
          <el-input
            v-model="query.title"
            clearable
            size="small"
            placeholder="通知标题"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <el-input
            v-model="query.description"
            clearable
            size="small"
            placeholder="通知描述"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
            <date-range-picker @change="crud.toQuery" v-model="query.createdTime" class="date-item" />
          <el-select
            v-model="query.type"
            clearable
            size="small"
            placeholder="类型"
            class="filter-item"
            style="width: 90px"
            @change="crud.toQuery"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
          <el-select
            v-model="query.status"
            clearable
            size="small"
            placeholder="状态"
            class="filter-item"
            style="width: 90px"
            @change="crud.toQuery"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
          <rrOperation />
        </div>
        <crudOperation show="" :permission="permission" />
      </div>
    </el-row>

    <el-table ref="table" v-loading="crud.loading" :data="crud.data" highlight-current-row style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column fixed :show-overflow-tooltip="true" type="index" width="50" align="center" label="ID" />
      <!-- <el-table-column  :show-overflow-tooltip="true" prop="id" label="编号" /> -->
      <el-table-column :show-overflow-tooltip="true" prop="title" label="通知标题" align="center" />
      <el-table-column :show-overflow-tooltip="true" prop="orderNum" label="显示顺序" align="center" />
      <el-table-column :show-overflow-tooltip="true" label="类型" align="center" prop="type" :formatter="typeFormat" />
      <el-table-column :show-overflow-tooltip="true" prop="content" label="通知内容" align="center" />
      <el-table-column :show-overflow-tooltip="true" label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column :show-overflow-tooltip="true" prop="description" label="通知描述" />
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
        <el-row>
          <el-col :span="12">
            <el-form-item label="通知标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入通知标题" maxlength="20" suffix-icon="el-icon-edit" clearable />
            </el-form-item>
          </el-col>
           <el-col :span="12">
             <el-form-item label="公告类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择">
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="1" />
            </el-form-item>
          </el-col>
<el-col :span="24">
            <el-form-item label="内容">
              <editor v-model="form.content" :min-height="192"/>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="通知内容" prop="content">
              <el-input v-model="form.content" placeholder="请输入通知内容" maxlength="20" suffix-icon="el-icon-edit" clearable />
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="备注" prop="description">
              <el-input
                v-model="form.description"
                type="textarea"
                maxlength="50"
                show-word-limit
  :autosize="{minRows: 2, maxRows: 8}"
                placeholder="请输入描述内容"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import crudNotice from '@/api/organization/notice'
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
  orderNum: 1, title: null,  type: '1', content: null,
  status: '0',
  description: null
}
export default {
  name: 'NoticeManagement',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination },
  cruds() {
    return [
      CRUD({ title: '通知数据', url: '/organization/notice', crudMethod: { ...crudNotice },
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
        add: ['Admin', 'Developer'],
        edit: ['Admin', 'Developer'],
        del: ['Admin', 'Developer']
      },
      typeOptions: [],
      statusOptions: [],
      yesOptions: [],
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      rules: {
        title: [{ required: true, message: '通知标题必填', trigger: 'blur' }],
        type: [
          { required: true, message: '通知类型不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'notice'
    ])
  },
  created() {
    this.getDicts('notice_type').then(response => {
      this.typeOptions = response.data
    })
    this.getDicts('job_status').then(response => {
      this.statusOptions = response.data
    })
    this.getDicts('yes_no').then(response => {
      this.yesOptions = response.data
    })
  },
  methods: {
    // 通知状态通知翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type)
    },
    // 通知状态通知翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    handleStatusChange(row) {
      const text = row.status === true ? '启用' : '停用'
      this.$confirm('确认要"' + text + '"?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeUserEnabled(row.id, row.status)
      }).then(response => {
        if (response.code === '000000') {
          this.msgSuccess(response.mesg)
        } else if (response.code === '050000') {
          this.msgWarning(response.mesg)
        }
      }).catch(function() {
        row.status = row.status === false
      })
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
