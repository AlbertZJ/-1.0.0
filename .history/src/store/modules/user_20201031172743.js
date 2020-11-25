import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
const baseUrl = process.env.VUE_APP_BASE_API
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, slidingCode } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password , slidingCode: slidingCode}).then(response => {
        if (response.code == '040003') {
          console.log("login::"+response.mesg)
          reject(error)
        }
        commit('SET_TOKEN', response.access_token)
        setToken(response.access_token)
        resolve()
      }).catch(error => {
        console.error(error + 'login')
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          // if(data.includes("Unauthorized")){
          //   reject('您无权限访问，请联系管理员.')
          // }
          reject('验证失败，请重新登录或您无权限访问，请联系管理员.')
        }
        const user = response.data
        const avatar = user.avatar == undefined ? require('../../assets/images/profile.jpg') : baseUrl + '/organization/oauth/img' + user.avatar
        const { roles, name, description } = data
        if (!roles || roles.length <= 0) {
          reject('角色必须是非空数组!')
        }
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', description)
        resolve(data)
      }).catch(error => {
        console.error(error + 'getinfo')
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        console.error(error + 'logout')
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  // 动态地修改权限
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'
      commit('SET_TOKEN', token)
      setToken(token)
      const { roles } = await dispatch('getInfo')
      resetRouter()
      // generate accessible routes map based on roles
      // 根据角色生成可访问路由图
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
      // dynamically add accessible routes
      // 动态添加可访问路由
      router.addRoutes(accessRoutes)
      // reset visited views and cached views
      // 重置已访问的视图和缓存的视图
      dispatch('tagsView/delAllViews', null, { root: true })
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
