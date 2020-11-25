import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function get() {
  return request({
    url: '/routes',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function edit(id, data) {
  return request({
    url: `/role/${id}`,
    method: 'put',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/role/${id}`,
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: `/role/${id}`,
    method: 'delete'
  })
}

export function getLevel() {
  return request({
    url: '/role/level',
    method: 'get'
  })
}

export function deleteRole(id) {
  return request({
    url: `/role/${id}`,
    method: 'delete'
  })
}

export default { add, edit, del, get, editMenu, getLevel }
