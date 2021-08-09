<template>
    <div class='position-wrap'>
        <p class='header'>
            <span>{{ $t('trade.position') }}({{ positionList?.length }})</span>
            <span class='fr fallColor'>
                {{ userAccount?.profitLoss || '--' }}
            </span>
        </p>

        <van-loading v-if='loading' class='loading' />
        <positionItem
            v-for='(item,index) in positionList'
            v-else
            :key='index'
            :data='item'
            :product='product'
            @showAdjustPopup='showAdjustPopup'
            @showClose='showClose'
            @showSLTP='showSLTP'
        />
    </div>

    <!-- {{ subscribList }} -->

    <!-- 平仓 -->
    <DialogClosePosition
        v-model:show='closeVisible'
        :data='positionData'
        :product='product'
    />
    <!-- 调整保证金 -->
    <DialogAdjustMargin
        v-model:show='adjustVisible'
        :data='positionData'
    />
    <!-- 设置止损止盈 -->
    <DialogSLTP
        v-if='showSetProfit'
        :data='positionData'
        :product='product'
        :show='showSetProfit'
        @update:show='updateSLTPVisible'
    />
</template>

<script>
import { computed, reactive, toRefs, watch, watchEffect } from 'vue'
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

        const tradeType = computed(() => {
            return store.state._quote.curTradeType
        })

        const positionList = computed(() => store.state._trade.positionList[tradeType.value])

        const userAccount = computed(() => store.state._user.accountAssets[tradeType.value])

        const loading = computed(() => store.state._trade.positionLoading)
        const product = computed(() => store.state._quote.productMap[state.positionData?.symbolId + '_' + tradeType.value])

        // 平仓
        const showClose = (data) => {
            store.commit('_quote/Update_productActivedID', data.symbolId + '_' + tradeType.value)
            state.positionData = data
            state.closeVisible = true
            if (!product.value.minVolume) {
                store.dispatch('_quote/querySymbolInfo', { symbolId: data.symbolId, tradeType: tradeType.value })
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
            store.commit('_quote/Update_productActivedID', data.symbolId + '_' + tradeType.value)
        }

        const updateSLTPVisible = (val) => {
            state.showSetProfit = val
        }

        return {
            ...toRefs(state),
            positionList,
            product,
            showAdjustPopup,
            showClose,
            showSLTP,
            updateSLTPVisible,
            tradeType,
            loading,
            userAccount
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
        .fr {
            font-weight: bold;
            font-size: rem(34px);
        }
    }
}
.loading {
    line-height: rem(100px);
    background: var(--contentColor);
}
</style>
