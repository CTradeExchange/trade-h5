import { computed, ref, unref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { debounce } from '@/utils/util'
import { fundCalcApplyShares, fundApply, fundRedeem } from '@/api/fund'
import { Toast } from 'vant'

export const orderHook = () => {
    const { t } = useI18n({ useScope: 'global' })
    const route = useRoute()
    const store = useStore()
    const loading = ref(false)
    const { direction, fundId } = route.query
    let pageTitle = direction === 'buy' ? t('fundInfo.buy') : t('fundInfo.sell')
    pageTitle = t('fundInfo.fund') + pageTitle

    const activeCurrency = ref(null) // 申购的时候表示支付资产，赎回的时候表示接受资产
    const accountList = computed(() => store.state._user.customerInfo?.accountList?.filter(el => el.tradeType === 5)) // 现货玩法的账户列表
    const curAccount = computed(() => accountList.value.find(el => el.currency === activeCurrency.value))

    // 基金产品列表
    const fundProductList = computed(() => store.state._quote.fundProductList)
    if (!fundProductList.value.length) {
        store.dispatch('_quote/findFundPage')
    }

    // 基金产品信息
    const fund = computed(() => store.state._quote.fundInfo)
    const activeCurrencyList = computed(() => {
        const purchaseCurrencySetting = unref(fund)?.purchaseCurrencySetting ?? []
        const redemptionCurrencySetting = unref(fund)?.redemptionCurrencySetting ?? []
        const resultList = direction === 'buy' ? purchaseCurrencySetting : redemptionCurrencySetting
        return resultList
    })
    store.dispatch('_quote/queryFundInfo', fundId).then(res => {
        if (res.check()) {
            activeCurrency.value = activeCurrencyList.value[0]?.currencyCode
            updateAccountAssetsInfo(direction === 'buy' ? activeCurrency.value : res.data.shareTokenCode)
        }
    })

    // 获取申购手续费
    const calcApplyShares = debounce((val, e) => {
        // console.log('开始获取申购手续费', val, e)
        getCalcApplyFee(val, activeCurrency.value)
    }, 800)

    // 点击申购
    const submitFundApply = (params) => {
        if (!params?.amountPay) {
            return Toast(t('fundInfo.subScriptePlaceholder'))
        }
        loading.value = true
        return fundApply(params).then(res => {
            loading.value = false
            updateAccountAssetsInfo(activeCurrency.value)
            return res
        })
    }
    // 点击赎回
    const submitFundRedeem = (params) => {
        if (!params?.shares) {
            return Promise.resolve().then(() => Toast(t('fundInfo.redeemNumPlaceholder')))
        }
        loading.value = true
        return fundRedeem(params).then(res => {
            loading.value = false
            updateAccountAssetsInfo(fund.value.shareTokenCode)
            return res
        })
    }

    // 是否显示actionsSheet弹窗
    const selectShow = ref(false)
    const selectActions = computed(() => {
        const resultList = activeCurrencyList.value.map(el => {
            return {
                ...el,
                name: el.currencyCode
            }
        })
        return resultList
    })
    const onSelect = (item) => {
        activeCurrency.value = item.currencyCode
        updateAccountAssetsInfo(item.currencyCode)
        selectShow.value = false
    }

    // 更新单个资产详情
    const updateAccountAssetsInfo = (currency) => {
        const account = accountList.value.find(el => el.currency === currency)
        if (!account) return false
        store.dispatch('_user/queryAccountAssetsInfo', {
            tradeType: 5,
            accountId: parseInt(account.accountId)
        })
    }

    const calcApplyFee = ref('') // 获取申购手续费
    const calcShares = ref('') // 获取申购份额
    const calcSharesNet = ref('') // 获取申购手净值
    const getCalcApplyFee = (amountPay, currencyPay) => {
        if (!amountPay) {
            calcApplyFee.value = ''
            calcShares.value = ''
            calcSharesNet.value = ''
            return false
        }
        fundCalcApplyShares({ amountPay, currencyPay, fundId: parseInt(fundId) }).then(res => {
            if (res.check()) {
                const { data } = res
                calcApplyFee.value = data.fees
                calcShares.value = data.shares
                calcSharesNet.value = data.sharesNet
            }
        })
    }

    return {
        pageTitle,
        fund,
        accountList,
        loading,
        calcApplyShares,
        submitFundApply,
        submitFundRedeem,
        selectShow,
        selectActions,
        activeCurrency,
        curAccount,
        updateAccountAssetsInfo,
        calcApplyFee,
        calcShares,
        calcSharesNet,
        onSelect
    }
}
