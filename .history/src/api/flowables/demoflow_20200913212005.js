import request from '@/utils/request'

// 绑定用户管理
export function bindUser() {
  return request({
    url: '/flowable-modeler/flowable/user',
    method: 'get'
  })
}

// 获取用户列表
export function getUserList(data) {
  return request({
    url: '/flowable-modeler/flowable/user/list',
    method: 'get',
    data
  })
}

// export function queryTask(data) {
//   return request({
//     url: '/flowable-modeler/flowable/user/conditions',
//     method: 'post',
//     data
//   })
// }

// 选择绑定已发布的流程
export function bindPublished(userId) {
  return request({
    url: '/flowable-modeler/flowable/user/binding/' + userId,
    method: 'get'
  })
}

// 用户绑定流程
export function binding() {
  return request({
    url: '/flowable-modeler/flowable/user/binding',
    method: 'post'
  })
}

// 选择已绑定的流程
export function binded(userId) {
  return request({
    url: '/flowable-modeler/flowable/user/binded/'+userId,
    method: 'get'
  })
}

// 用户已绑定的数据
export function listBinded(userId) {
  return request({
    url: '/flowable-modeler/flowable/user/list/binded/'+userId,
    method: 'get'
  })
}

// 用户取消绑定流程
export function unbinded(data) {
  return request({
    url: '/flowable-modeler/flowable/user/unbinded',
    method: 'post',
    data
  })
}


// export function updateTask(data) {
//   return request({
//     url: '/flowable-modeler/flowable/user/' + data.id,
//     method: 'put',
//     data
//   })
// }

// export function deleteTask(id) {
//   return request({
//     url: '/flowable-modeler/flowable/user/' + id,
//     method: 'delete'
//   })
// }

