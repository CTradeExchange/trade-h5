<template>
    <customTable
        :data='tableData'
        :loading='loading'
        :options='tableOptions'
        :raw-response='rawResponse'
    />
</template>

<script setup>
import { ref, computed, unref, watch } from 'vue'
import { useStore } from 'vuex'
import customTable from './customTable'
import { tradeRecordList } from '@/api/user'
import { useI18n } from 'vue-i18n'
import { getTransactionColumns } from './tableConfig'
import { useRoute } from 'vue-router'

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
const { t } = useI18n({ useScope: 'global' })
const product = computed(() => store.getters.productActived)
const tradeType = computed(() => unref(product).tradeType)
const loading = ref(false)
const tableOptions = computed(() => {
    return {
    ...props.commonOptions,
    columns: getTransactionColumns(props.tradeType)
    }
})

const tableData = ref([])
// 接口原始数据
const rawResponse = ref({})
// 成交记录
const account = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(unref(tradeType))))
const accountIds = computed(() => account.value.map(e => e.accountId).toString())
const queryRecordList = () => {
    const params = {
        accountIds: unref(accountIds),
        tradeType: Number(unref(tradeType)),
        sortFieldName: 'executeTime',
        sortType: 'desc',
        executeStartTime: window.dayjs(window.dayjs(new Date()).format('YYYY/MM/DD 00:00:00')).valueOf(),
        executeEndTime: window.dayjs(window.dayjs(new Date()).format('YYYY/MM/DD 23:59:59')).valueOf(),
        current: 1,
        size: 10,
    }
    loading.value = true
    tradeRecordList(params)
        .then(res => {
            rawResponse.value = res
            if (res.check()) {
                tableData.value = res.data.list
            }
        })
        .catch(err => {})
        .finally(() => {
            loading.value = false
        })
}

watch(() => route.query.tradeType, queryRecordList, { immediate: true })

</script>
