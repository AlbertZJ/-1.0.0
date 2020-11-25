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
    }
  ]
}

export default flowablesRouter
