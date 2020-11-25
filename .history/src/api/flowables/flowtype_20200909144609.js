import request from '@/utils/request'

export function queryFlowtype(data) {
  return request({
    url: '/flowable-modeler/flowable/type/conditions',
    method: 'post',
    data
  })
}

export function getPosition(id) {
  return request({
    url: '/flowable-modeler/flowable/type/' + id,
    method: 'get'
  })
}

export function getAllPositions() {
  return request({
    url: '/flowable-modeler/flowable/type/all',
    method: 'get'
  })
}

export function createPosition(data) {
  return request({
    url: '/flowable-modeler/flowable/type',
    method: 'post',
    data
  })
}

export function updatePosition(data) {
  return request({
    url: '/flowable-modeler/flowable/type/' + data.id,
    method: 'put',
    data
  })
}

export function deletePosition(id) {
  return request({
    url: '/flowable-modeler/flowable/type/' + id,
    method: 'delete'
  })
}

