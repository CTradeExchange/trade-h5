<template>
    <customTable
        :data='tableData'
        :empty-text="$t('trade.pendingEmpty')"
        :options='tableOptions'
    />
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted, defineProps } from 'vue'
import { useStore } from 'vuex'
import customTable from './customTable'
import { getPendingColumns } from './tableConfig'
import { QuoteSocket } from '@/plugins/socket/socket'
import mitt from '@/utils/mitt'

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
const store = useStore()
const tableOptions = computed(() => ({
    ...props.commonOptions,
    columns: getPendingColumns(props.tradeType)
}))
const tableData = computed(() => store.state._trade.pendingList[props.tradeType] || [])
const symbolKeys = computed(() => tableData.value.map(e => `${e.symbolId}_${e.tradeType}`))
const symbolKey = computed(() => store.state._quote.productActivedID)

let unSubscribe = () => {}

const queryPBOOrderPage = () => {
    store.dispatch('_trade/queryPBOOrderPage', {
        tradeType: props.tradeType
    })
}

watch(() => symbolKey.value, () => {
    // 切换产品重新获取订单列表
    queryPBOOrderPage()
})

watch(() => symbolKeys.value, () => {
    if (!store.state._user.switchAccounting) {
        unSubscribe = QuoteSocket.add_subscribe({ moduleId: 'currentCommission', symbolKeys: symbolKeys.value })
    }
}, {
    immediate: true,
    deep: true
})

onMounted(() => {
    // 初始化拉取订单
    queryPBOOrderPage()
    // 收到市价成交消息时需同时更新持仓记录和当前订单标签页数据
    mitt.on('POSITION_OPEN', () => {
        store.dispatch('_trade/queryPBOOrderPage', {
            tradeType: props.tradeType
        })
    })
})

onUnmounted(() => {
    unSubscribe()
    mitt.off('POSITION_OPEN')
})

</script>

<style lang="scss" scoped>
:deep() {
    .crossLevelNum {
        margin-left: 4px;
        vertical-align: middle;
        position: relative;
        height: 16px;
        line-height: 14px;
        padding-left: 3px;
        padding-right: 5px;
        font-size: 12px;
        color: var(--color);
        border-radius: 3px;
        border: 1px solid var(--color);
        &.marginleft0 {
            margin-left: 0;
        }
    }
}
</style>
