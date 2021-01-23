<template>
    <div class='positionItem of-1px-bottom' @click='detailVisible=!detailVisible'>
        <div class='mainWrap'>
            <p class='productName'>
                <i class='van-badge__wrapper van-icon van-icon-success'></i>
                EURCAD
            </p>
            <div class='col'>
                <p>
                    <i class='iconArrow icon_down-jiantou-right riseColor'></i>
                    0.01手数
                </p>
            </div>
            <div class='ft price riseColor'>
                <van-icon class='iconClose' name='cross' />
                <span class='alignmiddle'>-34.66</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            detailVisible: false
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~@/sass/mixin.scss";
.positionItem {
    position: relative;
    padding: rem(30px) rem(40px);
    font-size: rem(26px);
    .mainWrap {
        position: relative;
        display: flex;
        align-items: center;
        overflow: hidden;
    }
    .productName {
        color: var(--color);
        .van-icon {
            display: inline-block;
            width: rem(50px);
            vertical-align: -2px;
            font-size: rem(30px);
            color: var(--success);
        }
    }
    .col {
        flex: 1;
        text-align: center;
        font-size: rem(24px);
        margin-left: rem(46px);
        &:first-of-type {
            margin-left: 0;
        }
    }
    .ft{
        width: 25%;
    }
    .iconArrow{
        font-size: 1.2em;
    }
    .iconClose {
        float: right;
        vertical-align: middle;
        color: var(--color);
        font-size: rem(36px);
    }
}
</style>
