import { computed } from 'vue'
import { useStore } from 'vuex'
import { toFixed, mul, divide } from '@/utils/calculation'

// 返回总资产排序数据
export function useTotalAssetsSort () {
    const store = useStore()

    // 用户信息返回的accountList
    const accountList = computed(() => store.state._user.accountList || [])
    // businessConfig
    const businessConfig = computed(() => store.state.businessConfig || {})
    // 资产排序列表
    const walletAssetSortBy = computed(() => businessConfig.value.walletAssetSortBy || [])
    // 排序后的资产数据
    const sortAssetsList = computed(() => {
        let list = accountList.value.slice(0)
        const assetSortBy = walletAssetSortBy.value.slice(0).reverse()
        const arr1 = []
        const arr2 = []
        list.sort((a, b) => {
            const a_sortIndex = Number(a.wholeWarehouseBalance)
            const b_sortIndex = Number(b.wholeWarehouseBalance)
            return b_sortIndex - a_sortIndex
        })
        list.map(el => {
            if (Number(el.wholeWarehouseBalance) > 0) {
                arr1.push(el)
            } else {
                arr2.push(el)
            }
        })
        arr2.sort((a, b) => {
            let a_sortIndex = 0
            let b_sortIndex = 0
            a_sortIndex = assetSortBy.indexOf(a.currency)
            a_sortIndex = a_sortIndex === -1 ? -1 : a_sortIndex
            b_sortIndex = assetSortBy.indexOf(b.currency)
            b_sortIndex = b_sortIndex === -1 ? -2 : b_sortIndex
            return b_sortIndex - a_sortIndex
        })
        list = arr1.concat(arr2)

        return list
    })

    return sortAssetsList
}

// 返回可提排序数据
export function useWithdrawAmountSort () {
    const store = useStore()

    // 用户信息返回的accountList
    const accountList = computed(() => store.state._user.accountList || [])
    // 用户资产数据
    const customerAssetsInfo = computed(() => store.state._user.customerAssetsInfo)
    // 排序后的资产数据
    const assetsList = computed(() => {
        let list = accountList.value
        list = list.slice(0)
        list.map(el => {
            let value = ''
            if (el.wholeWarehouseRate) {
                if (el.formulaSymbol === 'multiply') {
                    value = mul(el.withdrawAmount, el.wholeWarehouseRate)
                } else {
                    value = divide(el.withdrawAmount, el.wholeWarehouseRate)
                }
            }
            el.wholeWithdrawAmount = value ? toFixed(value, customerAssetsInfo.value.digits) : ''
        })
        return list
    })
    // businessConfig
    const businessConfig = computed(() => store.state.businessConfig || {})
    // 资产排序列表
    const walletAssetSortBy = computed(() => businessConfig.value.walletAssetSortBy || [])
    // 排序后的资产数据
    const sortAssetsList = computed(() => {
        let list = assetsList.value.slice(0)
        const assetSortBy = walletAssetSortBy.value.slice(0).reverse()
        const arr1 = []
        const arr2 = []
        list.sort((a, b) => {
            const a_sortIndex = Number(a.wholeWithdrawAmount)
            const b_sortIndex = Number(b.wholeWithdrawAmount)
            return b_sortIndex - a_sortIndex
        })
        list.map(el => {
            if (Number(el.wholeWithdrawAmount) > 0) {
                arr1.push(el)
            } else {
                arr2.push(el)
            }
        })
        arr2.sort((a, b) => {
            let a_sortIndex = 0
            let b_sortIndex = 0
            a_sortIndex = assetSortBy.indexOf(a.currency)
            a_sortIndex = a_sortIndex === -1 ? -1 : a_sortIndex
            b_sortIndex = assetSortBy.indexOf(b.currency)
            b_sortIndex = b_sortIndex === -1 ? -2 : b_sortIndex
            return b_sortIndex - a_sortIndex
        })
        list = arr1.concat(arr2)

        return list
    })

    return sortAssetsList
}

export function useAssets () {
    const store = useStore()

    // 用户信息
    const customerInfo = computed(() => store.state._user.customerInfo)
    // 当前产品
    const tradeType = computed(() => store.state._base.tradeType)

    // 当前账户
    const assets = computed(() => {
        const accountAssets = store.state._user.accountAssets[tradeType.value] || {}

        const accountList = customerInfo.value?.accountList || []
        const accountTemp = accountList.find(el => el.tradeType === tradeType.value) || {}
        return {
            currency: 'USDT',
            digits: 4,
            ...accountTemp,
            ...accountAssets,
        }
    })

    return assets
}
