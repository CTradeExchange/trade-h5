<template>
    <centerViewDialog
        v-model='dialogVisible'
        class='productSeatchDialog'
    >
        <!-- 头部导航 -->
        <Top
            back
            left-icon='arrow-left'
            :right-action='false'
            show-center
            :title='isAddChoose ? $t("trade.addToOptional") : $t("trade.symbolSearch")'
        >
            <template #right>
                <a class='topBack' href='javascript:;' @click='dialogVisible = false'>
                    <van-icon color='#fff' name='cross' size='22' />
                </a>
            </template>
            <template #left>
                <span></span>
            </template>
        </Top>
        <product-search
            class='product-search'
            :is-add-choose='isAddChoose'
            @item-click='handleItem'
        />
    </centerViewDialog>
</template>

<script>
import { computed, watch } from 'vue'
import centerViewDialog from '@planspc/layout/centerViewDialog'
import productSearch from './productSearch'
import Top from '@/components/top'
import { useStore } from 'vuex'

export default {
    components: {
        centerViewDialog,
        productSearch,
        Top
    },
    props: {
        modelValue: {
            type: Boolean,
            default: true
        },
        /** 是否是自选弹窗 */
        isAddChoose: {
            type: Boolean,
        }
    },
    setup (props, { emit }) {
        const store = useStore()
        const customerInfo = computed(() => store.state._user.customerInfo)

        // 弹窗开关
        const dialogVisible = computed({
            get: () => props.modelValue,
            set: val => emit('update:modelValue', val)
        })

        // 列表点击 关闭弹窗
        const handleItem = () => {
            dialogVisible.value = false
        }

        watch(dialogVisible, () => {
            if (customerInfo.value && dialogVisible.value) {
                store.dispatch('_user/queryCustomerOptionalList')
            }
        })

        return {
            dialogVisible,
            handleItem
        }
    }
}
</script>

<style lang="scss" scoped>
.product-search {
    padding: 0 0 20px;
}
</style>
