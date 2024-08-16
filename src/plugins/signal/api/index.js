import request from '../utils/request'
import axios from 'axios'
import { guid, getToken } from '@/utils/util'

// 初始化数组
function getArrayParams (data = []) {
    const params = data.map((item) => {
        const jsonParams = Object.keys(item).map((key) => {
            return getStringJSON(key, item[key])
        })
        return jsonParams.length ? `{${jsonParams.join(',')}}` : ''
    })
    return params.length ? `${params.join(',')}` : ''
}

// 获取文字字符串
function getStringJSON (key, value) {
    return `${key}:${typeof value === 'number' ? value : `"${value}"`}`
}

// 转换graphql格式参数  formatArray转换数组
function getParams (data = {}, formatArray = false) {
    const params = Object.keys(data).map((key) => {
        // 如果是数组对象需要特殊处理
        if (formatArray && Array.isArray(data[key])) {
            return `${key}:[${getArrayParams(data[key])}]`
        }
        return getStringJSON(key, data[key])
    })
    return params.length ? `(${params.join(',')})` : ''
}

// 获取query参数
function getQuery (type, data = {}, queryName = 'QueryIndicator', extra = '{ items { id sc sy i si pe t a pr } nextToken scannedCount }') {
    const query = `query ${queryName} { ${type} ${getParams(data)} ${extra}}`
    return query
}

// 发起api请求
export function graphqlAll ({ type, query, variables = {} }) {
    return request({
        url: '/graphql',
        method: 'post',
        data: {
            type,
            query,
            variables
        }
    })
}

export function graphql (type, data = {}, variables = {}) {
    const query = getQuery(type, data)
    return graphqlAll({
        type,
        query,
        variables
    })
}

// 获取服务器时间
export function getServerTime () {
    return graphqlAll({
        type: 'echo',
        query: 'query QueryIndicator { echo }',
    })
}

// 获取最新指标列表
export function queryQuotapIndicatorByTime (data = {}, variables = {}) {
    return graphql('queryQuotapIndicatorByTime', data, variables)
}

// 根据指标获取列表
export function queryQuotapIndicatorByIndicator (data = {}, variables = {}) {
    return graphql('queryQuotapIndicatorByIndicator', data, variables)
}

// 根据信号获取列表
export function queryQuotapIndicatorBySignal (data = {}, variables = {}) {
    return graphql('queryQuotapIndicatorBySignal', data, variables)
}

// 根据买卖建议获取列表
export function queryQuotapIndicatorByAction (data = {}, variables = {}) {
    return graphql('queryQuotapIndicatorByAction', data, variables)
}

// 根据周期获取列表
export function queryQuotapIndicatorByPeriod (data = {}, variables = {}) {
    return graphql('queryQuotapIndicatorByPeriod', data, variables)
}

// 获取指标详情
export function getQuotapIndicator (data) {
    const type = 'getQuotapIndicator'
    const query = getQuery(type, data, 'GetIndicator', '{ id sc sy i si pe t a pr }')
    return graphqlAll({
        type,
        query,
    })
}

// 筛选条件
export function queryQuotapIndicatorByCondition (data = {}, variables = {}) {
    const type = 'queryQuotapIndicatorByDynamodb'
    const query = getQuery(type, data, 'QueryIndicatorCondition', '{ items { id sc sy i si pe t a pr } offset limit }')
    return graphqlAll({
        type,
        query,
        variables
    })
}

// 根据代号查信号
export function queryQuotapIndicatorBySymbol (data = {}, variables = {}) {
    return graphql('queryQuotapIndicatorBySymbol', data, variables)
}

// 活跃度【统计类】
export function analyzeQuotapIndicator (data, variables = {}) {
    const type = 'analyzeQuotapIndicator'
    const query = getQuery(type, data, 'AnalyzeIndicatorCondition', '{ items { sy i si a t times count } }')
    return graphqlAll({
        type,
        query,
    })
}

// 搜索
export function searchQuotapIndicator (data = {}, variables = {}) {
    const type = 'searchQuotapIndicator'
    const query = getQuery(type, data, 'SearchIndicatorCondition', '{ items { id sc sy i si pe t a pr }}')
    return graphqlAll({
        type,
        query,
        variables
    })
}

// 查询全部订阅
export function queryAllQuotaIndicatorSub (data = {}, variables = {}) {
    const type = 'queryAllQuotaIndicatorSub'
    const query = getQuery(type, data, 'QueryAllQuotaIndicatorSub', '{items {  i pe sy ct ut et}}')
    return graphqlAll({
        type,
        query,
        variables
    })
}

// 增删改订阅
export function cudQuotapIndicatorSub (data = {}, variables = {}) {
    const type = 'cudQuotapIndicatorSub'
    const query = `mutation CUDQuotapIndicatorSub { ${type} ${getParams(data, true)} { items { i pe sy ct ut et } firstSub}}`
    return graphqlAll({
        type,
        query,
        variables
    })
}

// 获取订阅的信号
export function querySubscribeSignal (data = {}, variables = {}) {
    const type = 'queryQuotapIndicatorByDynamodb'
    const query = `query QueryIndicatorCondition { ${type} ${getParams(data, true)} { items { id sy i si pe t a pr } offset limit} }`
    return graphqlAll({
        type,
        query,
        variables
    })
}

// auth2

// 获取授权码
export function getAuth2Code (data) {
    return axios({
        url: '/cats-gateway-auth2/auth2/code',
        method: 'post',
        headers: {
            trace: guid(),
            token: getToken(),
        },
        data
    })
}

// 获取用户Telegram Bot绑定信息
export function queryTGInfo (data, variables = {}) {
    const type = 'queryTGInfo'
    const query = getQuery(type, data, 'QueryTGInfo', '{ bna link  }')
    return graphqlAll({
        type,
        query,
    })
}

// 获取可用Telegram Bot信息
export function queryBotInfo (data, variables = {}) {
    const type = 'queryBotInfo'
    const query = getQuery(type, data, 'QueryBotInfo', '{ bna link }')
    return graphqlAll({
        type,
        query,
    })
}

// 指标评价排行榜
export function queryAssess (params, rest = {}) {
    return request({
        url: '/valuable/assess',
        method: 'get',
        params,
        ...rest
    })
}

// 指标评价排行榜
export function queryPnl (params, rest = {}) {
    return request({
        url: '/valuable/pnl',
        method: 'get',
        params,
        ...rest
    })
}
