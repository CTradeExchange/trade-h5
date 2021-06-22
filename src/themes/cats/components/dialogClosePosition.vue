<template>
    <van-popup v-model:show='showCP' class='m-dialog m-dialogPc' position='bottom' transition-appear='false'>
        <div class='dialog-header'>
            <div class='title'>
                <p class='productName'>
                    {{ data.symbolName }}
                </p><p class='lot'>
                    {{ data.symbolName }}
                </p>
            </div>
            <div class='right' @click='close'>
                <i class='icon_icon_close_big'></i>
            </div>
        </div><div class='dialog-body'>
            <div class='inputNumber'>
                <div class='left'>
                    <div class='name'>
                        {{ $t('trade.hold') }}
                    </div><div class='val'>
                        <span :class="Number(data.direction) === 1 ? 'riseColor' : 'fallColor'">
                            {{ Number(data.direction) === 1 ? $t('trade.buy') :$t('trade.sell') }}
                        </span> {{ positionVolume }} {{ $t('trade.volumeUnit') }}
                    </div>
                </div><div class='right'>
                    <div>
                        <div class='name'>
                            {{ $t('trade.positionPrice') }}
                        </div><div>
                            {{ data.openPrice }}
                        </div>
                    </div><div class='line'>
                        <div class='lineInfo van-hairline--bottom'>
                            4269.7  点
                        </div>
                    </div><div>
                        <div class='name'>
                            {{ $t('trade.currentPrice') }}
                        </div><div class='riseColor'>
                            {{ Number(data.direction) === 1 ? product.sell_price : product.buy_price }}
                        </div>
                    </div>
                </div>
            </div><div class='inputNumber'>
                <div class='title'>
                    <div>
                        {{ $t('trade.closedNumHands') }}
                    </div>
                </div>
                <stepper
                    class='stepper'
                    :controlbtn='true'
                    max='100'
                    min='0'
                    :placeholder="$t('trade.positionNum')"
                    :step='1'
                    value='2'
                    @change='change'
                />
            </div>
            <div class='pcBtns'>
                <van-tab
                    v-for='item in btns'
                    :key='item.value'
                    :disabled='item.disabled'
                    :name='item.value'
                >
                    <van-button slot='title' round>
                        <template #title>
                            {{ item.title }}
                        </template>
                    </van-button>
                </van-tab>
            </div>
            <div class='info'>
                <div class='row'>
                    <div class='name'>
                        平仓盈亏
                    </div><div class='val'>
                        +42.70 USDT≈  +42.70 USD
                    </div>
                </div><div class='row'>
                    <div class='name'>
                        隔夜利息
                    </div><div class='val'>
                        -6.63 USD
                    </div>
                </div><div class='row'>
                    <div class='name'>
                        手续费
                    </div><div class='val'>
                        0.00 USD
                    </div>
                </div><div class='row'>
                    <div class='name'>
                        平仓净盈亏
                    </div><div class='val'>
                        <span class='riseColor'>
                            {{ data.profitLoss }}
                        </span>
                        {{ customerInfo.currency }}
                    </div>
                </div>
            </div>
        </div><div class='dialog-footer'>
            <van-button

                color='#477FD3'
                :loading='loading'
                @click='submit'
            >
                {{ $t('trade.confirmClose') }}
            </van-button>
        </div>
    </van-popup>
</template>

<script>
import { reactive, toRefs, watch, computed, watchEffect, onUnmounted } from 'vue'
import { minus } from '@/utils/calculation'
import { useStore } from 'vuex'
export default {
    props: ['cpVis', 'data'],
    setup (props, context) {
        const store = useStore()
        const fastBtns = [
            { title: '全部', value: 1 },
            { title: '1/2', value: 0.5 },
            { title: '1/3', value: 1 / 3 },
            { title: '1/4', value: 0.25 }
        ]
        const state = reactive({
            showCP: true
        })
        const customerInfo = computed(() => store.state._user.customerInfo)
        const positionVolume = computed(() => minus(props.data.openVolume, props.data.closeVolume))
        const product = computed(() => store.state._quote.productMap[props.data.symbolId])
        const close = () => {
            context.emit('update:show', false)
        }

        const change = () => {

        }

        watchEffect(() => (state.showCP = props.show))

        return {
            ...toRefs(state),
            close,
            product,
            positionVolume,
            change,
            customerInfo
        }
    }
}
</script>

<style lang="scss">
@import '~@/sass/mixin.scss';
.m-dialogPc {
    z-index: 1000;
    height: rem(740px);
    &.pc {
        width: 400px;
        height: 600px;
        border-radius: 6px;
        .dialog-footer {
            position: absolute;
            right: 20px;
            bottom: 20px;
            left: 20px;
            .van-button {
                border-radius: 2px;
            }
        }
        .dialog-header {
            .title {
                padding: 0 60px;
                .productName {
                    @include single-line-clamp();
                }
            }
        }
    }
    .errorFixedTip {
        top: 57px !important;
        width: 100%;
        height: rem(50px);
        color: #E3525C;
        font-size: rem(24px);
        line-height: rem(50px);
        text-align: center;
        background: rgba(255, 240, 226, 1);
    }
    .lot {
        color: #999;
        font-size: rem(20px);
        text-align: center;
    }
    .dialog-body {
        .pcBtns {
            padding-bottom: rem(30px);
            text-align: right;
            .van-tabs__wrap {
                height: rem(60px);
            }
            .van-tabs__nav--card {
                height: rem(60px);
                margin: 0 rem(30px);
            }
            .van-tabs__nav {
                justify-content: flex-end;
                border: none;
            }
            .van-tab {
                flex: none;
                width: rem(120px);
                height: rem(50px);
                margin-left: rem(30px);
                padding: 0;
                border-right: none;
            }
            .van-button {
                width: rem(120px);
                height: rem(50px);
                padding: 0;
                color: #333;
                line-height: rem(50px);
                text-align: center;
                background-color: #F9F9F9;
                border-color: #F9F9F9;
                border-radius: rem(6px);
            }
            .van-tab--active {
                background-color: #FFF;
                .van-button {
                    color: #FFF;
                    background-color: #477FD3;
                    border-color: #477FD3;
                }
            }
        }
        .inputNumber {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 0 rem(40px) rem(40px) rem(35px);
            .title {
                color: #333;
                font-size: rem(28px);
            }
            .stepper {
                &.warn {
                    color: var(--red);
                }
            }
            .tipNumber {
                color: #666;
                font-size: rem(24px);
                &.warn {
                    color: var(--red);
                }
            }
            .tipWords {
                position: absolute;
                bottom: rem(-30px);
                left: rem(330px);
                color: var(--red);
                font-size: rem(24px);
            }
            .name {
                padding-bottom: rem(20px);
                color: #999;
                font-size: rem(20px);
            }
            .left,
            .right {
                font-size: rem(20px);
            }
            .left {
                width: rem(300px);
            }
            .right {
                display: flex;
                flex: 1;
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
