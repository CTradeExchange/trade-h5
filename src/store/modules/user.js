import { login } from '@/api/user'

export default {
    namespaced: true,
    state: {
        info: '', // http接口登录的信息
        zone: '86', // 区号
        loginData: '', // login返回的信息
    },
    mutations: {
        Update_zone (state, data) {
            state.zone = data
        },
        Update_loginData (state, data) {
            state.loginData = data
        },
    },
    actions: {
        // 登录
        login ({ dispatch, commit, state }, params = {}) {
            return login(params).then((res) => {
                if (res.check()) {
                    sessionStorage.setItem('token', res.data.token)
                    commit('Update_loginData', res.data)
                }
                return res
            })
        },
    }
}
