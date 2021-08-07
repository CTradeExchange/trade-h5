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
            v-for='item in positionList'
            v-else
            :key='item'
            :data='item'
            :product='product'
            @showAdjustPopup='showAdjustPopup'
            @showClose='showClose'
            @showSLTP='showSLTP'
        />
    </div>

    <!-- {{ subscribList }} -->

    <!-- 平仓 -->
    <DialogClosePosition v-model:show='closeVisible' :data='positionData' :product='product' />
    <!-- 调整保证金 -->
    <DialogAdjustMargin v-model:show='adjustVisible' :data='positionData' />
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
import { QuoteSocket } from '@/plugins/socket/socket'
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

        const tradeType = computed(() => store.state._quote.curTradeType)

        watchEffect(() => {
            // 获取持仓列表 并订阅报价

            if ([1, 2].indexOf(Number(tradeType.value)) > -1) {
                store.dispatch('_trade/queryPositionPage', { tradeType: tradeType.value }).then(res => {
                    state.loading = false
                    if (res.check()) {
                        const subscribList = positionList.value.map(el => {
                            return {
                                symbolId: el.symbolId,
                                tradeType: tradeType.value
                            }
                        })
                        QuoteSocket.send_subscribe(subscribList)
                    }
                }).catch(() => {
                    state.loading = false
                })
            }
        })

        const positionList = computed(() => store.state._trade.positionList[tradeType.value])

        const userAccount = computed(() => store.state._user.accountAssets[tradeType.value])

        const loading = computed(() => store.state._trade.positionLoading)
        const product = computed(() => store.state._quote.productMap[state.positionData?.symbolId + '_' + tradeType.value]) // state.positionData?.symbolId

        // 订阅报价
        /*  const subscribList = computed(() => {
            const caa = positionList.value?.map(item => {
                return { tradeTtype: tradeType.value, Symbol: item.symbolId }
            })

            return caa
        }) */

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
            debugger
            state.positionData = data
            state.showSetProfit = true
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
        border-bottom: solid 1px var(--lineColor);
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
