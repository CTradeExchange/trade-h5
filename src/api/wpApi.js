import { unzip, localGet, isDemoAccount, langList, getCookie, DERAULT_LANG, getDevice } from '@/utils/util'
import request_wp from '@/utils/request_wp'
import axios from 'axios'
import appJson from '../../src/app.json'

/* 获取wp公司配置信息 */
export const wpCompanyConfig = () => {
    return pageConfig('SysSetting')
}
// 获取自选产品
export const wpSelfSymbolIndex = () => pageConfig('SelfSymbolIndex')
export const wpNav = () => pageConfig('Nav')
export const wpFooter = () => pageConfig('Footer')

/* 获取页面配置信息 */
export function pageConfig (id) {
    const NODE_ENV = process.env.NODE_ENV
    // if (NODE_ENV === 'production' && !isDemoAccount()) {
    //     let data = ''
    //     switch (id) {
    //     case 'SelfSymbolIndex':
    //         data = unzip(window['wp_SelfSymbolIndex'])
    //         break
    //     case 'Nav':
    //         data = unzip(window['wp_Nav'])
    //         break
    //     case 'Footer':
    //         data = window['wp_Footer'] ? unzip(window['wp_Footer']) : '[]'
    //         break
    //     case 'Home':
    //         data = unzip(window['wp_Home'])
    //         break
    //     case 'TradeIndex':
    //         data = unzip(window['wp_TradeIndex'])
    //         break
    //     case 'PositionIndex':
    //         data = unzip(window['wp_PositionIndex'])
    //         break
    //     case 'Mine':
    //         data = unzip(window['wp_Mine'])
    //         break
    //     case 'SysSetting': // 获取wp公司配置信息
    //         data = window['wp_SysSetting']
    //         break
    //     case 'ChannelSett': // 获取wp公司配置信息
    //         data = window['wp_ChannelSett']
    //         break
    //     default:
    //         break
    //     }
    //     if (data) return Promise.resolve(JSON.parse(data))
    // }
    let url = '';
    if (isDemoAccount()) {
        let lang = '';
        if (langList.every(i => window.wp_apiPath?.indexOf(`/${i}/`) === -1)) {
            lang = '/' + (getCookie('lang') || DERAULT_LANG)
        }
        const demo_domain = localGet('demo_domain')
            NODE_ENV === 'development'
                ? url = '/api_demo_domain'
                : url = 'https://' + demo_domain + window.wp_apiPath
    }
    if (['Nav', 'Footer'].includes(id) && getDevice() === 2) {
        return Promise.resolve()
    }
    return request_wp(`${url}/${id}.json?timestamp=${Date.now()}`).then(res => {
        const reg = /^(\{|\[)/
        let content = res?._content || res || []
        content = reg.test(content) || typeof (content) === 'object' ? content : unzip(content)
        const data = typeof (content) === 'string' ? JSON.parse(content) : content
        if (id === 'SysSetting') {
            const suffix = isDemoAccount() ? 'Demo' : ''
            window[`apiService${suffix}`] = data.apiService
            window[`quoteService${suffix}`] = data.quoteService
            window[`msgService${suffix}`] = data.msgService
            window[`tradeService${suffix}`] = data.tradeService
        }
        // 配置信息 Nav Footer 仅h5有此接口
        if (id === 'Nav' && res) window['wp_Nav'] = JSON.stringify(res)
        if (id === 'Footer' && res) window['wp_Footer'] = JSON.stringify(res)

        if (id === 'SelfSymbolIndex' && res) window['wp_SelfSymbolIndex'] = JSON.stringify(res)
        if (id === 'Home' && res) window['wp_Home'] = JSON.stringify(res)
        if (id === 'TradeIndex' && res) window['wp_TradeIndex'] = JSON.stringify(res)
        if (id === 'PositionIndex' && res) window['wp_PositionIndex'] = JSON.stringify(res)
        if (id === 'Mine' && res) window['wp_Mine'] = JSON.stringify(res)
        if (id === 'SysSetting' && res) window['wp_SysSetting'] = JSON.stringify(res)
        if (id === 'ChannelSett' && res) window['wp_ChannelSett'] = JSON.stringify(res)
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

// 获取业务配置文件
export function requestBusinessConfig (params) {
    const time = new Date().getTime()
    const url = '/bc/businessConfig.json?timestamp=' + time
    return axios({
        url,
        responseType: 'json',
    }).then(res => {
        return res.data
    })
};
// 获取APPJSON业务配置文件
export function requestAppJson(params) {
    const time = new Date().getTime();
    const NODE_ENV = process.env.NODE_ENV;
    const url = "/bc/app.json?timestamp=" + time;
    return new Promise((resolve) => {
        if (NODE_ENV === "production" && !isDemoAccount()) {
            return axios({
                url,
                responseType: "json",
            }).then((res) => {
                resolve(res.data);
            }).catch(()=>{
                resolve()
            })
        } else {
            resolve(appJson);
        }
    });
}