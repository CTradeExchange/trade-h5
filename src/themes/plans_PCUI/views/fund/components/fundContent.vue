<template>
    <div class='fund-content'>
        <fundInfo :fund='fund' />
        <div class='fundInformation'>
            <fundInformation :key='key' :fund-id='fund.fundId' jump='push' />
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineAsyncComponent, watch } from 'vue'
import fundInfo from './fundInfo.vue'
import LoadingComponent from '@/components/loadingComponent'

const props = defineProps({
    fund: {
        type: Object,
        default: () => {}
    }
})

// 组件key值
const key = ref('')
// 监听fundId
watch(() => props.fund.fundId, () => {
    key.value = Date.now()
})

const fundInformation = defineAsyncComponent({
    loader: () => import('@planspc/components/fundInformation'),
    loadingComponent: LoadingComponent,
    delay: 0, // 在显示 loadingComponent 之前的延迟 | 默认值：200（单位 ms）
    suspensible: false
})
</script>

<style lang="scss" scoped>
.fundInformation {
    padding: 0 25px;
}
</style>
