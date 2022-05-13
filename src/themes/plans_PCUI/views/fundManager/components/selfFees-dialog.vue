<template>
    <div class='dialog-layer'>
        <el-dialog
            v-model='show'
            :close-on-click-modal='false'
            :title="type==='fee' ? $t('fundManager.buy.fees') : $t('fundManager.buy.finalMoney')"
            width='520px'
            @open='onOpen'
        >
            <el-table v-loading='isLoading' border :cell-style="{ background:'none' }" :data='tableData'>
                <el-table-column align='center' :label="$t('common.currency')" prop='currency' />
                <el-table-column align='center' :label="type==='fee' ? $t('fundManager.buy.fees') : $t('fundManager.buy.finalMoney')">
                    <template #default='scope'>
                        <span>{{ type==='fee' ? scope.row.fees : scope.row.amount }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <template #footer>
                <button class='confirm-btn' @click='onConfirm'>
                    {{ $t('confirm') }}
                </button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { getFundCurrencyList } from '@/api/fund'
import { ref, computed, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
    modelValue: Boolean,
    data: Object,
    type: String,
})
const emit = defineEmits(['confirm', 'update:modelValue'])
const { t } = useI18n({ useScope: 'global' })

// 是否显示弹窗
const show = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val)
})

const isLoading = ref(false)

// 列表数据
const tableData = ref([])

// 打开弹窗
const onOpen = () => {
    tableData.value = []
    tableData.isLoading = true
    getFundCurrencyList({
        'proposalNo': props.data.proposalNo
    }).then(res => {
        tableData.isLoading = false
        if (res.check()) {
            tableData.value = res.data
        }
    }).catch(() => {
        tableData.isLoading = false
    })
}

// 点击确定
const onConfirm = () => {
    emit('update:modelValue', false)
}

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
        align-items: center;
        justify-content: center;
        width: 320px;
        height: 48px;
        margin: 0 auto;
        color: #FFF;
        font-size: 16px;
        background: var(--primary);
        border-radius: 24px;
        cursor: pointer;
        &:hover {
            opacity: 0.9;
        }
    }
}
</style>
