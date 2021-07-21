<template>
    <van-popup v-model:show='show' position='bottom' @closed='closed'>
        <div class='returnMoneyPop'>
            <p class='closeBar'>
                <a class='closeBtn' href='javascript:;' @click='closed'>
                    <i class='icon_icon_close_big'></i>
                </a>
            </p>
            <div class='container'>
                <div class='actionBar'>
                    <span class='muted' @click='pickerShow=true'>
                        以
                    </span>
                    <span class='currencySpan' @click='pickerShow=true'>
                        BTC
                    </span>
                    <span class='icon_icon_arrow' @click='pickerShow=true'></span>
                    <input class='input' type='text' />
                    <a class='all' href='javascript:;'>
                        全部
                    </a>
                </div>
                <p class='mutedTip'>
                    可用 1.00000 BTC
                </p>
                <div class='actionBar mtop20'>
                    <span class='muted'>
                        还
                    </span>
                    <span class='currencySpan'>
                        USDT
                    </span>
                    <span class='icon_icon_arrow'></span>
                    <input class='input' type='text' />
                </div>
                <p class='mutedTip'>
                    待还 1.00000 USDT
                </p>
            </div>
            <van-button block class='returnBtn' type='primary'>
                还 USDT
            </van-button>
        </div>
    </van-popup>
    <van-popup v-model:show='pickerShow' class='assetsPicker' position='bottom'>
        <van-picker :columns='columns' :default-index='2' title='标题' />
    </van-popup>
</template>

<script>
import { ref, toRefs, watch } from 'vue'
export default {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const show = ref(false)
        const pickerShow = ref(false)
        const columns = ['USDT', 'BTC', 'USDT', 'BTC', 'USDT', 'BTC', 'USDT', 'BTC']
        watch(
            () => props.modelValue,
            newval => {
                if (show.value !== newval) show.value = newval
            },
            { immediate: true }
        )
        const closed = () => {
            emit('update:modelValue', false)
        }
        return {
            show,
            pickerShow,
            columns,
            closed
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.returnMoneyPop {
    padding: rem(80px) rem(30px) rem(140px);
    .closeBtn {
        position: absolute;
        top: rem(30px);
        right: rem(30px);
    }
    .icon_icon_close_big {
        color: var(--color);
    }
    .actionBar {
        position: relative;
        display: flex;
        align-items: center;
        height: rem(80px);
        padding: 0 rem(30px);
        color: var(--color);
        font-size: rem(28px);
        line-height: rem(80px);
        background: var(--assistColor);
        .icon_icon_arrow {
            margin-left: rem(10px);
            font-size: rem(24px);
        }
        .input {
            flex: 1;
            height: rem(40px);
            margin-left: rem(20px);
            padding-left: rem(20px);
            border-left: 1px solid var(--lineColor);
        }
        .all {
            position: absolute;
            top: 0;
            right: rem(20px);
            bottom: 0;
            margin: auto;
            color: var(--primary);
            font-size: rem(24px);
        }
        .currencySpan {
            margin-left: 3px;
        }
    }
    .mutedTip {
        margin-top: 5px;
        color: var(--minorColor);
        font-size: rem(20px);
    }
    .returnBtn {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
    }
}
.assetsPicker {
    --van-picker-background-color: var(--contentColor);
}
</style>
