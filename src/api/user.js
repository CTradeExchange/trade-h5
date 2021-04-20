import request from '@/utils/request'
import { getDevice } from '@/utils/util'

/* 登录 */
export function login (data) {
    return request({
        url: '/login/customer.CustomerWebApiService.login',
        method: 'post',
        // toastErr: false,
        headers: {
            version: '0.0.1',
        },
        data: {
            device: getDevice(),
            ...data,
        }
    })
}

/* 登出 */
export function logout (data) {
    return request({
        url: '/global/cats-gateway/logout',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 注册 */
export function register (data) {
    return request({
        url: '/global/customer.CustomerWebApiService.register',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data: {
            registerSource: getDevice(),
            ...data,
        }
    })
}
/* 开交易账户 */
export function openAccount (data) {
    return request({
        url: '/global/customer.CustomerWebApiService.openAccount',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}
/* 检测客户信息是否存在 */
export function checkCustomerExist (data) {
    return request({
        url: '/global/customer.CustomerWebApiService.checkCustomerExist',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data: {
            ...data,
        }
    })
}
/* 查询客户信息 */
export function findCustomerInfo (data) {
    return request({
        url: '/global/customer.CustomerWebApiService.findCustomerInfo',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 找回密码 */
export function findPwd (data) {
    return request({
        url: '/global/customer.CustomerWebApiService.forgetLoginPwd',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 修改密码 */
export function modifyPwd (data) {
    return request({
        url: '/global/customer.CustomerWebApiService.updateLoginPwd',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 创建存款提案 */
export function handleDesposit (data) {
    return request({
        url: '/global/fund.DepositAppDubboService.createDepositProposal',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 创建取款提案 */
export function handleWithdraw (data) {
    return request({
        url: '/global/fund.WithdrawAppDubboService.createWithdrawProposal',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 获取取款限制配置 */
export function queryWithdrawConfig (data) {
    return request({
        url: '/global/fund.WithdrawAppDubboService.queryWithdrawLimitConfig',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 获取客户取款货币对汇率 */
export function queryWithdrawRate (data) {
    return request({
        url: '/global/fund.WithdrawAppDubboService.getWithdrawExchangeRate',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 获取支付通道 */
export function queryPayType (data) {
    return request({
        url: '/global/fund.DepositAppDubboService.getPayChannels',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 获取客户存款货币对汇率 */
export function queryDepositExchangeRate (data) {
    return request({
        url: '/global/fund.DepositAppDubboService.getDepositExchangeRate',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 查询客户出金银行卡列表 */
export function queryBankList (data) {
    return request({
        url: '/global/customer.WithdrawBankWebApiService.bankList',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 新增出金银行卡 */
export function addBank (data) {
    return request({
        url: '/global/customer.WithdrawBankWebApiService.add',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 取款提案列表 */
export function queryWithdrawPageList (data) {
    return request({
        url: '/global/fund.CustomerProposalQueryService.queryWithdrawPageList',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 存款提案列表 */
export function queryDepositPageList (data) {
    return request({
        url: '/global/fund.CustomerProposalQueryService.queryDepositPageList',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 资金明细查询 */
export function queryCapitalFlowList (data) {
    return request({
        url: '/global/tradeapi.OrderApiService.queryCapitalFlowList',
        method: 'post',
        headers: {
            version: '0.0.1',
            group: 'tradeApi'
        },
        data
    })
}

/* 获取取款手续费 */
export function computeWithdrawFee (data) {
    return request({
        url: '/global/fund.WithdrawAppDubboService.computeWithdrawFee',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 设置登录密码 */
export function setLoginPwd (data) {
    return request({
        url: '/global/customer.CustomerWebApiService.bindLoginPwd',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 修改登录密码 */
export function modifyLoginPwd (data) {
    return request({
        url: '/global/customer.CustomerWebApiService.updateLoginPwd',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 获取指定公司下平台信息列表 */
export function queryPlatFormMessageLogList (data) {
    return request({
        url: '/global/message.PlatFormMessageLogApiService.queryPlatFormMessageLogByPage',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 切换交易账户信息 */
export function switchAccount (data) {
    return request({
        url: '/global/switch.trade.account',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 指定客户的身份认证信息 */
export function findAllBizKycList (data) {
    return request({
        url: '/global/customer.KycWebApiService.findAllBizKycList',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 判断指定KYC等级是否要KYC认证 */
export function findAllLevelKyc (data) {
    return request({
        url: '/global/customer.KycWebApiService.findAllLevelKyc',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* KYC证申请 */
export function kycLevelApply (data) {
    return request({
        url: '/global/customer.KycWebApiService.kycLevelApply',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}
