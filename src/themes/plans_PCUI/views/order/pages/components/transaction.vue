<template>
    <customTable
        :data='tableData'
        :empty-text="$t('trade.noDealData')"
        :loading='loading'
        :options='tableOptions'
        :raw-response='rawResponse'
    />
</template>

<script setup>
import { computed, onUnmounted, watch, ref, onMounted, defineProps } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import customTable from './customTable'
import { getTransactionColumns } from './tableConfig'
import { tradeRecordList } from '@/api/user'
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
const route = useRoute()
const tableOptions = computed(() => {
    return {
    ...props.commonOptions,
    columns: getTransactionColumns(props.tradeType)
    }
})

const loading = ref(false)
// 接口数据
const rawResponse = ref({})
const tableData = ref([])
const queryData = () => {
    const account = store.state._user.customerInfo.accountList?.filter(el => Number(el.tradeType) === Number(props.tradeType)) || []
    const accountIds = account.map(e => e.accountId).toString()
    // 未登录的情况下暂不发请求
    if (!accountIds) {
        return
    }
    loading.value = true
    const params = {
        accountIds,
        sortFieldName: 'executeTime',
        sortType: 'desc',
        current: 1,
        size: 10,
        executeStartTime: window.dayjs(window.dayjs().subtract(7, 'day').format('YYYY/MM/DD')).valueOf(),
        executeEndTime: window.dayjs(window.dayjs(new Date()).format('YYYY/MM/DD 23:59:59')).valueOf(),
        tradeType: props.tradeType
    }
    tradeRecordList(params)
        .then(res => {
            if (res.check()) {
                rawResponse.value = res.data
                tableData.value = res.data?.list
            }
        })
        .catch(err => console.error(err)).finally(() => {
            loading.value = false
        })
}

const unSubscribe = store.subscribeAction((action, state) => {
    if (action.type === '_trade/tradeRecordList') {
        queryData()
    }
})

onMounted(() => {
    // 收到市价成交消息时需同时更新持仓记录和当前订单标签页数据
    mitt.on('POSITION_OPEN', () => {
        queryData()
    })
})

onUnmounted(() => {
    unSubscribe()
    mitt.off('POSITION_OPEN')
})

watch(() => route.query.tradeType, () => store.dispatch('_trade/tradeRecordList'), { immediate: true })

</script>
