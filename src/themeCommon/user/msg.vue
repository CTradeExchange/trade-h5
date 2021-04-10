<template>
    <Top back='true' :menu='false' title='' />
    <div class='msg-list'>
        <div v-for='(item,index) in 10' :key='index' class='msg-item'>
            <p class='msg-title'>
                充值入账通知
            </p>
            <p class='msg-content'>
                您的USD账户68000089于2021.01.29 15:53:40充值100.00US D，实际入账金额为100.00US
            </p>
            <p class='msg-time'>
                2021.01.29  15:53:41
            </p>
        </div>
    </div>
</template>

<script>
import Top from '@m/layout/top'
export default {
    components: {
        Top
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.msg-list {
    flex: 1;
    overflow-y: auto;
    .msg-item {
        padding: rem(30px);
        border-top: solid rem(20px) var(--btnColor);
        .msg-title {
            color: var(--color);
            font-weight: bold;
            font-size: rem(28px);
            line-height: rem(60px);
        }
        .msg-content {
            color: var(--color);
            font-weight: 500;
            font-size: rem(24px);
            line-height: rem(40px);
        }
        .msg-time {
            color: var(--mutedColor);
            font-weight: 400;
            font-size: rem(20px);
            line-height: rem(60px);
        }
    }
}
</style>
