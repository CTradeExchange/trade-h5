<template>
    <!-- <watchlist v-if="module === 'watchlist'" /> -->
    <offer v-if="module === 'offer'" @onclose='handleClose' />
    <events v-else-if="module === 'event'" />
    <funds v-else-if="module === 'funds'" @onclose='handleClose' />
    <product-detail-signal
        v-else-if="module === 'signal'"
        :symbol-code='product?.symbolCode'
        :symbol-name='product?.symbolName'
        @onclose='handleClose'
    />
</template>

<script>
import { computed } from 'vue'

import watchlist from './components/watchlist/index.vue'
import offer from './offer.vue'
import events from './events.vue'
import funds from './funds.vue'
import { useStore } from 'vuex'
import productDetailSignal from '@/plugins/signal/modules/product-detail-signal.vue'

export default {
    components: {
        watchlist,
        offer,
        funds,
        events,
        productDetailSignal,
    },
    props: {
        module: String,
    },
    emits: ['update:module'],
    setup (props, { emit }) {
        const store = useStore()
        const product = computed(() => store.getters.productActived)
        // 关闭页面
        const handleClose = () => {
            emit('update:module', '')
        }

        return {
            handleClose,
            product,
        }
    },
}
</script>

<style lang="scss" scoped></style>
