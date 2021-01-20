<template>
    <section class='addAccount'>
        <ul class='actionList of-1px-bottom'>
            <li class='item of-1px-bottom'>
                <p class='title'>打开模拟账户</p>
                <p class='desc'>选择一家交易商并注册一个账户来学习交易和测试您的策略</p>
            </li>
            <li class='item' @click="$router.push('/login')">
                <p class='title'>登录一个已有账户</p>
                <p class='desc'>使用您的登录名/密码连接您选择的交易商</p>
            </li>
        </ul>
        <tip class='muted'>
            若要打开一个真实账户，请
            <a class='link' href='javascript:;' @click="$router.push('/register')">立即注册</a>
        </tip>
    </section>
</template>

<script>
import top from '@m/layout/top'
import tip from '@m/components/tip'
export default {
    components: {
        top,
        tip,
    },

}
</script>

<style lang="scss" scoped>
@import "~@/sass/mixin.scss";
.actionList{
    padding-left: rem(40px);
    line-height: 1.5;
    .item{
        padding: rem(30px) rem(30px) rem(30px) 0;
        @include active();
    }
    .title{
        font-size: rem(30px);
        font-weight: bold;
    }
    .desc{
        color: var(--mutedColor);
        font-size: rem(26px);
    }
}
</style>
