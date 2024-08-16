<template>
    <!-- <div class='wrapper'>
        <FloatTip v-if='warn'>
            {{ warn }}
        </FloatTip>
        <PendingBar
            v-model='pendingPrice'
            :direction='direction'
            :product='product'
            @change='onChange'
        />
    </div> -->
    <StepperComp
        v-model='pendingPrice'
        class='stepper'
        :class='{ warn: warn }'
        :controlbtn='true'
        :digits='product.price_digits'
        :step='step'
        @firstMinus='firstChange'
        @firstPlus='firstChange'
    />
    <!-- :max=' stopRange[0]'
        :min='stopRange[1]' -->
</template>

<script>
import { pow } from '@/utils/calculation'
import PendingBar from './pendingBar'
import FloatTip from './floatTip'
import { Dialog } from 'vant'
import { computed, onBeforeUnmount, reactive, toRefs, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import StepperComp from '@plans/components/stepper'

export default {
    components: {
        FloatTip,
        PendingBar,
        StepperComp,
    },
    props: ['modelValue', 'product', 'direction'],
    emits: ['update:modelValue', 'change'],
    setup (props, { emit }) {
        const store = useStore()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const pendingRang = computed(() => {
            const range = store.getters['_trade/pendingPriceRang']
            const limitRange = props.direction === 'buy' ? range.buyLimitRange : range.sellStopRange
            const stopRange = props.direction === 'buy' ? range.buyStopRange : range.sellLimitRange
            return {
                stopRangeMax: stopRange[1],
                stopRangeMin: stopRange[0],
                limitRangeMax: limitRange[1],
                limitRangeMin: limitRange[0],
                defaultBuyPrice: range.defaultBuyPrice,
                defaultSellPrice: range.defaultSellPrice,
            }
        })
        const warn = computed(() => {
            // const modelValue = props.modelValue
            // const pendingRange = pendingRang.value
            // if (!modelValue) {
            //     return ''
            // } else if (lt(modelValue, pendingRange.stopRangeMin) && gt(modelValue, pendingRange.limitRangeMax)) {
            //     return t('trade.pendingPriceWarn')
            // } else if (gt(modelValue, pendingRange.stopRangeMax) || lt(modelValue, pendingRange.limitRangeMin)) {
            //     return t('trade.pendingPriceWarn2')
            // } else {
            //     return ''
            // }
            return ''
        })
        const pendingPrice = computed({
            get: () => props.modelValue,
            set: (val) => emit('update:modelValue', val),
        })

        const step = computed(() => pow(0.1, props.product.price_digits))
        const state = reactive({
            num: props.modelValue,
            // 是否第一次设置
            isFirst: true,
        })

        const priceIntroduce = () => {
            Dialog.alert({
                title: t('trade.priceIntroduce'),
                message: t('trade.priceIntroContent'),
            })
        }

        const firstChange = () => {
            const defaultPendingPrice = pendingRang.value[props.direction === 'buy' ? 'defaultBuyPrice' : 'defaultSellPrice']
            if (defaultPendingPrice && !isNaN(defaultPendingPrice)) emit('update:modelValue', defaultPendingPrice)
            state.isFirst = false
        }

        const onChange = (val) => {
            emit('update:modelValue', val)
            emit('change', val)
        }

        // 监听产品是否变化
        watch(
            () => [route.query.symbolId, route.query.tradeType],
            () => {
                state.isFirst = true
            },
        )

        // 监听modelValue
        watch(
            () => props.modelValue,
            (newVal) => {
                if (newVal) store.commit('_trade/Update_pendingPrice', { price: newVal, direction: props.direction })
            },
            {
                immediate: true,
            },
        )

        // 监听direction
        watch(
            () => props.direction,
            () => {
                store.commit('_trade/Update_pendingPrice', { price: props.modelValue, direction: props.direction })
            },
        )

        // 切换产品的初始化一次价格
        watchEffect(() => {
            if (pendingRang.value && state.isFirst) {
                firstChange()
            }
        })

        onBeforeUnmount(() => {
            store.commit('_trade/Update_pendingPrice', { price: '', direction: props.direction })
        })

        return {
            ...toRefs(state),
            step,
            warn,
            pendingRang,
            pendingPrice,
            onChange,
            priceIntroduce,
            firstChange,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.wrapper {
    width: 100%;
    align-items: center;
    line-height: 1.5;
    .title {
        line-height: 1;
        .icon {
            color: var(--minorColor);
            vertical-align: -3px;
        }
    }
    .pendingRang {
        color: var(--minorColor);
        font-size: rem(20px);
    }
}
.stepper {
    background: var(--assistColor);
    border-radius: 4px;
    &.warn {
        color: var(--warn);
    }
    :deep(.input) {
        font-size: 16px;
        font-weight: bold;
        height: 40px;
    }
}
</style>
