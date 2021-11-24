<template>
    <customTable
        :data='tableData'
        :options='tableOptions'
    />
</template>

<script setup>
import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import customTable from './customTable'
import { getPendingColumns } from './tableConfig'
import { QuoteSocket } from '@/plugins/socket/socket'

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

watch(() => symbolKeys.value, () => {
    QuoteSocket.add_subscribe({ moduleId: 'currentCommission', symbolKeys: symbolKeys.value })
}, {
    immediate: true,
    deep: true
})
</script>

<style lang="scss" scoped>

</style>
