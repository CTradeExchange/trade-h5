import { queryPositionPage, queryOrderPage } from '@/api/trade'

export default {
    namespaced: true,
    state: {
        positionLoading: '', // 持仓列表加载
        positionList: [], // 持仓列表
        historyLoading: false, // 历史记录加载
        historyList: '', // 订单列表
    },
    mutations: {
        Update_positionLoading (state, data) {
            state.positionLoading = data
        },
        Update_positionList (state, data) {
            state.positionList = data
        },
        Update_historyLoading (state, data) {
            state.historyLoading = data
        },
        Update_historyList (state, data) {
            state.historyList = data
        },
    },
    actions: {
        // 查询持仓列表
        queryPositionPage ({ dispatch, commit, state, rootState }, params = {}) {
            commit('Update_positionLoading', true)
            return queryPositionPage(params).then((res) => {
                commit('Update_positionLoading', false)
                if (res.check()) {
                    commit('Update_positionList', res.data)
                }
                return res
            })
        },
        // 查看订单列表
        queryOrderPage ({ dispatch, commit, state, rootState }, params = {}) {
            commit('Update_historyLoading', true)
            return queryOrderPage(params).then((res) => {
                commit('Update_historyLoading', false)
                if (res.check()) {
                    commit('Update_historyList', res.data)
                }
                return res
            })
        },
    }
}
