<template>
    <customTable
        :component-refs='componentRefs'
        :data='tableData'
        :options='tableOptions'
    >
        <template #dependencies>
            <!-- table需要的依赖组件， 例如操作按钮打开其他组件 -->
            <ClosePosition :ref='el => componentRefs.closePosition = el' />
            <Sltp :ref='el => componentRefs.sltp = el' />
            <AdjustMargin :ref='el => componentRefs.adjustMargin = el' />
            <MultipleSet
                :ref='el => componentRefs.multipleSet = el'
                :product='product'
                @beforeClose='MultipleSetBeforeClose'
            />
            <MultipleSetCross
                :ref='el => componentRefs.multipleSetCross = el'
                :product='product'
                @beforeClose='MultipleSetBeforeClose'
            />
        </template>
    </customTable>
</template>

<script setup>
import { computed, unref, watch, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import customTable from './customTable'
import { getAssetColumns } from './tableConfig'
import { QuoteSocket } from '@/plugins/socket/socket'
import AdjustMargin from '@planspc/views/assets/components/adjust-margin.vue'
import ClosePosition from '@planspc/views/assets/components/close-position.vue'
import Sltp from '@planspc/views/assets/components/sltp.vue'
import MultipleSet from '@planspc/components/multipleSet.vue'
import MultipleSetCross from '@planspc/components/multipleSetCross.vue'
import { useRoute, useRouter } from 'vue-router'
const componentRefs = ref({})
const props = defineProps({
    tradeType: {
        type: [String, Number],
        default: ''
    },
    commonOptions: {
        type: Object,
        default: () => ({})
    }
})
const router = useRouter()
const route = useRoute()
const store = useStore()
// 用户信息

const product = computed(() => store.getters.productActived)
const customerInfo = computed(() => store.state._user.customerInfo)
// 持仓列表
// 资产列表
const accountList = computed(() => customerInfo.value?.accountList?.filter(el => Number(el.tradeType) === props.tradeType) || [])
const positionList = computed(() => store.state._trade.positionList[props.tradeType] || [])
const tableData = computed(() => {
    if ([1, 2].includes(props.tradeType)) {
        return unref(positionList)
    } else if ([3, 5, 9].includes(props.tradeType)) {
        console.log(unref(accountList))
        return unref(accountList)
    }
    return []
})
const tableOptions = computed(() => ({
        ...props.commonOptions,
        columns: getAssetColumns(props.tradeType)
}))

// 获取持仓列表数据
const queryPositionList = () => {
    if (unref(customerInfo)) {
        const accountId = customerInfo.value.accountList.find(item => Number(item.tradeType) === Number(props.tradeType))?.accountId
        store.dispatch('_trade/queryPositionPage', {
            tradeType: props.tradeType,
            sortFieldName: 'openTime',
            sortType: 'desc',
            accountId
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

watch(() => props.tradeType, () => {
    if (customerInfo.value) initData()
}, { immediate: true })

let unSubscribe = () => {}
const symbolKeys = computed(() => tableData.value.map(e => `${e.symbolId}_${props.tradeType}`))
watch(() => symbolKeys.value, (val) => {
    val = [...new Set(val)]
    unSubscribe = QuoteSocket.add_subscribe({ moduleId: 'assetsList', symbolKeys: val })
}, {
    immediate: true
})

onUnmounted(() => {
    unSubscribe()
})

// 拉取用户信息
store.dispatch('_user/findCustomerInfo', false)

</script>

<style lang="scss" scoped>

</style>
