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

        <div class='borrowMoney'>
            <van-radio-group v-model='checked' direction='horizontal' @change='changeOperationType'>
                <van-radio :name='2'>
                    {{ $t('trade.autoLoan') }}
                    <van-icon class='questionIcon' name='question-o' @click='lilvAlert=true' />
                </van-radio>
                <van-radio :name='3'>
                    {{ $t('trade.autoRepayment') }}
                </van-radio>
            </van-radio-group>
            <van-row class='mtop10' justify='space-between'>
                <van-col>
                    {{ $t('trade.availableLoanAmount') }}
                    <van-icon class='questionIcon' name='question-o' @click='availableLoanAlert=true' />
                </van-col>
                <van-col>{{ account.availableLoan }} {{ account.currency }}</van-col>
            </van-row>
        </div>

        <van-dialog v-model:show='availableLoanAlert' title=''>
            <div class='availableLoanContent'>
                <p>{{ $t('trade.availableLoanContent1', [maxBorrow]) }}</p>
                <p>{{ $t('trade.availableLoanContent2',[account.currency,dailyInterest]) }}</p>
            </div>
        </van-dialog>
        <van-dialog v-model:show='lilvAlert' title=''>
            <div class='availableLoanContent'>
                <p>{{ $t('trade.availableLoanContent2', [account.currency,dailyInterest]) }}</p>
            </div>
        </van-dialog>
    </div>
</template>

<script>
import { computed, reactive, ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { mul, div, toFixed } from '@/utils/calculation'
export default {
    props: ['direction', 'product', 'volume', 'operationType', 'account'],
    emits: ['update:operationType'],
    setup (props, { emit }) {
        const store = useStore()
        const checked = ref(2)
        const availableLoanAlert = ref(false)
        const lilvAlert = ref(false)
        watch(
            () => props.operationType,
            newval => { checked.value = newval },
            { immediate: true }
        )
        const changeOperationType = val => emit('update:operationType', val)

        const accountMap = computed(() => store.state._user.customerInfo?.accountMap)
        const dailyInterest = computed(() => {
            const assetsId = accountMap?.value[props.account.currency]?.assetsId
            const interest = props.product.borrowInterestList.find(item => Number(item.assetsId) === Number(assetsId))?.value

            return interest ? mul(interest, 100) + '%' : '--'
        })

        // 最大可借额度
        const maxBorrow = computed(() => {
            const assetsId = accountMap?.value[props.account.currency]?.assetsId
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
            availableLoanAlert,
            lilvAlert,
            checked,
            changeOperationType,
            dailyInterest,
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
    margin-top: rem(80px);
    :deep(.van-radio__icon .van-icon) {
        line-height: 1;
    }
    .questionIcon {
        font-size: rem(30px);
        vertical-align: -2px;
    }
}
.availableLoanContent {
    padding: rem(30px);
    font-size: rem(24px);
    p {
        margin-top: rem(10px);
    }
}
</style>
