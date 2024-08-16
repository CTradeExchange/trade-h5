<template>
    <div v-if='positionList.length > 0' class='position-wrap pb-25'>
        <van-loading v-if='loading && showHeader' class='loading' />

        <positionItem
            v-for='item in positionList'
            :key='item.positionId'
            :data='item'
            @showAdjustPopup='showAdjustPopup'
            @showClose='showClose'
            @showMultiplePopup='showMultiplePopup'
            @showPositionInfo='showPositionInfo'
            @showSLTP='showSLTP'
        />
    </div>

    <template v-else>
        <div v-if='!$store.state._user.customerInfo' class='flex justify-center py-20 text-sm'>
            <router-link class='px-1 text-primary cursor-pointer' to='/login'>
                {{ `${$t('c.login')} / ${$t('c.register')}` }}
            </router-link>
        </div>
        <div v-else-if='Number(userAccount?.availableMargin) === 0' class='flex flex-col py-10 justify-center items-center'>
            <div class='text-base font-bold'>
                {{ $t('headLineTrade.noAssetsTips') }}
            </div>
            <div class='text-sm text-minorColor mt-1'>
                {{ $t('register.goDepositStartTrading') }}
            </div>
            <img class='my-4 cursor-pointer w-10 h-10' src='/images/deposit.svg' @click='deposit' />
            <div class='text-sm'>
                {{ $t('trade.deposit') }}
            </div>
        </div>

        <van-empty v-else image='/images/empty.png' :image-size='100'>
            <div class='text-center font-bold text-base'>
                {{ $t('trade.noPositions') }}
            </div>
            <div class='text-sm text-minorColor text-center mb-4 mt-1'>
                {{ $t('register.goDepositStartTrading') }}
            </div>
            <van-button v-if='showTradeBtn' type='primary' @click='onTrade'>
                {{ $t('common.startTrade') }}
            </van-button>
        </van-empty>
    </template>

    <!-- 平仓 -->
    <ClosePosition ref='closePosition' />
    <!-- 调整保证金 -->
    <DialogAdjustMargin v-model:show='adjustVisible' :data='positionData' />
    <!-- 设置止损止盈 -->
    <ProfitlossSetPopup
        ref='profitlossSetPopup'
    />
    <!--  -->
    <MultipleSet
        v-if='product && product.tradeType === 2'
        v-model='multipleSetVisible'
        v-model:multipleVal='mVal'
        :position='positionData'
        :product='product'
        @save='saveMultiple'
    />
    <MultipleSetCross
        v-if='product && product.tradeType === 1'
        v-model='multipleSetVisible'
        v-model:multipleVal='mVal'
        :position='positionData'
        :product='product'
        @save='saveMultiple'
    />

    <van-popup
        v-if='selectPosition'
        v-model:show='positionInfoVisible'
        class='m-dialog m-dialogZyzs custom-popup'
        closeable
        :duration='0.2'
        get-container='body'
        position='bottom'
        round
        teleport='body'
        :transition-appear='true'
        @closed='closed'
        @open='open'
    >
        <div class='selected-position-box'>
            <div class='selected-position-title'>
                <span>{{ 'Transaction Details' }}</span>
            </div>

            <van-cell :title="$t('trade.positionPrice')" :value='selectPosition?.openPrice' />
            <van-cell :title="$t('trade.leverage')" :value="selectPosition?.crossLevelNum + 'X'" />
            <van-cell :title="$t('trade.postionSize')" :value='formatAmount(selectPosition.currentTradeAmount)' />
            <van-cell :title="$t('trade.previewStopPrice')" :value="selectPosition.previewStopPrice || '--'" />
            <van-cell :title="$t('trade.swap_2')" :value='setCurrencyUnit()' />
        </div>

        <div class='dialog-footer'>
            <van-button @click='closePositionInfo'>
                {{ $t('confirm') }}
            </van-button>
        </div>
    </van-popup>
</template>

<script>
import { computed, reactive, toRefs, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import positionItem from './positionItem'
import ClosePosition from '@/themeCommon/components/trade/close-position.vue'
import DialogAdjustMargin from '@plans/components/dialogAdjustMargin'
import ProfitlossSetPopup from '@/themeCommon/components/trade/profitlossSetPopup'
import MultipleSet from '@plans/components/multipleSet'
import MultipleSetCross from '@plans/components/multipleSetCross'
import useTradeHooks from '@/hooks/trade/index.js'
import useMethods from '@plans/hooks/useMethods'
import useSubscribe24H from '@/hooks/product/useSubscribe24H.js'
import { useAssets } from '@/hooks/assets'

export default {
    components: {
        positionItem,
        MultipleSet,
        MultipleSetCross,
        ClosePosition,
        DialogAdjustMargin,
        ProfitlossSetPopup,
    },
    props: {
        // 是否显示头部标题
        showHeader: {
            type: Boolean,
            default: true,
        },
        // 是否显示交易按钮
        showTradeBtn: {
            type: Boolean,
            default: true,
        },
    },
    setup (props, { emit }) {
        const store = useStore()
        const router = useRouter()
        const { checkOrderStatusFn } = useTradeHooks()
        const { toOrderPriority } = useMethods()
        const assets = useAssets()
        const closePosition = ref(null)
        const profitlossSetPopup = ref(null)

        const state = reactive({
            closeVisible: false,
            adjustVisible: false,
            multipleSetVisible: false,
            positionInfoVisible: false,
            mVal: '',
            positionData: null,
            showSetProfit: false,
            selectPosition: null,
        })

        // 获取玩法列表
        const tradeType = computed(() => store.state._base.tradeType)

        const positionList = computed(() => store.state._trade.positionList[tradeType.value] ?? [])

        const userAccount = computed(() => store.state._user.accountAssets[tradeType.value])
        const assetsInfo = computed(() =>
            store.state._user.customerInfo.accountList.find((el) => Number(el.tradeType) === Number(tradeType)),
        )

        const loading = computed(() => store.state._trade.positionLoading)
        const product = computed(() => store.state._quote.productMap[state.positionData?.symbolId + '_' + tradeType.value])
        const symbolKeys = computed(() => positionList.value.map((e) => `${e.symbolId}_${tradeType.value}`))
        useSubscribe24H(symbolKeys)

        // 平仓
        const showClose = (data) => {
            state.positionData = data
            closePosition.value.open(data)
        }

        // 调整保证金
        const showAdjustPopup = (data) => {
            checkOrderStatusFn(tradeType.value, data.orderId, 2).then(() => {
                state.positionData = data
                state.adjustVisible = true
            })
        }

        // 设置止盈止损
        const showSLTP = (data) => {
            state.positionData = data
            state.showSetProfit = true
            profitlossSetPopup.value.open(data)
        }

        // 设置杠杆倍数
        const showMultiplePopup = (data) => {
            state.positionData = data
            state.multipleSetVisible = true
            state.mVal = data.crossLevelNum
        }
        // 保存杠杆倍数
        const saveMultiple = (val) => {}

        const updateSLTPVisible = (val) => {
            state.showSetProfit = val
        }

        // 点击开始交易
        const onTrade = () => {
            toOrderPriority(2)
        }

        const setCurrencyUnit = () => {
            return `${state.selectPosition?.interest || '--'}${assetsInfo?.value?.currency ? '(' + assetsInfo.value.currency + ')' : ''}`
        }

        // 跳转到划转页面
        const toTransfer = () => {
            router.push({
                path: '/transfer',
                query: {
                    tradeType: 5,
                },
            })
        }

        const deposit = () => {
            router.push({
                path: '/deposit',
            })
        }

        // 弹出订单的详细信息
        const showPositionInfo = (item) => {
            state.selectPosition = item
            state.positionInfoVisible = true
        }

        // 关闭订单的详细信息
        const closePositionInfo = () => {
            state.selectPosition = null
            state.positionInfoVisible = false
        }

        const formatAmount = (amount) => {
            if (!amount || !assets.value) return '--'
            return `${amount} ${assets.value.currency}`
        }

        return {
            ...toRefs(state),
            positionList,
            product,
            tradeType,
            loading,
            userAccount,
            showAdjustPopup,
            showClose,
            showSLTP,
            showMultiplePopup,
            updateSLTPVisible,
            saveMultiple,
            onTrade,
            toTransfer,
            showPositionInfo,
            formatAmount,
            setCurrencyUnit,
            closePositionInfo,
            deposit,
            closePosition,
            profitlossSetPopup
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.none-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: rem(160px) 0;
    margin: rem(20px) 0;
    background: var(--contentColor);
    border-radius: 4px;
    button {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: rem(200px);
        height: rem(72px);
        padding: 0 rem(20px);
        color: #fff;
        background: var(--primary);
        border-radius: rem(10px);
    }
    .tip {
        margin-bottom: rem(25px);
        font-size: rem(27px);
        letter-spacing: 1px;
        color: var(--minorColor);
    }
}
.position-wrap {
    background-color: var(--contentColor);
    .header {
        display: flex;
        justify-content: space-between;
        padding: 0 rem(30px);
        color: var(--color);
        font-size: rem(28px);
        line-height: rem(100px);
        border-bottom: solid rem(1px) var(--lineColor);
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
.van-empty {
    border-radius: rem(6px);
}
.selected-position-box {
    // padding-top: 30px;
    .selected-position-title {
        padding: 20px 0;
        & > span {
            color: #333;
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
            line-height: 16px; /* 100% */
        }
    }
    :deep {
        .van-cell {
            padding: 0;
            margin-bottom: 16px;
            &::after {
                border: none;
            }
        }
        .van-cell__title {
            span {
                color: #999;
                text-align: right;
                font-family: 'Inter';
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
            }
        }
        .van-cell__value {
            span {
                color: #000;
                text-align: right;
                font-family: 'Inter';
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
            }
        }
    }
}
</style>
