<template>
    <div class='top'>
        <slot name='left'>
            <a class='back' href='javascript:;' @click='back'>
                <van-icon name='cross' />
            </a>
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
import { useRouter } from 'vue-router'
export default {
    props: {
        rightAction: {
            type: Object,
            default: function () {
                return { title: '' }
            }
        },
        backHandler: Function,
    },
    setup (props, { emit, attrs }) {
        console.log(attrs)
        const router = useRouter()
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
    padding: 0 rem(30px);
    .back {
        color: var(--color);
        font-size: rem(46px);
    }
    .rightClick {
        height: rem(60px);
        padding: 0 rem(21px) 0 rem(30px);
        color: var(--color);
        font-size: rem(24px);
        line-height: rem(59px);
        border: 1px solid var(--bdColor);
        border-radius: rem(30px);
    }
    .van-icon-arrow {
        font-size: rem(30px);
        vertical-align: -3px;
    }
}
</style>
