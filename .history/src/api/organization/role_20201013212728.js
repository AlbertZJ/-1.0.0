import request from '@/utils/request'

export function queryRole(data) {
  return request({
    url: '/organization/role/conditions',
    method: 'post',
    data
  })
}

// 角色状态修改
export function changeRoleEnabled(id, enabled) {
  const data = {
    id,
    enabled
  }
  return request({
    url: '/organization/role/changeEnabled',
    method: 'put',
    data: data
  })
}

export function getRole(id) {
  return request({
    url: '/organization/role/' + id,
    method: 'get'
  })
}

export function getAllRoles() {
  return request({
    url: '/organization/role/all',
    method: 'get'
  })
}

export function createRole(data) {
  return request({
    url: '/organization/role',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/organization/role/' + data.id,
    method: 'put',
    data
  })
}


export function add(data) {
  return request({
    url: '/organization/role',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/organization/role',
    method: 'delete',
    data: ids
  })
}

export function get(id) {
  return request({
    url: '/organization/role/' + id,
    method: 'get'
  })
}

export function edit(data) {
  return request({
    url: '/organization/role/' + data.id,
    method: 'put',
    data
  })
}

export function editMenu(data) {
  return request({
    url: '/organization/role/menu/'+ data.id,
    method: 'put',
    data
  })
}

export function getLevel() {
  return request({
    url: '/organization/role/level',
    method: 'get'
  })
}

export default { add, edit, del, get, editMenu, getLevel }
