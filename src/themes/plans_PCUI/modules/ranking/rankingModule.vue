<template>
    <div class='rankingModule'>
        <el-tabs
            v-if='showLabelTab && labelList.length>1'
            v-model='activeTab'
            class='labelTabs'
            type='card'
        >
            <el-tab-pane v-for='(item, index) in labelList' :key='index' :label='item.name' />
        </el-tabs>

        <div v-if='profitCurrencyList.length>0' class='rankContent'>
            <div class='item'>
                <RankingItem
                    v-model:currency='increaseCurrency'
                    :currency-list='profitCurrencyList'
                    :index-column='indexColumn'
                    :label-index='activeTab'
                    :max='max'
                    :title='$t("ranking.increaseRanking")'
                    type='increaseRanking'
                />
            </div>
            <div class='item'>
                <RankingItem
                    v-model:currency='declineCurrency'
                    :currency-list='profitCurrencyList'
                    :index-column='indexColumn'
                    :label-index='activeTab'
                    :max='max'
                    :title='$t("ranking.declineRanking")'
                    type='declineRanking'
                />
            </div>
            <div v-if="'cryptocurrency'===activeLabelCode" class='item'>
                <RankingItem
                    v-model:currency='amountCurrency'
                    :currency-list='profitCurrencyList'
                    :index-column='indexColumn'
                    :label-index='activeTab'
                    :max='max'
                    :title='$t("ranking.amountRanking")'
                    type='amountRanking'
                >
                    <template #header>
                        <span v-if='indexColumn' class='label'></span>
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
                    <template #default='{ item,i }'>
                        <span v-if='indexColumn' class='label'>
                            {{ i + 1 }}
                        </span>
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
            <div v-if="'stock'===activeLabelCode" class='item'>
                <RankingItem
                    v-model:currency='amountCurrency'
                    :currency-list='profitCurrencyList'
                    :index-column='indexColumn'
                    :label-index='activeTab'
                    :max='max'
                    title='成交量榜'
                    type='tradingVolume'
                >
                    <template #header>
                        <span v-if='indexColumn' class='label'></span>
                        <span class='label'>
                            名称
                        </span>
                        <span class='label'>
                            价格
                        </span>
                        <span class='label lastLabel'>
                            24成交量
                        </span>
                    </template>
                    <template #default='{ item, i }'>
                        <span v-if='indexColumn' class='label'>
                            {{ i + 1 }}
                        </span>
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
                            {{ formatAmount(item.rolling_transactions_number) }}
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
import { computed, onUnmounted, ref, unref, watch } from 'vue'
import { formatAmount } from '@/utils/calculation'
import CurrencyIcon from '@/components/currencyIcon'
import { QuoteSocket } from '@/plugins/socket/socket'

export default {
    components: {
        RankingItem,
        CurrencyIcon,
    },
    props: {
        indexColumn: {
            type: Boolean,
            default: false
        },
        max: {
            type: Number,
            default: 3
        },
        showLabelTab: {
            type: Boolean,
            default: true
        },
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
        // 当前选择的标签
        const activeLabelCode = computed(() => {
            return labelList.value[activeTab.value]?.labelCode
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
                unSubscribe = QuoteSocket.add_subscribe24H({ moduleId: 'rankingModule', symbolKeys: symbolKeyByPlans.value })
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
            activeLabelCode,
            symbolKeyByPlans,
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
.rankingModule{
    position: relative;
    background: var(--contentColor);
    border-radius: 5px;
    font-size: 12px;
    .labelTabs{
        margin-top: 10px;
    }
    .rankContent{
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        .item{
            flex: 1;
            margin-right: 50px;
            &:last-child{
                margin-right: 0;
            }
        }
        .label{
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

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
