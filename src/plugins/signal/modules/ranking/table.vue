<template>
    <ElTable
        class='ranking-table'
        :data='tableData'
        :row-class-name='getRowClass'
        :style='{ width: "100%" }'
        @cell-click='handleItemClick'
    >
        <ElTableColumn
            v-if='showTop3'
            :label='$t("signal.valuable.rank")'
            :min-width='isPC ? 100 : 80'
        >
            <template #default='scope'>
                <span v-if='showTop3 && scope.$index < 3' class='number'>
                    <signal-ranking-icon :num='scope.$index+1' />
                </span>
                <span v-else class='number'>
                    {{ scope.$index + 1 }}
                </span>
            </template>
        </ElTableColumn>
        <ElTableColumn
            :label='$t("signal.detail.indicator")'
            :min-width='isPC ? 120 : 100'
        >
            <template #default='scope'>
                <span> {{ scope.row.i + (isPC ? '' : '-' + getPeriodName(scope.row.pe)) }}</span>
            </template>
        </ElTableColumn>
        <ElTableColumn
            v-if='isPC'
            :label='$t("signal.common.period")'
            min-width='120'
        >
            <template #default='scope'>
                {{ getPeriodName(scope.row.pe) }}
            </template>
        </ElTableColumn>
        <ElTableColumn
            :label='$t("signal.common.product")'
            :min-width='isPC ? 120 : 90'
        >
            <template #default='scope'>
                <div class='product-icon'>
                    <product-icon :show-symbol-icon='!!isPC' :symbol-code='scope.row.sy' />
                </div>
            </template>
        </ElTableColumn>
        <ElTableColumn
            :min-width='isPC ? 240 : 140'
        >
            <template #header>
                <span class='flex items-center icon-profit'>
                    <span>
                        {{ $t("signal.valuable.rankingProfit")+'(USD)' }}
                    </span>
                    <popover
                        :offset='[16, 8]'
                        placement='top-end'
                        :text="$t('signal.valuable.rankingProfitPopover')"
                    />
                </span>
            </template>
            <template #default='scope'>
                <Profit :value='scope.row.tpnl' />
            </template>
        </ElTableColumn>
        <ElTableColumn
            label=''
            :min-width='isPC ? 200 : 30'
        >
            <template #default='scope'>
                <van-button
                    v-if='isPC'
                    class='plain-button'
                    plain
                    type='primary'
                    @click.stop='handleDetail(scope.row)'
                >
                    <span>
                        {{ $t('signal.common.detail') }}
                    </span>
                    <van-icon class='icon' name='arrow' />
                </van-button>
                <div
                    v-else
                    class='signal-item-more'
                >
                    <van-icon class='icon' name='arrow' />
                </div>
                <!-- <van-button
                    v-if='isPC'
                    class='plain-button'
                    plain
                    type='primary'
                    @click.stop='handleSubscribe(scope.row)'
                >
                    {{ $t('signal.subscribe.freeSubscribe') + ' >' }}
                </van-button>
                <div
                    v-else
                    class='signal-item-more'
                    @click.stop='handleSubscribe(scope.row)'
                >
                    <i class='icon icon_subscribed'></i>
                </div> -->
            </template>
        </ElTableColumn>
        <template #empty>
            <signalListSkeleton
                :limit='10'
                :list='tableData'
                :skeleton-show='skeletonShow'
            />
        </template>
    </ElTable>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import productIcon from '@/plugins/signal/components/product-icon'
import useSignal from '@/plugins/signal/hooks/signal'
import { ElTable, ElTableColumn } from 'element-plus'
import { toFixed } from '@/utils/calculation'
import Profit from '@/plugins/signal/modules/signal-valuable-profit.vue'
import signalRankingIcon from '@/plugins/signal/components/signal-ranking-icon.vue'
import signalListSkeleton from '@/plugins/signal/components/signal-list-skeleton.vue'

export default {
    components: {
        ElTable,
        ElTableColumn,
        productIcon,
        Profit,
        signalRankingIcon,
        signalListSkeleton
    },
    props: {
        showTop3: {
            type: Boolean,
            default: false, // 默认不显示前三名图标
        },
        // 表格数据
        data: {
            type: Object,
            default: () => {}
        },
        // 埋点参数
        dataGaList: String, // 列表埋点
        dataGaSub: String, // 订阅按钮埋点
        dataGaDetail: String, // 详情按钮埋点
        skeletonShow: {
            type: Boolean,
            default: false, // 骨架
        },
        isReplace: {
            type: Boolean,
            default: false, // 是否replace
        }
    },
    setup (props, { emit }) {
        const store = useStore()
        const router = useRouter()
        const { jumpTrade, subscribeSignal } = useSignal()
        const config = computed(() => {
            return store.state._signal.config
        })
        const isPC = window.isPC

        // 表格数据
        const tableData = computed(() => {
            if (props.skeletonShow) {
                return []
            }
            return props.data
        })

        // 周期名称
        const getPeriodName = (pe) => {
            return store.getters['_signal/getPeriodName'](pe)
        }

        // 列表点击
        const handleItemClick = (item, gaEvent = true) => {
            const res = {
                path: '/signal/ranking/detail',
                query: {
                    id: item.id,
                    rtime: item.rtime,
                    tpnl: item.tpnl
                }
            }
            if (props.isReplace) {
                router.replace(res)
            } else {
                router.push(res)
            }
        }
        // 去交易
        const handleTrade = (item) => {
            jumpTrade(item.sy)
        }

        // 订阅
        const handleSubscribe = (item) => {
            subscribeSignal({
                payload: {
                    ...item,
                    id: 'signal', // 必传
                },
                type: 'quick',
                needConfirm: !isPC
            })
        }

        const handleDetail = (item) => {
            handleItemClick(item, false)
        }

        // 更改行样式
        const getRowClass = ({ rowIndex }) => {
            return props.showTop3 ? 'item-' + (rowIndex + 1) : ''
        }

        return {
            config,
            getPeriodName,
            handleTrade,
            handleItemClick,
            toFixed,
            handleSubscribe,
            handleDetail,
            isPC,
            tableData,
            getRowClass
        }
    }
}
</script>

<style lang="scss" scoped>
.ranking-table {
    .btn-option {
        width: 80px;
        height: 30px;
        border-color: var(--primary);
        color: var(--primary);
        margin: 0 auto;
        &:hover {
            opacity: 0.8;
        }
    }
    .icon_subscribed {
        color: var(--primary);
    }
    :deep {
        .el-table__row {
            cursor: pointer;
        }
        .number {
            min-width: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            svg {
                width: 32px;
                height: 32px;
            }
        }
        .product-icon {
            width: 120px;
            display: flex;
            align-items: center;
            @media screen and (max-width: 768px) {
                width: 90px;
            }
        }
        .plain-button {
            height: 30px;
            font-size: 14px;
            min-width: 140px;
            @media screen and (max-width: 768px) {
                font-size: 13px;
                height: 25px;
                min-width: auto;
            }
            .icon {
                margin-left: 8px;
            }
        }
        .cell {
            display: inline-block;
            vertical-align: middle;
            word-break: break-word;
        }
        .el-table_1_column_1 {
            .cell {
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
        }
        th.el-table__cell,
        .el-table-fixed-column--left,
        .el-table-fixed-column--right {
            background: var(--contentColor);
        }
        .el-table__empty-text {
            width: 100%;
        }
        .icon-profit {
            .popover-warp {
                align-items: center;
            }
        }
    }
}

</style>
