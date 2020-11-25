const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => "/profile/avatar/2020/08/06/bb61f414-8cf7-4f72-aeef-16c63083db07.jpeg",
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  nacosServer: state => state.api.nacosServer,
  nacosRegister: state => state.api.nacosRegister,
  sentinelDashboard: state => state.api.sentinelDashboard,
  mossServer: state => state.api.mossServer,
  swaggerApi: state => state.api.swaggerApi,
  zipkinServer: state => state.api.zipkinServer,
  kibanaServer: state => state.api.kibanaServer,
  grafanaServer: state => state.api.grafanaServer,
  rabbitmqServer: state => state.api.rabbitmqServer

}
export default getters
