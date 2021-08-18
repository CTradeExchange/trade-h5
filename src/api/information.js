import request from '@/utils/request_information'

export function newsListByType (data) {
    return request({
        url: '/api/article/newsListByType',
        data
    })
}
export function newsListByTypeByPage (data) {
    return request({
        url: '/api/article/newsListByTypeByPage',

        data
    })
}
export function canlendarListByDate (data) {
    return request({
        url: '/api/canlendar/listByDate',
        data
    })
}
export function articleDetail (data) {
    return request({
        url: '/api/article/detail',
        data
    })
}
