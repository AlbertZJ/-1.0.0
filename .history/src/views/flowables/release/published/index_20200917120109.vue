<template>
  <div class="app-container">
     <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50" align="center" label="ID" />
      <el-table-column width="180px" align="center" label="流程编号">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="流程名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="流程标识">
        <template slot-scope="scope">
          <span>{{ scope.row.modelKey }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="流程类型">
        <template slot-scope="scope">
          <span>{{ scope.row.category }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.deployTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

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

    <!--添加或编辑对话框-->
    <el-dialog title="流程图" :visible.sync="dialogFormVisible">
     <div>
    <img :src="flowPic" />
  </div>

    </el-dialog>
  </div>
</template>

<script>
import { getModeler, getModelerList, queryModeler, preview, diagram, undeploy, delay,deploy,released,category,publish,abolish } from '@/api/flowables/modeler'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'Published',
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
        type: 3,
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
    this.getModeler()
  },
  methods: {
    /**
       * 查询列表
       */
    getModeler() {
      this.listLoading = true
      released(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.data.total
      })
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getModeler()
    },
    /**
       * 修改每页显示条数
       */
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getModeler()
    },
    /**
       * 跳转到指定页
       */
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getModeler()
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
            this.getModeler()
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
      this.find(row.id)
    },
    find(id){
      diagram(id).then((res) => {
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
            this.getModeler()
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

