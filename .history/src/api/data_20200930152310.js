import request from '@/utils/request'
import qs from 'qs'

// export function initData(url, params) {
//   return request({
//     url: url + '?' + qs.stringify(params, { indices: false }),
//     method: 'get'
//   })
// }
export function initData(url, data) {
  return request({
    url: url +'/conditions',
    method: 'post',
    data
  })
}

export function download(url, params) {
  return request({
    url: url + '?' + qs.stringify(params, { indices: false }),
    method: 'get',
    responseType: 'blob'
  })
}

// export function download(url, data) {
//   return request({
//     url: url ,
//     method: 'post',
//     responseType: 'blob',
//     data
//   })
// }
