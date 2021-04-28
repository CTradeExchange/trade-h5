import { pageConfig, wpCompanyConfig, wpNav, wpSelfSymbolIndex } from '@/api/wpApi'
import { isEmpty, unzip } from '@/utils/util'
import User from './user'

export default {
    namespaced: true,
    state: {
        wpCompanyInfo: null, //   wordpress公司配置信息
        wpNav: null, //   wordpress公司配置信息
        tradeType: localStorage.getItem('tradeType'), //   先存储公司默认的玩法类型，用户登录后存储用户的玩法类型
    },
    mutations: {
        UPDATE_wpCompanyInfo (state, data) {
            sessionStorage.setItem('companyId', data.companyId)
            state.wpCompanyInfo = data
        },
        UPDATE_wpNav (state, data) {
            state.wpNav = data
        },
        UPDATE_tradeType (state, type) {
            localStorage.setItem('tradeType', String(type))
            state.tradeType = type
        },
    },
    actions: {
        // 获取公司配置信息
        getCompanyInfo ({ dispatch, commit, state }) {
            return wpCompanyConfig().then(async data => {
                if (data) {
                    // data.customerGroupId= 1;
                    commit('UPDATE_wpCompanyInfo', data)
                    commit('UPDATE_tradeType', data.tradeTypeList[0]['id']) // 先存储公司默认的玩法类型
                }
                // 自选产品
                const selfSymbolData = await wpSelfSymbolIndex()

                // const guestCustomerGroupId = sessionStorage.getItem('guestCustomerGroupId')
                // const wp_SelfSymbolIndex = JSON.parse(unzip(window['wp_SelfSymbolIndex']))
                // const products = wp_SelfSymbolIndex[0].data.product
                // // const customerInfo = this.$store.state._user.customerInfo

                // console.log('user', User.state.customerInfo)
                // debugger
                // const products = selfSymbolData[0].data.product
                if (selfSymbolData) {
                    const productList = selfSymbolData.symbol_ids.map(el => ({ symbolId: el }))

                    commit('_quote/Update_productList', productList, { root: true })
                    commit('_quote/Update_productActivedID', selfSymbolData.symbol_ids[0], { root: true })
                }
                return data
            })
        },
        // 获取底部导航配置
        getNav ({ dispatch, commit, state }) {
            return wpNav().then(data => {
                if (data) {
                    commit('UPDATE_wpNav', data)
                }
                return data
            })
        },
    }
}
