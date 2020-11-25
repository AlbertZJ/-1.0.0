<template>
  <div class="app-container">

    <!-- <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        style="width: 200px;"
        class="filter-item"
        placeholder="流程名称"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        :loading="downloadLoading"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出
      </el-button>
    </div> -->
     <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50" align="center" label="ID" />
      <el-table-column width="180px" align="center" label="流程编号">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="业务编号">
        <template slot-scope="scope">
          <span>{{ scope.row.businessKey }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="任务名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="流程名称">
        <template slot-scope="scope">
          <span>{{ scope.row.processName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="流程标识">
        <template slot-scope="scope">
          <span>{{ scope.row.processKey }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="流程版本">
        <template slot-scope="scope">
          <span>{{ scope.row.processVersion }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="发起人">
        <template slot-scope="scope">
          <span>{{ scope.row.startUserId }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="流程描述">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column width="160px" align="center" label="时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="90" align="center" label="修改人">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedBy }}</span>
        </template>
      </el-table-column> -->

      <el-table-column width="160px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column width="90" align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.createdBy }}</span>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="操作" width="320">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            流程图
          </el-button>
           <el-button type="primary" size="mini" @click="log(scope.row)">
            流程日志
          </el-button>
           <el-button type="primary" size="mini" @click="check(scope.row)">
            查看
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <!--翻页工具条-->
    <!-- <div class="pagination-container">
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
    </div> -->

    <!--添加或编辑对话框-->
    <el-dialog title="新增/修改" :visible.sync="dialogFormVisible">
     <div>
    <img :src="flowPic" />
  </div>
      <!-- <el-form
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
      </el-form> -->
      <!--对话框动作按钮-->
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">创建</el-button>
        <el-button v-else type="primary" @click="updateData">保存</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { myself, getTaskList, getTask, getSubmit, submitSave, assignee, nextFlowNodes,image,diagram,detail } from '@/api/flowables/task'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'Finished',
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        deleted: 'info',
        ok: 'success'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
       flowPic:'',
       flowImgParamData:"297e080b742446ee017424496cbe0001",
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        type: 5,
        status: 'ok',
        current: 1,
        size: 10
      },
      dialogStatus: 'create',
      dialogFormVisible: false,
      authFormVisible: false,
      rules: {
        name: [{ required: true, message: '流程名称必填', trigger: 'blur' }]
      },
      checkAll: false,
      // resources: [],
      isIndeterminate: true,
      temp: {
        name: '',
        description: ''
        // resourceIds: []
      },
      downloadLoading: false
    }
  },
  created() {
    this.getTask()
  },
  methods: {
    /**
       * 查询列表
       */
    getTask() {
      this.listLoading = true
      // this.$alert("name:"+this.listQuery.name)
      getTask(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.data.total
      })
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getTask()
    },
    /**
       * 修改每页显示条数
       */
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getTask()
    },
    /**
       * 跳转到指定页
       */
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getTask()
    },

    /**
       * 弹出新增角色对话框
       */
    handleCreate() {
      this.temp = {}
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
       * 新增职位
       */
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createPosition(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '创建成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getTask()
          })
        }
      })
    },
    /**
       * 点击更新按钮
       */
    handleUpdate(row) {
      this.temp = Object.assign({}, row)// copy obj
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.find(row.businessKey)
    },
    find(businessKey){
      diagram(businessKey).then((res) => {
          const url =window.URL.createObjectURL(res)
           this.flowPic = url
      }).catch(err => {

        this.$Message.error({
          content: '图片加载失败',
        })
      })
    },
    /**
       * 更新角色
       */
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updatePosition(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '编辑成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
            this.getTask()
          })
        }
      })
    },

    handleDownload() {
      console.log('download')
    }
  }
}
</script>

