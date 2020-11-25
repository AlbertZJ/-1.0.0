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
              <!-- <el-option
                v-for="item in enabledTypeOptions"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              /> -->
               <!-- <el-option
                v-for="item in enabledTypeOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              /> -->
            </el-select>
          <rrOperation />
        </div>
        <crudOperation show="" :permission="permission" />
      </div>
    </el-row>

    <el-table ref="table" v-loading="crud.loading" :data="crud.data" highlight-current-row style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :show-overflow-tooltip="true" type="index" width="50" align="center" label="ID" />
      <!-- <el-table-column  :show-overflow-tooltip="true" prop="id" label="编号" /> -->
      <el-table-column :show-overflow-tooltip="true" prop="dictLabel" label="字典标签" />
      <el-table-column :show-overflow-tooltip="true" prop="dictValue" label="字典键值" />
      <el-table-column :show-overflow-tooltip="true" prop="dictSort" label="显示顺序" />
      <el-table-column :show-overflow-tooltip="true" prop="dictType" label="字典类型" />
      <el-table-column :show-overflow-tooltip="true" prop="cssClass" label="样式属性" />
      <el-table-column :show-overflow-tooltip="true" prop="listClass" label="表格回显样式" />
      <el-table-column :show-overflow-tooltip="true" prop="isDefault" label="是否默认" />
      <!-- <el-table-column :show-overflow-tooltip="true" label="状态" align="center" prop="enabled" :formatter="statusFormat" /> -->
       <!-- <el-table-column width="120px" label="状态" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enabled"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column> -->
      <el-table-column :show-overflow-tooltip="true" prop="description" label="字典描述" />
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
        <el-form-item label="字典标签" prop="dictLabel">
          <el-input v-model="form.dictLabel" placeholder="请输入字典标签" maxlength="40" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="字典键值" prop="dictValue">
          <el-input v-model="form.dictValue" placeholder="请输入字典键值" maxlength="40" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="显示排序" prop="dictSort">
              <el-input-number v-model="form.dictSort" controls-position="right" :min="1" />
            </el-form-item>
          </el-col>
           <el-col :span="12">
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="form.dictType" placeholder="请输入字典类型" maxlength="40" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
          </el-col>
           <el-col :span="12">
        <el-form-item label="样式属性" prop="cssClass">
          <el-input v-model="form.cssClass" placeholder="请输入样式属性" maxlength="40" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
          </el-col>
           <el-col :span="12">
        <el-form-item label="表格回显样式" prop="listClass">
          <el-input v-model="form.listClass" placeholder="请输入表格回显样式" maxlength="40" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
          </el-col>
           <el-col :span="12">
        <el-form-item label="是否默认" prop="isDefault">
          <el-input v-model="form.isDefault" placeholder="是否默认" maxlength="40" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="字典数据状态" prop="enabled">
          <el-input v-model="form.enabled" placeholder="字典数据状态" maxlength="40" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
          </el-col>
          <el-col :span="24">
        <el-form-item label="字典数据描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            maxlength="150"
            show-word-limit
            :rows="2"
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

import crudDictData from '@/api/organization/dictData'
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
  dictSort: 1, dictLabel: null, dictValue: null, dictType: null, cssClass: null,
  listClass: null, isDefault: null, enabled: true,
  description: null
}
export default {
  name: 'DictDataManagement',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination },
  cruds() {
    return [
      CRUD({ title: '字典数据', url: '/organization/dict/data', crudMethod: { ...crudDictData },
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
  // 设置数据字典
  dicts: ["sys_normal_disable"],
  data() {
    return {
      dictTyped:{
        dictType: "sys_normal_disable"
      },
      height: document.documentElement.clientHeight - 180 + 'px;',
      permission: {
        add: ['admin'],
        edit: ['admin'],
        del: ['admin']
      },
      // enabledTypeOptions: [
      //   { key: 'true', display_name: '正常' },
      //   { key: 'false', display_name: '无效' }
      // ],
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      rules: {
        dictLabel: [{ required: true, message: '字典数据名称必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'dictData'
    ])
  },
//   created(){
//     this.$nextTick(()=>{
//  this.getDicts("sys_normal_disable").then(response => {
//    this.$alert(response.data)
//       this.enabledTypeOptions = response.data
//     })})
//   },
created(){
  console.log(this.dict.sys_normal_disable)
  console.log(this.dict.sys_normal_disable.label)
},
  methods: {
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.enabledTypeOptions, row.enabled);
    },
     handleStatusChange(row) {
      const text = row.enabled === true ? '启用' : '停用'
      this.$confirm('确认要"' + text + '"?', '警告', {
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
