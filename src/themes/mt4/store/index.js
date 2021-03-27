import { createStore } from 'vuex'
import Base from '@/store/modules/base'
import User from '@/store/modules/user'
import Quote from '@/store/modules/quote'
import Trade from '@/store/modules/trade'

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
        zoneList: [{ name: '中国(86)', value: 86 }, ...new Array(100).fill({ name: 'other(88)', value: 88 })],
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
            state.productActivedID = id
        },
    },
    actions: {
    }
})
