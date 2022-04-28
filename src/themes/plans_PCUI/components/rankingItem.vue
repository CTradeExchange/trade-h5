<template>
    <div class='rankingItem'>
        <div class='titleBar'>
            <h3 class='title'>
                {{ title }}
            </h3>

            <el-select
                v-model='currencyVal'
                class='currencySelect'
                placeholder='Select'
                size='small'
            >
                <el-option
                    v-for='item in currencyList'
                    :key='item.currency'
                    :label="item.currency + $t('trade.markets')"
                    :value='item.currency'
                />
            </el-select>
        </div>

        <ul class='rankingList' :class='{ showIndex: indexColumn }'>
            <li class='item labelBar'>
                <slot name='header'>
                    <span v-if='indexColumn' class='label'></span>
                    <span class='label'>
                        {{ $t('trade.name') }}
                    </span>
                    <span class='label'>
                        {{ $t('trade.priceLabel') }}
                    </span>
                    <span class='label'>
                        {{ $t('ranking.24hUpdown') }}
                    </span>
                </slot>
            </li>
            <li v-for='(item, i) in list' :key='item.symbolKey' class='item productItem' @click='clickHandler(item)'>
                <slot :i='i' :item='item'>
                    <span v-if='indexColumn' class='label'>
                        {{ i + 1 }}
                    </span>
                    <span class='label'>
                        <CurrencyIcon
                            v-if='item.isCryptocurrency'
                            class='symbolCurrencyIcon'
                            :currency='item.baseCurrency'
                        />
                        <span class='symbolCurrency'>
                            {{
                                item.isCryptocurrency
                                    ? item.baseCurrency
                                    : item.symbolName
                            }}
                        </span>
                    </span>
                    <span class='label' :class='[item.last_color]'>
                        {{ item.rolling_last_price }}
                    </span>
                    <span class='label' :class='[item.rolling_upDownColor]'>
                        {{ item.rolling_upDownWidth }}
                    </span>
                </slot>
            </li>
        </ul>
    </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import CurrencyIcon from '@/components/currencyIcon'
import { useRouter } from 'vue-router'
export default {
    components: {
        CurrencyIcon,
    },
    props: {
        title: String,
        currencyList: Array,
        currency: String,
        type: String,
        labelIndex: [String, Number],
        indexColumn: {
            type: Boolean,
            default: false
        },
        max: {
            type: Number,
            default: 3
        },
    },
    emits: ['update:currency'],
    setup (props, { emit }) {
        const router = useRouter()

        const currencyVal = computed({
            get: () => props.currency,
            set: (val) => emit('update:currency', val),
        })

        // 重置币种
        const resetCurrency = () => {
            emit('update:currency', props.currencyList[0].currency)
        }
        // 设置默认币种
        watch(
            () => props.currencyList,
            (newval, oldval) => {
                if (newval?.length > 0 && oldval?.length === 0) resetCurrency()
            },
            {
                immediate: true
            }
        )

        // 切换标签tab时，重置币种
        watch(
            () => props.labelIndex,
            () => {
                resetCurrency()
            },
            {
                immediate: true
            }
        )

        // 产品排行列表
        const list = computed(() => {
            if (props.type === '' || props.currency === '') return []
            const curCurrencyProdocutList = props.currencyList.find(el => el.currency === props.currency)
            if (!curCurrencyProdocutList) return []
            const proList = curCurrencyProdocutList.list
                .filter(el => !isNaN(el.rolling_last_price))
                .slice()
            // increaseRanking 涨幅榜  declineRanking 跌幅榜 amountRanking 成交额榜
            if (props.type === 'increaseRanking') {
                proList.sort((a, b) => {
                    const firtstValue = parseFloat(a.rolling_upDownWidth) || -Infinity
                    const secondValue = parseFloat(b.rolling_upDownWidth) || -Infinity
                    return secondValue - firtstValue
                })
            } else if (props.type === 'declineRanking') {
                proList.sort((a, b) => {
                    const firtstValue = parseFloat(a.rolling_upDownWidth) || Infinity
                    const secondValue = parseFloat(b.rolling_upDownWidth) || Infinity
                    return firtstValue - secondValue
                })
            } else if (props.type === 'amountRanking') {
                proList.sort((a, b) => {
                    const firtstValue = isNaN(a.rolling_amount) ? -Infinity : a.rolling_amount
                    const secondValue = isNaN(b.rolling_amount) ? -Infinity : b.rolling_amount
                    return secondValue - firtstValue
                })
            } else if (props.type === 'tradingVolume') {
                proList.sort((a, b) => {
                    const firtstValue = isNaN(a.rolling_transactions_number) ? -Infinity : a.rolling_transactions_number
                    const secondValue = isNaN(b.rolling_transactions_number) ? -Infinity : b.rolling_transactions_number
                    return firtstValue - secondValue
                })
            }
            return proList.slice(0, props.max)
        })

        // 跳转到产品交易页面
        const clickHandler = (item) => {
            router.push(`/order?symbolId=${item.symbolId}&tradeType=${item.tradeType}`)
        }
        return {
            currencyVal,
            clickHandler,
            list,
        }
    }
}
</script>

<style lang="scss" scoped>
.rankingItem {
    position: relative;
    padding-bottom: 20px;
    .titleBar {
        display: flex;
        justify-content: space-between;
        line-height: 40px;
        .title {
            font-size: 16px;
            font-weight: normal;
        }
    }
    .categorySelect {
        position: absolute;
        right: 20px;
        top: 0;
    }
    .currencySelect {
        width: 150px;
        :deep(.el-input__inner) {
            background: none;
            border: 1px solid var(--lineColor);
        }
    }
}
.rankingList {
    margin-top: 20px;
    .labelBar {
        height: 32px;
        line-height: 32px;
        color: var(--minorColor);
    }
    .item {
        display: grid;
        grid-template-columns: 3fr 2fr 2fr;
        grid-column-gap: 15px;
        height: 24px;
        line-height: 24px;
        padding: 5px 6px;
        box-sizing: content-box;
        &.productItem{
            cursor: pointer;
            &:hover{
                background: var(--assistColor);
                border-radius: 5px;
            }
        }

        .label{
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .label:last-child {
            text-align: right;
        }
    }
    .symbolCurrencyIcon {
        margin-right: 0.2em;
    }
    .symbolCurrency {
        display: inline-block;
        line-height: 16px;
        vertical-align: middle;
        font-size: 14px;
    }
}
.showIndex {
    .item {
        grid-template-columns: 20px 3fr 2fr 2fr !important;
    }
}
</style>
