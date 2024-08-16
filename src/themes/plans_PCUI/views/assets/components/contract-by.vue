<template>
    <div class='assets-module'>
        <div class='assets-header'>
            <ul class='assets-ul'>
                <li>
                    <p class='muted'>
                        <span>{{ $t('trade.freeMargin') }}</span>
                        <van-icon class='question' name='question-o' @click='showExplain(5)' />
                    </p>
                    <p class='value'>
                        <strong>{{ userAccount?.availableMargin || '--' }}</strong>
                    </p>
                </li>
                <li>
                    <p class='muted'>
                        <span>{{ $t('trade.allOriginalMargin') }}</span>
                        <van-icon class='question' name='question-o' @click='showExplain(6)' />
                    </p>
                    <p class='value'>
                        <strong>{{ userAccount?.occupyMargin || '--' }}</strong>
                    </p>
                </li>
                <li>
                    <p class='muted'>
                        <span>{{ $t('trade.positionProfit') }}</span>
                    </p>
                    <p class='value'>
                        <strong :class='{ riseColor: userAccount?.profitLoss > 0, fallColor: userAccount?.profitLoss < 0 }'>
                            {{ userAccount?.profitLoss || '--' }}
                        </strong>
                    </p>
                </li>
            </ul>
            <!-- <div class='assets-handle'>
                <van-button
                    v-if='$store.state._base.plans.length > 1'
                    block
                    class='button-hover px-6 flex-1 w-full'
                    size='small'
                    type='primary'
                    @click='goTransfer'
                >
                    {{ $t('trade.transfer') }}
                </van-button>
                <van-button
                    v-if="customerInfo.companyType === 'real'"
                    block
                    class='button-hover px-6 flex-1 w-full ml-5'
                    size='small'
                    type='primary'
                    @click='goDesposit'
                >
                    {{ $t('trade.desposit') }}
                </van-button>
                <van-button
                    v-if="customerInfo.companyType === 'real'"
                    block
                    class='button-hover px-6 flex-1 w-full ml-5'
                    size='small'
                    style='color: var(--color); border: 1px solid var(--lineColor); background: var(--assistColor)'
                    type='primary'
                    @click='goWithdraw'
                >
                    {{ $t('trade.withdraw') }}
                </van-button>
                <div class='record-link' @click='goRecord'>
                    <i class='icon_zijinjilu'></i>
                    <span>{{ $t('trade.fundRecord') }}</span>
                </div>
            </div> -->
        </div>
        <div class='assets-body'>
            <el-table :data='positionList' :empty-text="$t('c.noData')" height='100%' @row-click='positionDetail'>
                <el-table-column :label="$t('trade.direction')">
                    <template #default='scope'>
                        <span :class="Number(scope.row.direction) === 1 ? 'riseColor' : 'fallColor'">
                            {{ Number(scope.row.direction) === 1 ? $t('trade.buy') : $t('trade.sell') }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('common.symbolName')" :min-width='minWidth' prop='symbolName'>
                    <template #default='scope'>
                        <div class='flex items-center'>
                            <div class='mr-1'>
                                <ProductIcon :symbol-key='`${scope.row.symbolId}_${scope.row.tradeType}`' />
                            </div>
                            <div class='van-ellipsis'>
                                {{ scope.row.symbolName }}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$t('trade.profit') + `${assetsInfo?.currency ? `(${assetsInfo?.currency})` : ''}`"
                    :min-width='minWidth'
                >
                    <template #default='scope'>
                        <span :class="parseFloat(scope.row.profitLoss) > 0 ? 'riseColor' : 'fallColor'">
                            {{ scope.row.profitLoss }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$t('trade.swap_2') + `${assetsInfo?.currency ? `(${assetsInfo?.currency})` : ''}`"
                    :min-width='minWidth'
                    prop='interest'
                />
                <el-table-column :label="$t('trade.size')" :min-width='200' prop='currentTradeAmount'>
                    <template #default='scope'>
                        <div>
                            <div>
                                {{ scope.row.currentTradeAmount ? `${scope.row.currentTradeAmount} ${assetsInfo?.currency || ''}` : '--' }}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.leverage')" :min-width='minWidth'>
                    <template #default='scope'>
                        {{ `${scope.row.crossLevelNum}${scope.row.crossLevelNum ? 'x' : ''}` }}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('fund.accupyMargin')" :min-width='minWidth'>
                    <template #default='scope'>
                        <div class='flex items-center'>
                            <div class='van-ellipsis mr-2'>
                                {{ scope.row.occupyTheMargin }}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.positionPrice')" :min-width='minWidth'>
                    <template #default='scope'>
                        <span>{{ scope.row.openPrice }}</span>
                    </template>
                </el-table-column>

                <el-table-column :label="$t('trade.currentPrice')" :min-width='minWidth'>
                    <template #default='scope'>
                        <span v-if='currentProduct(scope.row)?.isMakingMatch' :class="[currentProduct(scope.row)?.last_color || '']">
                            {{ currentProduct(scope.row)?.rolling_last_price || '--' }}
                        </span>
                        <span v-else :class="Number(scope.row.direction) === 1 ? 'riseColor' : 'fallColor'">
                            {{
                                Number(scope.row.direction) === 1
                                    ? currentProduct(scope.row)?.sell_price
                                    : currentProduct(scope.row)?.buy_price
                            }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column :min-width='160'>
                    <template #header>
                        <div class='header-cell'>
                            <span>{{ $t('trade.previewStopPrice') }}</span>
                            <van-icon class='question' name='question-o' @click='showExplain(7)' />
                        </div>
                    </template>
                    <template #default='scope'>
                        <span>{{ scope.row.previewStopPrice || '--' }}</span>
                    </template>
                </el-table-column>

                <el-table-column :label="$t('trade.tpsl')" :min-width='180'>
                    <template #default='scope'>
                        <div class='flex items-center'>
                            <div>
                                <div class='flex items-center'>
                                    <div>{{ $t('trade.takeProfit') }}:</div>
                                    <div class='ml-1'>
                                        {{ scope.row.takeProfitDecimal * 1 !== 0 ? scope.row.takeProfitDecimal : '--' }}
                                    </div>
                                </div>
                                <div class='flex items-center'>
                                    <div>{{ $t('trade.stopLoss') }}:</div>
                                    <div class='ml-1'>
                                        {{ scope.row.stopLossDecimal * 1 !== 0 ? scope.row.stopLossDecimal : '--' }}
                                    </div>
                                </div>
                            </div>
                            <i class='icon_edit iconfont cursor-pointer ml-2' @click.stop='openSltp(scope.row)'></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.profit') + '(' + assetsInfo.currency + ')'" :min-width='minWidth'>
                    <template #default='scope'>
                        <span :class='{ riseColor: parseFloat(scope.row.profitLoss) > 0, fallColor: parseFloat(scope.row.profitLoss) < 0 }'>
                            {{ scope.row.profitLoss }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align='center' fixed='right' :label="$t('trade.closed')" :min-width='100'>
                    <template #default='scope'>
                        <div class='flex items-center justify-center'>
                            <div class='text-primary cursor-pointer' @click.stop='openClosePosition(scope.row)'>
                                {{ $t('trade.closed') }}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <template #empty>
                    <div class='none-data'>
                        <button @click='onTrade'>
                            {{ $t('common.startTrade') }}
                        </button>
                        <p class='tip'>
                            {{ $t('trade.positionEmpty') }}
                        </p>
                    </div>
                </template>
            </el-table>
        </div>
    </div>

    <!-- 调整杠杆倍数 -->
    <multipleSet ref='multipleSetRef' :product='product' />
    <!-- 调整保证金组件 -->
    <adjust-margin ref='adjustMargin' />
    <!-- 平仓组件 -->
    <close-position ref='closePosition' />
    <!-- 止盈止损 -->
    <profitlossSetPopup ref='sltp' />
    <!-- 说明弹窗 -->
    <explain-popup v-model='isExplain' :explain-type='explainType' :user-account='userAccount' />
    <!-- 持仓详情弹窗 -->
    <positionDetailPopup ref='positionDetailPopupRef' />
</template>

<script>
// compontens
import adjustMargin from './adjust-margin.vue'
import closePosition from '@/themeCommon/components/trade/close-position.vue'
import explainPopup from './explain-popup.vue'
import multipleSet from '@planspc/components/multipleSet.vue'
import profitlossSetPopup from '@/themeCommon/components/trade/profitlossSetPopup'

import { computed, ref, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { minus } from '@/utils/calculation'
import useTradeHooks from '@/hooks/trade/index.js'
import useMethods from '@planspc/hooks/useMethods'
import ProductIcon from '@/components/product-icon.vue'
import positionDetailPopup from '../../order/pages/components/positionDetailPopup.vue'
export default {
    components: {
        adjustMargin,
        closePosition,
        profitlossSetPopup,
        explainPopup,
        multipleSet,
        ProductIcon,
        positionDetailPopup,
    },
    props: {
        // 玩法类型
        tradeType: {
            type: [String, Number],
            default: '',
        },
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const { t, locale } = useI18n({ useScope: 'global' })
        const { checkOrderStatusFn } = useTradeHooks()
        const { toOrderPriority } = useMethods()
        const multipleSetRef = ref(null)
        const adjustMargin = ref(null)
        const closePosition = ref(null)
        const sltp = ref(null)
        const positionDetailPopupRef = ref(null)
        const minWidth = 130
        // 产品map数据
        const productMap = computed(() => store.state._quote.productMap)
        // 当前产品
        const product = computed(() => store.getters.productActived)
        // 用户信息
        const customerInfo = computed(() => store.state._user.customerInfo)
        // 账户资产
        const userAccount = computed(() => store.state._user.accountAssets[props.tradeType])
        // 资产信息
        const assetsInfo = computed(() => customerInfo.value.accountList?.find((el) => Number(el.tradeType) === props.tradeType))
        // 持仓列表数据
        const positionList = computed(() => store.state._trade.positionList[props.tradeType])

        // 配置文件
        const businessConfig = computed(() => store.state.businessConfig)

        // 获取当产品数据
        const currentProduct = (row) => {
            return productMap.value[row.symbolId + '_' + row.tradeType]
        }
        const state = reactive({
            // 是否显示说明弹窗
            isExplain: false,
            // 说明类型
            explainType: 0,
        })
        // 风险状态等级文案
        const riskLevelMap = {
            1: t('riskLevel.safety'),
            2: t('riskLevel.warn'),
            3: t('riskLevel.danger'),
        }

        // 跳转到划转页面
        const goTransfer = () => {
            router.push({
                path: '/assets/transfer',
                query: {
                    accountId: assetsInfo.value.accountId,
                    tradeType: props.tradeType,
                },
            })
        }

        // 跳转到资金记录页面
        const goRecord = () => {
            router.push({
                path: '/assets/record',
                query: {
                    accountId: assetsInfo.value.accountId,
                    tradeType: props.tradeType,
                },
            })
        }

        // 调整杠杆倍数弹窗
        const openMultipleSet = (row) => {
            multipleSetRef.value.open(row)
        }

        // 调整保证金弹窗
        const openAdjustMargin = (row) => {
            checkOrderStatusFn(props.tradeType, row.orderId, 2).then(() => {
                adjustMargin.value.open(row)
            })
        }

        // 平仓调窗
        const openClosePosition = (row, isLimit) => {
            store.commit('_quote/Update_productActivedID', row.symbolId + '_' + row.tradeType)
            closePosition.value.open(row, isLimit)
        }

        // 止盈止损弹窗
        const openSltp = (row) => {
            store.commit('_quote/Update_productActivedID', row.symbolId + '_' + row.tradeType)
            sltp.value.open(row)
        }

        // 查看持仓详情
        const positionDetail = (row) => {
            positionDetailPopupRef.value.open(row)
        }

        // 显示说明弹窗
        const showExplain = (type) => {
            state.explainType = type
            state.isExplain = true
        }

        // 跳转充值页面
        const goDesposit = () => {
            router.push({
                path: '/depositChoose',
                query: {
                    tradeType: props.tradeType,
                },
            })
        }

        // 跳转提现页面
        const goWithdraw = () => {
            router.push({
                path: '/withdrawChoose',
            })
        }

        // 去交易
        const onTrade = () => {
            toOrderPriority(props.tradeType)
        }

        return {
            minus,
            productMap,
            product,
            userAccount,
            assetsInfo,
            positionList,
            currentProduct,
            goTransfer,
            goRecord,
            multipleSetRef,
            openMultipleSet,
            adjustMargin,
            openAdjustMargin,
            closePosition,
            openClosePosition,
            sltp,
            openSltp,
            minWidth,
          ...toRefs(state),
            showExplain,
            riskLevelMap,
            customerInfo,
            businessConfig,
            goDesposit,
            goWithdraw,
            onTrade,
            locale,
            positionDetail,
            positionDetailPopupRef,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../assets.scss';
.assets-header {
  .assets-handle button {
      background-color: var(--primary);
  }
}
.assets-body {
  :deep {
      .el-table td.el-table__cell div {
          line-height: normal;
      }
      .el-table__row {
          cursor: pointer;
      }
      .el-table__body {
          tr.hover-row {
              > td.el-table__cell {
                  background-color: var(--primaryAssistColor);
              }
              .el-table-fixed-column--right {
                  background-color: var(--primaryAssistColor) !important;
              }
          }
      }
  }
}
</style>
