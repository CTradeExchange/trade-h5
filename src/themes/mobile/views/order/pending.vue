<template>
    <div class='pending'>
        <top />
        <p class='iconMain'><i class='icon_paidui'></i></p>
        <p class='title'>订单正在进行排队处理...</p>
        <p class='desc'>
            buy 1.00 EURUSD at 1.21350 <br />
            sl:0.0000 tp: 0.00000
        </p>
        <div class='footerBtn of-1px-top'>
            <button class='btn' @click='$router.back()'>隐藏</button>
        </div>
    </div>
</template>

<script>
import top from '@m/layout/top'
export default {
    components: {
        top,
    },
    mounted () {
        setTimeout(() => {
            this.$router.replace('/order/success')
        }, 1000)
    },
}
</script>

<style lang="scss" scoped>
@import "~@/sass/mixin.scss";
.pending{
    position: relative;
    height: 100%;
}
.iconMain{
    padding-top: rem(50px);
}
.icon_paidui{
    display: block;
    margin: 0 auto;
    width: rem(200px);
    font-size: rem(200px);
    color: var(--primary);
    opacity: .8;
}
.title{
    font-size: rem(50px);
    text-align: center;
    padding-top: rem(30px);
}
.desc{
    padding-top: rem(30px);
    font-size: rem(30px);
    text-align: center;
    color: var(--mutedColor);
    line-height: 1.5;
}
.footerBtn{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    .btn{
        height: rem(100px);
        width: 100%;
        text-align: center;
        background: var(--bgColor);
        color: var(--color);
        font-size: rem(28px);
        @include active();
    }
}
</style>
