import { useStore } from 'vuex'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { localGetJSON, localSetObj, sessionSet, setToken } from '@/utils/util'
import { switchUserAccount, findCustomerInfo } from '@/api/user'
import { Dialog } from 'vant'
import { useI18n } from 'vue-i18n'
import qs from 'qs'

export default function () {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n({ useScope: 'global' })
    const customerInfo = computed(() => store.state._user.customerInfo)
    const isReal = computed(() => customerInfo.value?.companyType === 'real')

    // 根据tradeType获取默认品种
    const getDefaultProduct = (tradeType) => {
        tradeType = Number(tradeType)
        const bitcoinId = computed(() => store.state._quote.bitcoinId)

        // 有效的品种
        const availableList = store.getters['_quote/userProductCategoryKeys'] || []

        // const product = null
        // 优先进入上一次访问的产品
        const lastProductSymbolKey = (localGetJSON('lastProductActived', {})[tradeType]) || ''
        if (lastProductSymbolKey && availableList.includes(lastProductSymbolKey)) {
            const lastProduct = store.state._quote.productMap[lastProductSymbolKey]
            if (lastProduct?.symbolId) {
                return lastProduct
            }
        } else {
            const arr = store.state._quote.productList.filter(el => {
                return Number(el.tradeType) === tradeType && availableList.includes(el.symbolKey)
            }).sort((a, b) => {
                return a.sortNum - b.sortNum
            })
            if (arr.length) {
                const btcItem = Object.values(arr).find(item => `${item.symbolId}` == bitcoinId.value)
                return btcItem || arr[0]
            } else {
                return null
            }
        }
    }

    // 跳转到下单页面并优先显示指定产品
    const toOrderPriority = (tradeType) => {
        const product = getDefaultProduct(tradeType)

        if (product) {
            const symbolId = product.symbolId
            store.commit('_quote/Update_productActivedID', `${symbolId}_${tradeType}`)
            router.push({
                path: '/order',
                query: {
                    symbolId,
                    tradeType
                }
            })
        } else {
            console.log("can't find default product")
        }
    }

    /**
     * 去充值页面，如果是真实账户直接跳转，模拟需要弹窗提示用户确认再跳转
     */
    const toDeposit = (query = {}) => {
        // 处理@click='toDeposit' 使用第一个参数是event
        if (query?.target) {
            query = null
        }
        if (isReal.value) {
            router.push({
                path: '/depositChoose',
                query
            })
        } else {
            const queryStr = qs.stringify(query)
            Dialog.confirm({
                title: t('common.tip'),
                message: t('mockAccount.switchToDepositTip'),
            }).then(() => {
                handleSwitchAccount({
                    type: 'real',
                    url: 'depositChoose' + (queryStr ? `?${queryStr}` : '')
                })
            })
        }
    }

    /**
     * 去充值页面，如果是真实账户直接跳转，模拟需要弹窗提示用户确认再跳转
     */
    const toSignal = () => {
        if (isReal.value) {
            router.push('/signal')
        } else {
            Dialog.confirm({
                title: t('common.tip'),
                message: t('mockAccount.switchToSignalTip'),
            }).then(() => {
                handleSwitchAccount({
                    type: 'real',
                    url: 'signal'
                })
            })
        }
    }

    // 切换真实模拟
    const handleSwitchAccount = ({
        type,
        callback,
        fail,
        url
    }) => {
        store.commit('_user/Update_switchAccounting', true)
        findCustomerInfo().then(res => {
            if (res.check()) {
                if (Number(res.data.relationCustomerId) > 0) {
                    switchUserAccount().then(res => {
                        if (res.check()) {
                            setToken(res.data.token)
                            sessionSet('companyId', res.data.associationCompanyId)
                            localSetObj('mockAccount', 'accountType', type)
                            localSetObj('mockAccount', 'lastAccountType', type)
                            localSetObj('mockAccount', 'demo_domain', store.state._base.wpCompanyInfo.demo_domain)
                        }
                    }).then(() => {
                        return store.dispatch('_base/initBaseConfig')
                    }).then(() => {
                        return store.dispatch('_user/findCustomerInfo', true)
                    }).then(() => {
                        store.commit('_user/Update_emptyAccountAssets')
                        store.commit('_quote/Update_symbolBaseLoaded', 0)
                        return store.dispatch('_quote/querySymbolBaseInfoList')
                    }).then(() => {
                        const { tradeType } = store.getters.productActived
                        const defaultProduct = getDefaultProduct(tradeType)
                        if (route.name === 'Order' && defaultProduct?.symbolName && defaultProduct?.symbolId) {
                            router.replace(`/order?symbolId=${defaultProduct.symbolId}&tradeType=${tradeType}`)
                        }
                        // 模拟账户需要返回首页
                        if (type === 'demo' && route.meta?.roles?.includes('Real')) {
                            url = '/'
                        }
                        if (url) {
                            location.href = url
                        } else {
                            location.reload()
                        }
                        store.commit('_user/Update_switchAccounting', false)
                    }).catch(() => {
                        store.commit('_user/Update_switchAccounting', false)
                        fail && fail()
                    })
                }
            } else {
                store.commit('_user/Update_switchAccounting', false)
            }
        })
    }

    return {
        toOrderPriority,
        getDefaultProduct,
        handleSwitchAccount,
        toDeposit,
        toSignal
    }
}
