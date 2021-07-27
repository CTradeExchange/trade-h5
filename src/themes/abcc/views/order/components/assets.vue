<template>
    <div class='orderAssets'>
        <van-row justify='space-between'>
            <van-col>{{ $t('trade.estimatedMargin') }}</van-col>
            <van-col>
                {{ lockFunds }}
                {{ direction==='buy'?product.profitCurrency:product.baseCurrency }}
            </van-col>
        </van-row>
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
                </van-radio>
                <van-radio :name='3'>
                    {{ $t('trade.autoRepayment') }}
                </van-radio>
            </van-radio-group>
            <van-row class='mtop5' justify='space-between'>
                <van-col>
                    {{ $t('trade.availableLoanAmount') }}
                    <van-icon class='questionIcon' name='question-o' @click='availableLoanAlert=true' />
                </van-col>
                <van-col>{{ account.availableLoan }} {{ account.currency }}</van-col>
            </van-row>
        </div>

        <van-dialog v-model:show='availableLoanAlert' title=''>
            <div class='availableLoanContent'>
                <p>{{ $t('trade.availableLoanContent1') }}</p>
                <p>{{ $t('trade.availableLoanContent2') }}</p>
            </div>
        </van-dialog>
    </div>
</template>

<script>
import { computed, reactive, ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { mul } from '@/utils/calculation'
export default {
    props: ['direction', 'product', 'volume', 'operationType', 'account'],
    emits: ['update:operationType'],
    setup (props, { emit }) {
        const store = useStore()
        const checked = ref(2)
        const availableLoanAlert = ref(false)
        watch(
            () => props.operationType,
            newval => { checked.value = newval },
            { immediate: true }
        )
        const changeOperationType = val => emit('update:operationType', val)

        // 预计占用
        const lockFunds = computed(() => {
            if (props.direction === 'buy') {
                return mul(props.volume, props.product.buy_price)
            } else {
                return props.volume
            }
        })

        return {
            availableLoanAlert,
            checked,
            changeOperationType,
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
