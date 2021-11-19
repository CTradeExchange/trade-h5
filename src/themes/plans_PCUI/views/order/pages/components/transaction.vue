<template>
    <customTable
        :data='tableData'
        :options='tableOptions'
        :raw-response='rawResponse'
    />
</template>

<script setup>
import { computed, onUnmounted, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import customTable from './customTable'
import { getTransactionColumns } from './tableConfig'
import { tradeRecordList } from '@/api/user'

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
const route = useRoute()
const tableOptions = computed(() => {
    return {
        ...props.commonOptions,
        columns: getTransactionColumns(props.tradeType)
    }
})
// 接口数据
const rawResponse = ref({})
const tableData = ref([])
const queryData = () => {
    const account = store.state._user.customerInfo.accountList?.filter(el => Number(el.tradeType) === Number(props.tradeType)) || []
    const accountIds = account.map(e => e.accountId).toString()

    const params = {
        accountIds,
        sortFieldName: 'executeTime',
        sortType: 'desc',
        current: 1,
        size: 10,
        executeEndTime: -1,
        tradeType: props.tradeType
    }
    tradeRecordList(params)
        .then(res => {
            if (res.check()) {
                rawResponse.value = res.data
                tableData.value = res.data.list
            }
        })
        .catch(err => console.error(err))
}

const unSubscribe = store.subscribeAction((action, state) => {
    if (action.type === '_trade/tradeRecordList') {
        queryData()
    }
})

onUnmounted(() => {
    unSubscribe()
})

watch(() => route.query.tradeType, () => store.dispatch('_trade/tradeRecordList'), { immediate: true })

</script>
