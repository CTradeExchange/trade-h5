<template>
    <div class='orderAssets'>
        <!-- <van-row justify='space-between'>
            <van-col>{{ $t('trade.estimatedMargin') }}</van-col>
            <van-col>
                {{ lockFunds }}
                {{ direction==='buy'?product.profitCurrency:product.baseCurrency }}
            </van-col>
        </van-row> -->
        <van-row justify='space-between'>
            <van-col>{{ $t('trade.free') }}</van-col>
            <van-col>
                {{ account.available }}
                {{ direction==='buy'?product.profitCurrency:product.baseCurrency }}
            </van-col>
        </van-row>

        <div v-if='[3,9].includes(product.tradeType)' class='borrowMoney'>
            <van-row class='mtop10' justify='space-between'>
                <van-col v-if='product.tradeType===3'>
                    {{ $t('trade.availableLoanAmount') }}
                    <van-icon class='questionIcon' name='question-o' @click='loanTradeType3=true' />
                </van-col>
                <van-col v-else-if='product.tradeType===9'>
                    {{ $t('trade.availableLoanAgent') }}
                    <van-icon class='questionIcon' name='question-o' @click='loanTradeType9=true' />
                </van-col>
                <van-col>{{ account.availableLoan }} {{ account.currency }}</van-col>
            </van-row>
        </div>

        <!-- 杠杆玩法可借额度的解说 -->
        <van-dialog v-model:show='loanTradeType3' title=''>
            <div class='availableLoanContent'>
                <p>{{ $t('trade.availableLoanContent7') }}</p>
                <p>{{ $t('trade.availableLoanContent8') }}</p>
            </div>
        </van-dialog>
        <!-- 代理可借的解说 -->
        <van-dialog v-model:show='loanTradeType9' title=''>
            <div class='availableLoanContent'>
                <p>{{ $t('trade.availableLoanContent1', [maxBorrow]) }}</p>
                <p>{{ $t('trade.availableLoanContent2') }}</p>
            </div>
        </van-dialog>
    </div>
</template>

<script>
import { computed, reactive, ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { mul, div, toFixed } from '@/utils/calculation'
export default {
    props: ['direction', 'product', 'volume', 'account'],
    setup (props, { emit }) {
        const store = useStore()
        const checked = ref(2)
        const loanTradeType9 = ref(false)
        const loanTradeType3 = ref(false)
        watch(
            () => props.operationType,
            newval => { checked.value = newval },
            { immediate: true }
        )

        const accountMap = computed(() => store.state._user.customerInfo?.accountMap)

        // 最大可借额度
        const maxBorrow = computed(() => {
            const assetsCurrency = store.state._user.assetsInfo?.currency
            if (props.product.tradeType === 9) return props.product.totalCredit + assetsCurrency // abcc玩法显示总授信
            const accountMapKey = `${props.product.tradeType}_${props.account.currency}`
            const assetsId = accountMap?.value[accountMapKey]?.assetsId
            if (props.product.borrowLimitList) {
                const borrowLimit = props.product?.borrowLimitList.find(item => Number(item.assetsId) === Number(assetsId))?.value
                return borrowLimit || '--'
            }
            return '--'
        })

        // 预计占用
        const lockFunds = computed(() => {
            let amount = ''
            if (props.direction === 'buy') {
                amount = mul(props.volume, props.product.buy_price)
            } else {
                amount = props.volume
            }
            if (amount === '') amount = 0
            return toFixed(amount, props.account.digits)
        })

        return {
            loanTradeType3,
            loanTradeType9,
            checked,
            maxBorrow,
            lockFunds,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.orderAssets {
    margin-top: rem(20px);
    color: var(--minorColor);
    line-height: 1.5;
}
.borrowMoney {
    margin-top: rem(20px);
    color: var(--minorColor);
    font-size: rem(24px);
    :deep(.van-radio__icon .van-icon) {
        width: rem(30px);
        height: rem(30px);
        font-size: rem(26px);
        line-height: 0.9;
    }
    .questionIcon {
        font-size: rem(30px);
        vertical-align: -2px;
    }

    --van-radio-label-color: var(--minorColor);
}
.availableLoanContent {
    padding: rem(30px);
    font-size: rem(24px);
    p {
        margin-top: rem(10px);
    }
}
</style>
