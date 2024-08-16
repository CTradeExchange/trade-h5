import { checkKycApply, queryPayType, getCryptoBlockchainInfo, judgeIsAlreadyDeposit, queryDepositExchangeRate } from '@/api/user'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Dialog, Toast } from 'vant'
import { unref, reactive, watch, computed } from 'vue'
import { gt, lt, plus, mul } from '@/utils/calculation'

import { digitsFormat, isEmpty } from '@/utils/util'
import { map } from 'lodash'

// 检查是否需要KYC认证
export function checkKyc () {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n({ useScope: 'global' })
    const customerInfo = computed(() => store.state._user.customerInfo)
    const isMobile = process.env.VUE_APP_theme === 'plans'
    const gaClass = isMobile ? 'mobile_deposit_kyc_ga' : 'pc_deposit_kyc_ga'
    // 在PC认证页面不检测kyc
    if (!route.meta.roles.includes('Auth')) {
        checkKycApply({
            businessCode: 'cashin',
            openAccountType: customerInfo.value.openAccountType
        }).then(res => {
            if (res.check()) {
                if (Number(res.data) !== 2) {
                    return Dialog.alert({
                        title: t('common.tip'),
                        // 埋点类名
                        className: Number(res.data) !== 1 ? gaClass : '',
                        confirmButtonText: Number(res.data) === 1 ? t('common.goLook') : t('login.goAuthenticate'),
                        message: Number(res.data) === 2 ? t('deposit.KYCReviewing') : t('deposit.needKYC'),
                    }).then(() => {
                        if (window.isPC) {
                            if (customerInfo.value.openAccountType === 0) {
                                router.replace({
                                    path: '/depositChoose/authentication',
                                    query: {
                                        businessCode: 'cashin'
                                    }
                                })
                            } else {
                                router.replace({
                                    path: '/businessKYC'
                                })
                            }
                        } else {
                            router.replace({ path: '/authentication' })
                        }
                    })
                }
            }
        }).catch(err => { })
    }
}

// 验证客户是否可存款
export function checkCustomerDeposit () {
    const store = useStore()
    const { t } = useI18n({ useScope: 'global' })
    // 客户信息
    const customerInfo = computed(() => store.state._user.customerInfo)
    // 在线客服地址
    const onlineService = unref(computed(() => store.state._base.wpCompanyInfo?.onlineService))
    // 获取客户信息
    store.dispatch('_user/findCustomerInfo', false).then(res => {
        if (res.check()) {
            // 是否显示联系客服弹窗
            if (Number(customerInfo.value.deposit) === 0) {
                Dialog.confirm({
                    title: t('common.tip'),
                    message: t('deposit.serviceTips1'),
                    confirmButtonText: t('common.service'),
                    cancelButtonText: t('common.close')
                }).then(() => {
                    if (onlineService) {
                        if (window.isPC) {
                            window.open(onlineService)
                        } else {
                            location.href = onlineService
                        }
                    }
                })
            }
        }
    })
}

// 通道存款时间验证
export const checkDepositTime = (openTime) => {
    if (!isEmpty(openTime)) {
        const todayStr = window.dayjs().format('YYYY-MM-DD')
        const tomorrowStr = window.dayjs().add(1, 'day')
        const timeList = []
        const timeRange = openTime.split(',')
        let timeShow = true
        if (timeRange.length > 0) {
            timeRange.map(el => {
                const [start, end] = el.split('-')
                const startLocal = window.dayjs.utc(`${todayStr} ${start}`).local()
                const endLocal = window.dayjs.utc(`${todayStr} ${end}`).local()
                if ((startLocal.isAfter(todayStr, 'day') && endLocal.isAfter(todayStr, 'day')) || (startLocal.isBefore(tomorrowStr, 'day') && endLocal.isBefore(tomorrowStr, 'day'))) {
                    timeList.push(startLocal.format('HH:mm') + '-' + endLocal.format('HH:mm'))
                } else if (endLocal.format('HH:mm') === '00:00') {
                    timeList.push(startLocal.format('HH:mm') + '-24:00')
                } else {
                    timeList.push(startLocal.format('HH:mm') + '-23:59')
                    timeList.push('00:00-' + endLocal.format('HH:mm'))
                }

                // 判断当前时间是否在设置的存款时间内
                const nowDate = window.dayjs.utc()
                const nowMinutes = nowDate.hour() * 60 + nowDate.minute() // 获取当前天的分钟数
                const startMinutes = parseFloat(start.split(':')[0]) * 60 + parseFloat(start.split(':')[1]) // 计算开始时间的分钟数
                const endMinutes = parseFloat(end.split(':')[0]) * 60 + parseFloat(end.split(':')[1]) // 计算结束时间的分钟数
                if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
                    timeShow = false
                }
            })
        }
        return {
            timeShow,
            timeList
        }
    } else {
        return {
            timeShow: true,
            timeList: []
        }
    }
}

export const userDeposit = () => {
    const store = useStore()
    const { t } = useI18n({ useScope: 'global' })

    const state = reactive({
    /** 充值币种列表 */
        currencyList: [],
        /** 获取币种loading */
        getCurrencyLoading: false,
        /** 充值网络列表 */
        blockchainList: [],
        /** 充值网络loading */
        getChainListLoading: false,
        amountList: [],
        /** 充值渠道信息 */
        channel: null,
        /** 充值提交loading */
        submitLoading: false,
        /** 提交汇率loading */
        rateLoading: false,
        /** 充值汇率 */
        exchangeRate: null,
        // 检查输入的结果
        checkResult: true,
        // 在第一种UI里面，然后打开faq的信息
        openFaq: false,
        // 输入的充值数字
        amount: '',
        // 当前选择的币种缩写
        coinKind: '',
        // 默认区块链网络
        network: '',
        // 其他提示信息（支付平台关闭或者其他输入金额不在范围内）
        limitPrompt: ''

    })

    const tradeType = computed(() => store.state._base.tradeType)
    const customInfo = computed(() => store.state._user.customerInfo)
    const assetsInfo = computed(() => store.state._user.customerInfo.accountList.find(item => item.tradeType === tradeType.value && state.coinKind === item.currency))
    const accountList = computed(() => store.state._user.customerInfo.accountList.filter(item => item.tradeType === tradeType.value)?.filter(item => ['USDT', 'USDC', 'DAI'].includes(item.currency)) || [])

    /** 获取存款配置数据 */
    // const depositData = computed(() => store.state._base.wpCompanyInfo?.depositData)
    /** 不在存款时间提示 */
    const depositTimeTips = computed(() => {
        if (!state.channel?.openTime || !checkDepositTime(state.channel.openTime)?.timeShow) return
        const timeList = checkDepositTime(state.channel?.openTime)?.timeList
        if (timeList.length === 0) {
            // 此支付方式暂时不在可使用时间内。
            return t('deposit.timeTip1')
        } else {
            let result = timeList.join(',')
            // 此支付方式暂时不在可使用时间内，请在以下时间范围内使用：
            result = t('deposit.timeTip2') + result
            return result
        }
    })

    const limitPrompt = computed(() => {
        const baseSysConfig = store.state._base.newsSysConfig
        const result = baseSysConfig.find((o) => o.Key === 'despositModelType') || {}
        const modelNum = result?.Value || '1'

        if (!state.channel) {
            return t('headLineDeposit.not-use-deposit')
        }
        if (modelNum == '2') {
            return ''
        }
        if (lt(state.amount, state.channel?.singleLowAmount) || gt(state.amount, state.channel?.singleHighAmount)) {
            return t('deposit.amountTip', {
                singleLowAmount: state.channel.singleLowAmount,
                singleHighAmount: state.channel.singleHighAmount,
            })
        }
        return ''
    })

    /** 充值金额小数位格式化 */
    const amountFormatter = (value) => digitsFormat(value, assetsInfo.value?.digits)

    /** 获取支付通道 */
    const getPayTypes = () => {
        state.getCurrencyLoading = true
        queryPayType({
            customerNo: customInfo.value.customerNo,
            customerGroupId: customInfo.value.customerGroupId,
            clientType: 'pc',
            accountId: assetsInfo.value.accountId,
            tradeType: assetsInfo.value.tradeType,
            accountCurrency: assetsInfo.value.currency,
        })
            .then((res) => {
                // 关闭支付通道了
                // if(res.code=='50002'){

                // }
                if (res?.data && Array.isArray(res.data)) {
                    state.channel = res.data.find(item => item.paymentCode === 'blockatm_webhook')
                    getChainInfo()
                }
            })
            .finally(() => {
                state.getCurrencyLoading = false
            })
    }

    /** 获取币对应的链 */
    const getChainInfo = () => {
        state.getCurrencyLoading = true
        getCryptoBlockchainInfo({
            currency: state.coinKind,
            paymentCode: state.channel.paymentCode,
            tradeType: assetsInfo.value.tradeType,
        })
            .then((res) => {
                // if (res?.data?.blockchainList) {
                //     // 过滤，只保留erc20的
                //     state.blockchainList = res?.data?.blockchainList.filter(item => item === 'Ethereum(ERC20)')
                //     form.blockchainName = state.blockchainList?.[0] || ''
                // }
                // console.log(res, '????????????????????????????')
                state.blockchainList = res?.data?.blockchainList
                state.network = state.blockchainList?.[0] || ''
                // form.blockchainName = state.blockchainList?.[0] || ''
            })
            .finally(() => {
                state.getCurrencyLoading = false
            })
    }

    /** 设置存款金额选择数据 */
    const setAmountList = () => {
        try {
            const newsSysConfig = store.state._base.newsSysConfig
            const newsConfig = newsSysConfig && newsSysConfig.find((o) => o.Key === 'depositAmountList')
            const { Value } = newsConfig || {}
            state.amountList = JSON.parse(Value).map(amount => ({ amount }))
        } catch (error) {
            state.amountList = [{ amount: 50 }, { amount: 100 }, { amount: 500 }, { amount: 1000 }]
        }
        // form.amount = state.amountList[0].amount
        state.amount = state.amountList[0].amount
    }

    watch(() => accountList.value, (value) => {
        state.currencyList = map(value, 'currency')
        if (state.currencyList?.[0]) {
            // form.currency = state.currencyList[0]
            state.coinKind = state.currencyList[0]
        }
    }, {
        immediate: true,
    },)

    watch(
        () => assetsInfo.value,
        (value) => {
            if (value?.accountId) {
                getPayTypes()
                setAmountList()
            }
        },
        {
            immediate: true,
        },
    )

    return { limitPrompt, amountFormatter, depositTimeTips, state, getPayTypes }
}
