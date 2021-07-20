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
                    以 BTC
                    <span class='icon_icon_arrow'></span>
                    <input class='input' type='text' />
                    <a class='all' href='javascript:;'>
                        全部
                    </a>
                </div>
                <p class='mtop5 muted'>
                    可用 1.00000 BTC
                </p>
                <div class='actionBar mtop20'>
                    还 USDT
                    <span class='icon_icon_arrow'></span>
                    <input class='input' type='text' />
                </div>
                <p class='mtop5 muted'>
                    待还 1.00000 USDT
                </p>
            </div>
            <van-button block class='returnBtn' type='primary'>
                还 USDT
            </van-button>
        </div>
    </van-popup>
</template>

<script>
import { ref, toRefs, watch } from 'vue'
export default {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const show = ref(false)
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
        padding: 0 rem(20px);
        color: var(--minorColor);
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
        }
    }
    .returnBtn {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
    }
}
</style>
