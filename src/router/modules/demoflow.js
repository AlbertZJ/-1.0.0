/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const demoflowsRouter = {
  path: '/demoflows',
  component: Layout,
  redirect: '/demoflows/register',
  name: 'Demoflows',
  meta: {
    roles: ['Admin', 'TheBackendDevelopment', 'Front-endDevelopment', 'ExternalVisitor'],
    title: '流程演示',
    icon: 'chart'
  },
  children: [
    {
      path: '/demoflows/expense',
      name: 'Expense',
      component: () => import('@/views/demoflows/expense'),
      meta: {
        roles: ['Admin', 'TheBackendDevelopment'],
        title: '报销管理',
        icon: 'link'
      }
    },
    {
      path: '/demoflows/leave',
      name: 'Leave',
      component: () => import('@/views/demoflows/leave'),
      meta: {
        roles: ['Admin', 'TheBackendDevelopment'],
        title: '请假管理',
        icon: 'link'
      }
    }
  ]
}

export default demoflowsRouter
