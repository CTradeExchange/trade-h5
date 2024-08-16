<template>
    <div class='deal-wrap'>
        <van-empty v-if='dealList.length === 0' :description='$t("common.noData")' image='/images/empty.png' />
        <div v-else class='list-wrap'>
            <div class='col time-col'>
                {{ $t('trade.dealTime') }}
            </div>

            <div class='col'>
                {{ $t('trade.direction') }}
            </div>

            <div class='col price-col'>
                {{ $t('trade.priceLabel') }}{{ product?.profitCurrency ? `(${ product.profitCurrency})` : '' }}
            </div>

            <template v-if='product.tradeType == 2'>
                <div v-if='isQuantity' class='col volume-col'>
                    {{ $t("trade.volumes") }}({{ $t("trade.volumeUnit") }})
                </div>
                <div v-else class='col volume-col'>
                    {{ $t("trade.totalAmount")
                    }}{{ assetsInfo?.currency ? `(${assetsInfo.currency})` : "(USDT)" }}
                </div>
            </template>
            <div v-else class='col volume-col'>
                {{ $t("trade.volumes") }}({{ product.baseCurrency }})
            </div>
        </div>
        <div class='deal-content'>
            <div v-for='item in dealList' :key='item.symbolId' class='deal-item'>
                <span>{{ formatTime(item.dealTime) }}</span>
                <span :class="[Number(item.trade_direction)===1?'riseColor':'fallColor']">
                    {{ Number(item.trade_direction) === 1 ? $t('trade.buy') : $t('trade.sell') }}
                </span>
                <span>
                    {{ item.price }}
                </span>
                <span>{{ formatVolume(item.volume, item.price) }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { formatAmount } from '@/utils/calculation'
import useFormatVolume from '@/hooks/trade/useFormatVolume'
import { useAssets } from '@/hooks/assets'

export default {
    props: ['symbolId'],
    setup (props) {
        const store = useStore()
        const { formatVolume, isQuantity } = useFormatVolume()
        const product = computed(() => store.getters.productActived)
        // 获取成交数据
        const dealList = computed(() => store.state._quote.dealList.filter(item => Number(item.symbolId) === Number(props.symbolId)))
        const assetsInfo = useAssets()

        // 格式化时间
        const formatTime = (val) => {
            return window.dayjs(Number(val)).format('HH:mm:ss')
        }

        return {
            dealList,
            formatAmount,
            formatTime,
            formatVolume,
            isQuantity,
            assetsInfo,
            product
        }
    }
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.deal-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    color: var(--mutedColor);
    font-size: rem(22px);
    line-height: rem(24px);
    .list-wrap {
        display: flex;
        //flex: rem(300px); // 仅用于不撑开外层
        flex-direction: row;
        flex-wrap: nowrap;
        width: 95%;
        margin: 0 auto;
        overflow: hidden;
        .col {
            position: relative;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            color: var(--minorColor);
            line-height: rem(50px);
            white-space: nowrap;
            text-align: left;
            &:last-child {
                margin-right: 0;
            }
            &.time-col {
                width: 25%;
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
                color: #FFF;
                opacity: 0;
            }
        }
        .price-col {
            flex: 1;
            align-items: flex-end;
            text-align: right;
        }
        .volume-col {
            flex: 1;
            align-items: flex-end;
            margin-left: rem(6px);
            text-align: right;
        }
    }
    .deal-content {
        // min-height: rem(250px);
        padding: 0 rem(20px);
        overflow: 100%;
        .deal-item {
            line-height: rem(50px);
            >span {
                display: inline-block;
                &:first-child {
                    width: 25%;
                }
                &:nth-child(2) {
                    width: 8%;
                }
                &:nth-child(3) {
                    width: 33%;
                    text-align: right;
                }
                &:last-child {
                    width: 34%;
                    text-align: right;
                }
            }
        }
    }
}
</style>
