import { createStore } from 'vuex'
import Base from '@/store/modules/base'
import User from '@/store/modules/user'
import Quote from '@/store/modules/quote'
import Trade from '@/store/modules/trade'
import { getListByParentCode, getCountryListByParentCode } from '@/api/base'
import Colors from '@plans/colorVariables'
import { localGet, localSet } from '@/utils/util'

const style = {
    ...Colors
}
const supportLanguages = [
    { val: 'zh-CN', name: '中文' },
    { val: 'en-US', name: 'English' },
]

export default createStore({
    modules: {
        _base: Base,
        _user: User,
        _quote: Quote,
        _trade: Trade,
    },
    state: {
        style,
        disabledSuccAnimtion: false,
        invertColor: localGet('invertColor') || 'light', // 黑夜模式
        zoneList: [],
        bankDict: [],
        supportLanguages: supportLanguages,
        countryList: [],
        cacheViews: ['Layout'],
        currencyList: []
    },
    getters: {
        productActived (state) {
            return JSON.parse('{"symbolKey":"59_5","symbolId":59,"tradeType":5,"pointRatio":null,"customerGroupIds":null,"displayName":"BTC/USDT","dealMode":1,"baseCurrency":"BTC","bidSpread":null,"symbolGroupIds":null,"symbolCode":"BTCUSDT","profitCurrency":"USDT","symbolName":"BTC/USDT","symbolDigits":2,"class":"com.cats.config.api.vo.open.OpenSymbolDetailVo","askSpread":null,"symbol_id":"59","spread_text":"NaN","buy_price_pre":"62326.17","sell_price_pre":"62286.91","cur_price_pre":"62322.27","yesterday_close_price":"60917.18","price_digits":2,"cur_color":"grayColor","buy_color":"grayColor","sell_color":"grayColor","upDownAmount":"1405.09","upDownAmount_pip":"","upDownWidth":"2.31%","upDownColor":"riseColor","trade_type":5,"trade_mode":1,"seq":"1064613393","tick_time":"1635521698850","price":"62322.27","tick_deep":[{"price_bid":"62286.91","price_ask":"62326.17","volume_bid":"0.002246","volume_ask":"0.006763"}],"open_price":"61557.42","close_price":"62322.27","high_price":"62464.70","low_price":"60520.05","cur_price":"62322.27","sell_price":"62286.91","buy_price":"62326.17","weekendLeadTime":null,"borrowStatusList":null,"fee":null,"borrowingLimitRatio":0.009,"eodTime":null,"holidayLeadTime":null,"priceMinLimit":null,"stopLossMaxPoint":null,"feeMethod":null,"buyInterest":null,"priceMaxLimit":null,"sellInterest":null,"multipleFreezeRatio":0.3,"borrowInterestList":null,"beforeHolidayMarginSet":null,"dailyMarginSet":null,"transferLimitRatio":0,"stopLossMinPoint":null,"beforeWeekendMarginSet":null,"feeRate":0.28,"usedMarginSet":null,"earlyWarningProportion":0.002,"borrowLimitList":null,"tradeTimeList":[{"dayOfWeek":5,"startTime":0,"endTime":1439,"class":"com.cats.config.api.vo.open.OpenSymbolDetailVo$TradeTime"},{"dayOfWeek":7,"startTime":0,"endTime":1440,"class":"com.cats.config.api.vo.open.OpenSymbolDetailVo$TradeTime"},{"dayOfWeek":6,"startTime":0,"endTime":1440,"class":"com.cats.config.api.vo.open.OpenSymbolDetailVo$TradeTime"},{"dayOfWeek":3,"startTime":0,"endTime":1430,"class":"com.cats.config.api.vo.open.OpenSymbolDetailVo$TradeTime"},{"dayOfWeek":2,"startTime":0,"endTime":1399,"class":"com.cats.config.api.vo.open.OpenSymbolDetailVo$TradeTime"},{"dayOfWeek":1,"startTime":0,"endTime":1439,"class":"com.cats.config.api.vo.open.OpenSymbolDetailVo$TradeTime"},{"dayOfWeek":4,"startTime":0,"endTime":1439,"class":"com.cats.config.api.vo.open.OpenSymbolDetailVo$TradeTime"}],"startTime":null,"contractSize":null,"quoteTimeList":[],"totalCredit":null,"maxVolume":1000,"feeFormula":"1","volumeStep":0.000001,"holidayTimeList":[{"startTime":1629279900334,"endTime":1629280200334,"class":"com.cats.config.api.vo.open.OpenSymbolDetailVo$HolidayTime"}],"leverRatio":"1","marginType":0,"weekendMarginSet":null,"minVolume":0.000001,"endTime":null,"holidayMarginSet":null}')
            return state._quote.productMap[state._quote.productActivedID]
        },
        customerGroupId (state) { // 用户组ID
            return state._user.customerInfo?.customerGroupId ?? state._base.wpCompanyInfo?.customerGroupId
        },
        // 用户自选列表
        userSelfSymbolList (state, getters,) {
            if (state._user.customerInfo?.optional === 1) {
                // return state._user.selfSymbolList
                const selfSymbolList = state._user.selfSymbolList
                const result = {}
                Object.keys(selfSymbolList).forEach(el => {
                    result[el] = selfSymbolList[el].map(item => item.symbolId)
                })
                return result
            } else {
                const wpSelfSymbol = state._base.wpSelfSymbol
                const selfSymbolData = wpSelfSymbol.find(el => el.tag === 'selfSymbol')?.data?.product || {}
                const customerGroupId = getters.customerGroupId
                const newSelfSymbolData = {}
                Object.keys(selfSymbolData).forEach(el => {
                    newSelfSymbolData[el] = selfSymbolData[el][customerGroupId] ?? []
                })
                return newSelfSymbolData
            }
        },
        // 用户产品板块
        userProductCategory (state, getters) {
            const customerGroupId = getters.customerGroupId
            const wpProductCategory = state._base.wpProductCategory
            const quoteListConfig = wpProductCategory.find(el => el.tag === 'quoteList')
            if (!quoteListConfig) return {}
            const categories = quoteListConfig.data.tradeTypeBlock || {}
            Object.keys(categories).forEach(tradeType => {
                categories[tradeType].forEach(el => {
                    el.listByUser = el.list[customerGroupId] ?? []
                })
            })
            return categories
        },
    },
    mutations: {
        Update_style (state, data) {
            state.style = data
        },
        Update_quoteMode (state, data = 1) {
            state.quoteMode = data
        },
        Update_zoneList (state, list) {
            state.zoneList = list
        },
        Update_bankList (state, list) {
            state.bankDict = list
        },
        Update_countryList (state, list) {
            state.countryList = list
        },
        Update_invertColor (state, data) {
            state.invertColor = data
            localSet('invertColor', data)
        },
        add_cacheViews (state, routeName) {
            if (!routeName) return false
            if (state.cacheViews.indexOf('Layout') === -1) state.cacheViews.push('Layout')
            if (state.cacheViews.includes(routeName)) return false
            state.cacheViews.push(routeName)
        },
        del_cacheViews (state, routeName) {
            if (!routeName) return false
            const _index = state.cacheViews.findIndex(el => el === routeName)
            if (_index > -1) {
                state.cacheViews.splice(_index, 1)
            }
        },
        Update_disabledSuccAnimtion (state, data) {
            state.disabledSuccAnimtion = data
        },
        Update_currencyList (state, data) {
            state.currencyList = data
        },
        Update_supportLanguages (state, data) {
            state.supportLanguages = data
        }
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
            return getListByParentCode({ parentCode: 'bank_code' }).then(res => {
                if (res.check()) {
                    commit('Update_bankList', res.data)
                }
                return res
            })
        },
        getCountryListByParentCode ({ dispatch, commit, state }) {
            return getCountryListByParentCode({ parentCode: '-1' }).then(res => {
                if (res.check()) {
                    commit('Update_countryList', res.data)
                }
                return res
            })
        },
        getCurrencyList ({ dispatch, commit, state }, params) {
            return getListByParentCode(
                { parentCode: params || 'digit_wallet_withdraw_currency' }).then(res => {
                if (res.check()) {
                    if (params) {
                        state.currencyList.map(item => {
                            if (item.name === params) {
                                item.subList = res.data
                            }
                        })
                        // currencyObj.subList = res.data
                        // commit('Update_currencyList', currencyObj)
                        return
                    }
                    commit('Update_currencyList', res.data)
                }
                return res
            })
        }

    }
})
