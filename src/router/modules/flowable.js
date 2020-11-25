/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const flowablesRouter = {
  path: '/flowables',
  component: Layout,
  redirect: '/flowables/register',
  name: 'ProcessManagement',
  meta: {
    roles: ['Admin', 'TheBackendDevelopment', 'Front-endDevelopment', 'ExternalVisitor'],
    title: '流程管理',
    icon: 'chart'
  },
  children: [
    {
      path: '/flowables/modeler',
      name: 'FlowTemplate',
      component: () => import('@/views/flowables/modeler'),
      meta: {
        roles: ['Admin', 'TheBackendDevelopment'],
        title: '流程模板',
        icon: 'link'
      }
    },
    {
      path: '/flowables/flowtype',
      name: 'FlowType',
      component: () => import('@/views/flowables/flowtype'),
      meta: {
        roles: ['Admin', 'TheBackendDevelopment'],
        title: '流程类型',
        icon: 'link'
      }
    },
    {
      path: '/flowables',
      component: () => import('@/views/flowables/release/index'),
      redirect: '/flowables/release/unpublished',
      name: 'Release',
      meta: {
        roles: ['Admin', 'TheBackendDevelopment'],
        title: '发布管理',
        icon: 'component'
      },
      children: [
        {
          path: '/flowables/release/unpublished',
          name: 'Unpublished',
          component: () => import('@/views/flowables/release/unpublished'),
          meta: {
            roles: ['Admin', 'TheBackendDevelopment'],
            title: '待发布',
            icon: 'link'
          }
        },
        {
          path: '/flowables/release/published',
          name: 'Published',
          component: () => import('@/views/flowables/release/published'),
          meta: {
            roles: ['Admin', 'TheBackendDevelopment'],
            title: '已发布',
            icon: 'link'
          }
        }
      ]
    },
    {
      path: '/flowables/bound',
      name: 'Bound',
      component: () => import('@/views/flowables/bound'),
      meta: {
        roles: ['Admin', 'TheBackendDevelopment'],
        title: '绑定流程',
        icon: 'link'
      }
    }
  ]
}

export default flowablesRouter
