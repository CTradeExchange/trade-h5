import { watch, onUnmounted } from 'vue'
import { QuoteSocket } from '@/plugins/socket/socket'

/** 订阅24小时产品报价 */
export default function (symbolKeys) {
    let unSubscribe = () => {}
    watch(() => symbolKeys.value, (val) => {
        // 增量订阅24H的产品，获取lastPrice
        const value = [...new Set(val)].filter(item => !QuoteSocket.subscribed24HMap['positionList']?.includes(item))
        if (!value.length) return
        unSubscribe = QuoteSocket.add_subscribe24H({ moduleId: 'positionList', symbolKeys: value })
    }, {
        immediate: true
    })

    onUnmounted(() => {
        unSubscribe()
    })
}
