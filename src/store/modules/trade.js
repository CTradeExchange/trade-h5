import { queryPositionPage, queryHistoryCloseOrderList } from '@/api/trade'
import CheckAPI from '@/utils/checkAPI';

export default {
    namespaced: true,
    state: {
        positionLoading: '', // 持仓列表加载
        positionList: [], // 持仓列表
        historyLoading: false, // 历史记录加载
        historyList: '', // 平仓历史记录列表
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
            const accountListLen = rootState._user.customerInfo?.accountList?.length
            if(!accountListLen) return Promise.resolve(new CheckAPI({code:'0',data:[]})) //没有交易账户直接返回空持仓
            commit('Update_positionLoading', true)
            return queryPositionPage(params).then((res) => {
                commit('Update_positionLoading', false)
                if (res.check()) {
                    commit('Update_positionList', res.data)
                }
                return res
            })
        },
        // 平仓历史记录列表
        queryHistoryCloseOrderList ({ dispatch, commit, state, rootState }, params = {}) {
            const accountListLen = rootState._user.customerInfo?.accountList?.length
            if(!accountListLen) return Promise.resolve(new CheckAPI({code:'0',data:[]})) //没有交易账户直接返回空数据
            commit('Update_historyLoading', true)
            return queryHistoryCloseOrderList(params).then((res) => {
                commit('Update_historyLoading', false)
                if (res.check()) {
                    commit('Update_historyList', res.data)
                }
                return res
            })
        },
    }
}
