<template>
    <div v-if='product && curProduct' class='trust-item' @click='toDetail(item)'>
        <div class='t-header'>
            <div class='fl'>
                <span class='name'>
                    {{ product.symbolName }}
                </span>
                <span v-if='product.expireType' class='tag'>
                    {{ expireTypeMap[product.expireType] }}
                </span>
            </div>

            <div class='t-right'>
                <van-button @click.stop='cancelOrder'>
                    {{ $t('trade.cancelOrder') }}
                </van-button>
            </div>
        </div>
        <div class='directionCell'>
            <div class='direction item'>
                <span :class="Number(product.direction) === 1 ? 'riseColor' : 'fallColor'">
                    {{ Number(product.direction) === 1 ? $t('trade.buy') :$t('trade.sell') }}
                </span>
                &nbsp;
                <span v-if='Number(product.tradeType) === 5'>
                    {{ product.requestNum }}&nbsp;{{ product.outCurrency }}
                </span>
                <span v-else-if='Number(product.tradeType) === 3'>
                    {{ product.requestNum }}&nbsp;{{ product.accountCurrency }}
                </span>
                <span v-else>
                    {{ product.requestNum }}&nbsp;{{ Number(product.entryType) === 1 ? $t('trade.volumeUnit') : product.accountCurrency }}
                </span>
            </div>
            <div v-if='product.tradeType===5' class='item orderComplete'>
                <span class='label'>
                    {{ $t('trade.orderComplete') }}
                </span>
                <span>{{ product.executeNum }}</span>
            </div>
        </div>

        <div class='t-body'>
            <div class='t-left'>
                <p class='tl-item'>
                    <label for=''>
                        {{ $t('trade.pendingPrice') }}
                    </label>
                    <span>{{ product.requestPrice }}</span>
                </p>
                <p class='tl-item'>
                    <label for=''>
                        {{ $t('trade.currentPrice') }}
                        <!-- {{ symbolKey }} -->
                    </label>
                    <span :class='[Number(product.direction) === 1 ? curProduct.buy_color : curProduct.sell_color]'>
                        {{ Number(product.direction) === 1 ? curProduct.buy_price : curProduct.sell_price }}
                    </span>
                </p>

                <p v-if='[3, 9].includes(Number(product.tradeType))' class='tl-item'>
                    <label for=''>
                        {{ $t('trade.loan') }}
                    </label>
                    <span>
                        {{ product?.loanAmount || '--' }}
                    </span>
                </p>

                <p v-if='[1,2].includes(Number(product.tradeType))' class='tl-item'>
                    <label for=''>
                        {{ $t('trade.stopLossPrice') }}
                    </label>
                    <span>{{ shiftedBy(product.stopLoss,-1*product.digits ) || '--' }}</span>
                </p>

                <p v-if='[1,2].includes(Number(product.tradeType))' class='tl-item'>
                    <label for=''>
                        {{ $t('trade.stopProfitPrice') }}
                    </label>

                    <span>{{ shiftedBy(product.takeProfit,-1*product.digits ) || '--' }}</span>
                </p>
            </div>
        </div>
        <div class='t-body'>
            <div class='t-left'>
                <p class='tl-item'>
                    <span>{{ formatTime(product.orderTime,'YYYY/MM/DD HH:mm:ss') }}</span>
                </p>

                <p class='tl-item'>
                    <span> #{{ product.id }}</span>
                </p>
            </div>
        </div>
    </div>
    <Loading :show='loading' />
</template>

<script>
import { computed, ref } from 'vue'
import { Toast, Dialog } from 'vant'
import { shiftedBy } from '@/utils/calculation'
import { useStore, useRoute } from 'vuex'
import { closePboOrder, closeTradePboOrder } from '@/api/trade'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
export default {
    props: ['product'],
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const loading = ref(false)
        const { t } = useI18n({ useScope: 'global' })
        const expireTypeMap = {
            1: t('trade.expire1'),
            2: t('trade.expire2')
        }
        // 获取当前产品
        const symbolKey = `${props.product.symbolId}_${props.product.tradeType}`
        const curProduct = computed(() => store.state._quote.productMap[symbolKey])

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        const toDetail = (item) => {
            router.push({
                path: '/trustDetail',
                query: {
                    id: props.product.id,
                    symbolId: props.product.symbolId,
                    tradeType: props.product.tradeType
                }
            })
        }

        const cancelOrder = () => {
            Dialog.confirm({
                title: t('tip'),
                message: t('trade.cancelPendingOrder'),
            }).then(() => {
                closePendingOrder()
            }).catch(() => {})
        }

        // 取消挂单
        const closePendingOrder = () => {
            // if(Number())
            loading.value = true
            const params = {
                tradeType: props.product.tradeType,
                customerNo: customInfo.value.customerNo,
                accountId: props.product.accountId,
                bizType: props.product.bizType

            }

            if ([5, 9].includes(props.product.tradeType)) {
                // ABCC撤单
                closeTradePboOrder({
                    orderId: props.product.id,
                    ...params,
                }).then(res => {
                    loading.value = false
                    if (res.check()) {
                        closeSuccess()
                    }
                }).catch(err => {
                    loading.value = false
                    console.log(err)
                })
            } else {
                closePboOrder({
                    pboId: props.product.id,
                    ...params,
                }).then(res => {
                    loading.value = false
                    if (res.check()) {
                        closeSuccess()
                    }
                }).catch(err => {
                    loading.value = false
                    console.log(err)
                })
            }
        }

        const closeSuccess = () => {
            Toast(t('trade.cancelSuccess'))
            store.dispatch('_trade/queryPBOOrderPage', {
                tradeType: props.product.tradeType,
                sortFieldName: 'orderTime',
                sortType: 'desc',

            })
        }

        return {
            cancelOrder,
            shiftedBy,
            loading,
            curProduct,
            symbolKey,
            toDetail,
            expireTypeMap
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.trust-item {
    margin: rem(20px);
    padding: rem(20px);
    background-color: var(--contentColor);
    border-bottom: solid 1px var(--lineColor);
    border-radius: rem(8px);
    .t-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: rem(20px);
        .fl {
            margin-right: rem(32px);
            color: var(--color);
            font-size: rem(30px);
            // .time {
            //     color: var(--placeholdColor);
            //     font-size: rem(20px);
            // }
            .name {
                margin-right: rem(40px);
            }
        }
        .tag {
            // width: 92px;
            display: inline-block;
            height: rem(35px);
            padding: 0 rem(8px);
            color: var(--minorColor);
            font-size: rem(20px);
            line-height: rem(35px);
            text-align: center;
            border: 1px solid var(--minorColor);
            border-radius: rem(6px);
        }
        .t-right {
            //position: relative;
            .van-button {
                width: rem(124px);
                height: rem(48px);
                color: var(--primary);
                font-size: rem(24px);
                line-height: rem(48px);
                background: var(--primaryAssistColor);
                border-color: var(--primaryAssistColor);
                border-radius: rem(6px);
            }
        }
    }
    .directionCell {
        display: flex;
        margin: rem(20px) 0;
        .item {
            flex: 1;
        }
        .orderComplete {
            color: var(--normalColor);
            font-size: rem(20px);
            .label {
                display: inline-block;
                width: rem(100px);
                margin-right: rem(20px);
            }
        }
    }
    .t-body {
        display: flex;
        justify-content: space-between;
        .t-left {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            .tl-item {
                width: 50%;
                margin-bottom: rem(10px);
                color: var(--normalColor);
                text-align: left;
                label {
                    display: inline-block;
                    width: rem(100px);
                    margin-right: rem(20px);
                    font-size: rem(20px);
                }
                span {
                    font-size: rem(20px);
                    text-align: left;
                }
            }
        }
    }
}
</style>
