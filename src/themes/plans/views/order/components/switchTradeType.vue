<template>
    <div class='switchTradeType van-hairline--bottom'>
        <div v-if='product' class='productInfo'>
            <span class='h-full flex items-center' @click="$emit('switchProduct')">
                <svg fill='none' height='17' viewBox='0 0 18 17' width='18' xmlns='http://www.w3.org/2000/svg'>
                    <path
                        d='M0 0.5C0 0.223858 0.223858 0 0.5 0H17.5C17.7761 0 18 0.223858 18 0.5V1.5C18 1.77614 17.7761 2 17.5 2H0.5C0.223858 2 0 1.77614 0 1.5V0.5ZM0 15.5C0 15.2239 0.223858 15 0.5 15H17.5C17.7761 15 18 15.2239 18 15.5V16.5C18 16.7761 17.7761 17 17.5 17H0.5C0.223858 17 0 16.7761 0 16.5V15.5ZM0 10.5C0 10.2239 0.223858 10 0.5 10H9.5C9.77614 10 10 10.2239 10 10.5V11.5C10 11.7761 9.77614 12 9.5 12H0.5C0.223858 12 0 11.7761 0 11.5V10.5ZM0 5.5C0 5.22386 0.223858 5 0.5 5H9.5C9.77614 5 10 5.22386 10 5.5V6.5C10 6.77614 9.77614 7 9.5 7H0.5C0.223858 7 0 6.77614 0 6.5V5.5Z'
                        fill='black'
                    />
                    <path
                        d='M16.1585 10.5488L17.6399 9.25258C18.0952 8.85417 18.0952 8.14584 17.6399 7.74742L16.1585 6.45119C15.5119 5.88543 14.5 6.34461 14.5 7.20377V9.79623C14.5 10.6554 15.5119 11.1146 16.1585 10.5488Z'
                        fill='black'
                    />
                </svg>
            </span>
            <!-- <span class='productName' @click="$emit('switchProduct')">
                {{ product.symbolName }}
            </span>
            <ETF v-if='product.etf' />
            <div :class="['upDownWidth']">
                <span
                    :class="[
                        product.rolling_upDownColor,
                        product?.rolling_upDownWidth ? (product?.rolling_upDownWidth?.includes('+') ? 'rise' : 'fall') : '',
                    ]"
                >
                    {{ product?.rolling_upDownWidth ? product?.rolling_upDownWidth : '--' }}
                </span>
            </div> -->

            <div class='flex '>
                <div class='mr-3 flex items-center' @click='setShowChart'>
                    <img alt='' class='line-k' height='18' src='@/themes/plans/images/trend.png' width='18' />
                    <img alt='' :class="['trend-icon-arrow', showChart ? 'rotate--180' : 'rotate-0']" src='@/themeCommon/image/right_up.png' width='18' />
                </div>
                <div
                    class='flex items-center'
                    @click="$router.push({ name: 'Product', query: { symbolId: product.symbolId, tradeType: product.tradeType } })"
                >
                    <img alt='' class='line-k ' height='20' src='/images/chart.svg' width='20' />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ETF from '@plans/components/etfIcon.vue'
import { reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'

export default {
    components: {
        ETF,
    },
    props: ['product'],
    emits: ['switchProduct', 'showChartHandle'],
    setup (props, { emit }) {
        const route = useRoute()

        const { miniChart } = route.query

        const state = reactive({
            showChart: !!miniChart,
        })
        const setShowChart = () => {
            const result = !state.showChart
            state.showChart = result
            emit('showChartHandle', result)
        }
        return {
            ...toRefs(state),
            setShowChart,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.switchTradeType {
    position: relative;
    background: var(--contentColor);
}
.switchWrapper {
    display: flex;
    height: rem(90px);
    padding: 0 rem(30px);
    color: var(--minorColor);
    font-size: rem(28px);
    line-height: rem(90px);
    border-bottom: 1px solid var(--assistColor);
    .item {
        margin-right: rem(35px);
        vertical-align: baseline;
    }
    .active {
        color: var(--color);
        font-weight: bold;
        font-size: rem(38px);
    }
}
.productInfo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: rem(104px);
    padding: 0 16px;
    font-size: rem(34px);
    line-height: rem(104px);
    .icon_chouti1 {
        padding-right: rem(20px);
        font-size: rem(26px);
    }
    .productName {
        padding-right: rem(20px);
        font-weight: bold;
    }
    .upDownWidth {
        flex: 1;
        display: flex;
        align-items: center;

        & > span {
            height: 30px;
            border-radius: 4px;
            padding: 0 6px;
            line-height: 30px;
            font-size: 14px;
            &.rise {
                background: rgba(95, 186, 110, 0.1);
            }
            &.fall {
                background: #fef7f6;
            }
        }
    }

    .sortIconSpan {
        margin-right: 10px;
        padding-top: 2px;
    }
    .sortIcon {
        transform: rotate(90deg);
        font-size: rem(40px);
    }
}
</style>
