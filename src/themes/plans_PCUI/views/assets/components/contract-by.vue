<template>
    <div class='assets-module'>
        <div class='assets-header'>
            <ul class='assets-ul'>
                <li>
                    <span>{{ $t('assets.freeMargin') }}</span>
                    <strong>{{ userAccount?.availableMargin || '--' }}</strong>
                </li>
                <li>
                    <span>{{ $t('assets.allOriginalMargin') }}</span>
                    <strong>{{ userAccount?.occupyMargin || '--' }}</strong>
                </li>
                <li>
                    <span>{{ $t('assets.positionProfit') }}</span>
                    <strong :class="userAccount?.profitLoss > 0 ? 'riseColor': 'fallColor'">
                        {{ userAccount?.profitLoss || '--' }}
                    </strong>
                </li>
            </ul>
            <div class='assets-handle'>
                <button class='btn' @click='goTransfer'>
                    {{ $t('assets.transfer') }}
                </button>
                <div class='record-link' @click='goRecord'>
                    <i class='icon_zijinmingxi1'></i>
                    <span>{{ $t('assets.fundRecord') }}</span>
                </div>
            </div>
        </div>
        <div class='assets-body'>
            <el-table :cell-style="{ background:'none' }" :data='positionList' :empty-text="$t('c.noData')">
                <el-table-column :label="$t('assets.name')" prop='symbolName' width='120' />
                <el-table-column :label="$t('assets.profit') + '('+ assetsInfo.currency +')'" width='120'>
                    <template #default='scope'>
                        <span :class="parseFloat(scope.row.profitLoss) > 0 ? 'riseColor': 'fallColor'">
                            {{ scope.row.profitLoss }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('assets.interest') + '('+ assetsInfo.currency +')'" prop='interest' />
                <el-table-column :label="$t('assets.direction')" width='80'>
                    <template #default='scope'>
                        <span :class="Number(scope.row.direction) === 1 ? 'riseColor' : 'fallColor'">
                            {{ Number(scope.row.direction) === 1 ? $t('trade.buy') : $t('trade.sell') }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('assets.pendingUnit') + '(' + $t('assets.volumeUnit') + ')'" width='80'>
                    <template #default='scope'>
                        <span>{{ minus(scope.row.openVolume, scope.row.closeVolume) }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('assets.positionPrice')">
                    <template #default='scope'>
                        <span>{{ scope.row.openPrice }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('assets.currentPrice')">
                    <template #default='scope'>
                        <span>{{ Number(scope.row.direction) === 1 ? currentProduct(scope.row).sell_price : currentProduct(scope.row).buy_price }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('assets.prospectMandatory')">
                    <template #default='scope'>
                        <span>{{ scope.row.previewStopPrice || '--' }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('assets.originalMargin')">
                    <template #default='scope'>
                        <span> {{ scope.row.occupyTheMargin || '--' }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('assets.holdMargin')">
                    <template #default='scope'>
                        <span>{{ scope.row.maintenanceMargin || '--' }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('assets.stopLossPrice')" width='80'>
                    <template #default='scope'>
                        <span>{{ parseFloat(scope.row.stopLossDecimal) ? scope.row.stopLossDecimal : '--' }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('assets.stopProfitPrice')" width='80'>
                    <template #default='scope'>
                        <span>{{ parseFloat(scope.row.takeProfitDecimal) ? scope.row.takeProfitDecimal : '--' }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('assets.openTime')" width='100'>
                    <template #default='scope'>
                        <span>{{ formatTime(scope.row.openTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('assets.positionId')" width='120'>
                    <template #default='scope'>
                        <span>{{ scope.row.positionId }}</span>
                    </template>
                </el-table-column>
                <el-table-column align='right' fixed='right' :label="$t('c.handle')" width='220'>
                    <template #default='scope'>
                        <div class='handle'>
                            <button @click='openAdjustMargin(scope.row)'>
                                {{ $t('assets.modifyMargin') }}
                            </button>
                            <button>{{ $t('assets.tackStopSetup') }}</button>
                            <button>{{ $t('assets.closed') }}</button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
    <!-- 调整保证金组件 -->
    <adjust-margin ref='adjustMargin' :data='data' :product='product' />
</template>

<script>
// compontens
import adjustMargin from './adjust-margin.vue'

import { computed, ref, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { minus } from '@/utils/calculation'

export default {
    components: {
        adjustMargin
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
        const adjustMargin = ref(null)
        const state = reactive({
            // 弹窗data数据
            data: {},
            // 弹窗产品数据
            product: {}
        })
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
        // 获取当产品数据
        const currentProduct = (row) => {
            return productMap.value[row.symbolId + '_' + row.tradeType]
        }

        // 跳转到划转页面
        const goTransfer = () => {
            console.log('跳转到划转页面')
        }

        // 跳转到资金记录页面
        const goRecord = () => {
            console.log('跳转到资金记录页面')
        }

        // 调整保证金弹窗
        const openAdjustMargin = (row) => {
            state.data = row
            adjustMargin.value.open()
        }

        return {
            minus,
            ...toRefs(state),
            productMap,
            userAccount,
            assetsInfo,
            positionList,
            currentProduct,
            goTransfer,
            goRecord,
            adjustMargin,
            openAdjustMargin
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets.scss';
</style>
