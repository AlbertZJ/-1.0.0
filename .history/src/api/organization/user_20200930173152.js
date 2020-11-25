import request from '@/utils/request'

// 搜索用户
export function queryUser(data) {
  return request({
    url: '/organization/user/conditions',
    method: 'post',
    data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/organization/user/profile',
    method: 'get'
  })
}

// 根据用户id查看用户
export function getUser(id) {
  return request({
    url: '/organization/user/' + id,
    method: 'get'
  })
}

// 新增用户
export function createUser(data) {
  return request({
    url: '/organization/user',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: '/organization/user',
    method: 'post',
    data
  })
}

// 游客注册用户
export function registerUser(data) {
  return request({
    url: '/organization/oauth/registerUser',
    method: 'post',
    data
  })
}

// 编辑用户
export function updateUser(data) {
  return request({
    url: '/organization/user/' + data.id,
    method: 'put',
    data
  })
}

export function edit(data) {
  return request({
    url: '/organization/user/'+ data.id,
    method: 'put',
    data
  })
}

// 修改用户基本信息
export function updateUserBasic(data) {
  return request({
    url: '/organization/user/basic/' + data.id,
    method: 'put',
    data
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: '/organization/user/' + id,
    method: 'delete'
  })
}

export function del(ids) {
  return request({
    url: '/organization/user',
    method: 'delete',
    data:ids
  })
}

// 用户状态修改
export function changeUserEnabled(id, enabled) {
  const data = {
    id,
    enabled
  }
  return request({
    url: '/organization/user/changeEnabled',
    method: 'put',
    data: data
  })
}

// 导出用户
export function exportUser(data) {
  return request({
    url: '/organization/user/export',
    method: 'post',
    data
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/organization/user/resetPwd',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/organization/user/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/organization/user/avatar',
    method: 'post',
    data: data
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/organization/user/excel/importTemplate',
    method: 'get'
  })
}

export default { add, edit, del }
