<template>
    <van-popup
        v-model:show='showDialog'
        class='m-dialog m-dialogZyzs'
        get-container='body'
        :position="isPC?'center':'bottom'"
        @closed='close'
        @open='open'
    >
        <template v-if='showDialog'>
            <div class='dialog-header'>
                <div class='title'>
                    <p class='productName'>
                        现货白银
                    </p>
                </div>
                <div class='right' @click='close'>
                    <i class='icon_icon_close_big'></i>
                </div>
            </div>
            <div class='dialog-body'>
                <div class='inputNumber'>
                    <div class='left'>
                        <div class='name'>
                            {{ $t('trade.hold') }}
                        </div>
                        <div class='val'>
                            <span
                                class='riseColor'
                            >
                                卖出
                            </span>
                            0.1 {{ $t('trade.volumeUnit') }}
                        </div>
                    </div>
                    <div class='right'>
                        <div>
                            <div class='name'>
                                {{ $t('trade.positionPrice') }}
                            </div>
                            <div>51.55488</div>
                        </div>
                        <div class='line'>
                            <div class='lineInfo van-hairline--bottom'>
                                7545
                            </div>
                        </div>
                        <div>
                            <div class='name'>
                                {{ $t('trade.currentPrice') }}
                            </div>
                            <div class='sell_color'>
                                21.555
                            </div>
                        </div>
                    </div>
                </div>
                <!-- <profit-loss
                        ref='profitLoss'
                        v-model='setData'
                        class='mtop'
                        :digits='product.groupSymbol.digits'
                        :direction="direction === 1 ? 'buy' : 'sell'"
                        from='zyzs'
                        :open-price='orderinfo.open_price'
                        :position-close-price="isPosition ? positionClosePrice : ''"
                        :product='orderinfo'
                        :volume='orderinfo.volume'
                    /> -->
            </div>
            <div class='dialog-footer'>
                <van-button color='#477FD3' @click='submit'>
                    {{ $t('save') }}
                </van-button>
            </div>
        </template>
    </van-popup>
</template>

<script>
import { reactive, toRefs, watch, watchEffect, onUnmounted } from 'vue'
export default {
    props: ['show'],
    setup (props, context) {
        const state = reactive({
            showDialog: false
        })

        watchEffect(() => (state.showDialog = props.show))

        const close = () => {
            context.emit('update:show', false)
        }

        return {
            ...toRefs(state),
            close
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.m-dialogZyzs {
    height: rem(630px);
    overflow-y: visible;
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

                }
            }
        }
    }
    .lot {
        color: #999;
        font-size: rem(20px);
        text-align: center;
    }
    .dialog-body {
        overflow-y: visible;
        ::v-deep {
            .layout-1 {
                padding-bottom: rem(30px);
            }
        }
        .mtop {
            padding: 0 rem(40px);
        }
        .inputNumber {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 0 rem(40px) rem(20px) rem(35px);
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
                width: rem(200px);
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
    }
}
</style>
