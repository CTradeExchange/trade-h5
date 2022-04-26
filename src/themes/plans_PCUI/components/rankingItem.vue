<template>
    <div class='rankingItem'>
        <div class='titleBar'>
            <h3 class='title'>
                {{ title }}
            </h3>

            <el-select v-model='currencyVal' class='currencySelect' placeholder='Select' size='small'>
                <el-option
                    v-for='item in currencyList'
                    :key='item.currency'
                    :label='item.currency + $t("trade.markets")'
                    :value='item.currency'
                />
            </el-select>
        </div>

        <ul class='rankingList' :class='{ showIndex:indexColumn }'>
            <li class='item labelBar'>
                <slot name='header'>
                    <span v-if='indexColumn' class='label'></span>
                    <span class='label'>
                        名称
                    </span>
                    <span class='label'>
                        价格
                    </span>
                    <span class='label'>
                        24涨跌
                    </span>
                </slot>
            </li>
            <li v-for='(item,i) in list' :key='item.symbolKey' class='item'>
                <slot :item='item'>
                    <span v-if='indexColumn' class='label'>
                        {{ i+1 }}
                    </span>
                    <span class='label'>
                        {{ item.symbolName }}
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
export default {
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
    },
    emits: ['update:currency'],
    setup (props, { emit }) {
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
                    const firtstValue = parseFloat(a.rolling_amount) || Infinity
                    const secondValue = parseFloat(b.rolling_amount) || Infinity
                    return firtstValue - secondValue
                })
            }
            return proList.slice(0, 3)
        })
        return {
            currencyVal,
            list,
        }
    }
}
</script>

<style lang="scss" scoped>
.rankingItem{
    position: relative;
    padding-bottom: 20px;
    .titleBar{
        display: flex;
        justify-content: space-between;
        line-height: 40px;
        .title{
            font-size: 12px;
            font-weight: normal;
        }
    }
    .categorySelect{
        position: absolute;
        right: 20px;
        top: 0;
    }
    .currencySelect{
        width: 150px;
    }
}
.rankingList{
    margin-top: 20px;
    .labelBar{
        height: 32px;
        line-height: 32px;
        color: var(--minorColor);
    }
    .item{
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        grid-column-gap: 15px;
        height: 24px;
        line-height: 24px;
        padding: 5px 6px;
        box-sizing: content-box;
        .label:last-child{
            text-align: right;
        }
    }
    .showIndex{
        .item{
            grid-template-columns: 20px 2fr 1fr 1fr;
        }
    }
}
</style>
