<template>
    <div ref='userRecordRef' class='userRecord'>
        <div class='headbar'>
            <el-tabs v-model='activeName' class='tabs'>
                <el-tab-pane v-if='[1, 2].includes(Number(tradeType))' name='2'>
                    <template #label>
                        <span>{{ $t('trade.position') }} {{ isLogin ? `(${positionList.length})` : '' }}</span>
                    </template>
                </el-tab-pane>
                <el-tab-pane name='0'>
                    <template #label>
                        <span id='seventh-element-driver'>
                            {{ $t('trade.curTrust') }} {{ isLogin ? `(${pendingList.length})` : '' }}
                        </span>
                    </template>
                </el-tab-pane>

                <el-tab-pane :label="$t('trade.dealList')" name='1' />
                <el-tab-pane v-if='![1, 2].includes(Number(tradeType))' :label="$t('trade.asset')" name='2' />
            </el-tabs>
            <router-link v-if="isLogin && activeName === '1'" class='link' :to="{ name: 'TransRecords', query: { tradeType } }">
                {{ $t('trade.allTransaction') }}
            </router-link>
            <div v-if="isLogin && activeName === '2'" class='flex items-center'>
                <div class='mr-4'>
                    <div class='text-minorColor text-xs'>
                        {{ $t('trade.allOriginalMargin') }}
                    </div>
                    <div class='text-sm font-bold'>
                        {{ `${marginTotal} ${userAccount.currency}` }}
                    </div>
                </div>
                <div>
                    <div class='text-minorColor text-xs'>
                        {{ $t('headLineTrade.unrealizedPl') }}
                    </div>
                    <div
                        class='text-sm font-bold'
                        :class='{ riseColor: userAccount?.profitLoss > 0, fallColor: userAccount?.profitLoss < 0 }'
                    >
                        {{
                            `${gt(userAccount?.profitLoss, 0) ? '+' : ''}${addThousandthSign(
                                userAccount.profitLoss || 0,
                                userAccount.digits,
                            )} ${userAccount.currency}`
                        }}
                    </div>
                </div>
            </div>
        </div>
        <div v-if='mounted' class='content'>
            <!-- 当前委托 -->
            <CurrentCommission v-if="activeName === '0'" :common-options='commonOptions' :trade-type='tradeType' />
            <!-- 成交记录 -->
            <Transaction v-if="activeName === '1'" :common-options='commonOptions' :trade-type='tradeType' />
            <!-- 资产 -->
            <AssetsList v-if="activeName === '2'" :common-options='commonOptions' :trade-type='tradeType' />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, unref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { ElTabs, ElTabPane } from 'element-plus'
import CurrentCommission from './components/currentCommission'
import Transaction from './components/transaction'
import AssetsList from './components/assetsList'
import mitt from '@/utils/mitt'
import { addThousandthSign } from '@/utils/util'
import { useAssets } from '@/hooks/assets'
import { gt, plus } from '@/utils/calculation'

const store = useStore()
const userAccount = useAssets()
const product = computed(() => store.getters.productActived)
const tradeType = computed(() => unref(product).tradeType)
const isLogin = computed(() => !!store.state._user.customerInfo?.customerNo)
// 当前订单、当前挂单数据
const pendingList = computed(() => store.state._trade.pendingList[tradeType.value] || [])
// 持仓列表数据
const positionList = computed(() => store.state._trade.positionList[tradeType.value] || [])
// 持仓保证金总和
const marginTotal = computed(() =>
    store.state._trade.positionList[tradeType.value]?.reduce((sum, item) => plus(sum, item.occupyTheMargin), 0) || 0,
)

const activeName = ref('2')
const userRecordRef = ref(null)
const commonOptions = {
    height: '100%',
}

// 不同table数据混在一起了
const mounted = ref(true)
watch(
    () => tradeType.value,
    async () => {
        activeName.value = '2' // 玩法切换的时候重置tab页
        mounted.value = false
        await nextTick()
        mounted.value = true
    },
)

const handleActiveName = (type) => {
    if (type === 'position' || type === 'assets') {
        // 持仓/资产
        activeName.value = '2'
    } else if (type === 'pending') {
        // 订单
        activeName.value = '0'
    } else if (type === 'deal') {
        // 成交记录
        activeName.value = '1'
    }
    // 滚动到指定位置
    window.scrollTo(0, userRecordRef.value.offsetTop)
}

onMounted(() => {
    // 初始化监听方法
    mitt.on('OrderRecord', handleActiveName)
})

onUnmounted(() => {
    // 注销
    mitt.off('OrderRecord', handleActiveName)
})
</script>

<style lang="scss" scoped>
.userRecord {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
    overflow: hidden;

    .headbar {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 8px;
        white-space: nowrap;
        @include scroll-bar-horizontal;
        overflow-x: auto;
        .tabs {
            height: 40px;
            margin-right: 40px;
            :deep {
                .el-tabs__item {
                    --el-text-color-primary: var(--normalColor);
                    user-select: none;
                    font-weight: 400;
                    color: var(--normalColor);
                    &.is-active {
                        font-weight: bold;
                        color: var(--primary);
                    }
                }
                .el-tabs__active-bar {
                    background-color: var(--primary);
                }
                .el-tabs__nav-wrap::after {
                    display: none;
                }
            }
            .question {
                margin-left: 4px;
            }
        }
    }
    .link {
        cursor: pointer;
        user-select: none;
    }
    :deep {
        .link {
            padding: 0 5px;
            cursor: pointer;
        }
        .el-table__empty-block {
            height: auto !important;
            margin-top: 20px;
        }
    }
    .content {
        position: relative;
        flex: 1;
        overflow: auto;
        .loginMaskPop {
            z-index: 8;
        }
        &:hover .loginMaskPop {
            visibility: visible;
            opacity: 1;
        }
        :deep(.popover-tips) {
            display: inline-flex;
            align-items: center;
            white-space: nowrap;
            .icon-question {
                margin-top: rem(-4px);
                line-height: normal;
                font-size: rem(32px);
                cursor: pointer;
            }
        }
    }
}
</style>
