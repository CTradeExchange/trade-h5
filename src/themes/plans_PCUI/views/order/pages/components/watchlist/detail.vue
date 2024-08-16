<template>
    <div class='pane-detail'>
        <div class='head'>
            <product-icon
                :symbol-key='product.symbolKey'
            />
            <div class='symbol-code'>
                {{ product.symbolName || '--' }}
            </div>
        </div>
        <div class='detail'>
            <div class='price' :class='product?.cur_color'>
                <span class='price-title'>
                    {{ product?.cur_price ? parseFloat(product?.cur_price).toFixed(product.symbolDigits) : '--' }}
                </span>
                <p>
                    <span :class='product?.upDownColor'>
                        {{ product?.upDownAmount ? product?.upDownAmount : '--' }}
                    </span>&nbsp;
                    <span :class='product?.upDownColor'>
                        {{ product?.upDownWidth ? product?.upDownWidth : '--' }}
                    </span>
                </p>
            </div>
            <div class='list'>
                <div class='list-title'>
                    {{ $t('trade.keyStats') }}
                </div>
                <template v-if='product.isCryptocurrency'>
                    <van-cell
                        :title="$t('common.24hHigh')"
                        :value="product?.rolling_high_price || '--'"
                    />
                    <van-cell
                        :title="$t('common.24hLow')"
                        :value="product?.rolling_low_price || '--'"
                    />
                    <van-cell
                        :title="$t('common.24hNumber') + '('+ product.baseCurrency +')'"
                        :value="product?.rolling_transactions_number ? formatAmount(product.rolling_transactions_number) : '--'"
                    />
                    <!-- <van-cell
                        :title="$t('common.24hAmount') + '(' + product.profitCurrency + ')'"
                        :value="product?.rolling_amount ? formatAmount(product.rolling_amount) : '--'"
                    /> -->
                </template>
                <template v-else>
                    <van-cell
                        :title="$t('trade.todayOpen')"
                        :value="product?.open_price || '--'"
                    />
                    <van-cell
                        :title="$t('trade.yesterdayClosed')"
                        :value="product?.yesterday_close_price || '--'"
                    />
                    <van-cell
                        :title="$t('trade.high')"
                        :value="product?.high_price || '--'"
                    />
                    <van-cell
                        :title="$t('trade.low')"
                        :value="product?.low_price || '--'"
                    />
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import productIcon from '@/components/product-icon.vue'
import { formatAmount } from '@/utils/calculation'

export default {
    components: {
        productIcon
    },
    setup () {
        const store = useStore()
        const product = computed(() => store.getters.productActived)

        return {
            product,
            formatAmount
        }
    }
}
</script>

<style lang="scss" scoped>
.pane-detail {
    display: flex;
    flex-direction: column;
    padding: rem(30px);
    flex: 1;
    overflow: hidden;
    background: var(--contentColor);

    .head {
        display: flex;
        align-items: center;
        .img-group {
            margin-right: 4px;
        }
    }
    .detail {
        flex: 1;
        overflow: auto;
        padding: 0 rem(30px);
        margin: 0 rem(-30px);
    }
    .price {
        margin: 14px 0;
        .price-title {
            font-size: 22px;
            line-height: 28px;
            font-weight: bold;
        }
    }
    .list {
        .list-title {
            font-size: 14px;
            margin-bottom: 8px;
        }
        .van-cell {
            padding: rem(6px) 0;
            font-size: 12px;
            line-height: 18px;
            text-transform: uppercase;
            &::after {
                content: none;
            }
            :deep {
                .van-cell__value {
                    font-size: 14px;
                }
            }
        }
    }
}
</style>
