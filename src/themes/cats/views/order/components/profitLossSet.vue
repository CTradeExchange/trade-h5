<template>
    <div class='profitLossSetBar'>
        <p v-if='stopLossWarn' class='floatTip'>
            止损价格不在范围{{ stopLossRange }}
        </p>
        <p v-else-if='stopProfitWarn' class='floatTip'>
            止盈价格不在范围{{ profitRange }}
        </p>
        <van-cell center class='cellWrapper' :title="$t('trade.tackStopSetup')">
            <template #right-icon>
                <van-switch
                    v-model='enabled'
                    :active-color='$style.success'
                    size='24'
                    @change='switchCellChange'
                />
            </template>
        </van-cell>
        <div v-if='enabled' class='van-hairline--top'>
            <ProfitLossBar
                ref='stopLossRef'
                v-model='stopLossPrice'
                :max='stopLossRange[1]'
                :min='stopLossRange[0]'
                :product='product'
                @change="$emit('update:stopLoss',stopLossPrice)"
            >
                <template #title>
                    <p>{{ $t('trade.stopLossPrice') }}</p>
                    <p class='priceRange'>
                        &le; {{ stopLossRange[1] }}
                    </p>
                </template>
            </ProfitLossBar>
            <ProfitLossBar
                ref='stopProfitRef'
                v-model='stopProfitPrice'
                :max='profitRange[1]'
                :min='profitRange[0]'
                :product='product'
                @change="$emit('update:stopProfit',stopProfitPrice)"
            >
                <template #title>
                    <p>{{ $t('trade.stopProfitPrice') }}</p>
                    <p class='priceRange'>
                        &ge; {{ profitRange[0] }}
                    </p>
                </template>
            </ProfitLossBar>
        </div>
    </div>
</template>

<script>
import { computed, reactive, ref, toRefs, watchEffect } from 'vue'
import ProfitLossBar from '@c/modules/profitLossBar/profitLossBar'
import { useStore } from 'vuex'
export default {
    components: {
        ProfitLossBar,
    },
    props: ['product', 'stopLoss', 'stopProfit', 'direction'],
    emits: ['update:stopLoss', 'update:stopProfit'],
    setup (props, { emit }) {
        const store = useStore()
        const stopLossRef = ref(null)
        const stopProfitRef = ref(null)
        const state = reactive({
            enabled: false,
            stopLossPrice: '',
            stopProfitPrice: '',
        })
        const profitLossRang = computed(() => store.getters['_trade/marketProfitLossRang'])
        const stopLossRange = computed(() => props.direction === 'buy' ? profitLossRang.value.buyStopLossRange : profitLossRang.value.sellStopLossRange)
        const profitRange = computed(() => props.direction === 'buy' ? profitLossRang.value.buyProfitRange : profitLossRang.value.sellProfitRange)
        const stopLossWarn = computed(() => stopLossRef.value?.warn)
        const stopProfitWarn = computed(() => stopProfitRef.value?.warn)

        watchEffect(() => {
            if (props.stopLoss !== state.stopLossPrice) {
                state.stopLossPrice = props.stopLoss
            }
            if (props.stopProfit !== state.stopProfitPrice) {
                state.stopProfitPrice = props.stopProfit
            }
        })
        // 开启关闭止盈止损
        const switchCellChange = (e) => {
            if (!e) {
                emit('update:stopLoss', '')
                emit('update:stopProfit', '')
            }
        }
        return {
            ...toRefs(state),
            stopLossWarn,
            stopProfitWarn,
            stopLossRef,
            stopProfitRef,
            profitLossRang,
            stopLossRange,
            profitRange,
            switchCellChange,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.cellWrapper {
    padding: 10px 0;
    &::after {
        display: none;
    }
}
.priceRange {
    color: var(--mutedColor);
    font-size: rem(24px);
}
.floatTip {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: rem(50px);
    color: var(--red);
    line-height: rem(50px);
    text-align: center;
    background: #FFF0E2;
}
</style>
