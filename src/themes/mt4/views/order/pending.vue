<template>
    <div class='pending'>
        <p class='iconMain'>
            <i class='icon_paidui'></i>
        </p>
        <p class='title'>
            订单正在进行排队处理...
        </p>
        <p class='desc'>
            buy 1.00 EURUSD at 1.21350 <br />
            sl:0.0000 tp: 0.00000
        </p>
        <div class='footerBtn of-1px-top'>
            <button class='btn' @click='$emit("onHide")'>
                隐藏
            </button>
        </div>
    </div>
</template>

<script>
export default {
    // emits: ['onHide'],

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
.icon_paidui {
    display: block;
    width: rem(200px);
    margin: 0 auto;
    color: var(--primary);
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
