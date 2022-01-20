<template>
    <div class='dialog-layer'>
        <el-dialog
            v-model='show'
            :before-close='close'
            :close-on-click-modal='false'
            :title="$t('fundManager.ransom.confirmLot')"
            width='520px'
        >
            <el-table v-loading='isLoading' border :cell-style="{ background:'none' }" :data='tableData'>
                <el-table-column align='center' :label="$t('fundManager.ransom.totalLot')" prop='lot' />
                <el-table-column align='center' :label="$t('fundManager.ransom.totalMoney')" prop='amount' />
            </el-table>
            <template #footer v-if='!isLoading'>
                <button v-loading='isSubmit' class='confirm-btn' @click='onConfirm'>
                    {{ $t('confirm') }}
                </button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { getFundRedeemInfo, confirmFundRedeem } from '@/api/fund'
import { ref, unref, computed, defineEmits, defineExpose } from 'vue'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['confirm'])
const store = useStore()
const { t } = useI18n({ useScope: 'global' })

// 用户信息
const customerInfo = unref(computed(() => store.state._user.customerInfo))
// 是否显示弹窗
const show = ref(false)
// 是否加载中
const isLoading = ref(false)
// 是否提交中
const isSubmit = ref(false)
// 基金产品id集合
const ids = ref([])
// 列表数据
const tableData = ref([])
tableData.value.push({
    lot: '1000USDT',
    amount: '1000'
})

// 获取基金产品赎回信息
const queryFundRedeemInfo = () => {
    isLoading.value = true
    getFundRedeemInfo({
        customerNo: customerInfo.customerNo,
        fundIdList: ids.value
    }).then(res => {
        isLoading.value = false
    })
}
// 打开弹窗
const open = (ids = []) => {
    show.value = true
    ids.value = ids
    // 获取基金产品赎回信息
    queryFundRedeemInfo()
}
// 关闭弹窗
const close = () => {
    show.value = false
}
// 点击确定
const onConfirm = () => {
    isSubmit.value = true
    confirmFundRedeem({
        customerNo: customerInfo.customerNo,
        fundIdList: ids.value
    }).then(res => {
        isSubmit.value = false
        if (res.check()) {
            setTimeout(() => {
                show.value = false
                Toast(t('c.handleSuccess'))
                emit('confirm')
            }, 2000)
        }
    })
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>
.dialog-layer {
    .confirm-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 320px;
        height: 48px;
        margin: 0 auto;
        font-size: 16px;
        color: #fff;
        background: var(--primary);
        border-radius: 24px;
        cursor: pointer;
        &:hover {
            opacity: .9;
        }
    }
}
</style>
