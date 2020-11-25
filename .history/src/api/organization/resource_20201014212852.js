import request from '@/utils/request'

export function queryResource(data) {
  return request({
    url: '/organization/resource/conditions',
    method: 'post',
    data
  })
}

export function getResource(id) {
  return request({
    url: '/organization/resource/' + id,
    method: 'get'
  })
}

export function getAllResources() {
  return request({
    url: '/organization/resource/all',
    method: 'get'
  })
}

export function fetchResourceByParentId(id) {
  return request({
    url: '/organization/resource/parent/' + id,
    method: 'get'
  })
}

export function queryAllResource() {
  return request({
    url: '/organization/resource/all',
    method: 'get'
  })
}

export function createResource(data) {
  return request({
    url: '/organization/resource',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: '/organization/resource',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/organization/resource/' + data.id,
    method: 'put',
    data
  })
}

export function updateResource(data) {
  return request({
    url: '/organization/resource/' + data.id,
    method: 'put',
    data
  })
}

export function deleteResource(id) {
  return request({
    url: '/organization/resource/' + id,
    method: 'delete'
  })
}

export function del(ids) {
  return request({
    url: '/organization/resource',
    method: 'delete',
    data:ids
  })
}

export function refreshResource() {
  return request({
    url: '/organization/resource/overload',
    method: 'post'
  })
}

export default { add, edit, del }


