<template>
    <div class='position-wrap'>
        <p class='header'>
            <span>持仓（{{ positionList?.length }}）</span>
            <span class='fr fallColor'>
                +354512.00 USD
            </span>
        </p>
        <positionItem
            v-for='item in positionList'
            :key='item'
            :data='item'
            @showAdjustPopup='showAdjustPopup'
            @showClose='showClose'
            @showSLTP='showSLTP'
        />
    </div>

    <!-- 平仓 -->
    <DialogClosePosition v-model:show='closeVisible' :data='positionData' :product='product' />
    <!-- 调整保证金 -->
    <DialogAdjustMargin v-model:show='adjustVisible' :data='positionData' />
    <!-- 设置止损止盈 -->
    <DialogSLTP
        :data='positionData'
        :product='product'
        :show='showSetProfit'
        @update:show='updateSLTPVisible'
    />
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import positionItem from './positionItem'
import DialogClosePosition from '@plans/components/dialogClosePosition'
import DialogAdjustMargin from '@plans/components/dialogAdjustMargin'
import DialogSLTP from '@plans/components/dialogSLTP'
export default {
    components: {
        positionItem,
        DialogClosePosition,
        DialogAdjustMargin,
        DialogSLTP
    },
    setup (props, { emit }) {
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            closeVisible: false,
            adjustVisible: false,
            positionData: null,
            showSetProfit: false
        })

        const positionList = computed(() => store.state._trade.positionList[1])
        const product = computed(() => store.state._quote.productMap['35_3']) // state.positionData?.symbolId

        // 平仓
        const showClose = (data) => {
            store.commit('_quote/Update_productActivedID', data.symbolId)
            state.positionData = data
            state.closeVisible = true
            if (!product.value.minVolume) {
                store.dispatch('_quote/querySymbolInfo', data.symbolId)
            }
        }

        // 调整保证金
        const showAdjustPopup = (data) => {
            state.positionData = data
            state.adjustVisible = true
        }

        // 设置止盈止损
        const showSLTP = (data) => {
            state.positionData = data
            state.showSetProfit = true
        }

        const updateSLTPVisible = (val) => {
            state.showSetProfit = val
        }

        store.dispatch('_trade/queryPositionPage', { tradeType: 1 })

        store.dispatch('_trade/queryPBOOrderPage', { tradeType: 2 })

        return {
            ...toRefs(state),
            positionList,
            product,
            showAdjustPopup,
            showClose,
            showSLTP,
            updateSLTPVisible

        }
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.position-wrap {
    background-color: var(--contentColor);
    .header {
        display: flex;
        justify-content: space-between;
        padding: 0 rem(30px);
        color: var(--color);
        font-size: rem(28px);
        line-height: rem(100px);
        border-bottom: solid 1px var(--lineColor);
        .fr {
            font-weight: bold;
            font-size: rem(34px);
        }
    }
}
</style>
