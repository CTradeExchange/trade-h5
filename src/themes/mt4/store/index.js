import { createStore } from 'vuex'

const rootElement = getComputedStyle(document.documentElement)
const style = {
    primary: rootElement.getPropertyValue('--primary'),
    red: rootElement.getPropertyValue('--red'),
}

export default createStore({
    state: {
        style,
        quoteMode: 2, // 1简单模式 2高级模式
        zoneList: [{ name: '中国(86)', value: 86 }, ...new Array(100).fill({ name: 'other(88)', value: 88 })],
    },
    mutations: {
        Update_quoteMode (state, data = 1) {
            state.quoteMode = data
        }
    },
    actions: {
    },
    modules: {
    }
})
