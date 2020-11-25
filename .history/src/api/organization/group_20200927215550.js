import request from '@/utils/request'

export function queryGroup(data) {
  return request({
    url: '/organization/group/conditions',
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

export function updateDept(data) {
  return request({
    url: '/organization/group/' + data.id,
    method: 'put',
    data
  })
}

export function deleteDept(id) {
  return request({
    url: '/organization/group/' + id,
    method: 'delete'
  })
}

export function queryAllDept() {
  return request({
    url: '/organization/group/all',
    method: 'get'
  })
}
