import { unzip, isEmpty } from '@/utils/util'
import request_wp from '@/utils/request_wp'

/* 获取wp公司配置信息 */
export const wpCompanyConfig = () => {
    return pageConfig('SysSetting')
}
// 获取自选产品
export const wpSelfSymbolIndex = () => pageConfig('SelfSymbolIndex')
export const wpNav = () => pageConfig('Nav')

/* 获取页面配置信息 */
export function pageConfig (id) {
    const NODE_ENV = process.env.NODE_ENV
    if (NODE_ENV === 'production') {
        let data = ''
        switch (id) {
        case 'SelfSymbolIndex':
            data = unzip(window['wp_SelfSymbolIndex'])
            break
        case 'Nav':
            data = unzip(window['wp_Nav'])
            break
        case 'Home':
            data = unzip(window['wp_Home'])
            break
        case 'TradeIndex':
            data = unzip(window['wp_TradeIndex'])
            break
        case 'PositionIndex':
            data = unzip(window['wp_PositionIndex'])
            break
        case 'Mine':
            data = unzip(window['wp_Mine'])
            break
        case 'SysSetting': // 获取wp公司配置信息
            data = window['wp_SysSetting']
            break
        case 'ChannelSett': // 获取wp公司配置信息
            data = window['wp_ChannelSett']
            break
        default:
            break
        }
        if (data) return Promise.resolve(JSON.parse(data))
    }
    return request_wp(`/${id}.json?timestamp=${Date.now()}`).then(res => {
        const reg = /^(\{|\[)/
        let content = res?._content || res || []
        content = reg.test(content) || typeof (content) === 'object' ? content : unzip(content)
        const data = typeof (content) === 'string' ? JSON.parse(content) : content
        if (id === 'SysSetting' && window['wp_SysSetting'] === '') window['wp_SysSetting'] = JSON.stringify(res)
        if (NODE_ENV === 'development' && id === 'SysSetting') {
            window['apiService'] = data.apiService
            window['quoteService'] = data.quoteService
            window['msgService'] = data.msgService
            window['tradeService'] = data.tradeService
        }
        return data
    })
}

// mock多玩法配置参数信息
// function mockQuoteData (data) {
//     const quoteListConfig = data.find(el => el.tag === 'quoteList')
//     const items = quoteListConfig.data.items
//     items.forEach(el => {
//         const { code_ids_all } = el
//         const ids_all = Object.assign({}, code_ids_all)
//         code_ids_all['1'] = ids_all
//         code_ids_all['2'] = ids_all
//         code_ids_all['3'] = ids_all
//     })
// }
