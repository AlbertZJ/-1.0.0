import request from '@/utils/request'
// 登录
export function login(data) {
  const form = {
    username: data.username,
    password: data.password,
    slidingCode: data.slidingCode,
    grant_type: 'custom',
    scope: 'read'
  }
  // grant_type: 'password',
  return request({
    url: '/authorization-server/oauth/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic dGVzdF9jbGllbnQ6dGVzdF9zZWNyZXQ='
    },
    method: 'post',
    params: form
  })
}

export function getInfo(token) {
  return request({
    url: '/organization/user/profile',
    method: 'get'
  })
}

// export function getInfo(token) {
//   return request({
//     url: '/organization/user',
//     method: 'get',
//     params: { uniqueId: 'Admin' }
//   })
// }

// 登出
export function logout() {
  return Promise.resolve({
    code: '000000',
    mesg: '登出成功',
    time: new Date()
  })
}
