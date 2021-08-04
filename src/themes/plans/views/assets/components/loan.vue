<template>
    <van-popup v-model:show='show' position='bottom' @closed='closed' @open='onOpen'>
        444
    </van-popup>
</template>

<script>
import { computed, reactive, ref, toRefs, watch, watchEffect } from 'vue'
export default {
    setup (props, { emit }) {
        const state = reactive({
            show: true
        })

        return {
            ...toRefs(state)
        }
    }
}
</script>
