import request from '@/utils/request'

export function queryDictType(data) {
  return request({
    url: '/organization/dict/type/conditions',
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: '/organization/dict/type/' + id,
    method: 'get'
  })
}

export function getAllDictTypes() {
  return request({
    url: '/organization/dict/type/all',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/organization/dict/type',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/organization/dict/type/' + data.id,
    method: 'put',
    data
  })
}

export function del(ids) {
  return request({
    url: '/organization/dict/type',
    method: 'delete',
    data: ids
  })
}

export default { add, edit, del }
