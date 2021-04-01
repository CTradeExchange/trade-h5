import { createStore } from 'vuex'
import Base from '@/store/modules/base'
import User from '@/store/modules/user'
import Quote from '@/store/modules/quote'
import Trade from '@/store/modules/trade'
import { getListByParentCode } from '@/api/base'

const rootElement = getComputedStyle(document.documentElement)
const style = {
    primary: rootElement.getPropertyValue('--primary'),
    red: rootElement.getPropertyValue('--red'),
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
        productActivedID: null, // 当前操作的产品ID
        zoneList: [],
    },
    getters: {
        productActived (state) {
            return state._quote.productMap[state.productActivedID]
        }
    },
    mutations: {
        Update_quoteMode (state, data = 1) {
            state.quoteMode = data
        },
        Update_productActivedID (state, id) {
            sessionStorage.setItem('productActived', JSON.stringify(state._quote.productMap[id]))
            state.productActivedID = id
        },
        Update_zoneList (state, list) {
            state.zoneList = list
        },
    },
    actions: {
        // 获取国家验区号
        getListByParentCode ({ dispatch, commit, state }) {
            return getListByParentCode({ parentCode: 'phone_code' }).then(res => {
                if (res.check()) {
                    res.data.forEach(el => {
                        el.name += ' ' + el.code
                    })
                    commit('Update_zoneList', res.data)
                }
                return res
            })
        },
    }
})
