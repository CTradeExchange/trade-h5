<template>
    <div class='fund-list'>
        <el-table :cell-style="{ background:'none' }" :data='fundProductList'>
            <el-table-column :label="$t('fundInfo.fundName')" :min-width='minWidth' prop='fundName' />
            <el-table-column :label="$t('fundInfo.fundIcon')" :min-width='minWidth'>
                <template #default='scope'>
                    <currency-icon class='currency' :currency='scope.row.shareTokenCode' size='20px' />
                    <span>{{ scope.row.shareTokenCode }}</span>
                </template>
            </el-table-column>
            <!-- 基金申购赎回 -->
            <el-table-column align='center' :label="$t('funds.buyRedeem')">
                <el-table-column :label="$t('funds.trend')" :min-width='minWidth'>
                    <template #default='scope'>
                        <kline-svg
                            :data='klineData'
                            :height='30'
                            :width='80'
                        />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('fundInfo.realtimeJZ')" prop='netValue' />
                <el-table-column :label="$t('fundInfo.dayUpDown')" :min-width='minWidth' prop='marketPriceChangeQuote' />
                <el-table-column :label="$t('funds.applyStatus')" :min-width='minWidth'>
                    <template #default='scope'>
                        <span v-if='scope.row.canPurchase === 1'>
                            {{ $t('funds.canApply') }}
                        </span>
                        <span v-else>
                            {{ $t('funds.notApply') }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('funds.redeemStatus')" :min-width='minWidth'>
                    <template #default='scope'>
                        <span v-if='scope.row.canRedemption === 1'>
                            {{ $t('funds.canRedeem') }}
                        </span>
                        <span v-else>
                            {{ $t('funds.notRedeem') }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.operating')" :min-width='minWidth'>
                    <template #default='scope'>
                        <div class='handle'>
                            <span @click="goDeal(scope.row.fundId, 'apply')">
                                {{ $t('fundInfo.buy') }}
                            </span>
                            <span @click="goDeal(scope.row.fundId, 'redeem')">
                                {{ $t('fundInfo.sell') }}
                            </span>
                        </div>
                    </template>
                </el-table-column>
            </el-table-column>
            <!-- 现货买卖 -->
            <el-table-column align='center' :label="$t('funds.cashDeal')">
                <el-table-column :label="$t('funds.offerTrend')" :min-width='minWidth'>
                    <template #default='scope'>
                        <kline-svg
                            :data='klineData'
                            :height='30'
                            :width='80'
                        />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.newPrice')" :min-width='minWidth'>
                    <template #default='scope'>
                        <span>233.5546</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('fundInfo.dayUpDown')" :min-width='minWidth'>
                    <template #default='scope'>
                        <span>0.00</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.operating')" :min-width='minWidth'>
                    <template #default='scope'>
                        <div class='handle'>
                            <span @click="goDeal(scope.row.fundId, 'trade')">
                                {{ $t('funds.deal') }}
                            </span>
                        </div>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, inject } from 'vue'
import { useStore } from 'vuex'
import { useFund } from '../hooks.js'
import currencyIcon from '@/components/currencyIcon.vue'
import klineSvg from '@planspc/components/klineSvg.vue'

const store = useStore()
const selectFund = inject('selectFund')
// 产品列表数据
const productList = computed(() => store.state._quote.productList)
// 基金产品列表
const { fundProductList } = useFund()
// 当前订阅的产品symbolKey
const productKes = ref([])
// 当前基金列表产品
const currentProducts = computed(() => {
    const result = []
    fundProductList.value.map(fund => {
        productList.value.map(product => {
            if (Number(product.tradeType) === 5 && product.fundId === fund.fundId) {
                productKes.value.push(product.symbolKey)
                result.push(product)
            }
        })
    })
    return result
})

// 列表最小宽度
const minWidth = ref(100)
// 基金净值数据
const klineData = ref([])

// 随机生成基金净值数据
const randomData = () => {
    const result = []
    for (let i = 0; i < 30; i++) {
        const num = Math.floor(Math.random() * 100)
        result.push(num)
    }
    klineData.value = result
}

// 去交易
const goDeal = (fundId, active) => {
    selectFund(fundId, active)
}

onMounted(() => {
    randomData()
})
</script>

<style lang='scss' scoped>
@import "@/sass/mixin.scss";
.fund-list {
    margin-top: 16px;
    background: var(--contentColor);
    .currency {
        margin-right: 10px;
    }
    .handle {
        display: flex;
        span {
            margin-right: 10px;
            text-decoration: underline;
            color: var(--primary);
            cursor: pointer;
            &:last-child {
                margin-right: 0;
            }
        }
    }
}
// el-table
:deep(.el-table) {
    background-color: transparent;
    &::before {
        background: none;
    }
    .el-checkbox {
        height: auto;
        position: relative;
        top: 3px;
    }
    .el-table__fixed-right::before {
        background: none;
    }
    .el-table__cell.is-right {
        background: var(--contentColor) !important;
    }
    .cell {
        line-height: 16px;
    }
    thead {
        tr {
            font-size: 12px;
            color: var(--minorColor);
            background: transparent;
            th {
                font-weight: normal;
                border-bottom: 1px solid var(--lineColor) !important;
                background: transparent !important;
            }
        }
    }
    tbody {
        tr {
            font-size: 13px;
            color: var(--color);
            background: transparent;
            td {
                border-bottom: 1px solid var(--lineColor);
                background: transparent;
            }
        }
    }
    .el-table__body-wrapper {
        @include scroll-pc();
    }
}
</style>
