<template>
    <bottom-sheet ref='myBottomSheet' @closed='closed'>
        <div class='subscribe-swipe-modal' :style="{ height: '100vh', overflow: 'hidden' }">
            <operation-subscribe v-if='show' :payload='payload' @close='close' />
        </div>
    </bottom-sheet>
</template>

<script setup>
import operationSubscribe from './operation-subscribe.vue'

import bottomSheet from '@/components/bottomSheet'
import { ref, defineExpose, defineProps } from 'vue'

defineProps({
    payload: {
        type: Object,
        default: () => {},
    },
})
const myBottomSheet = ref(null)
const show = ref(false)

const close = () => {
    myBottomSheet.value.close()
}
const open = () => {
    myBottomSheet.value.open()
    show.value = true
}

const closed = () => {
    setTimeout(() => {
        show.value = false
    }, 1000)
}

defineExpose({ open, close })
</script>

<style lang="scss">
.subscribe-swipe-modal {
    .subscribe-title {
        .van-icon {
            display: none;
        }
    }
}
</style>
