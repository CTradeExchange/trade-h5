<template>
    <div class='closePositionSuccess'>
        <a class='back' href='javascript:;' @click='$router.back()'>
            <i class='icon_icon_close_small'></i>
        </a>
        <span class='successIcon'>
            <SuccessAnimation :disabled-succ-animtion='$store.state.disabledSuccAnimtion' />
        </span>
        <p class='title successColor' :class="{ 'animate':!$store.state.disabledSuccAnimtion }">
            {{ $t('trade.closedSuccess') }}
        </p>

        <div class='orderInfo'>
            <div class='product'>
                <p class='productTitle'>
                    {{ orderInfo.symbolName }}
                </p>
                <p class='productCode'>
                    {{ orderInfo.symbolCode }}
                </p>
            </div>
            <template v-if='orderInfo '>
                <van-cell class='dataBar' :title="$t('trade.closedNum')">
                    <template #default>
                        <span
                            :class="[orderInfo.direction===1?'riseColor':'fallColor']"
                        >
                            {{ orderInfo.direction===1?$t('trade.buy'):$t('trade.sell') }}
                        </span>
                        {{ orderInfo.requestNum+$t('trade.volumeUnit') }}
                    </template>
                </van-cell>
                <van-cell class='dataBar' :title="$t('trade.positionPrice')" :value='orderInfo.openPrice' />
                <van-cell class='dataBar' :title="$t('trade.closedPrice')" :value='orderInfo.executePrice' />
                <van-cell class='dataBar' :title="$t('trade.closeProfit')" :value='orderInfo.profit' />
                <van-cell class='dataBar' :title="$t('trade.swap')" :value='orderInfo.interest' />
                <van-cell v-if='orderInfo.fee' class='dataBar' :title="$t('trade.fee')" :value='orderInfo.fee' />
            </template>

            <van-row class='btnGroup' gutter='10'>
                <van-col span='12'>
                    <button
                        class='primary toDetail'
                        @click='toOpen'
                    >
                        {{ $t('trade.backOpenPosition') }}
                    </button>
                </van-col>
                <van-col span='12'>
                    <button
                        class='primaryBg goonOrder'
                        @click='$router.back()'
                    >
                        {{ $t('confirm') }}
                    </button>
                </van-col>
            </van-row>
        </div>
    </div>
</template>

<script>
import SuccessAnimation from '@c/components/successAnimation'
import { computed, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { shiftedBy } from '@/utils/calculation'
export default {
    components: {
        SuccessAnimation,
    },
    setup () {
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        const product = computed(() => store.getters.productActived)
        const { orderId } = route.query
        const state = reactive({
            orderInfo: JSON.parse(sessionStorage.getItem('order_' + orderId))
        })

        // 查看详情
        const toOpen = () => {
            const symbolId = state.orderInfo.symbolId
            const direction = state.orderInfo.direction === 1 ? 'sell' : 'buy'
            router.push({ name: 'Order', query: { symbolId, direction } })
        }
        return {
            ...toRefs(state),
            product,
            orderId,
            shiftedBy,
            toOpen,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
@import '~@/sass/animations.scss';
.closePositionSuccess {
    position: relative;
    height: 100%;
    overflow: auto;
    background: var(--btnColor);
    .back {
        position: absolute;
        top: rem(40px);
        right: rem(40px);
        color: inherit;
        font-size: rem(40px);
        font-style: normal;
        &:active {
            box-shadow: 0 0 999px rgba(0, 0, 0, 0.05) inset;
            opacity: 0.7;
        }
    }
    .successIcon {
        position: relative;
        display: block;
        width: rem(90px);
        height: rem(90px);
        margin: rem(120px) auto 0;
        color: #FFF;
        font-size: rem(70px);
        line-height: rem(110px);
        text-align: center;
        border-radius: 100%;
    }
    .title {
        padding-top: rem(20px);
        padding-bottom: rem(20px);
        font-size: rem(34px);
        line-height: 1;
        text-align: center;
        &.animate {
            opacity: 0;
            animation: fadeInUp 0.3s linear 0.9s forwards;
        }
    }
    .adTopBox {
        width: rem(580px);
        margin: rem(50px) auto 0;
    }
    .fullScreenLink {
        width: rem(580px);
        margin: rem(30px) auto rem(90px);
        text-align: center;
    }
    .adBottomBox {
        width: rem(580px);
        margin: 0 auto rem(90px);
    }
    .orderInfo {
        box-sizing: border-box;
        width: rem(580px);
        margin: 0 auto;
        margin-top: rem(40px);
        padding: rem(66px) rem(40px);
        line-height: 1.6;
        background: #FFF;
        border-radius: rem(10px);
        box-shadow: 0 0 18px 0 rgba(243, 243, 243, 1);
    }
    .product {
        padding-bottom: rem(40px);
        .productTitle {
            @include single-line-clamp();
            font-size: rem(34px);
            text-align: center;
        }
        .productCode {
            color: var(--mutedColor);
            font-size: rem(20px);
            text-align: center;
        }
    }
    .dataBar {
        :deep(.van-cell__title) {
            color: var(--mutedColor);
        }
        :deep(.van-cell__value) {
            color: #333;
        }
    }
    .dataBar {
        padding: 6px 0;
        white-space: nowrap;
        &::after {
            opacity: 0;
        }
    }
    .goonOrder,
    .toDetail {
        display: block;
        width: 100%;
        height: rem(80px);
        color: #FFF;
        font-size: rem(26px);
        line-height: 1;
        text-align: center;
        border-radius: rem(6px);
        cursor: pointer;
    }
    .toDetail {
        background-color: #F4F7FC;
    }
    .btnGroup {
        margin-top: rem(45px);
    }
    .hasAdded {
        margin-top: rem(40px);
        color: var(--mutedColor);
        text-align: center;
    }
}
</style>
