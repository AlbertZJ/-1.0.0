const baseUrl = process.env.VUE_APP_BASE_API
const api = {
  state: {
    // 注册中心
    nacosServer: 'http://192.168.1.117:8848/nacos/#/configurationManagement?dataId=&group=&appName=&namespace=',
    // 配置中心
    nacosRegister: 'http://192.168.1.117:8848/nacos/#/serviceManagement?dataId=&group=&appName=&namespace=',
    sentinelDashboard: 'http://192.168.1.117:8180/#/login',
    zipkinServer: 'http://192.168.1.117:9411',
    kibanaServer: 'http://192.168.1.117:5601',
    grafanaServer: 'http://192.168.1.117:3000',
    rabbitmqServer: 'http://127.0.0.1:15672/#/',
    modelerServer: 'http://localhost:9000',
    mossServer: 'http://localhost:8022/login',
    // swagger
    swaggerApi: baseUrl + '/swagger-ui.html'
  }
}

export default api
