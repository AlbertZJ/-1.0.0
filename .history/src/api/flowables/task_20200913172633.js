import request from '@/utils/request'

// 我的任务（待发送、已发送、已办结）
export function myself(type) {
  return request({
    url: '/flowable-modeler/flowable/task/myself/' + type,
    method: 'get'
  })
}

// 待办任务、已办（经办）任务、办结任务
export function getTaskList(type) {
  return request({
    url: '/flowable-modeler/flowable/task/' + type,
    method: 'get'
  })
}

// export function queryTask(data) {
//   return request({
//     url: '/flowable-modeler/flowable/task/conditions',
//     method: 'post',
//     data
//   })
// }

// 任务数据
export function getTask(type) {
  return request({
    url: '/flowable-modeler/flowable/task/list/' + type,
    method: 'get'
  })
}

// 任务办理页面（审批意见）
export function getSubmit(businessKey) {
  return request({
    url: '/flowable-modeler/flowable/task/submit/'+businessKey,
    method: 'get'
  })
}

// 保存结束任务办理
export function submitSave(data) {
  return request({
    url: '/flowable-modeler/flowable/task/submit',
    method: 'post',
    data
  })
}

// 获取选择下一步环节以及操作人员
export function assignee(businessKey,handleId,nodeId) {
  return request({
    url: '/flowable-modeler/flowable/task/nextAssignee/'+businessKey+'/'+handleId+'/'+nodeId,
    method: 'get'
  })
}

// 获取选择下一步环节以及操作人员
export function nextFlowNodes(businessKey,handleId) {
  return request({
    url: '/flowable-modeler/flowable/task/nextFlowNodes/'+businessKey+'/'+handleId,
    method: 'get'
  })
}

// 查看流程图
export function image(businessKey) {
  return request({
    url: '/flowable-modeler/flowable/task/image/'+businessKey,
    method: 'get'
  })
}

// 生成流程图
export function diagram(businessKey) {
  return request({
    url: '/flowable-modeler/flowable/task/diagram/'+businessKey,
    method: 'get'
  })
}

// 查看流程步骤详情
export function detail(businessKey) {
  return request({
    url: '/flowable-modeler/flowable/task/detail/'+businessKey,
    method: 'get'
  })
}

// export function updateTask(data) {
//   return request({
//     url: '/flowable-modeler/flowable/task/' + data.id,
//     method: 'put',
//     data
//   })
// }

// export function deleteTask(id) {
//   return request({
//     url: '/flowable-modeler/flowable/task/' + id,
//     method: 'delete'
//   })
// }

