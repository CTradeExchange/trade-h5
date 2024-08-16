<template>
    <div class='p-4 van-hairline--bottom'>
        <div class='flex justify-space-between items-center mb-6'>
            <div class='flex items-center text-color'>
                <van-tag
                    :color="Number(product.direction) === 1 ? 'var(--riseColor)' : 'var(--fallColor)'"
                    size='large'
                    style='--van-tag-border-radius: 4px'
                    text-color='#fff'
                >
                    {{ Number(product.direction) === 1 ? 'L' : 'S' }}
                </van-tag>
                <span class='text-base font-bold mx-3'>
                    {{ product.symbolName }}
                </span>
                <van-tag v-if='product.crossLevelNum' class='font-bold' color='var(--assistColor)' size='large' text-color='var(--color) '>
                    {{ product.crossLevelNum }}x
                </van-tag>
                <img class='w-4 h-4 ml-3' src='/images/chart.svg' @click.stop='toProduct(product.symbolId)' />
            </div>
            <van-button class='px-4' plain size='mini' type='primary' @click.stop='cancelOrder'>
                {{ $t('trade.cancelOrder') }}
            </van-button>
        </div>

        <div class='flex justify-space-between'>
            <div>
                <div>
                    <div class='text-xs text-minorColor mb-1'>
                        {{ `${$t('trade.size')}${`(${showVolume ? curProduct.numberCurrency : currency})`}` }}
                    </div>

                    <div class='flex items-center'>
                        <div v-if='!showVolume' class='text-sm text-color font-bold mr-1'>
                            {{ `${mul(product.requestNum, product.crossLevelNum)}` }}
                        </div>
                        <div v-else class='text-sm text-color font-bold mr-1'>
                            {{
                                toFixed(
                                    div(mul(product.requestNum, product.crossLevelNum), product.requestPriceTarget),
                                    curProduct.numberDigits,
                                    1,
                                )
                            }}
                        </div>
                        <img src='/images/switch.svg' @click='showVolume = !showVolume' />
                    </div>
                </div>
                <div class='mt-4'>
                    <div class='text-xs text-minorColor mb-1'>
                        {{ $t('trade.currentPrice') }}
                    </div>
                    <div class='text-sm text-color font-bold' :class='curProduct?.cur_color'>
                        {{ curProduct?.cur_price || '--' }}
                    </div>
                </div>
                <div v-if='product.takeProfitTarget || product.stopLossTarget' class='mt-4'>
                    <div class='text-xs text-minorColor mb-1'>
                        {{ $t('trade.stopProfitPrice') }}
                    </div>
                    <div class='text-sm text-color font-bold'>
                        {{ product.takeProfitTarget || '--' }}
                    </div>
                </div>
            </div>

            <div>
                <div>
                    <div class='text-xs text-minorColor mb-1'>
                        {{ `${$t('trade.margin')}${currency ? ` (${currency})` : ''}` }}
                    </div>
                    <div class='text-sm text-color font-bold'>
                        {{ product.requestNum ? `${product.requestNum}` : '--' }}
                    </div>
                </div>
                <div class='mt-4'>
                    <div class='text-xs text-minorColor mb-1'>
                        {{ $t('headLineTrade.liqPrice') }}
                    </div>
                    <div class='text-sm text-color font-bold'>
                        {{ liqPrice }}
                    </div>
                </div>
            </div>

            <div class='text-right'>
                <div>
                    <div class='text-xs text-minorColor mb-1'>
                        {{ $t('trade.trustPrice') }}
                    </div>
                    <div class='text-sm text-color font-bold'>
                        {{ product.requestPrice || '--' }}
                    </div>
                </div>
                <div v-if='product.takeProfitTarget || product.stopLossTarget' class='mt-4'>
                    <div class='text-xs text-minorColor mb-1'>
                        {{ $t('trade.stopLossPrice') }}
                    </div>
                    <div class='text-sm text-color font-bold'>
                        {{ product.stopLossTarget || '--' }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Loading :show='loading' />
</template>

<script>
import { computed, ref } from 'vue'
import { Toast, Dialog } from 'vant'
import { toFixed, shiftedBy, minus, div, mul, plus } from '@/utils/calculation'
import { useStore } from 'vuex'
import { closePboOrder, closeTradePboOrder } from '@/api/trade'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAssets } from '@/hooks/assets'

export default {
    props: ['product'],
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const loading = ref(false)
        const { t } = useI18n({ useScope: 'global' })
        const expireTypeMap = {
            1: t('trade.expire1'),
            2: t('trade.expire2'),
        }
        const assets = useAssets()
        // 显示手数
        const showVolume = ref(false)
        // 获取当前产品
        const symbolKey = `${props.product.symbolId}_${props.product.tradeType}`
        const curProduct = computed(() => store.state._quote.productMap[symbolKey])
        const currency = computed(() => assets.value?.currency || '')

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        const toDetail = (item) => {
            router.push({
                path: '/trustDetail',
                query: {
                    id: props.product.id,
                    symbolId: props.product.symbolId,
                    tradeType: props.product.tradeType,
                },
            })
        }

        const cancelOrder = () => {
            Dialog.confirm({
                title: t('tip'),
                message: t('trade.cancelPendingOrder'),
                confirmButtonText: t('common.sure'),
                cancelButtonText: t('common.cancel'),
            })
                .then(() => {
                    closePendingOrder()
                })
                .catch(() => {})
        }

        const productMap = computed(() => store.state._quote.productMap)
        const currentProduct = (row) => {
            return productMap.value[row.symbolId + '_' + row.tradeType]
        }
        const liqPrice = computed(() => {
            if (!props.product.requestPriceTarget) return '--'
            const methods = props.product.direction === 1 ? minus : plus
            return `${toFixed(
                methods(props.product.requestPriceTarget, div(mul(props.product.requestPriceTarget, 0.8), props.product.crossLevelNum)),
                currentProduct(props.product).price_digits,
            )}`
        })

        // 取消挂单
        const closePendingOrder = () => {
            // if(Number())
            loading.value = true
            const params = {
                tradeType: props.product.tradeType,
                customerNo: customInfo.value.customerNo,
                accountId: props.product.accountId,
                bizType: props.product.bizType,
            }

            // 玩法2的判断，如果不是撮合就调用closePboOrder，是的话就调用closeTradePboOrder
            if (
                [5, 9].includes(props.product.tradeType) ||
                (Number(props.product.tradeType) === 2 && currentProduct(props.product).dealMode === 6)
            ) {
                closeTradePboOrder({
                    orderId: props.product.id,
                    ...params,
                })
                    .then((res) => {
                        loading.value = false
                        if (res.check()) {
                            closeSuccess()
                        } else {
                            Toast(res.msg)
                        }
                    })
                    .catch((err) => {
                        loading.value = false
                        // console.log(err)
                    })
            } else {
                closePboOrder(
                    {
                        pboId: props.product.id.toString(),
                        ...params,
                    },
                    {
                        toastErr: false,
                    },
                )
                    .then((res) => {
                        loading.value = false
                        if (res.check()) {
                            closeSuccess()
                        } else {
                            if (res?.code === '10011012') {
                                Toast(t('trade.closePboOrderFail'))
                            } else {
                                Toast(res.msg)
                            }
                        }
                    })
                    .catch((err) => {
                        loading.value = false
                        console.log(err)
                    })
            }
        }

        const closeSuccess = () => {
            Toast(t('trade.cancalPendingSucc'))
            store.dispatch('_trade/queryPBOOrderPage', {
                tradeType: props.product.tradeType,
                sortFieldName: 'orderTime',
                sortType: 'desc',
            })
        }

        const toProduct = (symbolId) => {
            router.push({ path: '/product', query: { symbolId, tradeType: props.product.tradeType } })
        }
        return {
            toFixed,
            cancelOrder,
            shiftedBy,
            loading,
            curProduct,
            symbolKey,
            toDetail,
            expireTypeMap,
            currentProduct,
            productMap,
            toProduct,
            currency,
            mul,
            minus,
            div,
            showVolume,
            liqPrice,
        }
    },
}
</script>
