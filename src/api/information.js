import request from '@/utils/request_information'

const baseLangURL = {
    'zh-CN': 'https://prodcn.displore.com.cn', // 中文
    'en-US': 'https://proden.displore.com.cn', // 英文
    // 'in': 'https://prodin.displore.com.cn', // 印尼
}

export function newsListByType (data, lang) {
    const baseURL = baseLangURL[lang] || baseLangURL['en-US']
    return request({
        url: baseURL + '/api/article/newsListByType',
        data
    })
}
export function newsListByTypeByPage (data, lang) {
    const baseURL = baseLangURL[lang] || baseLangURL['en-US']
    return request({
        url: baseURL + '/api/article/newsListByTypeByPage',

        data
    })
}
export function canlendarListByDate (data, lang) {
    const baseURL = baseLangURL[lang] || baseLangURL['en-US']
    return request({
        url: baseURL + '/api/canlendar/listByDate',
        data
    })
}
export function articleDetail (data, lang) {
    const baseURL = baseLangURL[lang] || baseLangURL['en-US']
    return request({
        url: baseURL + '/api/article/detail',
        data
    })
}
