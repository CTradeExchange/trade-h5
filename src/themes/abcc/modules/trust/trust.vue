<template>
    <div class='trust-item'>
        <div class='t-header'>
            <span class='product-name'>
                {{ product.symbolName }}
            </span>
            <span class='direction'>
                <span :class="Number(product.direction) === 1 ? 'riseColor' : 'fallColor'">
                    {{ Number(product.direction) === 1 ? $t('trade.buy') :$t('trade.sell') }}
                </span> {{ product.requestNum }} {{ product.accountCurrency }}
            </span>
        </div>
        <Loading :show='loading' />
        <div class='t-body'>
            <div class='t-left'>
                <p class='tl-item'>
                    <label for=''>
                        {{ $t('trade.pendingPrice') }}
                    </label>
                    <span>{{ shiftedBy(product.requestPrice, -1*product.digits) }}</span>
                </p>
                <p class='tl-item'>
                    <label for=''>
                        {{ $t('trade.currentPrice') }}
                    </label>
                    <span :class='curProduct.cur_color'>
                        {{ curProduct.cur_price }}
                    </span>
                </p>
                <p class='tl-item'>
                    <label for=''>
                        {{ $t('trade.loan') }}
                    </label>
                    <span>--</span>
                </p>
                <!-- <p class='tl-item'>
                    <label for=''>
                        利息
                    </label>
                    <span>12.55488USDT</span>
                </p> -->
            </div>
            <div class='t-right'>
                <van-button @click.stop='cancelOrder'>
                    {{ $t('trade.cancelOrder') }}
                </van-button>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { Toast, Dialog } from 'vant'
import { shiftedBy } from '@/utils/calculation'
import { useStore } from 'vuex'
import { closePboOrder } from '@/api/trade'
import { useI18n } from 'vue-i18n'
export default {
    props: ['product'],
    setup (props) {
        const store = useStore()
        const loading = ref(false)
        const { t } = useI18n({ useScope: 'global' })
        // 获取当前产品
        const curProduct = computed(() => store.state._quote.productMap[props.product.symbolId])
        // 获取玩法id
        const tradeType = computed(() => store.state._base.tradeType)

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        const cancelOrder = () => {
            Dialog.confirm({
                title: '提示',
                message: '确定撤单吗?',
            }).then(() => {
                loading.value = true
                const params = {
                    tradeType: tradeType.value,
                    customerNo: customInfo.value.customerNo,
                    accountId: props.product.accountId,
                    pboId: props.product.id,
                    bizType: props.product.bizType

                }

                closePboOrder(params).then(res => {
                    loading.value = false
                    if (res.check()) {
                        Toast(t('trade.cancelSuccess'))
                        store.dispatch('_trade/queryPBOOrderPage')
                    }
                }).catch(err => {
                    loading.value = false
                    console.log(err)
                })
            }).catch(() => {})
        }

        return {
            cancelOrder,
            shiftedBy,
            loading,
            curProduct
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.trust-item {
    padding: rem(30px);
    background-color: var(--contentColor);
    border-bottom: solid 1px var(--lineColor);
    border-radius: rem(8px);
    .t-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: rem(30px);
        .product-name {
            color: var(--color);
            font-size: rem(30px);
        }
        .direction {
            font-size: rem(24px);
        }
    }
    .t-body {
        display: flex;
        justify-content: space-between;
        .t-left {
            .tl-item {
                margin-bottom: rem(10px);
                color: var(--normalColor);
                font-size: rem(24px);
                text-align: left;
                label {
                    display: inline-block;
                    width: rem(80px);
                }
                span {
                    text-align: left;
                }
            }
        }
        .t-right {
            position: relative;
            .van-button {
                position: absolute;
                right: 0;
                bottom: rem(10px);
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
}
</style>
