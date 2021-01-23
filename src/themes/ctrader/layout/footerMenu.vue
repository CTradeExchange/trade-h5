<template>
    <van-swipe :autoplay='0' class='my-swipe of-1px-top' indicator-color='white'>
        <van-swipe-item>
            <div class='col'>
                <p class='title muted'>账户余额</p>
                <p class='val'>$ 1000.08</p>
            </div>
            <div class='col'>
                <p class='title muted'>净值</p>
                <p class='val'>$ 98.62</p>
            </div>
            <div class='col'>
                <p class='title muted'>总浮动</p>
                <p class='val fallColor'>$ -18.26</p>
            </div>
            <div class='col'>
                <p class='title muted'>净浮动</p>
                <p class='val fallColor'>$ -18.26</p>
            </div>
        </van-swipe-item>
        <van-swipe-item>
            <div class='col'>
                <p class='title muted'>可用保证金</p>
                <p class='val'>$ 1000.08</p>
            </div>
            <div class='col'>
                <p class='title muted'>已使用保证金</p>
                <p class='val'>$ 98.62</p>
            </div>
            <div class='col'>
                <p class='title muted'>保证金比例</p>
                <p class='val'>11 696.67</p>
            </div>
            <div class='col'>
                <p class='title muted'>强制平仓</p>
                <p class='val'>50.00%</p>
            </div>
        </van-swipe-item>
    </van-swipe>
</template>

<script>
export default {
    data () {
        return {
            active: ''
        }
    },
    created () {
        this.active = this.$route.name
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.my-swipe{
    .van-swipe-item {
        font-size: rem(24px);
        height: rem(120px);
        text-align: center;
        background-color: var(--bgColor);
        padding-top: rem(20px);
        width: 100%;
        line-height: 1.5;
        display: flex;
        .col{
            flex: 1;
        }
    }
    :deep(.van-swipe__indicators){
        bottom:5px;
    }
    :deep(.van-swipe__indicator){
        background-color: var(--mutedColor) !important;
        width: 4px;
        height: 4px;
    }
}

.val {
    font-size: rem(22px);
}
</style>
