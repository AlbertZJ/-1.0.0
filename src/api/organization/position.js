import request from '@/utils/request'

export function queryPosition(data) {
  return request({
    url: '/organization/position/conditions',
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: '/organization/position/' + id,
    method: 'get'
  })
}

export function getAllPositions() {
  return request({
    url: '/organization/position/all',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/organization/position',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/organization/position/' + data.id,
    method: 'put',
    data
  })
}

export function del(ids) {
  return request({
    url: '/organization/position',
    method: 'delete',
    data: ids
  })
}

export default { add, edit, del }
