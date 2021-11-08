<template>
    <customTable
        :data='tableData'
        :options='tableOptions'
    />
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import customTable from './customTable'
import { ElButton, ElMessageBox, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { closePboOrder, closeTradePboOrder } from '@/api/trade'

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
const { t } = useI18n({ useScope: 'global' })
const store = useStore()
const tableData = computed(() => store.state._trade.pendingList[props.tradeType])
const formatTime = val => dayjs(val).format('YYYY-MM-DD HH:mm:ss')
const tableOptions = {
    ...props.commonOptions,
    columns: [
        { name: t('trade.name'), prop: 'symbolName', align: 'left', width: 120 },
        { name: t('trade.direction'), prop: 'direction', align: 'right' },
        { name: t('trade.pendingAmount'), prop: '', align: 'right' },
        { name: t('trade.pendingUnit'), prop: 'requestNum', align: 'right' },
        { name: t('trade.trustPrice'), prop: 'requestPrice', align: 'right' },
        { name: t('trade.currentPrice'), prop: '', align: 'right' },
        { name: t('trade.loan'), prop: 'loanAmount', align: 'right' },
        { name: t('trade.trustTime'), align: 'right', width: 160, formatter: row => formatTime(row.trustTime) },
        { name: t('trade.pendingNo'), prop: 'id', align: 'right', width: 200 },
        {
            name: t('c.handle'),
            width: '120',
            fixed: 'right',
            align: 'right',
            className: 'operate',
            slotsData: {
                default: ({ row }) => {
                    return (
                        <ElButton
                            type='text'
                            onclick={handleCancelOrder.bind(null, row)}
                        >
                            { t('trade.cancelOrder') }
                        </ElButton>
                    )
                }
            }
        },
    ]
}
/** 配置 */
const cancelOrder = (row) => {
    const params = {
        customerNo: row.customerNo,
        customerId: row.customerId,
        accountId: row.accountId,
        tradeType: row.tradeType,
        bizType: row.bizType
    }

    if (Number(row.tradeType) === 9) {
        return closeTradePboOrder({
            orderId: row.id,
            ...params,
        })
            .then(res => res.check())
            .catch(err => {
                console.log(err)
            })
    } else {
        return closePboOrder({
            pboId: row.id,
            ...params,
        })
            .then(res => res.check())
            .catch(err => {
                console.log(err)
            })
    }
}

// 撤单
const handleCancelOrder = (row) => {
    ElMessageBox.confirm(t('trade.cancelPendingOrder'), t('tip'), {
        confirmButtonText: 'OK',
        beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
                instance.confirmButtonLoading = true
                cancelOrder(row)
                    .then((bool) => {
                        if (bool) {
                            ElMessage({
                                type: 'success',
                                message: t('trade.cancelSuccess'),
                            })
                            store.dispatch('_trade/queryPBOOrderPage', {
                                tradeType: row.tradeType,
                                sortFieldName: 'orderTime',
                                sortType: 'desc',
                            })
                        } else {
                            ElMessage({
                                type: 'error',
                                message: t('trade.cancelFail'),
                            })
                        }
                    })
                    .finally(() => {
                        done()
                        instance.confirmButtonLoading = false
                    })
            } else {
                done()
            }
        },
    })
        .then(action => {

        },)
}

</script>

<style lang="scss" scoped>

</style>
