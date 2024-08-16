<template>
    <div class='orderWrap'>
        <div class='orderTop'>
            <CurrentPairInfo />
        </div>
        <div class='van-hairline--bottom' :class="subStudy ? 'h-110' : 'h-70'">
            <Chart container-id='order-chart' :disabled-features="['timeframes_toolbar', 'left_toolbar']" @setSubStudy='setSubStudy' />
        </div>
        <SignalOrderMobile />
        <div class='container'>
            <div v-if='product' class='main'>
                <OrderHandicap v-if='product?.enableDepthTrade === 2' class='left' :product='product' />

                <div v-if='product' class='right'>
                    <QuickTransaction />
                </div>
            </div>

            <!-- 交易记录 -->
            <OrderRecord ref='orderRecordRef' :trade-type='product?.tradeType' @subscribe='setProductKeys' />
        </div>
        <!-- 切换产品 -->
        <ProductSearchSwipeModal v-if="$route.path.indexOf('/order') !== -1" key='order' />
    </div>
</template>

<script>
import { reactive, toRefs, computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { useStore } from 'vuex'
import { pow } from '@/utils/calculation'
import { QuoteSocket } from '@/plugins/socket/socket'
import OrderHandicap from './components/handicap.vue'
import OrderRecord from './components/orderRecord.vue'
import CurrentPairInfo from './components/currentPairInfo.vue'
import hooks from './orderHooks'
import { toolHooks } from '@plans/hooks/handicap'
import { isEmpty } from '@/utils/util'
import QuickTransaction from '@/themeCommon/components/quickTransaction/quickTransaction.vue'
import useGetTradeExchangeRate from '@/hooks/trade/useGetTradeExchangeRate'
import ProductSearchSwipeModal from '@/themeCommon/components/productSearch/productSearchSwipeModal.vue'
import Chart from '@/components/chart/index.vue'
import SignalOrderMobile from '@/plugins/signal/modules/signal-order-mobile.vue'

export default {
    components: {
        OrderHandicap,
        OrderRecord,
        QuickTransaction,
        CurrentPairInfo,
        ProductSearchSwipeModal,
        Chart,
        SignalOrderMobile,
    },
    setup () {
        const store = useStore()
        const route = useRoute()

        const router = useRouter()
        const { miniChart } = route.query
        const originTitle = document.title
        const { t } = useI18n({ useScope: 'global' })
        const tradeRef = ref(null)
        useGetTradeExchangeRate()

        const symbolKey = computed(() => store.state._quote.productActivedID)
        const state = reactive({
            loading: false,
            productKeys: [], // 交易记录组件需要订阅的产品
            showChart: !!miniChart,
            subStudy: null,
        })
        const orderRecordRef = ref(null) // 交易记录组件对象
        const product = computed(() => store.getters.productActived)
        if (!product.value) {
            router.push('/')
        }
        const customerInfo = computed(() => store.state._user.customerInfo)
        const plansLen = computed(() => {
            const userProductCategory = store.getters.userProductCategory
            let arr = Object.keys(userProductCategory)
            arr = arr.filter((el) => {
                return userProductCategory[el]?.find((o) => o.listByUser?.length)
            })
            return arr.length
        })
        const { account, findProductInCategory, switchProduct } = hooks(state)
        const { dealModeShowMap } = toolHooks()
        const productSwitchHistory = {} // 顶部玩法类型切换记录
        // 玩法列表
        const isWallet = store.state._base.wpCompanyInfo.isWallet
        const plansList = computed(() =>
            store.state._base.plans
                .filter((el) => !(el.tradeType === '5' && isWallet))
                .map((el) => {
                    el.name = t('tradeType.' + el.tradeType)
                    return el
                }),
        )

        const productTradeType = ref('')

        // 初始化设置
        const init = () => {
            const [symbolId, tradeType] = symbolKey?.value.split('_')
            productSwitchHistory[tradeType] = symbolKey.value
            if ([1, 2].includes(Number(tradeType))) {
                store.dispatch('_trade/queryPositionPage', { tradeType })
            }
            // 获取产品详情
            store.dispatch('_quote/querySymbolInfo', { symbolId, tradeType }).then((product) => {
                quoteSubscribe() // 订阅产品行情
                // 订阅产品五档报价
                const curDigits = pow(0.1, product?.symbolDigits)
                QuoteSocket.deal_subscribe(symbolId, product?.priceBreadth || 0, curDigits, tradeType, 5)
                if (tradeType === '9') store.dispatch('_user/queryCustomerAssetsInfo', { tradeType }) // 拉取全仓账户币种
            })
        }

        // 切换玩法，优先取当前玩法下的缓存产品，没有缓存产品取当前玩法下的默认产品
        const handleTradeType = (tradeType) => {
            let changeProductKey = ''
            if (productSwitchHistory[tradeType]) {
                changeProductKey = productSwitchHistory[tradeType]
            } else {
                changeProductKey = findProductInCategory(tradeType)
                productSwitchHistory[tradeType] = changeProductKey
            }
            if (changeProductKey) {
                const [symbolId, tradeType] = changeProductKey.split('_')
                switchProduct(symbolId, tradeType)
            }
        }

        // 侧边栏-切换产品
        const onSelectProduct = (product, close) => {
            const { symbolId, tradeType } = product
            productSwitchHistory[tradeType] = `${symbolId}_${tradeType}`
            switchProduct(symbolId, tradeType).then((res) => {
                close()
            })
        }

        // 设置交易记录组件需要订阅的产品
        const setProductKeys = (arr) => {
            state.productKeys = arr
            quoteSubscribe()
        }

        // 下单页面的行情订阅，包括当前产品和挂单列表的产品
        const quoteSubscribe = () => {
            let result = state.productKeys
            result.push(symbolKey.value)
            result = [...new Set(result)]
            QuoteSocket.send_subscribe(result)
            QuoteSocket.send_subscribe24H(result)
        }

        // 价格跳动修改页面title
        const unWatchPrice = watch(
            () => product.value?.cur_price,
            (newval, oldval) => {
                if (newval) {
                    document.title = `${newval} | ${product.value.symbolCode} | ${originTitle}`
                }
            },
            { immediate: true },
        )

        // 去注册
        const toRegister = () => {
            router.push('/register')
        }

        const showChartHandle = (result) => {
            state.showChart = result
        }

        const setSubStudy = (value) => {
            state.subStudy = value
        }

        // 监听symbolId、tradeType
        watch(
            () => route.query,
            (query) => {
                const { symbolId, tradeType } = query
                if (symbolId && tradeType) {
                    productTradeType.value = Number(tradeType)
                    /** 找不到产品，没有权限 */
                    if (!store.state._quote.productMap[`${symbolId}_${tradeType}`]) {
                        router.replace('/')
                        return
                    }
                    store.commit('_quote/Update_productActivedID', `${symbolId}_${tradeType}`)
                    store.commit('_quote/Update_lastProductActivedID', `${symbolId}_${tradeType}`)
                }
            },
            { immediate: true },
        )

        watch(
            symbolKey,
            () => {
                init()
            },
            { immediate: true },
        )

        onBeforeRouteLeave(() => {
            unWatchPrice()
            document.title = originTitle
            QuoteSocket.cancel_subscribe(0)
            store.commit('_quote/Delete_dealList')
        })

        return {
            ...toRefs(state),
            isEmpty,
            init,
            customerInfo,
            plansList,
            dealModeShowMap,
            productTradeType,
            onSelectProduct,
            plansLen,
            account,
            orderRecordRef,
            handleTradeType,
            product,
            quoteSubscribe,
            toRegister,
            setProductKeys,
            tradeRef,
            showChartHandle,
            setSubStudy,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';

.orderWrap {
    height: 100%;
    overflow-y: auto;
    color: var(--color);
    background: var(--bgColor);
    padding-top: 56px;
    padding-bottom: rem(136px);
    .orderTop {
        background: var(--bgColor);
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 999;
        border-bottom: 1px solid var(--lineColor);
    }
    :deep {
        .quickTransaction-header {
            display: none;
        }
    }
    .container {
        flex: 1;
    }
    .main {
        @include scroll();
        display: flex;
        flex: 1;
        padding: 16px;
        overflow: auto;
        background: var(--contentColor);
        border-top: 1px solid var(--lineColor);
        .left {
            width: rem(250px);
            margin-right: 12px;
        }
        .right {
            flex: 1;
            :deep {
                .orderVolume input:focus {
                    background-color: var(--contentColor);
                }
                .profitLossSetBar {
                    &:first-of-type {
                        padding-top: 0;
                    }
                    .stepper:focus-within {
                        background-color: var(--contentColor);
                    }
                }
            }
        }
    }
}
</style>
