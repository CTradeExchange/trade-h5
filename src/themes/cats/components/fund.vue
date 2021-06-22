<template>
    <van-popup v-model:show='showFund' class='popup-myAsset' position='top' :style="{ height: '70%' }" :transition-appear='true'>
        <div class='layout-1'>
            <div class='title'>
                {{ $t('route.mine') }}
            </div>

            <div class='warp'>
                <div>
                    <div class='subTitle'>
                        {{ $t('fund.marginLevel') }}
                    </div>
                    <div class='item-3 adequate'>
                        <div class='progress-base'>
                            <div class='progress-color' style='width: 100%;'></div>
                            <div class='number'>
                                {{ accountInfo.marginRadio ?accountInfo.marginRadio+'%' : '--' }}
                            </div>
                        </div>
                    </div>
                    <div class='subTitle'>
                        {{ $t('fund.capitialComponents') }}
                        <span>({{ $t('common.unit') + mainAccount.currency }})</span>
                    </div>
                    <div id='annulus' class='annulus'>
                        {{ $t('common.loading') }}
                    </div>
                    <div class='percent-info'>
                        <div class='item'>
                            <div class='title'>
                                {{ $t('common.yk') }}
                            </div>
                            <div class='val riseColor'>
                                {{ computePrice(accountInfo.profitLoss) }}
                            </div>
                        </div>
                        <div class='item'>
                            <div class='title'>
                                {{ $t('fund.maginable') }}
                            </div>
                            <div class='val val2'>
                                {{ computePrice(accountInfo.availableMargin) }}
                            </div>
                        </div>
                        <div class='item'>
                            <div class='title'>
                                {{ $t('fund.accupyMargin') }}
                            </div>
                            <div class='val val3'>
                                {{ computePrice(accountInfo.occupyMargin) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class='layout-2' @click='hide'>
            <div class='close'>
                <i class='van-icon van-icon-arrow-up'></i>
            </div>
        </div>
    </van-popup>
</template>

<script>
import { reactive, toRefs, onUpdated, watchEffect, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { getArrayObj, priceFormat, isEmpty } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import {
    createTorus
} from '@/plugins/createTorus'
import { divide } from '@/utils/calculation'
export default {
    name: 'Fund',
    props: ['show'],
    setup (props, context) {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const state = reactive({
            showFund: false
        })
        const accountInfo = computed(() => store.state._user.accountAssets)
        watchEffect(() => (state.showFund = props.show))
        const customInfo = computed(() => store.state._user.customerInfo)
        const mainAccount = getArrayObj(customInfo.value.accountList, 'accountId', customInfo.value.accountId)

        const hide = () => {
            context.emit('update:show', false)
        }

        const computePrice = (price,) => {
            return price === '' ? '--' : price
        }

        // 净值计算
        const netWorth = computed(() => {
            if (!isEmpty(accountInfo.value) && !isEmpty(customInfo.value.digits)) {
                return accountInfo.value.netWorth
            }
        })

        onMounted(() => {
            if (accountInfo.value) {
                const earnest = accountInfo.value.occupyMargin

                const netWorthPercent = divide(netWorth.value, parseFloat(netWorth.value + earnest))
                const earnestPercent = divide(earnest, parseFloat(netWorth.value + earnest))

                createTorus({
                    id: 'annulus',
                    width: 210,
                    height: 210,
                    r: 80,
                    arcWidth: 15,
                    label: t('common.jz'),
                    text: netWorth.value || '--',
                    data: [
                        {
                            color: '#477FD3',
                            percent: netWorthPercent || 0,
                            text: 'fss'
                        },
                        {
                            color: '#E3525C',
                            percent: earnestPercent || 0,
                            text: 'sd'
                        },
                    ]
                })
            }
        })

        return {
            ...toRefs(state),
            hide,
            accountInfo,
            mainAccount,
            computePrice
        }
    }
}
</script>

<style lang="scss" >
@import '~@/sass/mixin.scss';
.popup-myAsset {
    background-color: transparent;
    .m-empty {
        padding: rem(100px) 0;
    }
    .layout-1 {
        color: #333;
        background-color: #FFF;
        .warp {
            @include scroll();
            max-height: 70vh;
            padding: rem(30px) rem(40px) rem(30px) rem(40px);
            overflow-y: auto;
        }
        .title {
            padding-top: rem(30px);
            padding-bottom: rem(30px);
            font-size: rem(30px);
            text-align: center;
        }
        .subTitle {
            margin-bottom: rem(30px);
            font-size: rem(28px);
            span {
                padding-left: rem(10px);
                font-size: rem(20px);
            }
        }
        .annulus {
            text-align: center;
        }
        .percent {
            position: relative;
            text-align: center;
        }
        .errorTips {
            margin-bottom: rem(30px);
        }
        .item-1 {
            margin-top: rem(10px);
            margin-bottom: rem(40px);
            text-align: center;
        }
        .item-3 {
            position: relative;
            padding-bottom: rem(20px);
            .progress-base {
                position: relative;
                display: inline-block;
                width: 100%;
                height: rem(10px);
                background-color: #EFEFEF;
                border-radius: rem(5px);
                .progress-color {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 50%;
                    height: rem(10px);
                    border-radius: rem(5px);
                }
                .number {
                    position: absolute;
                    right: 0;
                    bottom: rem(38px);
                    z-index: 20;
                    display: inline-block;
                    font-size: rem(50px);
                }
            }
            &.adequate {
                .progress-base {
                    .progress-color {
                        background-color: #10B873;
                    }
                    .number {
                        color: #10B873;
                    }
                }
            }
            &.less {
                .progress-base {
                    .progress-color {
                        background-color: #F39800;
                    }
                    .number {
                        color: #F39800;
                    }
                    .tip-2 {
                        .txt {
                            color: #F39800;
                        }
                    }
                }
            }
            &.stopout {
                .progress-base {
                    .progress-color {
                        background-color: #E3525C;
                    }
                    .number {
                        color: #E3525C;
                    }
                    .tip-2 {
                        .txt {
                            color: #E3525C;
                        }
                    }
                }
            }
        }
        .percent-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: rem(20px);
            padding: 0 rem(40px);
            text-align: center;
            .title {
                padding-bottom: rem(10px);
                color: #333;
                font-size: rem(24px);
            }
            .val {
                font-size: rem(34px);
            }
            .val2 {
                color: #477FD3;
            }
            .val3 {
                color: #F39800;
            }
        }
        .btn {
            height: rem(80px);
            margin-top: rem(46px);
            font-size: rem(34px);
            line-height: rem(80px);
            border-radius: rem(40px);
        }
    }
    .layout-2 {
        text-align: center;
        .close {
            display: inline-block;
            width: rem(60px);
            height: rem(80px);
            color: #FFF;
            font-size: rem(40px);
            line-height: rem(80px);
            text-align: center;
        }
    }
}
</style>
