/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const flowablesRouter = {
  path: '/flowables',
  component: Layout,
  redirect: '/flowables/register',
  name: 'ProcessManagement',
  meta: {
    roles:['Admin','TheBackendDevelopment','Front-endDevelopment','ExternalVisitor'],
    title: '流程管理',
    icon: 'chart'
  },
  children: [
    {
      path: '/flowables/modeler',
      name: 'FlowTemplate',
      component: () => import('@/views/flowables/modeler'),
      meta: {
        roles:['Admin','TheBackendDevelopment'],
        title: '流程模板',
        icon: 'link'
      }
    },
    {
      path: '/flowables/modeler',
      name: 'FlowTemplate',
      component: () => import('@/views/flowables/modeler'),
      meta: {
        roles:['Admin','TheBackendDevelopment'],
        title: '流程类型',
        icon: 'link'
      }
    },
    {
      path: '/flowables/modeler',
      name: 'FlowTemplate',
      component: () => import('@/views/flowables/modeler'),
      meta: {
        roles:['Admin','TheBackendDevelopment'],
        title: '发布管理',
        icon: 'link'
      },
      children: [
        {
          path: '/flowables/release/modeler',
          name: 'Unpublished',
          component: () => import('@/views/flowables/release/unpublished'),
          meta: {
            roles:['Admin','TheBackendDevelopment'],
            title: '待发布',
            icon: 'link'
          }
        },
        {
          path: '/flowables/release/modeler',
          name: 'Published',
          component: () => import('@/views/flowables/release/publish'),
          meta: {
            roles:['Admin','TheBackendDevelopment'],
            title: '已发布',
            icon: 'link'
          }
        }
      ]
    },
    {
      path: '/flowables/modeler',
      name: 'FlowTemplate',
      component: () => import('@/views/flowables/modeler'),
      meta: {
        roles:['Admin','TheBackendDevelopment'],
        title: '绑定流程',
        icon: 'link'
      }
    }
  ]
}

export default flowablesRouter
