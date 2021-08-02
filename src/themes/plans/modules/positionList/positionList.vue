<template>
    <div class='position-wrap'>
        <positionItem v-for='item in positionList' :key='item' :data='item' @showClose='showClose' />
    </div>
    <DialogClosePosition v-model:show='closeVisible' :data='positionData' :product='product' />
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import positionItem from './positionItem'
import DialogClosePosition from '@plans/components/dialogClosePosition'
export default {
    components: {
        positionItem,
        DialogClosePosition,
    },
    setup (props, { emit }) {
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            closeVisible: false,
            positionData: null
        })

        const positionList = computed(() => store.state._trade.positionList)
        const product = computed(() => store.state._quote.productMap[state.positionData?.symbolId])

        const showClose = (data) => {
            store.commit('_quote/Update_productActivedID', data.symbolId)
            state.positionData = data
            state.closeVisible = true
            if (!product.value.minVolume) {
                store.dispatch('_quote/querySymbolInfo', data.symbolId)
            }
        }

        return {
            ...toRefs(state),
            positionList,
            product,
            showClose,

        }
    }
}
</script>
