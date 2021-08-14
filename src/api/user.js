import request from '@/utils/request'
import { getDevice } from '@/utils/util'

/* 登录 */
export function login (data) {
    return request({
        url: '/login/customer.app.CustomerWebApiService.login',
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
        url: '/logout',
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
        url: '/register/customer.app.CustomerWebApiService.register',
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
        url: '/global/customer.app.CustomerWebApiService.openAccount',
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
        url: '/global/customer.app.CustomerWebApiService.checkCustomerExist',
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
        url: '/global/customer.app.CustomerWebApiService.findCustomerInfo',
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
        url: '/global/customer.app.CustomerWebApiService.forgetLoginPwd',
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
        url: '/global/customer.app.CustomerWebApiService.updateLoginPwd',
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
        url: '/global/fund.app.DepositAppDubboService.createDepositProposal',
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
        url: '/global/fund.app.WithdrawAppDubboService.createWithdrawProposal',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 获取取款、提币额度限制配置 */
export function queryWithdrawLimitInfo (data) {
    return request({
        url: '/global/fund.app.WithdrawAppDubboService.getWithdrawAmountLimitInfo',
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
        url: '/global/fund.app.WithdrawAppDubboService.queryWithdrawLimitConfig',
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
        url: '/global/fund.app.WithdrawAppDubboService.getWithdrawExchangeRate',
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
        url: '/global/fund.app.DepositAppDubboService.getPayChannels',
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
        url: '/global/fund.app.DepositAppDubboService.getDepositExchangeRate',
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
        url: '/global/customer.app.WithdrawBankWebApiService.bankList',
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
        url: '/global/customer.app.WithdrawBankWebApiService.add',
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
        url: '/global/fund.app.CustomerProposalQueryService.queryWithdrawPageList',
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
        url: '/global/fund.app.CustomerProposalQueryService.queryDepositPageList',
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
        url: '/global/tradeapi.app.OrderApiService.queryCapitalFlowList',
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
        url: '/global/fund.app.WithdrawAppDubboService.computeWithdrawFee',
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
        url: '/global/customer.app.CustomerWebApiService.bindLoginPwd',
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
        url: '/global/customer.app.CustomerWebApiService.updateLoginPwd',
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
        url: '/global/message.app.PlatFormMessageLogApiService.queryPlatFormMessageLogByPage',
        method: 'post',
        headers: {
            version: '0.0.1',
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
        url: '/global/customer.app.KycWebApiService.findAllBizKycList',
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
        url: '/global/customer.app.KycWebApiService.findAllLevelKyc',
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
        url: '/global/customer.app.KycWebApiService.kycLevelApply',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 指定业务场景是否KYC通过 */
export function checkKycApply (data) {
    return request({
        url: '/global/customer.app.KycWebApiService.checkKycApply',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* KYC业务场景认证申请 */
export function kycApply (data) {
    return request({
        url: '/global/customer.app.KycWebApiService.kycApply',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 绑定手机号码 */
export function bindPhone (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.bindPhone',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 绑定邮箱 */
export function bindEmail (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.bindEmail',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 查询存款提案 */
export function queryDepositProposal (data) {
    return request({
        url: '/global/fund.app.DepositAppDubboService.queryDepositProposal',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 客户自选产品列表 */
export function queryCustomerOptionalList (data) {
    return request({
        url: '/global/customer.app.CustomerOptionalWebApiService.optionalList',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 添加自选 */
export function addCustomerOptional (data) {
    return request({
        url: '/global/customer.app.CustomerOptionalWebApiService.add',
        method: 'post',
        headers: {
            // group: 'tradeApi',
            version: '0.0.1',
        },
        data
    })
}

/* 更换手机 */
export function changePhone (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.changePhone',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 更换邮箱 */
export function changeEmail (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.changeEmail',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 检测客户信息是否存在,不需要区号信息 */
export function checkUserStatus (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.checkStatus',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 获取客户提现方式 */
export function getWithdrawMethodList (data) {
    return request({
        url: '/global/fund.app.WithdrawAppDubboService.getWithdrawMethodList',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 获取客户提币币种和链名称 */
export function getWithdrawCurrencyList (data) {
    return request({
        url: '/global/fund.app.WithdrawAppDubboService.getWithdrawCurrencyList',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 获取钱包列表 */
export function getWalletAddressList (data) {
    return request({
        url: '/global/customer.app.CustomerWalletWebApiService.walletList',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 添加钱包 */
export function addWalletAddress (data) {
    return request({
        url: '/global/customer.app.CustomerWalletWebApiService.add',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 删除钱包 */
export function deleteWalletAddress (data) {
    return request({
        url: '/global/customer.app.CustomerWalletWebApiService.delete',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 设置默认钱包 */
export function setDefaultWallet (data) {
    return request({
        url: '/global/customer.app.CustomerWalletWebApiService.updateWallet',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 查询客户总资产信息 */
export function queryCustomerAssetsInfo (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.queryCustomerAssetsInfo',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    }).catch(err => {
        return {

        }
    })
}

/* 查询账户资产信息 */
export function queryAccountAssetsInfo (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.queryAccountAssetsInfo',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

// 手动还款
export function manualRepayment (data) {
    return request({
        url: '/global/fund.app.DepositAppDubboService.manualRepayment',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

// 修改仓位占用保证金
export function updateOccupyTheMargin (data) {
    return request({
        url: '/global/tradeapi.app.PositionApiService.updateOccupyTheMargin',
        method: 'post',
        headers: {
            version: '0.0.1',
            group: 'tradeApi'
        },
        data
    })
}

// 获取下单还币汇率(杠杆)
export function previewOrder (data) {
    return request({
        url: '/global/tradeapi.app.OrderApiService.previewOrder',
        method: 'post',
        headers: {
            version: '0.0.1',
            group: 'tradeApi'
        },
        data
    })
}

// 下单还币(杠杆)
export function addRepaymentOrder (data) {
    return request({
        url: '/global/tradeapi.app.OrderApiService.addRepaymentOrder',
        method: 'post',
        headers: {
            version: '0.0.1',
            group: 'tradeApi'
        },
        data
    })
}

// 手动借款

export function manualLoan (data) {
    return request({
        url: '/global/fund.app.DepositAppDubboService.manualLoan',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 查询借还款流水列表 */
export function queryLiabilitiesWaterByPage (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.queryLiabilitiesWaterByPage',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 成交记录 */
export function tradeRecordList (data) {
    return request({
        url: '/global/tradeapi.app.OrderApiService.queryTradeRecordPage',
        method: 'post',
        headers: {
            version: '0.0.1',
            group: 'tradeApi'
        },
        data
    })
}
