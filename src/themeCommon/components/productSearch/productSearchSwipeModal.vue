<template>
    <bottom-sheet ref='myBottomSheet' @closed="$store.commit('_trade/Update_productSearchVisible', false)">
        <div :style="{ height: '100vh', overflow: 'hidden' }">
            <productSearch :on-select='props.onSelect' />
        </div>
    </bottom-sheet>
</template>

<script setup>
import productSearch from './index'
import bottomSheet from '@/components/bottomSheet'
import { useStore } from 'vuex'
import { computed, ref, watch, defineProps } from 'vue'
const props = defineProps({
    onSelect: {
        type: Function
    }
})
const myBottomSheet = ref(null)
const store = useStore()
const productSearchVisible = computed(() => store.state._trade.productSearchVisible)

watch(
    () => productSearchVisible.value,
    (val) => {
        if (val) {
            myBottomSheet.value.open()
        } else {
            myBottomSheet.value.close()
        }
    },
)
</script>
