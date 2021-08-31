<template>
    <div class='top'>
        <slot name='left'>
            <a class='back' href='javascript:;' @click='back'>
                <span class='icon_icon_back'></span>
            </a>
        </slot>
        <slot name='center'>
            <div v-if='title' class='title'>
                {{ title }}
            </div>
            <div v-else-if='showCenter' class='title'>
                {{ $t($route.meta.title) }}
            </div>
        </slot>
        <slot name='tabs'></slot>
        <slot name='right'>
            <a v-if='rightAction.title' class='rightClick' href='javascript:;' @click='rightClick'>
                <span class='right-text'>
                    {{ rightAction.title }}
                </span>
                <van-icon name='arrow' />
            </a>
        </slot>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
    props: {
        rightAction: {
            type: [Object, Boolean],
            default: function () {
                return { title: '' }
            }
        },
        backHandler: Function,
        leftIcon: {
            type: String,
            default: 'arrow-left'
        },
        title: {
            type: String,
            default: ''
        },
        showCenter: {
            type: Boolean,
            default: false
        }
    },
    setup (props, { emit, attrs }) {
        const router = useRouter()
        // 点击返回
        const back = () => {
            attrs.onBack ? emit('back') : router.back()
        }
        // 点击右侧按钮
        const rightClick = () => {
            attrs.onRightClick && emit('rightClick')
        }
        return {
            back,
            rightClick,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.top {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    height: rem(100px);
    font-size: rem(34px);
    background: var(--contentColor);
    .back {
        position: absolute;
        top: rem(26px);
        left: 0;
        z-index: 1;
        width: rem(120px);
        padding: 0 rem(30px);
        color: var(--color);
    }
    .rightClick {
        position: absolute;
        right: rem(30px);
        display: flex;
        align-items: center;
        height: rem(60px);
        padding: 0 0 0 rem(26px);
        color: var(--color);
        font-size: rem(24px);
        border: 1px solid var(--bdColor);
        border-radius: rem(30px);
    }
    .van-icon-arrow {
        height: rem(28px);
        margin-right: rem(10px);
        margin-left: rem(5px);
        font-weight: bold;
        vertical-align: middle;
    }
    .right-text {
        vertical-align: middle;
    }
    .title {
        width: 60%;
        max-width: 60%;
        margin: 0 auto;
        color: var(--color);
        font-size: rem(34px);
        line-height: rem(59px);
        text-align: center;
    }
}
</style>
