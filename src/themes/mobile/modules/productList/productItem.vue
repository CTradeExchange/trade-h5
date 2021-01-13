<template>
    <div class='productItem of-1px-bottom position'>
        <div class='hd'>
            <p class='productName'>EURCAD</p>
            <p class='time'>06:43:18</p>
            <p class='p'>点差：19</p>
        </div>
        <div class='col'>
            <p class='price fallColor'>
                <span class='normal'>1.55</span>
                <span class='big'>22</span>
                <sup>5</sup>
            </p>
            <p class='muted'>最低：1.55067</p>
        </div>
        <div class='col'>
            <p class='price riseColor'>
                <span class='normal'>1.55</span>
                <span class='big'>22</span>
                <sup>5</sup>
            </p>
            <p class='muted'>最高：1.55067</p>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.productItem{
    position: relative;
    display: flex;
    padding: rem(20px) rem(40px);
    overflow: hidden;
    &.position::before{
        position: absolute;
        content: '';
        left: 0;
        top: 0;
        width: rem(40px);
        height: rem(40px);
        background: var(--riseColor);
        transform: translate(-50%, -50%) rotate(45deg);
        transform-origin: center;
    }
    .hd{
        font-size: rem(22px);
        color: var(--mutedColor);
        line-height: 1.3;
        flex: 1;
    }
    .productName{
        font-size: rem(36px);
        font-weight: normal;
        color: var(--color);
    }
    .col{
        text-align: right;
        font-size: rem(24px);
        margin-left: rem(46px);
        &:first-of-type{
            margin-left: 0;
        }
    }
    .price{
        font-size: rem(30px);
        font-weight: bold;
        margin-bottom: rem(6px);
        .normal{
            vertical-align: text-bottom;
        }
        .big{
            font-size: rem(46px);
        }
        sup{
            font-size: inherit;
        }
    }
}
</style>
