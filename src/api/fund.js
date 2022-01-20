import request from '@/utils/request'

/* 获取公司列表 */
export function getCompanyList (data = {}) {
    return request({
        url: '/global/admin.app.AppCompanyService.listAll',
        method: 'post',
        data
    })
}

/* 获取公司资产列表 */
export function getCompanyAssets (data) {
    return request({
        url: '/global/config.app.AppAssetsDubboService.getAssetsList',
        method: 'post',
        data
    })
}

/* 获取下单执行标准 */
export function getOrderStandard (data) {
    return request({
        url: '/global/fund.app.FundsOrderExecuteStandardService.getOrderExecuteStandardConfigs',
        method: 'post',
        data
    })
}

/* 保存下单执行标准 */
export function saveOrderStandard (data) {
    return request({
        url: '/global/fund.app.FundsOrderExecuteStandardService.saveOrderExecuteStandardConfigs',
        method: 'post',
        data
    })
}

/* 查询基金产品申购列表 */
export function getFundApplyList (data) {
    return request({
        url: '/global/fund.app.FundApplyAppDubboService.page',
        method: 'post',
        data
    })
}

/* 获取基金产品申购执行信息 */
export function getFundApplyInfo (data) {
    return request({
        url: '/global/fund.app.FundsApplyExecuteService.getFundsApplyExecuteInfo',
        method: 'post',
        data
    })
}

/* 确认基金产品申购执行 */
export function confirmFundApply (data) {
    return request({
        url: '/global/fund.app.FundsApplyExecuteService.confirmFundsApplyExecuteInfo',
        method: 'post',
        data
    })
}

/* 查询基金产品赎回列表 */
export function getFundRedeemList (data) {
    return request({
        url: '/global/fund.app.FundRedeemAppDubboService.queryManagerPage',
        method: 'post',
        data
    })
}

/* 查询基金产品赎回信息 */
export function getFundRedeemInfo (data) {
    return request({
        url: '/global/fund.app.FundRedeemAppDubboService.calShares',
        method: 'post',
        data
    })
}

/* 确认基金产品赎回 */
export function confirmFundRedeem (data) {
    return request({
        url: '/global/fund.app.FundRedeemAppDubboService.checkShares',
        method: 'post',
        data
    })
}
