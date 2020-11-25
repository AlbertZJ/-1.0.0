import request from '@/utils/request'

// 流程模板管理控制器
export function getModeler() {
  return request({
    url: '/flowable-modeler/flowable/modeler',
    method: 'get'
  })
}

// 流程模板管理控制器添加
export function getModelerList() {
  return request({
    url: '/flowable-modeler/flowable/modeler/add',
    method: 'get'
  })
}

export function queryModeler(data) {
  return request({
    url: '/flowable-modeler/flowable/modeler/edit/' + data.modelId,
    method: 'get'
  })
}

// 预览流程图
export function preview(data) {
  return request({
    url: '/flowable-modeler/flowable/modeler/image/' + data.modelId,
    method: 'get',
    data
  })
}

// 预览流程图
export function diagram(id) {
  return request({
    url: '/flowable-modeler/flowable/modeler/diagram/' + id,
    method: 'get',
    responseType: 'blob'
  })
}

// 查询待发布流程
export function undeploy() {
  return request({
    url: '/flowable-modeler/flowable/modeler/undeploy',
    method: 'get'
  })
}

// 查询待发布流程
export function delay(data) {
  return request({
    url: '/flowable-modeler/flowable/modeler/list/undeploy',
    method: 'get',
    data
  })
}

//
export function deploy() {
  return request({
    url: '/flowable-modeler/flowable/modeler/deploy',
    method: 'get'
  })
}

// 查询已发布流程
export function released(data) {
  return request({
    url: '/flowable-modeler/flowable/modeler/list/deploy',
    method: 'get',
    data
  })
}

// 选择发布流程的流程类型
export function category(data) {
  return request({
    url: '/flowable-modeler/flowable/modeler/category/' + data.modelId,
    method: 'get',
    data
  })
}

// 发布流程
export function publish(data) {
  return request({
    url: '/flowable-modeler/flowable/modeler/deploy',
    method: 'post',
    data
  })
}

// 取消发布流程
export function abolish(data) {
  return request({
    url: '/flowable-modeler/flowable/modeler/undeploy',
    method: 'post',
    data
  })
}

// export function deleteModeler(id) {
//   return request({
//     url: '/flowable-modeler/flowable/modeler/' + id,
//     method: 'delete'
//   })
// }

