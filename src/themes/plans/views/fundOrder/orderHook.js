import { computed, ref, unref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
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

    // 申购的时候表示支付资产，赎回的时候表示接受资产
    const activeCurrency = ref('')
    // 当前选择的资产数据
    const activeAssets = ref({})
    // 现货玩法的账户列表
    const accountList = computed(() => store.state._user.customerInfo?.accountList?.filter(el => el.tradeType === 5) || [])
    // 当前账户
    const curAccount = computed(() => accountList.value.find(el => el.currency === activeCurrency.value))
    // 基金底层资产列表
    const fundAssetsList = ref([])
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

    // 获取基金详情
    store.dispatch('_quote/queryFundInfo', fundId).then(res => {
        if (res.check()) {
            fundAssetsList.value = fund.value.fundCurrencyList
            activeCurrency.value = activeCurrencyList.value[0]?.currencyCode
            activeAssets.value = activeCurrencyList.value[0]
            updateAccountAssetsInfo(direction === 'buy' ? activeCurrency.value : res.data.shareTokenCode)
        }
    })
    // 获取基金净值等数据
    store.dispatch('_quote/fundNetValue', { fundId })

    // 获取申购手续费
    const calcApplyShares = (val, e) => {
        getCalcApplyFee(val, activeCurrency.value)
    }

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

    // 选择支付资产、选择赎回方式
    const selectShow = ref(false)
    const selectActions = computed(() => {
        const resultList = activeCurrencyList.value.map(el => {
            return {
                ...el
            }
        })
        return resultList
    })
    const onSelect = (item) => {
        activeCurrency.value = item.currencyCode
        activeAssets.value = item
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

    // 申购手续费,申购份额, 申购净值,手续费的币种,净值币种
    const calcApplyNet = ref('')
    const getCalcApplyFee = (amountPay, currencyPay) => {
        if (!amountPay) {
            calcApplyNet.value = ''
            return false
        }
        fundCalcApplyShares({
            amountPay,
            currencyPay,
            fundId: parseInt(fundId),
            applyType: 2
        }).then(res => {
            if (res.check()) {
                const { data } = res
                calcApplyNet.value = data
            }
        })
    }

    return {
        pageTitle,
        fund,
        fundAssetsList,
        accountList,
        loading,
        calcApplyShares,
        submitFundApply,
        submitFundRedeem,
        selectShow,
        selectActions,
        activeCurrency,
        activeAssets,
        curAccount,
        updateAccountAssetsInfo,
        calcApplyNet,
        onSelect
    }
}
