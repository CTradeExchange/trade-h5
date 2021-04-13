import { createStore } from 'vuex'
import Base from '@/store/modules/base'
import User from '@/store/modules/user'
import Quote from '@/store/modules/quote'
import Trade from '@/store/modules/trade'
import { getListByParentCode, getBankDict } from '@/api/base'
import Colors from '@m/colorVariables'

const style = {
    ...Colors
}

export default createStore({
    modules: {
        _base: Base,
        _user: User,
        _quote: Quote,
        _trade: Trade,
    },
    state: {
        style,
        quoteMode: 2, // 1简单模式 2高级模式
        zoneList: [],
        bankDict: []
    },
    getters: {
        productActived (state, getters, rootState) {
            return state._quote.productMap[rootState._quote.productActivedID]
        }
    },
    mutations: {
        Update_quoteMode (state, data = 1) {
            state.quoteMode = data
        },
        Update_zoneList (state, list) {
            state.zoneList = list
        },
        Update_bankList (state, list) {
            state.bankDict = list
        },

    },
    actions: {
        // 获取国家验区号
        getListByParentCode ({ dispatch, commit, state }) {
            return getListByParentCode({ parentCode: 'phone_code' }).then(res => {
                if (res.check()) {
                    // res.data.forEach(el => {
                    //     el.name += ' ' + el.code
                    // })
                    commit('Update_zoneList', res.data)
                }
                return res
            })
        },

        getBankDictList ({ dispatch, commit, state }) {
            return getBankDict({ parentCode: 'bank_code' }).then(res => {
                if (res.check()) {
                    // res.data.forEach(el => {
                    //     el.name += ' ' + el.code
                    // })
                    commit('Update_bankList', res.data)
                }
                return res
            })
        }
    }
})
