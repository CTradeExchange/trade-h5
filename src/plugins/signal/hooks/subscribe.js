import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import SignalEvent from '@/plugins/signal/utils/signalEvent'

export default function () {
    const store = useStore()
    const signalId = ref(null)
    const unread = ref(0)

    // 已经订阅的列表
    const subscribeMap = computed(() => {
        return store.getters['_signal/getSubscribeList']
    })

    function resetUnread () {
        unread.value = 0
    }

    function initSignal () {
        signalId.value = SignalEvent.onSignal({}, (evt) => {
            evt.forEach((item) => {
                // 排除非订阅的信号
                if (!subscribeMap.value[item.sy + item.i + item.pe]) {
                    return
                }
                unread.value += 1
            })
        })
    }

    function uninstallSignal () {
        resetUnread()
        signalId.value && SignalEvent.offSignal(signalId.value)
        signalId.value = null
    }

    // 如果订阅数据变化则清零
    watch(() => subscribeMap.value, (newVal) => {
        resetUnread()
    }, { deep: true })

    return {
        unread,
        initSignal,
        uninstallSignal
    }
}
