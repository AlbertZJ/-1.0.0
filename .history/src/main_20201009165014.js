import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import './styles/element-variables.scss'

import '@/styles/index.scss' // global css
import '@/assets/styles/zhuishu.scss'
import '@/assets/styles/thinkzhuishu.scss'


import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './assets/icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
//自定义表格工具扩展
import RightToolbar from "@/components/RightToolbar"
import Pagination from "@/components/Pagination"
import DateRangePicker from '@/components/DateRangePicker'
// import dict from './components/Dict'

import {thinn, parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, download, handleTree } from "@/utils/zhuishu";
import * as filters from './filters' // global filters

// Vue.use(dict)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 全局方法挂载
Vue.prototype.thinn = thinn
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.config.productionTip = false

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('DateRangePicker', DateRangePicker)
Vue.component('RightToolbar', RightToolbar)
// Vue.use(permission)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
