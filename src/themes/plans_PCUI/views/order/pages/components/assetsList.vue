<template>
    <customTable
        :data='tableData'
        :options='tableOptions'
    />
</template>

<script setup>
import { computed, unref, watch } from 'vue'
import { useStore } from 'vuex'
import customTable from './customTable'
import { ElButton } from 'element-plus'
import { getAssetColumns } from './tableConfig'

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
// 用户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 资产列表
const tableData = computed(() => store.state._trade.positionList[props.tradeType])
const tableOptions = computed(() => (
    {
        ...props.commonOptions,
        columns: getAssetColumns(props.tradeType)
    }
))

watch(() => props.tradeType, () => {
    if (unref(customerInfo)) {
        const accountId = customerInfo.value.accountList.find(item => Number(item.tradeType) === Number(props.tradeType))?.accountId
        store.dispatch('_trade/queryPositionPage', {
            tradeType: props.tradeType,
            sortFieldName: 'openTime',
            sortType: 'desc',
            accountId
        })
    }
})

const handleLoan = (row) => {
    console.log(row)
}
const handleRepayment = (row) => {
    console.log(row)
}

</script>

<style lang="scss" scoped>

</style>
