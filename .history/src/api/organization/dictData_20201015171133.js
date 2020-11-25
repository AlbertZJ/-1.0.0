import request from '@/utils/request'

export function queryDictData(data) {
  return request({
    url: '/organization/dict/data/conditions',
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: '/organization/dict/data/' + id,
    method: 'get'
  })
}

export function getAllPositions() {
  return request({
    url: '/organization/dict/data/all',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/organization/dict/data',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/organization/dict/data/' + data.id,
    method: 'put',
    data
  })
}

export function del(ids) {
  return request({
    url: '/organization/dict/data',
    method: 'delete',
    data: ids
  })
}

export default { add, edit, del }
