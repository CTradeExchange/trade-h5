<template>
    <div class='page-wrap'>
        <Top
            back
            :right-action="{ title: $t('deposit.depositRecord') }"
            show-center
            @rightClick="$router.push('/depositRecord')"
        />
        <div class='page-content'>
            <div class='module'>
                <div class='currency-info'>
                    <img :src="'/images/currency_icon/' + currency + '.png'" />
                    <p class='name'>
                        {{ currency }}
                    </p>
                    <p class='des'>
                        {{ currencyConfig[currency] }}
                    </p>
                </div>
                <div class='chain-list'>
                    <div class='item active'>
                        <div class='check'>
                            <van-icon color='#fff' name='success' />
                        </div>
                        <span class='name'>
                            OMNI
                        </span>
                    </div>
                    <div class='item'>
                        <div class='check'>
                            <van-icon color='#fff' name='success' />
                        </div>
                        <span class='name'>
                            OMNI
                        </span>
                    </div>
                    <div class='item'>
                        <div class='check'>
                            <van-icon color='#fff' name='success' />
                        </div>
                        <span class='name'>
                            OMNI
                        </span>
                    </div>
                </div>
                <div class='qr-code'>
                    <img src='/images/code.png' />
                    <div class='mask'>
                        <button class='get'>
                            获取地址
                        </button>
                    </div>
                </div>
                <div class='address-box'>
                    <p class='text'>
                        1KFHE7w8BhaENAswwryaoccDb6qcT6DbcDb6qcT6cDb6qcT6DbcDb6qcT6
                    </p>
                    <button id='copy' class='copy' data-clipboard-text='111222' @click='copyAddress'>
                        {{ $t('common.copy') }}
                    </button>
                </div>
            </div>
            <div class='warn-box'>
                <p class='title'>
                    {{ $t('common.warning') }}
                </p>
                <p class='des'>
                    {{ $t('deposit.directTip') }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import Top from '@/components/top'
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { currencyConfig } from './config.js'
import { Toast, Dialog } from 'vant'
import { useI18n } from 'vue-i18n'
import Clipboard from 'clipboard'
export default {
    components: {
        Top
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const { t } = useI18n()
        const state = reactive({
            // 当前币种
            currency: route.query.currency,
            // 支付通道code
            paymentCode: route.query.paymentCode
        })

        // 复制地址
        const copyAddress = () => {
            const clipboard = new Clipboard('#copy')
            clipboard.on('success', e => {
                Toast(t('common.copySuccess'))
                // 释放内存
                clipboard.destroy()
            })
        }

        return {
            ...toRefs(state),
            currencyConfig,
            copyAddress
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
.page-content {
    flex: 1;
    padding: 0 rem(30px);
    overflow-y: auto;
}
.module {
    min-height: rem(850px);
    margin-top: rem(100px);
    padding: 0 rem(30px) rem(35px);
    background: var(--contentColor);
    border-radius: rem(10px);
    .currency-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
            width: rem(96px);
            height: rem(96px);
            margin-top: rem(-48px);
        }
        .name {
            line-height: 1;
            margin-top: rem(20px);
            font-size: rem(40px);
            color: var(--color);
        }
        .des {
            line-height: 1;
            margin-top: rem(5px);
            font-size: rem(28px);
            color: var(--minorColor);
        }
    }
    .chain-list {
        display: flex;
        flex-wrap: wrap;
        margin-top: rem(50px);
        .item {
            display: flex;
            justify-content: center;
            align-items: center;
            width: rem(196px);
            height: rem(80px);
            margin-right: rem(20px);
            background: var(--assistColor);
            border: 1px solid transparent;
            border-radius: rem(10px);
            position: relative;
            &:nth-of-type(3n) {
                margin-right: 0;
            }
            .check {
                display: none;
            }
            .name {
                font-size: rem(28px);
                color: var(--color);
            }
        }
        .active {
            background: rgba(71, 127, 210, 0.1);
            border: 1px solid var(--primary);
            .check {
                display: flex;
                justify-content: center;
                align-items: center;
                width: rem(30px);
                height: rem(30px);
                background: var(--primary);
                border-radius: 0 0 0 rem(10px);
                position: absolute;
                top: 0;
                right: 0;
                &:deep(.van-icon) {
                    margin-top: rem(-5px);
                }
            }
        }
    }
    .qr-code {
        display: flex;
        justify-content: center;
        width: rem(265px);
        height: rem(265px);
        margin: rem(66px) auto 0;
        position: relative;
        img {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            opacity: .2;
        }
        .mask {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            .get {
                display: flex;
                justify-content: center;
                align-items: center;
                width: rem(260px);
                height: rem(88px);
                font-size: rem(30px);
                color: #fff;
                background: var(--primary);
                border-radius: rem(10px);
            }
        }
    }
    .address-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: rem(25px);
        margin-top: rem(66px);
        background: var(--assistColor);
        border-radius: rem(10px);
        .text {
            text-align: center;
            line-height: rem(32px);
            word-break: break-all;
            font-size: rem(24px);
            color: var(--color);
        }
        .copy {
            margin-top: rem(16px);
            font-size: rem(28px);
            font-weight: bold;
            color: var(--primary);
            background: none;
        }
    }
}
.warn-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
    margin: rem(30px) 0;
    padding: rem(36px) rem(25px);
    background: rgba(246, 0, 0, 0.05);
    border: 1px solid var(--riseColor);
    border-radius: rem(10px);
    .title {
        font-size: rem(40px);
        color: var(--riseColor);
    }
    .des {
        margin-top: rem(26px);
        font-size: rem(24px);
        color: var(--color);
    }
}
</style>
