import { createStore } from 'vuex'
import editor from './modules/editor'
import getters from './mockStore/getters'
import Base from '@/store/modules/base'
import User from '@/store/modules/user'
import Quote from '@/store/modules/quote'
import Trade from '@/store/modules/trade'

export default createStore({
    modules: {
        editor,
        _base: Base,
        _user: User,
        _quote: Quote,
        _trade: Trade,
    },
    getters,
    state: {
        style: {
            primary: '#477fd3',
            riseColor: '#F60000',
            fallColor: '#26a69a',
            warn: '#ef5353',
            success: '#26a69a',
            focusColor: '#f2a11b',
            primaryAssistColor: '#f4f7fc',
            color: '#333333',
            normalColor: '#656667',
            minorColor: '#999999',
            placeholdColor: '#c2c2c2',
            contentColor: '#ffffff',
            bgColor: '#f8f8f8',
            assistColor: '#f8f8f8',
            lineColor: '#eeeeee'
        }
    },
    mutations: {},
    actions: { }
})
