<template>
    <van-popup
        v-model:show='showCP'
        class='m-dialogPC custom-popup'
        :duration='0.2'
        position='bottom'
        round
        teleport='body'
        :transition-appear='true'
        @closed='closed'
    >
        <div v-if='!!closeVolumeWarn' class='floatTip'>
            {{ closeVolumeWarn }}
        </div>
        <div class='header'>
            <div class='header-title'>
                {{ data.symbolName }}
            </div>
            <i class='icon_guanbi' @click='$emit("update:show",false)'></i>
        </div>
        <div class='dialog-body'>
            <div class='left'>
                <div class='val'>
                    <span class='direction' :class="Number(data.direction) === 1 ? 'riseColor' : 'fallColor'">
                        {{ Number(data.direction) === 1 ? $t('trade.buyShort') :$t('trade.sellShort') }}
                    </span>
                    {{ positionVolume }} {{ $t('trade.volumeUnit') }}
                </div>
            </div>
            <div class='inputNumber'>
                <div class='right'>
                    <div>
                        <div class='name'>
                            {{ $t('trade.positionPrice') }}
                        </div>
                        <div class='open-price'>
                            {{ data.openPrice }}
                        </div>
                    </div>
                    <!-- <div class='line'>
                        <div class='lineInfo van-hairline--bottom'>
                            4269.7  点
                        </div>
                    </div> -->
                    <div>
                        <div class='name alignRight'>
                            {{ $t('trade.currentPrice') }}
                        </div>
                        <div :class='[Number(data.direction) === 1 ? product.sell_color : product.buy_color]'>
                            {{ Number(data.direction) === 1 ? product.sell_price : product.buy_price }}
                        </div>
                    </div>
                </div>
            </div>
            <div class='inputNumber'>
                <div class='title'>
                    <div>
                        {{ $t('trade.closedNumHands') }}
                    </div>
                </div>
                <Stepper
                    v-model='closeVolume'
                    class='stepper'
                    :digits='volumeDigit'
                    :placeholder="$t('trade.positionNum')"
                    :step='product.volumeStep'
                    @change='change'
                />
            </div>
            <div class='pcBtns'>
                <a
                    v-for='(item,i) in fastBtns'
                    :key='i'
                    class='item'
                    :class='{ active:item.activeIndex===fastBtnIndex }'
                    href='javascript:;'
                    @click='fastVolumeHandler(item)'
                >
                    {{ item.title }}
                </a>
            </div>
            <div class='info'>
                <!-- <div class='row'>
                    <div class='name'>
                        {{ $t('trade.closeProfit') }}
                    </div>
                    <div class='val'>
                        {{ data.profitLoss>0 ? data.profitLoss : data.profitLoss }} {{ customerInfo.currency }}
                    </div>
                </div> -->
                <!-- <div class='row'>
                    <div class='name'>
                        {{ $t('trade.swap') }}
                    </div>
                    <div class='val'>
                        -- {{ customerInfo.currency }}
                    </div>
                </div> -->
                <div v-if='data.closeFreeDigits' class='row'>
                    <div class='name'>
                        {{ $t('trade.fee') }}
                    </div>
                    <div class='val'>
                        {{ data.closeFreeDigits + customerInfo.currency }}
                    </div>
                </div>
            </div>
        </div>
        <div class='dialog-footer'>
            <van-button
                block
                class='pcHandler'
                :loading='loading'
                @click='submitCloseHandler'
            >
                {{ $t('trade.confirmClose') }}
            </van-button>
        </div>
    </van-popup>
    <Loading :show='loading' />
</template>

<script>
import { reactive, toRefs, computed, watchEffect, onMounted } from 'vue'
import { div, eq, getDecimalNum, gt, lt, minus, mul, toFixed } from '@/utils/calculation'
import { useStore } from 'vuex'
import Stepper from '@plans/components/stepper'
import BigNumber from 'bignumber.js'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { addMarketOrder } from '@/api/trade'
import { Toast } from 'vant'
export default {
    components: {
        Stepper,
    },
    props: ['show', 'product', 'data'],
    emits: ['update:show'],
    setup (props, context) {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const fastBtns = [
            { title: t('trade.allPosition'), activeIndex: 1, divValue: 1 },
            { title: '1/2', activeIndex: 2, divValue: 2 },
            { title: '1/3', activeIndex: 3, divValue: 3 },
            { title: '1/4', activeIndex: 4, divValue: 4 }
        ]
        const state = reactive({
            showCP: true,
            loading: false,
            fastBtnIndex: 1,
            closeVolume: '',
        })

        const account = computed(() => store.state._user.customerInfo.accountList.find(item => Number(item.tradeType) === Number(props.data.tradeType)))
        const customerInfo = computed(() => store.state._user.customerInfo)
        const volumeDigit = computed(() => props.product.numberDigits)
        const positionVolume = computed(() => minus(props.data?.openVolume, props.data?.closeVolume))
        const positionVolumeMin = computed(() => props.product.minVolume)
        const closeVolumeWarn = computed(() => { // 检测平仓手数是否合法
            const minVolume = props.product?.minVolume ?? 0
            const closeVolume = state.closeVolume
            const mod = BigNumber(closeVolume).mod(minVolume).toNumber()
            if (eq(closeVolume, positionVolume.value)) {
                return false
            } else if (lt(closeVolume, minVolume) || gt(closeVolume, positionVolume.value)) {
                return t('trade.volumesOutScope', { min: minVolume, max: positionVolume.value, volumeUnit: t('trade.volumeUnit') })
            } else if (mod > 0) {
                return t('trade.volumesOutScopeTip', { volume: minVolume })
            } else {
                return false
            }
        })

        const change = () => {}

        // 平仓接口参数
        const submitCloseParam = () => {
            if (!state.closeVolume) {
                Toast(t('trade.inputCloseNum'))
                return false
            }
            if (closeVolumeWarn.value) return false
            const requestPrice = props.data.direction === 1 ? props.product.sell_price : props.product.buy_price
            const direction = props.data.direction === 1 ? 2 : 1
            const p = Math.pow(10, props.product.price_digits)
            const params = {
                bizType: 2, // 业务类型。0-默认初始值；1-市价开；2-市价平；3-止损平仓单；4-止盈平仓单；5-爆仓强平单；6-到期平仓单；7-销户平仓单；8-手动强平单；9-延时订单；10-限价预埋单；11-停损预埋单；
                direction, // 订单买卖方向。1-买；2-卖；
                positionId: props.data.positionId,
                symbolId: props.product.symbolId,
                requestTime: Date.now(),
                requestNum: state.closeVolume,
                requestPrice: mul(requestPrice, p),
                expireType: props.data.expireType,
                stopLoss: props.data.stopLoss,
                takeProfit: props.data.takeProfit,
                tradeType: props.data.tradeType,
                accountId: account.value.accountId,
                accountCurrency: account.value.currency,
                accountDigits: account.value.digits
            }
            return params
        }
        // 平仓
        const submitCloseHandler = () => {
            const params = submitCloseParam()
            if (!params) return false
            state.loading = true
            const accountId = customerInfo.value.accountList.find(item => Number(item.tradeType) === Number(props.data.tradeType))?.accountId
            addMarketOrder(params)
                .then(res => {
                    state.loading = false
                    if (res.invalid()) return false
                    const data = res.data
                    const localData = Object.assign({}, params, data)
                    const orderId = data.orderId || data.id
                    sessionStorage.setItem('order_' + orderId, JSON.stringify(localData))
                    // router.push({ name: 'ClosePositionSuccess', query: { orderId } })
                    closed()
                    Toast({
                        message: t('trade.closeSuccessToast'),
                        duration: 1000,
                        forbidClick: true,
                    })
                    store.dispatch('_trade/queryPositionPage', {
                        tradeType: props.data.tradeType,
                        sortFieldName: 'openTime',
                        sortType: 'desc',
                        accountId
                    })
                })
                .catch(err => {
                    state.loading = false
                })
        }
        const closed = () => { // 关闭弹出层且动画结束后触发
            context.emit('update:show', false)
        }

        // 快速设置平仓手数
        const fastVolumeHandler = (item) => {
            const minVolume = props.product.minVolume
            const volumeStep = props.product.volumeStep
            const volumeDigit = getDecimalNum(props.product.minVolume)
            if (BigNumber(positionVolume.value).lte(minVolume)) {
                state.closeVolume = minVolume
            } else {
                const newVolume = toFixed(volumeStep * Math.round((positionVolume.value / volumeStep) / parseFloat(item.divValue)), volumeDigit)
                state.closeVolume = newVolume
            }
        }

        watchEffect(() => {
            state.showCP = props.show
            if (props.show) {
                state.closeVolume = positionVolume.value
            }
        })
        watchEffect(() => { // 根据输入的手数高亮快速平仓手数
            const fastBtnsItem = fastBtns.find(el => {
                const elVolume = div(positionVolume.value, el.divValue)
                if (eq(elVolume, state.closeVolume)) return true
            })
            state.fastBtnIndex = fastBtnsItem ? fastBtnsItem.activeIndex : -1
        })

        return {
            ...toRefs(state),
            fastBtns,
            closed,
            volumeDigit,
            positionVolume,
            positionVolumeMin,
            closeVolumeWarn,
            fastVolumeHandler,
            change,
            submitCloseHandler,
            customerInfo
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.floatTip {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: rem(50px);
    color: var(--warn);
    line-height: rem(50px);
    text-align: center;
    background: #FFF0E2;
    transform: translateY(-100%);
}
.stepper {
    background: var(--assistColor);
    border-radius: rem(6px);
    &.warn {
        color: var(--warn);
    }
}
.dialog-header {
    padding: rem(30px) 0;
    text-align: center;
    .productName {
        color: var(--color);
    }
    .title {
        font-size: rem(32px);
    }
    .lot {
        color: #999;
        font-size: rem(20px);
        text-align: center;
    }
    .right {
        position: absolute;
        top: 0;
        right: 0;
        padding:rem(35px) rem(25px) rem(25px) rem(25px);
        color: var(--normalColor);
        font-size: rem(28px);
    }
}
.pcBtns {
    display: flex;
    justify-content: space-evenly;
    .item {
        display: inline-block;
        width: rem(120px);
        height: rem(45px);
        margin-right: rem(30px);
        color: var(--color);
        line-height: rem(45px);
        text-align: center;
        background: var(--assistColor);
        border-radius: rem(6px);
        flex: 1;
            margin-right: 15px;
            &:last-child{
                margin-right: 0;
         }
        &.active {
            color: #FFF;
            background: var(--primary);
        }
    }
}
.dialog-footer {
    width: 100%;
    padding: rem(30px) 0;
    .pcHandler {
        color: #FFF;
        background: var(--primary);
        border: none;
        border-radius: 0;
        border-radius: rem(6px);
    }
}
.m-dialogPC {
    z-index: 1000;
    overflow: visible;
    .dialog-body {
        flex: none;
        .inputNumber {
            position: relative;
            line-height: 1.45;
            align-items: center;
            margin-bottom: rem(50px);
            .title {
                color: var(--color);
                font-size: rem(28px);
                margin-bottom: rem(24px);
            }
            .tipNumber {
                color: #666;
                font-size: rem(24px);
                &.warn {
                    color: var(--warn);
                }
            }
            .tipWords {
                position: absolute;
                bottom: rem(-30px);
                left: rem(330px);
                color: var(--warn);
                font-size: rem(24px);
            }
            .name {
                color: #999;
                font-size: rem(24px);
            }
            .open-price {
                color: var(--color);
            }

            .right {
                display: flex;
                flex: 1;
                justify-content: space-between;
                .line {
                    position: relative;
                    flex: 1;
                    .lineInfo {
                        margin: 0 rem(40px);
                        padding-top: rem(20px);
                        padding-bottom: rem(10px);
                        text-align: center;
                        border-color: #999;
                    }
                }
            }
        }
         .left {
            width: rem(300px);
            margin-bottom: rem(40px);
            .direction{
                display: inline-block;
                height: rem(36px);
                line-height: rem(40px);
                border-radius: rem(6px);
                color: #fff;
                text-align: center;
                padding: 0 rem(8px);
                font-size: rem(24px);
                margin-right: rem(10px);
                &.riseColor{
                    background: var(--riseColor);
                }
                &.fallColor{
                    background: var(--fallColor);
                }
            }
        }
        .info {
            margin: 0 rem(40px) rem(20px) rem(35px);
            color: #999;
            font-size: rem(20px);
            .row {
                display: flex;
                justify-content: space-between;
            }
            .name {
                padding-bottom: rem(8px);
            }
            .val {
                flex: 1;
                text-align: right;

            }

        }
        .step-2 {
            padding-bottom: rem(60px);
            color: #333;
            font-size: rem(28px);
            text-align: center;
        }
    }
}
</style>

<style lang='scss'>
@import '~@/sass/mixin.scss';
.m-dialogPC {
    z-index: 1000;
    display: flex;
    flex-flow: column;
    overflow: visible;
    background-color: var(--contentColor);
}
</style>
