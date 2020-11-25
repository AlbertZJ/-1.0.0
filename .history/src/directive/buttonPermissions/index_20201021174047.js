import buttonPermissions from './buttonPermissions'

const install = function(Vue) {
  Vue.directive('buttonPermissions', buttonPermissions)
}

if (window.Vue) {
  window['buttonPermissions'] = buttonPermissions
  Vue.use(install); // eslint-disable-line
}

buttonPermissions.install = install
export default buttonPermissions
