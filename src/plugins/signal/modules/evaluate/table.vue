<template>
    <div class='evaluate-table-content'>
        <ElTable
            ref='tableRef'
            border
            :cell-class-name='tableCellClassName'
            class='evaluate-table'
            :data='tableData'
            :header-cell-class-name='tableCellClassName'
            :style='{ width: "100%" }'
            @cell-click='handleItemClick'
        >
            <ElTableColumn fixed label='' min-width='150' prop='name'>
                <template #default='scope'>
                    <product-icon class='product-icon' :symbol-code='scope.row.sy' />
                </template>
            </ElTableColumn>
            <ElTableColumn
                v-for='(item) in config.indicator'
                :key='item.value'
                align='center'
                :label='item.name'
                min-width='80'
            >
                <template #default='scope'>
                    <signal-direction
                        :check-neutral='true'
                        :direction='scope.row[item.value.toLowerCase()]'
                    />
                </template>
            </ElTableColumn>
            <ElTableColumn
                align='center'
                min-width='110'
            >
                <template #header>
                    <div class='inline-flex items-center'>
                        <span class='mr-1 text-color'>
                            {{ $t("signal.common.summary") }}
                        </span>
                        <van-icon color='var(--primary)' name='star-o' />
                    </div>
                </template>
                <template #default='scope'>
                    <signal-direction
                        :check-neutral='true'
                        :direction='scope.row.summary'
                        :is-summary='true'
                    />
                </template>
            </ElTableColumn>
            <ElTableColumn align='center' :label='$t("signal.common.proportion")' min-width='240'>
                <template #default='scope'>
                    <signal-progress :item='scope.row' />
                </template>
            </ElTableColumn>
            <ElTableColumn
                align='center'
                :label='$t("signal.common.operate")'
                min-width='120'
            >
                <template #default='scope'>
                    <van-button
                        class='btn-option'
                        plain
                        size='normal'
                        @click.stop='handleTrade(scope.row)'
                    >
                        {{ $t("signal.common.trade") }}
                    </van-button>
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
    </div>
    <!-- 快捷交易面板 -->
    <QuickTransaction
        ref='quickTransactionRef'
    />
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed, ref, watch, onUnmounted } from 'vue'
import productIcon from '@/plugins/signal/components/product-icon'
import signalDirection from '@/plugins/signal/components/signal-direction.vue'
import signalProgress from '@/plugins/signal/components/progress'
import useSignal from '@/plugins/signal/hooks/signal'
import { ElTable, ElTableColumn } from 'element-plus'
import QuickTransaction from '@plans/components/quickTransaction'
import { QuoteSocket } from '@/plugins/socket/socket'
import signalListSkeleton from '@/plugins/signal/components/signal-list-skeleton.vue'

export default {
    components: {
        ElTable,
        ElTableColumn,
        productIcon,
        signalDirection,
        signalProgress,
        QuickTransaction,
        signalListSkeleton
    },
    props: {
        // 表格数据
        data: {
            type: Object,
            default: () => {}
        },
        // 埋点参数
        dataGaList: String, // 列表埋点
        dataGaTrade: String, // 交易按钮埋点
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
        const quickTransactionRef = ref(null)
        const tableRef = ref(null)
        const { jumpTrade, checkSymbolCodeValid } = useSignal()
        const config = computed(() => {
            return store.state._signal.config
        })

        const tableCellClassName = ({ columnIndex }) => {
            if (columnIndex === 7) {
                return 'col-summary'
            }
        }

        // 表格数据
        const tableData = computed(() => {
            if (props.skeletonShow) {
                return []
            }
            return props.data
        })

        // 初始化移动滚动条
        watch(() => props.data, (newVal) => {
            setTimeout(() => {
                newVal.length && tableRef.value?.setScrollLeft(1)
            })
        }, { immediate: true })

        // 列表点击
        const handleItemClick = (item) => {
            const res = {
                path: '/signal/evaluate/detail',
                query: {
                    sy: item.sy
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
            if (window.isPC) {
                jumpTrade(item.sy)
            } else {
                checkSymbolCodeValid({
                    sy: item.sy,
                    callback: (product) => {
                        store.dispatch('_quote/querySymbolInfo', product).then(result => {
                            quickTransactionRef.value.open(product)
                        })
                    }
                })
            }
        }

        const moduleId = 'evaluateTable_' + Date.now()
        let unSubscribe = () => {}
        // 订阅行情
        watch([() => props.data, () => store.state._quote.symbolCodeMap], (newValue) => {
            // 等行情加载完了再订阅
            if (Object.keys(newValue[1]).length === 0 || window.isPC) return
            const symbolKeyAll = []
            newValue[0].forEach((item) => {
                const symbolKey = store.getters['_signal/getSignalSymbolKey'](item.sy)
                if (symbolKey && !symbolKeyAll.includes(symbolKey)) {
                    symbolKeyAll.push(symbolKey)
                }
            })
            unSubscribe = QuoteSocket.add_subscribe({
                moduleId,
                symbolKeys: symbolKeyAll
            })
        }, { immediate: true, deep: true })

        onUnmounted(() => {
            unSubscribe()
        })

        const style = computed(() => {
            return {
                risebg: store.state.style.riseColor + '26',
                fallbg: store.state.style.fallColor + '26'
            }
        })

        return {
            tableRef,
            config,
            handleTrade,
            handleItemClick,
            quickTransactionRef,
            tableData,
            tableCellClassName,
            style
        }
    }
}
</script>

<style lang="scss" scoped>
.evaluate-table-content {
    @media screen and (max-width: 768px) {
        margin: 0 -15px;
    }
}
.evaluate-table {
    .product-icon {
        max-width: 125px;
    }
    .btn-option {
        width: 80px;
        height: 30px;
        background-color: var(--contentColor);
        border-color: var(--primary);
        color: var(--primary);
        margin: 0 auto;
        &:hover {
            opacity: 0.8;
        }
    }
    :deep {
        .el-table__row {
            cursor: pointer;
        }
        th.el-table__cell,
        .el-table-fixed-column--left {
            background: var(--contentColor);
        }
        .el-table__empty-text {
            width: 100%;
        }
        .col-summary {
            background-color: rgb(234 90 38 / 8%) !important;
        }
        tr:hover {
            .col-summary {
                background-color: rgb(234 90 38 / 12%) !important;
            }
        }
    }
}
</style>
