<template>
    <confirm-subscribe
        v-if='needConfirm && visible'
        :go-on='goOn'
        :payload='payload'
        @callback='handleConfirm'
        @close='handleClose'
    />
    <drawer
        v-else
        :position='isPC ? "center": "left"'
        :show='visible'
        :style='style'
        @close='handleClose'
    >
        <operation-subscribe
            v-if='visible'
            :payload='payload'
            :type='type'
            @close='handleClose'
            @setFirstSub='setFirstSub'
        />
    </drawer>
</template>

<script>
import { computed, onMounted, onUnmounted, reactive, toRefs, watch } from 'vue'
import drawer from '@/plugins/signal/components/drawer.vue'
import operationSubscribe from './operation-subscribe.vue'
import mitt from '@/utils/mitt'
import { useStore } from 'vuex'
import confirmSubscribe from './confirm-subscribe'

export default {
    components: {
        operationSubscribe,
        drawer,
        confirmSubscribe,
    },
    setup (props, { emit }) {
        const store = useStore()
        const state = reactive({
            visible: false,
            type: '', // 操作类型
            payload: {}, // 初始化参数
            needConfirm: false, // 是否需要确认框
            goOn: false, // 是否继续
            firstSub: false // 是否第一次订阅
        })

        const isPC = window.isPC

        // 关闭弹窗
        const handleClose = () => {
            state.visible = false
        }

        // 初始化信息 [订阅类型，数据]
        const initSubscribeSignal = (params = {}) => {
            state.payload = params.payload || {}
            state.type = params.type || ''
            state.visible = true
            state.needConfirm = params.needConfirm || false
            state.goOn = params.goOn || false
        }

        // 监听用户变化
        watch(() => store.state._user?.customerInfo?.id, (val) => {
            if (val) {
                store.dispatch('_signal/queryAllQuotaIndicatorSub')
                store.dispatch('_signal/queryTGInfo')
            }
        }, { immediate: true })

        watch(() => state.visible, (val) => {
            if (!val && state.firstSub) {
                mitt.emit('firstSubscribeSignal')
            }
        })

        const setFirstSub = (value) => {
            state.firstSub = value
        }

        const style = computed(() => {
            return isPC ? {
                minWidth: '450px',
            } : {
                width: '100%',
                minWidth: '320px',
                height: '100%',
                borderRadius: 0
            }
        })

        const handleConfirm = () => {
            state.needConfirm = false
        }

        onMounted(() => {
            // 订阅初始化信息
            const subscribeSignal = mitt.all.get('SubscribeSignal')
            // 如果没订阅过则需要初始化
            if (!Array.isArray(subscribeSignal) || subscribeSignal.length === 0) {
                mitt.on('SubscribeSignal', initSubscribeSignal)
            }
        })

        onUnmounted(() => {
            // 取消订阅初始化信息
            mitt.off('SubscribeSignal', initSubscribeSignal)
        })

        return {
            ...toRefs(state),
            handleClose,
            handleConfirm,
            setFirstSub,
            style,
            isPC
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
