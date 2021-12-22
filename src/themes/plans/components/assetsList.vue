<template>
    <van-popup
        v-model:show='popupShow'
        class='custom-popup'
        duration='0.3'
        position='bottom'
        round
    >
        <div class='header'>
            <div class='header-title'>
                {{ $t('common.lang') }}
            </div>
            <i class='icon_guanbi' @click='close'></i>
        </div>
        <div class='popup-wrap'>
            4555
        </div>
    </van-popup>
</template>

<script>
import Top from '@/components/top'
import { onBeforeMount, computed, reactive, toRefs, onUnmounted } from 'vue'
export default {
    props: ['show'],
    setup (props, context) {
        const state = reactive({
            popupShow: props.show
        })
        const close = () => {
            context.emit('update:show', false)
        }
        return {
            close,
            ...toRefs(state)
        }
    },
}
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';

</style>
