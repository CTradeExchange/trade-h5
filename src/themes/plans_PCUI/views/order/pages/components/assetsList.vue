<template>
    <!-- 资产搜索 -->
    <AssetFilter v-if='[3, 5].includes(tradeType)' @changeState='changeState' @searchAsset='searchAsset' />
    <customTable
        class='position-table'
        :component-refs='componentRefs'
        :data='tableData'
        :empty-text="$t('trade.positionEmpty')"
        :options='tableOptions'
    >
        >
        <template #dependencies>
            <!-- table需要的依赖组件， 例如操作按钮打开其他组件 -->
            <ClosePosition :ref='(el) => (componentRefs.closePosition = el)' />
            <ProfitlossSetPopup :ref='(el) => (componentRefs.sltp = el)' />
            <AdjustMargin :ref='(el) => (componentRefs.adjustMargin = el)' />
            <MultipleSet :ref='(el) => (componentRefs.multipleSet = el)' :product='product' @beforeClose='MultipleSetBeforeClose' />
            <MultipleSetCross
                :ref='(el) => (componentRefs.multipleSetCross = el)'
                :product='product'
                @beforeClose='MultipleSetBeforeClose'
            />
        </template>
    </customTable>
    <!-- 持仓详情弹窗 -->
    <positionDetailPopup ref='positionDetailPopupRef' />
</template>

<script setup>
import { computed, unref, watch, ref, defineProps, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import customTable from './customTable'
import { getAssetColumns } from './tableConfig'
import AdjustMargin from '@planspc/views/assets/components/adjust-margin.vue'
import ClosePosition from '@/themeCommon/components/trade/close-position.vue'
import ProfitlossSetPopup from '@/themeCommon/components/trade/profitlossSetPopup'
import MultipleSet from '@planspc/components/multipleSet.vue'
import MultipleSetCross from '@planspc/components/multipleSetCross.vue'
import AssetFilter from '@planspc/components/assetFilter.vue'
import { localGet } from '@/utils/util'
import positionDetailPopup from './positionDetailPopup.vue'
import { QuoteSocket } from '@/plugins/socket/socket'
import { useRouter } from 'vue-router'

const router = useRouter()
const componentRefs = ref({})
const positionDetailPopupRef = ref(null)
const props = defineProps({
    tradeType: {
        type: [String, Number],
        default: '',
    },
    commonOptions: {
        type: Object,
        default: () => ({}),
    },
})

const store = useStore()

const hideAsset = ref(JSON.parse(localGet('hideAsset')))
const searchText = ref('')

const product = computed(() => store.getters.productActived)
const customerInfo = computed(() => store.state._user.customerInfo)

// 持仓列表

// 账户列表
const accountList = computed(() => {
    const list =
        (store.state._user?.customerInfo?.accountList &&
            store.state._user?.customerInfo?.accountList?.filter((item) => Number(item.tradeType) === Number(props.tradeType))) ||
        []

    if (hideAsset.value) {
        if (Number(props.tradeType) === 3) {
            return list.filter(
                (item) =>
                    (item.balance > 0 || item.liabilitiesPrincipal > 0) &&
                    item.currency.toUpperCase().includes(searchText.value.toUpperCase()),
            )
        } else if (Number(props.tradeType) === 5) {
            return list.filter((item) => item.balance > 0 && item.currency.toUpperCase().includes(searchText.value.toUpperCase()))
        }
    }
    return list.filter((item) => item.currency.toUpperCase().includes(searchText.value.toUpperCase())) || []
})

const positionList = computed(() => store.state._trade.positionList[props.tradeType] || [])
const tableData = computed(() => {
    if ([1, 2].includes(props.tradeType)) {
        return unref(positionList)
    } else if ([3, 5, 9].includes(props.tradeType)) {
        return unref(accountList)
    }
    return []
})
const symbolKeys = computed(() => tableData.value.map((e) => `${e.symbolId}_${props.tradeType}`))
const tableOptions = computed(() => ({
    ...props.commonOptions,
    columns: getAssetColumns(props.tradeType),
    '@rowClick': (row, column) => {
        if (column.no === 9 || column.no === 6) return
        if (row.symbolId !== product.value.symbolId) {
            router.push({
                path: '/order',
                query: {
                    symbolId: row.symbolId,
                    tradeType: row.tradeType,
                },
            })
        }
    },
}))

// 获取持仓列表数据
const queryPositionList = () => {
    if (unref(customerInfo)) {
        const accountId = customerInfo.value.accountList.find((item) => Number(item.tradeType) === Number(props.tradeType))?.accountId
        store.dispatch('_trade/queryPositionPage', {
            tradeType: props.tradeType,
            sortFieldName: 'openTime',
            sortType: 'desc',
            accountId,
        })
    }
}

// 杠杆倍数弹出关闭之后，当前产品还原成弹窗之前的产品
const MultipleSetBeforeClose = (symbolKey) => {
    store.commit('_quote/Update_productActivedID', symbolKey)
}

const initData = () => {
    const val = props.tradeType
    if ([1, 2].includes(val)) {
        queryPositionList(val)
    } else if ([3, 5, 9].includes(val)) {
        store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: val })
    }
}

// 隐藏0资产事件
const changeState = (val) => {
    hideAsset.value = val
}

// 搜索资产
const searchAsset = (val) => {
    searchText.value = val
}

watch(
    () => props.tradeType,
    () => {
        if (customerInfo.value) initData()
    },
    { immediate: true },
)
let unSubscribe = () => {}

watch(
    () => symbolKeys.value,
    () => {
        if (!store.state._user.switchAccounting) {
            unSubscribe = QuoteSocket.add_subscribe({ moduleId: 'currentCommission', symbolKeys: symbolKeys.value })
        }
    },
    {
        immediate: true,
        deep: true,
    },
)
onUnmounted(() => {
    unSubscribe()
})
</script>

<style scoped lang="scss">
.position-table {
    :deep {
        .el-table__row {
            cursor: pointer;
        }
        td.el-table__cell {
            .cell {
                line-height: normal;
            }
        }
    }
}
</style>
