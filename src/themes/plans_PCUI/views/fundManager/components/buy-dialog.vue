<template>
    <div class='dialog-layer'>
        <el-dialog
            v-model='show'
            :before-close='close'
            :close-on-click-modal='false'
            :title="$t('fundManager.buy.title3')"
            width='520px'
        >
            <el-table v-loading='isLoading' border :cell-style="{ background:'none' }" :data='tableData'>
                <el-table-column align='center' :label="$t('fundManager.buy.title4')" prop='currency' />
                <el-table-column align='center' :label="$t('fundManager.buy.title5')" prop='amount' />
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
import { getFundApplyInfo, confirmFundApply } from '@/api/fund'
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
for (let i = 0; i < 10; i++) {
    tableData.value.push({
        currency: 'ADA/USDT',
        amount: '200USDT'
    })
}

// 获取申购执行信息
const queryFundApplyInfo = () => {
    isLoading.value = true
    getFundApplyInfo({
        companyId: customerInfo.companyId,
        customerNo: customerInfo.customerNo,
        customerGroupId: customerInfo.customerGroupId,
        applyIds: ids.value
    }).then(res => {
        isLoading.value = false
    })
}
// 打开弹窗
const open = (ids = []) => {
    show.value = true
    ids.value = ids
    // 获取申购执行信息
    queryFundApplyInfo()
}
// 关闭弹窗
const close = () => {
    show.value = false
}
// 点击确定
const onConfirm = () => {
    isSubmit.value = true
    confirmFundApply({
        companyId: customerInfo.companyId,
        customerNo: customerInfo.customerNo,
        customerGroupId: customerInfo.customerGroupId,
        applyIds: ids.value,
        fundsApplyExecuteRecordDto: [],
        fundsApplyExecuteRecordDetailDtoList: []
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
    &:deep(.el-table) {
        tbody {
            tr {
                height: 40px;
            }
        }
    }
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
