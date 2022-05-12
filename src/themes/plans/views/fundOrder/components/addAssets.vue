<template>
    <van-popup
        v-model:show='show'
        position='bottom'
        round
        @close='close'
    >
        <div class='add-wrap'>
            <h2>选择获取该资产的方式</h2>
            <div class='type' @click='toDeposit'>
                <div class='left'>
                    <i
                        class='icon iconfong icon_icon_assets'
                    ></i>
                    <div class='text'>
                        <h3>存款</h3>
                        <h5>通过存款的方式存入该资产</h5>
                    </div>
                </div>

                <van-icon name='arrow' />
            </div>
            <div class='type' @click='toOrderFund'>
                <div class='left'>
                    <img alt='' class='icon' src='../../../images/trade.png' />
                    <div class='text'>
                        <h3>买入</h3>
                        <h5>通过交易的方式买入该资产</h5>
                    </div>
                </div>
                <van-icon name='arrow' />
            </div>
        </div>
    </van-popup>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useStore()
const emit = defineEmits(['update:show'])
const props = defineProps({
    // 是否显示弹窗
    show: {
        type: Boolean,
        default: false
    },
    currency: {
        type: String,
        default: 'USDT'
    },
    accountId: {
        type: String,
        default: ''
    }
})

// 关闭弹窗
const close = () => {
    emit('update:show', false)
}

// 跳转充值页面
const toDeposit = () => {
    router.push({
        path: '/depositChoose',
        query: {
            tradeType: 5,
            accountId: 1001049,
            currency: 'BTC'
        }

    })
}

// 点击前往交易页面的对应产品
const toOrderFund = () => {
    const productList = store.state._quote.productList
    let product = productList.find(el => el.baseCurrency === props.currency && el.profitCurrency === 'USDT' && el.tradeType === 5)
    if (!product) {
        product = productList.find(el => el.baseCurrency === props.currency && el.tradeType === 5)
    }

    router.replace(`/order?symbolId=${product.symbolId}&tradeType=${product.tradeType}`)
}
</script>

<style scoped lang='scss'>
@import '@/sass/mixin.scss';
.add-wrap {
    padding: rem(30px);
    h2 {
        margin: rem(20px) 0 rem(40px) 0;
        text-align: center;
    }
    .type {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: rem(40px);
        padding: rem(40px) rem(30px);
        background: var(--bgColor);
        .left {
            display: flex;
            .icon {
                width: rem(80px);
                height: rem(80px);
                margin-right: rem(40px);
                font-size: rem(80px);
                &.icon_icon_assets {
                    color: var(--focusColor);
                }
            }
            .text {
                h3 {
                    font-weight: bold;
                }
                h5 {
                    color: var(--minorColor);
                }
            }
        }
    }
}
</style>
