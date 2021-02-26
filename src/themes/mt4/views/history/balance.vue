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
@import "~@/sass/mixin.scss";
.mainWrap {
    position: relative;
    padding: rem(20px) rem(40px);
    display: flex;
    overflow: hidden;
}
.hd {
    font-size: rem(22px);
    color: var(--mutedColor);
    line-height: 1.3;
    flex: 1;
}
.productName {
    font-size: rem(30px);
    font-weight: bold;
    color: var(--color);
    .volumn {
        font-weight: normal;
    }
}
.col {
    text-align: right;
    font-size: rem(24px);
    margin-left: rem(46px);
    &:first-of-type {
        margin-left: 0;
    }
}
.price {
    font-size: rem(30px);
    font-weight: bold;
    margin-bottom: rem(6px);
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
