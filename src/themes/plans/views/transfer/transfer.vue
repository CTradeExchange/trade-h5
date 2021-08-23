<template>
    <div class='fullPageWrapper'>
        <LayoutTop :back='true' :menu='false' />
        <div class='page-content'>
            <div class='transfer'>
                <div class='label'>
                    {{ $t('common.from') }}<span v-for='i in 3' :key='i' class='dot'>
                    </span> {{ $t('common.to') }}
                </div>
                <div class='center'>
                    <div class='from account'>
                        <span> 现货账户</span>
                        <van-icon name='arrow' />
                    </div>
                    <div class='to account'>
                        <span> CFD杠杆</span>
                        <van-icon name='arrow' />
                    </div>
                </div>
                <div class='right'>
                    <i class='icon_zhuanhuan'></i>
                </div>
            </div>
            <div class='action-bar' @click='pickerShow=true'>
                <span class='label'>
                    USD
                </span>
                <van-icon name='arrow' />
            </div>
            <div class='action-bar'>
                <input placeholder='最少划转 0.000001' type='number' />
                <span class='unit'>
                    USD
                </span>
                <span class='all'>
                    {{ $t('common.all') }}
                </span>
            </div>
            <p class='tip'>
                {{ $t('assets.maxTransfer') }} 0.05000000 BTC
            </p>
        </div>

        <div class='footerBtn'>
            <van-button block class='returnBtn' :loading='loading' type='primary' @click='handleTransfer'>
                {{ $t('trade.transfer') }} {{ curCurrency }}
            </van-button>
        </div>

        <van-popup v-model:show='pickerShow' class='assetsPicker' position='bottom'>
            <van-picker
                :columns='inCurrencyList'
                :default-index='0'
                @cancel='pickerShow = false'
                @confirm='onPickerConfirm'
            />
        </van-popup>

        <van-popup v-model:show='accountShow' class='assetsPicker' position='bottom'>
            <van-picker
                :columns='inCurrencyList'
                :default-index='0'
                @cancel='accountShow = false'
                @confirm='onPickerConfirm'
            />
        </van-popup>
    </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
export default {
    setup (props, { emit }) {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const state = reactive({
            curCurrency: 'USDT',
            pickerShow: false,
            inCurrencyList: ['USDT', 'BTC'],
            accountShow: false
        })

        const handleTransfer = () => {

        }
        const onPickerConfirm = () => {
            state.pickerShow = false
        }
        return {
            handleTransfer,
            onPickerConfirm,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.fullPageWrapper {
    background-color: var(--contentColor);
    .page-content {
        padding: 0 rem(30px);
        .transfer {
            display: flex;
            align-items: center;
            background: var(--assistColor);
            .label {
                //flex: 1;
                width: rem(18px);
                margin: 0 rem(30px) 0 rem(22px);
                color: var(--minorColor);
                font-weight: bold;
                font-size: rem(28px);
                line-height: rem(27px);
                letter-spacing: rem(20px);
                text-align: center;
                word-wrap: break-word;
                .dot {
                    display: block;
                    width: rem(4px);
                    height: rem(4px);
                    margin: rem(17px) auto rem(15px);
                    text-align: center;
                    background: var(--placeholdColor);
                }
            }
            .center {
                flex: 1;
                border-right: solid 1px var(--lineColor);
                .account {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-right: rem(30px);
                    font-size: rem(28px);
                    line-height: rem(100px);
                    &.from {
                        border-bottom: solid 1px var(--lineColor);
                    }
                }
            }
            .right {
                //flex: 1;
                .icon_zhuanhuan {
                    margin: 0 rem(32px);
                    color: var(--primary);
                    font-size: rem(44px);
                }
            }
        }
        .action-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: rem(80px);
            margin-top: rem(50px);
            padding: 0 rem(30px);
            color: var(--color);
            font-size: rem(28px);
            background: var(--assistColor);
            border-radius: rem(6px);
            input {
                flex: 1;
            }
            .unit {
                margin-right: rem(30px);
                padding-right: rem(30px);
                border-right: solid 1px var(--lineColor);
            }
            .all {
                color: var(--primary);
            }
        }
        .tip {
            margin-top: rem(23px);
            margin-left: rem(23px);
            color: var(--minorColor);
        }
    }
    .footerBtn {
        position: fixed;
        bottom: 0;
        left: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        width: 100%;
        .returnBtn {
            margin: rem(20px);
            color: #FFF;
            font-size: rem(30px);
            background: var(--primary);
        }
    }
}
</style>
