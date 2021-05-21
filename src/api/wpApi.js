import { unzip, isEmpty } from '@/utils/util'
import request_wp from '@/utils/request_wp'

/* 获取wp公司配置信息 */
export const wpCompanyConfig = () => {
    return pageConfig('SysSetting')
    return Promise.resolve({
        companyId: 3,
        trade_type: 1,
        customerGroupId: 7,
        currencyList: [
            { name: '美元账户', value: 'USD' },
            { name: '人民币', value: 'CNY' }
        ],
        tradeTypeList: [
            { name: 'CFD账户', id: '1' },
            { name: 'CFD账户222', id: '2' },
        ],
    })
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
        default:
            break
        }
        if (data) return Promise.resolve(JSON.parse(data))
    }
    return request_wp(`/${id}.json?timestamp=${Date.now()}`).then(res => {
        const reg = /^(\{|\[)/
        let content = res?._content ?? res
        content = reg.test(content) || typeof (content) === 'object' ? content : unzip(content)
        const data = typeof (content) === 'string' ? JSON.parse(content) : content
        return data
    })
}
