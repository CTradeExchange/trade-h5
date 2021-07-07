<template>
    <div class='product-item' @click.stop='toPositionDetail(data)'>
        <!-- {{ data.direction }} -->
        <div class='item'>
            <div class='cell'>
                <div class='th'>
                    <div class='name'>
                        {{ data.symbolName }}
                    </div>
                    <div class='lot'>
                        {{ data.symbolCode }}
                    </div><p>
                        <span :class="Number(data.direction) === 1 ? 'riseColor' : 'fallColor'">
                            {{ Number(data.direction) === 1 ? $t('trade.buy') :$t('trade.sell') }}&nbsp;
                        </span>{{ positionVolume }} {{ $t('trade.volumeUnit') }}
                    </p>
                </div><div>
                    <span class='ft amount' :class="parseFloat(data.profitLoss) > 0 ? 'riseColor': 'fallColor'">
                        {{ data.profitLoss }}
                    </span><span class='currency'>
                        {{ customerInfo.currency }}
                    </span>
                </div>
            </div>
            <div class='cell'>
                <div class='price'>
                    <div>
                        <div class='price_item'>
                            <span class='title'>
                                {{ $t('trade.positionPrice') }}
                            </span><span>
                                {{ data.openPrice }}
                            </span>
                        </div><div class='price_item'>
                            <span class='title'>
                                {{ $t('trade.currentPrice') }}
                            </span><span :class='[Number(data.direction) === 1 ? product.sell_color : product.buy_color]'>
                                {{ Number(data.direction) === 1 ? product.sell_price : product.buy_price }}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div class='price_item'>
                            <span class='title'>
                                {{ $t('trade.stopProfitPrice') }}
                            </span><span class=''>
                                {{ parseFloat(data.takeProfitDecimal) ? data.takeProfitDecimal : $t('trade.nosSet') }}
                            </span>
                        </div><div class='price_item'>
                            <span class='title'>
                                {{ $t('trade.stopLossPrice') }}
                            </span><span class=''>
                                {{ parseFloat(data.stopLossDecimal) ? data.stopLossDecimal : $t('trade.nosSet') }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class='ft'>
                    <div class='bd' @click.stop='toProduct(data.symbolId)'>
                        <i class='icon_icon_chart hidden'></i>
                    </div>
                    <van-button
                        color='#477fd3'
                        hairline
                        size='mini'
                        type='default'
                        @click.stop='$emit("showClose",data)'
                    >
                        {{ $t('trade.closed') }}
                    </van-button>
                </div>
            </div>
        </div>
    </div>

    <!-- <DialogClosePosition v-if='cpVis' :data='data' :show='cpVis' @update:show='updateShow' /> -->
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { minus } from '@/utils/calculation'
// import DialogClosePosition from '@c/components/dialogClosePosition'
export default {
    props: ['data'],
    emits: ['showClose'],
    setup ({ data }) {
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            show: false,
            loading: false,
            cur: {},
            cpVis: false
        })
        const customerInfo = computed(() => store.state._user.customerInfo)
        const positionList = computed(() => store.state._trade.positionList)
        const product = computed(() => store.state._quote.productMap[data.symbolId])
        const positionVolume = computed(() => minus(data.openVolume, data.closeVolume))

        const toPositionDetail = (item) => {
            store.commit('_quote/Update_productActivedID', item.symbolId)
            router.push({ path: '/positionDetail', query: { symbolId: item.symbolId, positionId: item.positionId } })
        }
        const updateShow = (val) => {
            state.cpVis = val
        }

        const toProduct = (symbolId) => {
            router.push({ path: '/product', query: { symbolId } })
        }

        return {
            ...toRefs(state),
            positionList,
            customerInfo,
            product,
            positionVolume,
            toPositionDetail,
            updateShow,
            toProduct
        }
    }
}
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.product-item {
    .item {
        position: relative;
        margin-bottom: rem(20px);
        padding: rem(20px) rem(30px) 0;
        overflow: hidden;
        background: var(--contentColor);
        border-radius: rem(10px);
        .cell {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            width: 100%;
            margin-bottom: rem(20px);
            color: #999;
            font-size: rem(20px);
            line-height: 1.45;
            .th {
                flex: 1;
            }
            &:last-child {
                align-items: flex-end;
            }
            .bd {
                position: relative;
                top: rem(4px);
                display: inline-block;
                margin-right: rem(20px);
                text-align: center;
            }
            .price {
                flex: 1;
                .price_item {
                    display: inline-block;
                    width: rem(220px);
                    span {
                        padding: 0 rem(4px);
                    }
                    .title {
                        margin-right: rem(4px);
                        padding: 0;
                    }
                }
            }
            .ft {
                text-align: right;
                vertical-align: middle;
                .van-button {
                    vertical-align: middle;
                    background: rgb(243, 248, 255);
                    border-color: rgb(243, 248, 255);
                }
            }
            .amount {
                padding-right: rem(6px);
                font-weight: 600;
                font-size: rem(34px);
            }
            .currency {
                position: relative;
                top: rem(6px);
            }
            .warn {
                color: #333;
                background-color: #FFA700;
            }
            .name {
                display: inline-block;
                max-width: rem(360px);
                color: var(--color);
                font-size: rem(28px);
                line-height: rem(38px);
                vertical-align: bottom;
            }
            .lot {
                display: inline-block;
                margin-left: 0.5em;
                vertical-align: bottom;
            }
            .time {
                color: #999;
                font-size: rem(20px);
            }
        }
        .icon_icon_chart {
            display: inline-block;
            width: rem(52px);
            height: rem(46px);
            font-size: rem(30px);
            font-style: normal;
            line-height: rem(46px);
            text-align: center;
            border-radius: rem(6px);
            &.hidden {
                color: var(--color);
                background-color: var(--primaryAssistColor);
            }
        }
        .van-button {
            width: rem(124px);
            height: rem(48px);
            color: var(--color) !important;
            font-size: rem(24px);
            line-height: rem(48px);
            background: var(--primaryAssistColor) !important;
            border-color: var(--primaryAssistColor) !important;
            border-radius: rem(6px);
        }
    }
}
</style>
