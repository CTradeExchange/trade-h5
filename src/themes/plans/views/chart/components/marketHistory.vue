<template>
    <div class='deal'>
        <van-empty v-if='dealList.length === 0' :description="$t('common.noData')" image='/images/empty.png' />
        <template v-else>
            <div class='list-wrap'>
                <div class='col time-col'>
                    {{ $t('trade.dealTime') }}
                </div>
                <div class='col price-col'>
                    {{ $t('trade.priceLabel') }}({{ product.profitCurrency }})
                </div>
                <template v-if='product.tradeType == 2'>
                    <div v-if='isQuantity' class='col volume-col'>
                        {{ $t('trade.volumes') }}({{ $t('trade.volumeUnit') }})
                    </div>
                    <div v-else class='col volume-col'>
                        {{ $t('trade.totalAmount') }}{{ assetsInfo?.currency ? `(${assetsInfo.currency})` : '(USDT)' }}
                    </div>
                </template>
                <div v-else class='col volume-col'>
                    {{ $t('trade.volumes') }}({{ product.baseCurrency }})
                </div>
            </div>
            <el-scrollbar class='quickTransaction-scroll'>
                <div class='deal-list'>
                    <div v-for='item in dealList' :key='item.symbolId' class='deal-item'>
                        <span>{{ formatTime(item.dealTime) }}</span>

                        <span :class="[Number(item.trade_direction) === 1 ? 'riseColor' : 'fallColor']">
                            {{ item.price }}
                        </span>
                        <span>{{ formatVolume(item.volume, item.price) }}</span>
                    </div>
                </div>
            </el-scrollbar>
        </template>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { formatAmount } from '@/utils/calculation'
import useFormatVolume from '@/hooks/trade/useFormatVolume'
import { useAssets } from '@/hooks/assets'

export default {
    name: 'MarketHistory',
    props: ['symbolId'],
    setup (props) {
        const store = useStore()
        const product = computed(() => store.getters.productActived)
        const { formatVolume, isQuantity } = useFormatVolume()
        const assetsInfo = useAssets()

        // 获取成交数据
        const dealList = computed(() => store.state._quote.dealList.filter((item) => Number(item.symbolId) === Number(props.symbolId)))

        // 格式化时间
        const formatTime = (val) => {
            return window.dayjs(Number(val)).format('HH:mm:ss')
        }

        return {
            dealList,
            formatAmount,
            formatTime,
            product,
            formatVolume,
            isQuantity,
            assetsInfo,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.deal {
    display: flex;
    flex-direction: column;
    height: 100%;
}
.title {
    color: var(--color);
    margin-bottom: 12px;
    font-weight: bold;
    padding: 12px 12px 0 12px;
}
.list-wrap {
    font-size: 12px;
    display: flex;
    padding: 0 12px;
    margin-bottom: 10px;
    .col {
        position: relative;
        overflow: hidden;
        color: var(--minorColor);
        line-height: rem(50px);
        white-space: nowrap;
        text-align: left;
        text-overflow: ellipsis;
        &:last-child {
            margin-right: 0;
        }
        &.time-col {
            flex: 1;
        }
        .vals {
            position: absolute;
            top: rem(50px);
            z-index: 0;
            min-height: 100%;
            color: var(--normalColor);
            .val {
                display: block;
                margin: rem(15px) 0;
            }
        }
        .forWide {
            height: 0;
            margin: 0 rem(2px);
            overflow: hidden;
            color: #fff;
            opacity: 0;
        }
    }
    .price-col {
        flex: 1;
        text-align: center;
    }
    .volume-col {
        flex: 1;
        align-items: flex-end;
        margin-left: rem(6px);
        text-align: right;
    }
}
.deal-list {
    flex: 1;
    overflow: auto;
    padding: 0 12px;
    @media screen and (max-width: 1560px) {
        font-size: 12px;
    }
    .deal-item {
        display: flex;
        height: 27px;
        color: var(--normalColor);
        font-size: 12px;
        > span {
            display: inline-block;
            flex: 1;
            &:nth-child(2) {
                text-align: center;
            }
            &:last-child {
                text-align: right;
            }
        }
    }
}
</style>
