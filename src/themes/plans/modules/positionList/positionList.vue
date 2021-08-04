<template>
    <div class='position-wrap'>
        <!-- <positionItem v-for='item in positionList' :key='item' :data='item' @showClose='showClose' /> -->
        <positionItem v-for='item in 5' :key='item' :data='data' @showClose='showClose' />
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
            positionData: null,
            data: {

                'symbolId': 7,
                'orderId': 121929,
                'dealId': 121929,
                'canReduceMargin': '220924424.1466482662',
                'openPrice': '1.0',
                'remark': 'null',
                'takeProfitDecimal': null,
                'closeNum': 0,
                'closeFee': '0',
                'takeProfit': null,
                'occupyTheMargin': '22092442414.7146266226',
                'interest': '0.0000000000',
                'maintenanceMargin': '0.0498000000',
                'closeVolume': 0,
                'closeTime': 0,
                'openVolume': 3,
                'symbolName': '欧元英镑',
                'closeAccountDigits': 10,
                'openTime': 1627898971222,
                'profit': '-0.0249534000',
                'tradeType': 2,
                'direction': 1,
                'singleMargin': '996000000',
                'openContractSize': 1,
                'margin': null,
                'resp': null,
                'openMargin': '0.2988000000',
                'openNum': 3,
                'closeSymbolDigits': 1,
                'openFee': '0.0515597400',
                'warningMargin': '0.0996000000',
                'stopLossDecimal': null,
                'openSymbolDigits': 1,
                'volume': 3,
                'accountId': 122,
                'companyId': 218,
                'positionId': 202108020006400,
                'closeFreeDigits': null,
                'stopLoss': null,
                'minVolume': null,
                'openAccountDigits': 10,
                'closePrice': '0',
                'status': '1',
                'profitLoss': 45454.155

            }
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
