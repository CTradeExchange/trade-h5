<template>
    <div class='positionItem of-1px-bottom' @click='detailVisible=!detailVisible'>
        <div class='mainWrap'>
            <div class='hd'>
                <p class='productName'>
                    EURCAD,
                    <span class='volumn'> buy 1.00 </span>
                </p>
                <p>
                    <span>104.185</span>
                    <span> →</span>
                    <span>104.156</span>
                </p>
            </div>
            <div class='col'>
                <p class='price riseColor'>-34.66</p>
            </div>
        </div>
        <div v-if='detailVisible' class='detail muted'>
            <p class='date '>2021.01.12 09:03</p>
            <ul class='list'>
                <li class='flexWrap'>
                    <span class='title'>S/L</span>
                    <span class='value'>--</span>
                </li>
                <li class='flexWrap'>
                    <span class='title'>库存费</span>
                    <span class='value'>--</span>
                </li>
                <li class='flexWrap'>
                    <span class='title'>T/P</span>
                    <span class='value'>--</span>
                </li>
                <li class='flexWrap'>
                    <span class='title'>税金</span>
                    <span class='value'>--</span>
                </li>
                <li class='flexWrap'>
                    <span class='title'>ID</span>
                    <span class='value'>692666666</span>
                </li>
                <li class='flexWrap'>
                    <span class='title'>手续费</span>
                    <span class='value'>--</span>
                </li>
            </ul>
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
    padding: rem(20px) rem(40px);
    .mainWrap {
        position: relative;
        display: flex;
        align-items: center;
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
}
.detail{
    margin-top: rem(10px);
    font-size: rem(22px);
    .date{
        font-weight: normal;
    }
    .list{
        margin-top: rem(10px);
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-column-gap: rem(30px);
    }
    .flexWrap{
        display: flex;
        justify-content: space-between;
    }
}
</style>
