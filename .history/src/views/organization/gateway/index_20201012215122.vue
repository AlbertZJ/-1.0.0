<template>
  <div class="app-container">
     <el-row :gutter="20">
    <!--用户数据-->
        <!--工具栏-->
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
             <el-input
              v-model="query.uri"
              clearable
              size="small"
              placeholder="uri路径"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
            <rrOperation />
          </div>
          <crudOperation show=""  :permission="permission" />

        </div>
        <!--表单渲染-->
        <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="65%">
          <el-form ref="form"  :model="form"
           label-position="right"  status-icon  style="width: 80%; margin-left:30px;"
          :rules="rules" label-width="120px" >
            <el-form-item   label="路由id" prop="routeId">
              <el-input v-model="form.routeId" placeholder="请输入路由id"  maxlength="40" suffix-icon="el-icon-edit" clearable/>
            </el-form-item>
               <el-form-item label="uri路径" prop="uri">
          <el-input v-model="form.uri" placeholder="请输入uri路径,如:lb://或http://" maxlength="60" suffix-icon="el-icon-edit" clearable />
        </el-form-item>
         <el-form-item
          v-for="(predicates, index) in form.predicates"
          :key="0+index"
          :label="'predicate' + (index+1)"
          :rules="{ required: true, message: 'predicates不能为空', trigger: 'blur'}"
        >
          <el-input
            v-model="predicates.name"
            :prop="'predicates.' + index + '.name'"
            style="width: 40%"
            placeholder="请输入名称，如Path"
            suffix-icon="el-icon-edit"
            maxlength="40"
            clearable
          />
          <el-input
            v-model="predicates.args.pattern"
            :prop="'predicates.' + index + '.args.pattern'"
            style="width: 40%"
            placeholder="请输入路由表达式,如：/user/**"
            suffix-icon="el-icon-edit"
            maxlength="40"
            clearable
          />
          </el-form-item>
  <el-form-item v-for="(filters, index) in form.filters" :key="1+index" :label="'filter' + (index+1)">
          <el-input
            v-model="filters.name"
            :prop="'filters.' + index + '.name'"
            style="width: 40%"
            placeholder="请输入名称，如StripPrefix"
            suffix-icon="el-icon-edit"
            maxlength="40"
            clearable
          />
          <el-input
            v-model="filters.args.parts"
            :prop="'filters.' + index + '.args.parts'"
            style="width: 40%"
            placeholder="请输入路由表达式"
            suffix-icon="el-icon-edit"
            maxlength="40"
            clearable
          />
          <el-button type="danger" icon="el-icon-minus" circle size="mini" @click="removeFilter(index)" />
          <el-button type="primary" icon="el-icon-plus" circle size="mini" @click="addFilter" />
        </el-form-item>
  <el-form-item label="排序" prop="orders">
          <el-input v-model="form.orders" type="number" placeholder="请输入优先级" />
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            maxlength="150"
            show-word-limit
            :rows="3"
            placeholder="请输入描述内容"
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
          <el-table-column  type="selection" width="55"  align="center" />
           <el-table-column :show-overflow-tooltip="true" prop="id" label="编号" />
          <el-table-column :show-overflow-tooltip="true" prop="routeId" label="路由id" />
          <el-table-column   prop="uri" label="uri路径" />
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
       <el-table-column width="50" align="center" label="排序">
        <template slot-scope="scope">
          <span>{{ scope.row.orders }}</span>
        </template>
      </el-table-column>
           <el-table-column width="50" align="center" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>

 <el-table-column :show-overflow-tooltip="true" prop="description" align="center" label="描述" />
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
            v-permission="['admin']"
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
    </el-row>
  </div>
</template>

<script>

import { getToken } from "@/utils/auth"
import crudGateway from '@/api/organization/gateway'
import { isvalidPhone } from '@/utils/validate'
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

const defaultForm =  {
        routeId: '',
        uri: 'lb://',
        orders: '100',
        description: '',
        predicates: [{
          name: 'Path',
          args: {
            pattern: ''
          }
        }],
        filters: [{
          name: 'StripPrefix',
          args: {
            parts: '1'
          }
        }]
      }
export default {
  name: 'GatewayManagement',
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
      height: document.documentElement.clientHeight - 180 + 'px;',
      deptName: '',  deptDatas: [], positions: [], level: 3, roles: [],
      defaultProps: { children: 'children', label: 'label' },
      permission: {
        add: ['admin'],
        edit: ['admin'],
        del: ['admin']
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
      'gateway'
    ])
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
</style>
