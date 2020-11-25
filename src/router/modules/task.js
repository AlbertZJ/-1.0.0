/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const tasksRouter = {
  path: '/tasks',
  component: Layout,
  redirect: '/tasks/register',
  name: 'TaskManagement',
  meta: {
    roles: ['Admin', 'TheBackendDevelopment', 'Front-endDevelopment', 'ExternalVisitor'],
    title: '任务管理',
    icon: 'chart'
  },
  children: [
    {
      path: '/tasks',
      component: () => import('@/views/tasks/mytask/index'),
      redirect: '/tasks/mytask/stay',
      name: 'Mytask',
      meta: {
        roles: ['Admin', 'TheBackendDevelopment'],
        title: '我的任务',
        icon: 'component'
      },
      children: [
        {
          path: '/tasks/mytask/stay',
          name: 'Stay',
          component: () => import('@/views/tasks/mytask/stay'),
          meta: {
            roles: ['Admin', 'TheBackendDevelopment'],
            title: '待发送',
            icon: 'link'
          }
        },
        {
          path: '/tasks/mytask/sent',
          name: 'Sent',
          component: () => import('@/views/tasks/mytask/sent'),
          meta: {
            roles: ['Admin', 'TheBackendDevelopment'],
            title: '已发送',
            icon: 'link'
          }
        },
        {
          path: '/tasks/mytask/completed',
          name: 'Completed',
          component: () => import('@/views/tasks/mytask/completed'),
          meta: {
            roles: ['Admin', 'TheBackendDevelopment'],
            title: '已办结',
            icon: 'link'
          }
        }
      ]
    },
    {
      path: '/tasks/backlog',
      name: 'Backlog',
      component: () => import('@/views/tasks/backlog'),
      meta: {
        roles: ['Admin', 'TheBackendDevelopment'],
        title: '待办任务',
        icon: 'link'
      }
    },
    {
      path: '/tasks/handle',
      name: 'Handle',
      component: () => import('@/views/tasks/handle'),
      meta: {
        roles: ['Admin', 'TheBackendDevelopment'],
        title: '经办任务',
        icon: 'link'
      }
    },
    {
      path: '/tasks/finished',
      name: 'Finished',
      component: () => import('@/views/tasks/finished'),
      meta: {
        roles: ['Admin', 'TheBackendDevelopment'],
        title: '办结任务',
        icon: 'link'
      }
    }
  ]
}

export default tasksRouter
