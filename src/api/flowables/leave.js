import request from '@/utils/request'

// 请假 信息控制层
export function getLeave() {
  return request({
    url: '/flowable-modeler/demo/leave',
    method: 'get'
  })
}

// 查询请假列表
export function getLeaveList(data) {
  return request({
    url: '/flowable-modeler/demo/leave/list',
    method: 'get',
    data
  })
}

// 新增请假
export function addLeave() {
  return request({
    url: '/flowable-modeler/demo/leave/add',
    method: 'get'
  })
}

// 新增保存请假
export function addSaveLeave(data) {
  return request({
    url: '/flowable-modeler/demo/leave/add',
    method: 'post',
    data
  })
}

// 修改保存请假
export function updateSaveLeave(data) {
  return request({
    url: '/flowable-modeler/demo/leave/edit',
    method: 'post',
    data
  })
}

// 修改请假
export function updateLeave(data) {
  return request({
    url: '/flowable-modeler/demo/leave/edit/' + data.LeaveId,
    method: 'get',
    data
  })
}

//  删除请假
export function deleteLeave(data) {
  return request({
    url: '/flowable-modeler/demo/leave/remove',
    method: 'post',
    data
  })
}

