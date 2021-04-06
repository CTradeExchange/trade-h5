<template>
    <div class='top'>
        <slot name='left'>
            <a class='back' href='javascript:;' @click='back'>
                <van-icon :name='leftIcon' />
            </a>
        </slot>
        <slot name='center'>
            <div v-if='showCenter' class='title'>
                {{ $route.meta.title }}
            </div>
        </slot>
        <slot name='right'>
            <a v-if='rightAction' class='rightClick' href='javascript:;' @click='rightClick'>
                {{ rightAction.title }}
                <van-icon name='arrow' />
            </a>
        </slot>
    </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
export default {
    props: {
        rightAction: {
            type: Object,
            default: function () {
                return { title: '' }
            }
        },
        backHandler: Function,
        leftIcon: {
            type: String
        },
        showCenter: {
            type: Boolean,
            default: false
        }
    },
    setup (props, { emit, attrs }) {
        const router = useRouter()
        const route = useRoute()
        // 点击返回
        const back = () => {
            if (props.backHandler) emit('back')
            else router.back()
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
    align-items: center;
    justify-content: space-between;
    height: rem(100px);
    .back {
        position: absolute;
        left: rem(10px);
        color: var(--color);
        font-size: rem(46px);
    }
    .rightClick {
        position: absolute;
        right: rem(30px);
        height: rem(60px);
        padding: 0 0 0 rem(26px);
        color: var(--color);
        font-size: rem(24px);
        line-height: rem(59px);
        border: 1px solid var(--bdColor);
        border-radius: rem(30px);
    }
    .van-icon-arrow {
        margin-right: rem(3px);
        margin-left: rem(3px);
        font-size: rem(30px);
        vertical-align: -3px;
    }
    .title {
        width: 60%;
        max-width: 60%;
        margin: 0 auto;
        font-size: rem(34px);
        line-height: rem(59px);
        text-align: center;
    }
}
</style>
