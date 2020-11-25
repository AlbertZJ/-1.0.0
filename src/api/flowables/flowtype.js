import request from '@/utils/request'

export function queryFlowtype(data) {
  return request({
    url: '/flowable-modeler/flowable/type/conditions',
    method: 'post',
    data
  })
}

export function getFlowtype(id) {
  return request({
    url: '/flowable-modeler/flowable/type/' + id,
    method: 'get'
  })
}

export function getAllFlowtypes() {
  return request({
    url: '/flowable-modeler/flowable/type/all',
    method: 'get'
  })
}

export function createFlowtype(data) {
  return request({
    url: '/flowable-modeler/flowable/type/add',
    method: 'post',
    data
  })
}

export function updateFlowtype(data) {
  return request({
    url: '/flowable-modeler/flowable/type/' + data.id,
    method: 'put',
    data
  })
}

export function deleteFlowtype(id) {
  return request({
    url: '/flowable-modeler/flowable/type/' + id,
    method: 'delete'
  })
}

