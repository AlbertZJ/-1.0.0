import request from '@/utils/request'

// 费用报销 信息控制层
export function getExpense() {
  return request({
    url: '/flowable-modeler/demo/expense' ,
    method: 'get'
  })
}

// 查询费用报销列表
export function getExpenseList(data) {
  return request({
    url: '/flowable-modeler/demo/expense/list',
    method: 'get',
    data
  })
}

// 新增费用报销
export function addExpense() {
  return request({
    url: '/flowable-modeler/demo/expense/add',
    method: 'get'
  })
}

// 新增保存费用报销
export function addSaveExpense(data) {
  return request({
    url: '/flowable-modeler/demo/expense/add',
    method: 'post',
    data
  })
}



// 修改保存费用报销
export function updateSaveExpense(data) {
  return request({
    url: '/flowable-modeler/demo/expense/edit',
    method: 'post',
    data
  })
}

// 修改费用报销
export function updateExpense(data) {
  return request({
    url: '/flowable-modeler/demo/expense/edit/' + data.expenseId,
    method: 'get',
    data
  })
}

// 删除费用报销
export function deleteExpense(data) {
  return request({
    url: '/flowable-modeler/demo/expense/remove' ,
    method: 'post',
    data
  })
}

