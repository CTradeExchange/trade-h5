<template>
    <div class='mainWrap of-1px-bottom'>
        <div class='hd'>
            <p class='productName'>Balance</p>
        </div>
        <div class='col'>
            <p class='muted'>2021.01.11 12:27</p>
            <p class='price riseColor'>-34.66</p>
        </div>
    </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.mainWrap {
    position: relative;
    display: flex;
    padding: rem(20px) rem(40px);
    overflow: hidden;
}
.hd {
    flex: 1;
    color: var(--mutedColor);
    font-size: rem(22px);
    line-height: 1.3;
}
.productName {
    color: var(--color);
    font-weight: bold;
    font-size: rem(30px);
    .volumn {
        font-weight: normal;
    }
}
.col {
    margin-left: rem(46px);
    font-size: rem(24px);
    text-align: right;
    &:first-of-type {
        margin-left: 0;
    }
}
.price {
    margin-bottom: rem(6px);
    font-weight: bold;
    font-size: rem(30px);
    .normal {
        vertical-align: text-bottom;
    }
    .big {
        font-size: rem(46px);
    }
    sup {
        font-size: inherit;
    }
}
</style>
