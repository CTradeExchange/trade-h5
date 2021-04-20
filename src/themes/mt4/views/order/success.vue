<template>
    <div class='pending'>
        <top />
        <p class='iconMain'>
            <i class='icon_chenggong'></i>
        </p>
        <p class='title'>
            订单打开
        </p>
        <p class='desc'>
            #695329333 <br />
            buy 1.00 EURUSD at 1.21350 <br />
            sl:0.0000 tp: 0.00000
        </p>
        <div class='footerBtn of-1px-top'>
            <button class='btn' @click='$router.replace("/quote")'>
                隐藏
            </button>
        </div>
    </div>
</template>

<script>
import top from '@m/layout/top'
export default {
    components: {
        top,
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.pending {
    position: relative;
    height: 100%;
}
.iconMain {
    padding-top: rem(50px);
}
.icon_chenggong {
    display: block;
    width: rem(200px);
    margin: 0 auto;
    color: var(--success);
    font-size: rem(200px);
    opacity: 0.8;
}
.title {
    padding-top: rem(30px);
    font-size: rem(50px);
    text-align: center;
}
.desc {
    padding-top: rem(30px);
    color: var(--mutedColor);
    font-size: rem(30px);
    line-height: 1.5;
    text-align: center;
}
.footerBtn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    .btn {
        @include active();
        width: 100%;
        height: rem(100px);
        color: var(--color);
        font-size: rem(28px);
        text-align: center;
        background: var(--bgColor);
    }
}
</style>
