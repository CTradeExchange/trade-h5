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
                </div>
                <div class='address'>
                    <p class=''>
                        1KFHE7w8BhaENAswwryaoccDb6qcT6DbcDb6qcT6cDb6qcT6DbcDb6qcT6
                    </p>
                    <button class='copy'></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Top from '@/components/top'
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { currencyConfig } from './config.js'
export default {
    components: {
        Top
    },
    setup () {
        const store = useStore()
        const state = reactive({
            // 当前币种
            currency: 'USDT'
        })

        return {
            ...toRefs(state),
            currencyConfig
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
        margin-top: rem(66px);
        img {
            width: rem(265px);
            height: rem(265px);
        }
    }
}
</style>
