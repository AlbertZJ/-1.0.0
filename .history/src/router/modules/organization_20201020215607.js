/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const organizationRouter = {
  path: '/organization',
  component: Layout,
  redirect: '/organization/user',
  name: 'OrganizationManagement',
  meta: {
    roles: ['Admin', 'TheBackendDevelopment'],
    title: '系统管理',
    icon: 'component'
  },
  children: [
    {
      path: '/organization/user',
      component: () => import('@/views/organization/user'),
      name: 'UserManagement',
      meta: {
        roles: ['Admin'],
        title: '用户管理',
        icon: 'peoples'
      }
    },
    {
      path: '/organization/role',
      component: () => import('@/views/organization/role'),
      name: 'RoleManagement',
      meta: {
        roles: ['Admin'],
        title: '角色管理',
        icon: 'role'
      }
    },
    {
      path: '/organization/resource',
      component: () => import('@/views/organization/resource'),
      name: 'ResourceManagement',
      meta: {
        roles: ['Admin', 'TheBackendDevelopment'],
        title: '资源管理',
        icon: 'guide'
      }
    },
    // {
    //   path: '/organization/menu',
    //   component: () => import('@/views/organization/menu'),
    //   name: 'Menu',
    //   meta: {
    //     title: '菜单架构',
    //     icon: 'group'
    //   }
    // },
    {
      path: '/organization/dept',
      component: () => import('@/views/organization/dept'),
      name: 'DeptManagement',
      meta: {
        roles: ['Admin'],
        title: '部门管理',
        icon: 'group'
      }
    },
    {
      path: '/organization/position',
      component: () => import('@/views/organization/position'),
      name: 'PositionManagement',
      meta: {
        roles: ['Admin'],
        title: '职位管理',
        icon: 'Steve-Jobs'
      }
    },
    {
      path: '/organization/dictData',
      component: () => import('@/views/organization/dictData'),
      name: 'DictDataManagement',
      meta: {
        roles: ['Admin'],
        title: '字典数据',
        icon: 'group'
      }
    },
    {
      path: '/organization/dictType',
      component: () => import('@/views/organization/dictType'),
      name: 'DictTypeManagement',
      meta: {
        roles: ['Admin'],
        title: '字典类型',
        icon: 'group'
      }
    },
    {
      path: '/organization/gateway',
      component: () => import('@/views/organization/gateway'),
      name: 'GatewayManagement',
      meta: {
        roles: ['Admin', 'TheBackendDevelopment'],
        title: '路由管理',
        icon: 'guide'
      }
    }
  ]
}

// 假设有两种角色：admin 和 user
// 从后台获取的用户角色
// const role = ['admin','TheBackendDevelopment']
// 当进入一个页面是会触发导航守卫 router.beforeEach 事件
// router.beforeEach((to,next)=>{
// 	if(to.meta.roles.includes(role)){
// 		next()	//放行
//   }
//   next()
// else{
// 	next({path:"/"})	//跳到404页面
// }
// })

export default organizationRouter
