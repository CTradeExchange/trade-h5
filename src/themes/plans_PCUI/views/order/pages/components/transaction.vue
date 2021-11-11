<template>
    <customTable
        :data='tableData'
        :options='tableOptions'
        :raw-response='rawResponse'
    />
</template>

<script setup>
import { computed, unref } from 'vue'
import { useStore } from 'vuex'
import customTable from './customTable'
import { getTransactionColumns } from './tableConfig'

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
const tableOptions = computed(() => {
    return {
        ...props.commonOptions,
        columns: getTransactionColumns(props.tradeType)
    }
})

store.dispatch('_trade/tradeRecordList')

// 接口原始数据
const rawResponse = computed(() => store.state._trade.tradeRecordData || {})
const tableData = computed(() => unref(rawResponse)?.list || [])
window.rawResponse = rawResponse
window.tableData = tableData
</script>
