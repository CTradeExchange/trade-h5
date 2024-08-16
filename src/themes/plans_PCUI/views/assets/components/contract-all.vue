<template>
    <div class='assets-module'>
        <div class='assets-body'>
            <el-table :cell-style="{ background:'none' }" :data='positionList' :empty-text="$t('c.noData')" height='100%'>
                <el-table-column :label="$t('common.symbolName')" prop='symbolName' width='120' />
                <el-table-column :label="$t('trade.profit') + `${assetsInfo?.currency?`(${assetsInfo?.currency})`:''}`" :min-width='minWidth'>
                    <template #default='scope'>
                        <span :class="parseFloat(scope.row.profitLoss) > 0 ? 'riseColor': 'fallColor'">
                            {{ scope.row.profitLoss }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.direction')" :min-width='minWidth'>
                    <template #default='scope'>
                        <span :class="Number(scope.row.direction) === 1 ? 'riseColor' : 'fallColor'">
                            {{ Number(scope.row.direction) === 1 ? $t('trade.buy') : $t('trade.sell') }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.myPosition') + '(' + $t('trade.volumeUnit') + ')'" min-width='120'>
                    <template #default='scope'>
                        <span>{{ minus(scope.row.openVolume, scope.row.closeVolume) }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.positionPrice')" :min-width='minWidth'>
                    <template #default='scope'>
                        <span>{{ scope.row.openPrice }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.currentPrice')" :min-width='minWidth'>
                    <template #default='scope'>
                        <span>{{ Number(scope.row.direction) === 1 ? currentProduct(scope.row)?.sell_price : currentProduct(scope.row)?.buy_price }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.stopLossPrice')" :min-width='minWidth'>
                    <template #default='scope'>
                        <span>{{ parseFloat(scope.row.stopLossDecimal) ? scope.row.stopLossDecimal : '--' }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.stopProfitPrice')" :min-width='minWidth'>
                    <template #default='scope'>
                        <span>{{ parseFloat(scope.row.takeProfitDecimal) ? scope.row.takeProfitDecimal : '--' }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.openTime')" :min-width='160'>
                    <template #default='scope'>
                        <span>{{ formatTime(scope.row.openTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.positionId')" :min-width='160'>
                    <template #default='scope'>
                        <span>{{ scope.row.positionId }}</span>
                    </template>
                </el-table-column>
                <el-table-column align='right' fixed='right' :label="$t('c.handle')" min-width='130'>
                    <template #default='scope'>
                        <div class='handle'>
                            <button @click='openSltp(scope.row)'>
                                {{ $t('trade.tackStopSetup') }}
                            </button>
                            <button @click='openClosePosition(scope.row)'>
                                {{ $t('trade.closed') }}
                            </button>
                        </div>
                    </template>
                </el-table-column>
                <template #empty>
                    <div class='empty-box'>
                        <img alt='' src='../../../../../assets/newPCUI/empty.png' />
                        <p>{{ $t("withdraw.noRecords") }}</p>
                        <div @click='handleTrade'>
                            {{ $t("withdraw.exploreTrade") }}
                        </div>
                    </div>
                </template>
            </el-table>
        </div>
    </div>

    <!-- 平仓组件 -->
    <close-position ref='closePosition' />
    <!-- 止盈止损 -->
    <profitlossSetPopup ref='sltp' />
</template>

<script>
import closePosition from '@/themeCommon/components/trade/close-position.vue'
import profitlossSetPopup from '@/themeCommon/components/trade/profitlossSetPopup'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { minus } from '@/utils/calculation'
import { isDemoAccount } from '@/utils/util'

export default {
    components: {
        closePosition,
        profitlossSetPopup
    },
    props: {
        // 玩法类型
        tradeType: {
            type: [String, Number],
            default: ''
        }
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const closePosition = ref(null)
        const sltp = ref(null)
        const minWidth = 130
        // 产品map数据
        const productMap = computed(() => store.state._quote.productMap)
        // 用户信息
        const customerInfo = computed(() => store.state._user.customerInfo)
        // 账户资产
        const userAccount = computed(() => store.state._user.accountAssets[props.tradeType])
        // 资产信息
        const assetsInfo = computed(() => customerInfo.value.accountList?.find(el => Number(el.tradeType) === props.tradeType))
        // 持仓列表数据
        const positionList = computed(() => store.state._trade.positionList[props.tradeType])
        const symbolKey = computed(() => store.state._quote.productActivedID)

        // 获取当产品数据
        const currentProduct = (row) => {
            return productMap.value[row.symbolId + '_' + row.tradeType]
        }
        // 判断是否模拟交易
        const isRealTran = computed(() => !isDemoAccount())

        // 平仓调窗
        const openClosePosition = (row) => {
            store.commit('_quote/Update_productActivedID', row.symbolId + '_' + row.tradeType)
            closePosition.value.open(row)
        }

        // 止盈止损弹窗
        const openSltp = (row) => {
            store.commit('_quote/Update_productActivedID', row.symbolId + '_' + row.tradeType)
            sltp.value.open(row)
        }

        const handleTrade = () => {
            const [symbolId, tradeType] = symbolKey.value?.split('_') || []
            const url = `/order?symbolId=${symbolId || ''}&tradeType=${tradeType || ''}`
            router.push(url)
        }

        return {
            minus,
            productMap,
            userAccount,
            assetsInfo,
            positionList,
            currentProduct,
            closePosition,
            openClosePosition,
            sltp,
            openSltp,
            minWidth,
            isRealTran,
            handleTrade
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets.scss';
.assets-body {
    padding: 0 !important;
}
.empty-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 0 36px;
    & > img {
        width: 80px;
        height: 80px;
    }
    & > p {
        font-size: 20px;
        font-weight: 500;
        line-height: 1.5;
        margin-bottom: 24px;
        color: var(--primaryText);
    }
    & > div {
        width: auto;
        height: 40px;
        min-width: 134px;
        padding: 0 16px;
        border-radius: 6px;
        background: var(--primary);
        color: var(--contentColor);
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &:active {
            opacity: 0.85;
        }
    }
}
</style>
