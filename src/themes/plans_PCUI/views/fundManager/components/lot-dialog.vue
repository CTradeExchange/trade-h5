<template>
    <div class='dialog-layer'>
        <el-dialog
            v-model='show'
            :before-close='close'
            :close-on-click-modal='false'
            :title="$t('fundManager.ransom.confirmLot')"
            width='520px'
        >
            <el-table border :cell-style="{ background:'none' }" :data='tableData'>
                <el-table-column align='center' :label="$t('fundManager.ransom.totalLot')" prop='lot' />
                <el-table-column align='center' :label="$t('fundManager.ransom.totalMoney')" prop='amount' />
            </el-table>
            <template #footer>
                <button v-loading='isSubmit' class='confirm-btn' @click='onConfirm'>
                    {{ $t('confirm') }}
                </button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, defineEmits, defineExpose } from 'vue'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['confirm'])
const { t } = useI18n({ useScope: 'global' })
// 是否显示弹窗
const show = ref(false)
// 是否提交中
const isSubmit = ref(false)
// 列表数据
const tableData = ref([])
tableData.value.push({
    lot: '1000USDT',
    amount: '1000'
})

// 打开弹窗
const open = () => {
    show.value = true
}
// 关闭弹窗
const close = () => {
    show.value = false
}
// 点击确定
const onConfirm = () => {
    isSubmit.value = true
    setTimeout(() => {
        Toast(t('c.handleSuccess'))
        isSubmit.value = false
        show.value = false
        emit('confirm')
    }, 2000)
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
