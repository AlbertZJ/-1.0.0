import request from '@/utils/request'

export function queryGateway(data) {
  data.orders = data.order
  return request({
    url: '/gateway-admin/gateway/routes/conditions',
    method: 'post',
    data
  })
}

export function addGateway(data) {
  data.orders = data.order
  return request({
    url: '/gateway-admin/gateway/routes',
    method: 'post',
    data
  })
}

export function add(data) {
  data.orders = data.order
  return request({
    url: '/gateway-admin/gateway/routes',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/gateway-admin/gateway/routes',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: '/gateway-admin/gateway/routes/' + data.id,
    method: 'put',
    data
  })
}

export function deleteGateway(ids) {
  return request({
    url: '/gateway-admin/gateway/routes',
    method: 'delete',
    data:ids
  })
}

export function updateGateway(data) {
  return request({
    url: '/gateway-admin/gateway/routes/' + data.id,
    method: 'put',
    data
  })
}

export function refreshGateway() {
  return request({
    url: '/gateway-admin/gateway/routes/overload',
    method: 'post'
  })
}


export default { add, edit, del }
