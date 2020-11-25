import request from '@/utils/request'

export function queryDept(data) {
  return request({
    url: '/organization/group/conditions',
    method: 'post',
    data
  })
}

export function searchDept(data) {
  return request({
    url: '/organization/group/searchDept',
    method: 'post',
    data
  })
}

export function getDepts(data) {
  return request({
    url: '/organization/group/conditions',
    method: 'post',
    data
  })
}

export function getDeptSuperior(ids) {
  const data = ids.length || ids.length === 0 ? ids : Array.of(ids)
  return request({
    url: '/organization/group/conditions',
    method: 'post',
    data
  })
}

export function getAllDepts() {
  return request({
    url: '/organization/group/all',
    method: 'get'
  })
}

export function fetchDeptByParentId(id) {
  return request({
    url: '/organization/group/parent/' + id,
    method: 'get'
  })
}

export function getDept(id) {
  return request({
    url: '/organization/group/' + id,
    method: 'get'
  })
}

export function createDept(data) {
  return request({
    url: '/organization/group',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: '/organization/group',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/organization/group/' + data.id,
    method: 'put',
    data
  })
}

export function updateDept(data) {
  return request({
    url: '/organization/group/' + data.id,
    method: 'put',
    data
  })
}

export function del(ids) {
  return request({
    url: '/organization/group',
    method: 'delete',
    data: ids
  })
}

export function queryAllDept() {
  return request({
    url: '/organization/group/all',
    method: 'get'
  })
}

export default { add, edit, del, getDepts, getDeptSuperior }
