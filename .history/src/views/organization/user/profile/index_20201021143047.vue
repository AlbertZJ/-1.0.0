<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />用户名称
                <div class="pull-right">{{ user.nickname }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />手机号码
                <div class="pull-right">{{ user.mobile }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />用户邮箱
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree" />所属部门
                <el-select
                  v-model="user.depts"
                  multiple
                  collapse-tags
                  style="margin-left:20px;"
                >
                  <el-option
                    v-for="item in deptList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                     :disabled="item"
                  />
                </el-select>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree" />拥有职位
                <el-select
                  v-model="user.positions"
                  multiple
                  collapse-tags
                  style="margin-left:20px;"
                >
                  <el-option
                    v-for="item in positionList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    :disabled="item"
                  />
                </el-select>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" />所属角色
                <el-select
                  v-model="user.roles"
                  multiple
                  collapse-tags
                  style="margin-left:20px;"
                >
                  <el-option
                    v-for="item in roleList"
                    :key="item.id"
                    :label="item.code"
                    :value="item.id"
                    :disabled="item"
                  />
                </el-select>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />创建日期
                <div class="pull-right">{{ user.createdTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from './userAvatar'
import userInfo from './userInfo'
import resetPwd from './resetPwd'
import { getUserProfile } from '@/api/organization/user'
import { getAllRoles } from '@/api/organization/role'
import { getAllPositions } from '@/api/organization/position'
import { getAllDepts } from '@/api/organization/dept'

export default {
  name: 'Profile',
  components: {
    userAvatar, userInfo, resetPwd
  },
  data() {
    return {
      user: {},
      roleList: [],
      roles: [],
      depts: [],
      deptList: [],
      positions: [],
      positionList: [],
      activeTab: 'userinfo'
    }
  },
  created() {
    this.getRoles()
    this.getUser()
    this.getDepts()
    this.getPositions()
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data
      })
    },
    /**
       * 角色列表
       */
    getRoles() {
      getAllRoles().then(response => {
        this.roleList = response.data

      })
    },
    /**
       * 职位列表
       */
    getDepts() {
      getAllDepts().then(response => {
        this.deptList = response.data
      })
    },
    /**
       * 职位列表
       */
    getPositions() {
      getAllPositions().then(response => {
        this.positionList = response.data
      })
    }
  }

}
</script>
