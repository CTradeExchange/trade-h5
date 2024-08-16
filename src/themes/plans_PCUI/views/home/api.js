import request from './index' // 引入封装得axios

// 获取新闻列表
export function getArticleList (data) {
    return request({
        url: '/api',
        method: 'POST',
        data
    })
}
