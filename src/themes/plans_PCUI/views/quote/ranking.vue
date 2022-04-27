<template>
    <div class='ranking'>
        <h2 class='title'>
            排行榜
        </h2>
        <a class='rightMore' href='javascript:;' @click="$router.push('/ranking')">
            <van-icon name='arrow' />
        </a>

        <!-- <el-tabs
            v-model='activeTab'
            class='labelTabs'
            type='card'
        >
            <el-tab-pane v-for='(item, index) in labelList' :key='index' :label='item.name' />
        </el-tabs> -->
        <div class='rankContent'>
            <div class='item'>
                <RankingItem
                    v-model:currency='increaseCurrency'
                    :currency-list='profitCurrencyList'
                    :index-column='false'
                    :label-index='activeTab'
                    title='涨幅榜'
                    type='increaseRanking'
                />
            </div>
            <div class='item'>
                <RankingItem
                    v-model:currency='declineCurrency'
                    :currency-list='profitCurrencyList'
                    :index-column='false'
                    :label-index='activeTab'
                    title='跌幅榜'
                    type='declineRanking'
                />
            </div>
            <div class='item'>
                <RankingItem
                    v-model:currency='amountCurrency'
                    :currency-list='profitCurrencyList'
                    :index-column='false'
                    :label-index='activeTab'
                    title='成交额榜'
                    type='amountRanking'
                >
                    <template #header>
                        <span class='label'>
                            名称
                        </span>
                        <span class='label'>
                            价格
                        </span>
                        <span class='label lastLabel'>
                            24成交额
                        </span>
                    </template>
                    <template #default='{ item }'>
                        <span class='label'>
                            <CurrencyIcon v-if='item.isCryptocurrency' class='symbolCurrencyIcon' :currency='item.baseCurrency' />
                            <span class='symbolCurrency'>
                                {{ item.isCryptocurrency ? item.baseCurrency : item.symbolName }}
                            </span>
                        </span>
                        <span class='label' :class='[item.last_color]'>
                            {{ item.rolling_last_price }}
                        </span>
                        <span class='label lastLabel' :class='[item.rolling_upDownColor]'>
                            {{ formatAmount(item.rolling_amount) }}
                        </span>
                    </template>
                </RankingItem>
            </div>
        </div>
    </div>
</template>

<script>
import RankingItem from '@planspc/components/rankingItem'
import productranking from '@planspc/hooks/productranking'
import { computed, ref, unref, watch, onUnmounted } from 'vue'
import { formatAmount } from '@/utils/calculation'
import CurrencyIcon from '@/components/currencyIcon'
import { QuoteSocket } from '@/plugins/socket/socket'

export default {
    components: {
        RankingItem,
        CurrencyIcon,
    },
    setup () {
        const { symbolLabelList, productListByLabel, symbolKeyByPlans } = productranking()
        const activeTab = ref('0')
        const increaseCurrency = ref('') // 涨幅榜币种
        const declineCurrency = ref('') // 跌幅榜币种
        const amountCurrency = ref('') // 成交额榜币种

        // 产品标签的显示排序：加密货币、外汇、商品、股票
        const labelList = computed(() => {
            const sortIndex = ['cryptocurrency', 'FX', 'commodites', 'stock']
            const sortResult = []
            sortIndex.forEach(el => {
                const labelItem = productListByLabel.value.find(item => item.labelCode === el)
                const labelData = symbolLabelList.value.find(item => item.code === el)
                if (labelItem && labelData && labelItem.list.length) {
                    labelItem.name = labelData.name
                    sortResult.push(labelItem)
                }
            })
            return sortResult
        })

        // 当前标签下的盈利货币下拉框列表
        const profitCurrencyList = computed(() => {
            const item = labelList.value[activeTab.value]?.list || []
            return item
        })

        // 订阅产品报价
        let unSubscribe = () => {}
        watch(
            symbolKeyByPlans,
            () => {
                if (unref(symbolKeyByPlans).length === 0) return false
                unSubscribe = QuoteSocket.add_subscribe24H({ moduleId: 'ranking', symbolKeys: symbolKeyByPlans.value })
            },
            {
                immediate: true,
                deep: true
            }
        )

        onUnmounted(() => {
            unSubscribe()
        })

        return {
            labelList,
            formatAmount,
            activeTab,
            profitCurrencyList,
            increaseCurrency,
            declineCurrency,
            amountCurrency,
            productListByLabel,
        }
    }
}
</script>

<style lang="scss" scoped>
.ranking{
    position: relative;
    margin: 60px 0;
    padding: 10px 20px 0;
    background: var(--contentColor);
    border-radius: 5px;
    font-size: 12px;
    .title{
        height: 56px;
        line-height: 56px;
        font-size: 24px;
    }
    .rightMore{
        position: absolute;
        right: 20px;
        top: 25px;
        font-size: 24px;
        color: var(--color);
    }
    .labelTabs{
        margin-top: 10px;
    }
    .rankContent{
        margin-top: 10px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-column-gap: 30px;
    }
    .lastLabel{
        text-align: right;
    }
    .symbolCurrencyIcon{
        margin-right: .2em;
    }
    .symbolCurrency{
        display: inline-block;
        line-height: 16px;
        vertical-align: middle;
        font-size: 14px;
    }
}
</style>
