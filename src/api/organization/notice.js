import request from '@/utils/request'

export function queryNotice(data) {
  return request({
    url: '/organization/notice/conditions',
    method: 'post',
    data
  })
}

// 根据通知查询通知信息
export function getDicts(dictType) {
  return request({
    url: '/organization/notice/type/' + dictType,
    method: 'get'
  })
}

export function get(id) {
  return request({
    url: '/organization/notice/' + id,
    method: 'get'
  })
}

export function getAllNotices() {
  return request({
    url: '/organization/notice/all',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/organization/notice',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/organization/notice/' + data.id,
    method: 'put',
    data
  })
}

export function del(ids) {
  return request({
    url: '/organization/notice',
    method: 'delete',
    data: ids
  })
}

export default { add, edit, del }
