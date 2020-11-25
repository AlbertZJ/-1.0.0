/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const devopsRouter = {
  path: '/devops',
  component: Layout,
  redirect: '/devops/register',
  name: 'Devops',
  meta: {
    roles:['Admin','TheBackendDevelopment','Front-endDevelopment','ExternalVisitor'],
    title: '流程管理',
    icon: 'chart'
  },
  children: [
    {
      path: '/devops/modeler',
      name: 'FlowTemplate',
      component: () => import('@/views/devops/modeler'),
      meta: {
        roles:['Admin','TheBackendDevelopment'],
        title: '流程模板',
        icon: 'link'
      }
    }
  ]
}

export default flowableRouter
