<template>
    <div class='productItem of-1px-bottom' @click="$emit('open')">
        <div class='hd'>
            <p class='productName'>
                <i class='van-badge__wrapper van-icon van-icon-success'></i>
                EURCAD
                <i class='positions'>5</i>
            </p>
            <div class='orderBtnRow'>
                <a class='btn riseColor' href='javascript:;'>
                    <p class='label'>卖出</p>
                    <p class='price'>1.21789</p>
                </a>
                <a class='btn fallColor' href='javascript:;'>
                    <p class='label'>买入</p>
                    <p class='price'>1.21789</p>
                </a>
            </div>
        </div>
        <div class='col'>
            <p class='priceUp muted'>-50.2 (-0.65%)</p>
            <Peity :data='pieData' :options="{ 'fill': 'url(#LinearGradient)', 'innerRadius': 10, 'radius': 40 }" :type="'line'" />
        </div>
    </div>
    <div style='position: absolute; top: -2000px'>
        <svg>
            <defs>
                <linearGradient
                    id='redLinearGradient'
                    x1='0'
                    x2='0'
                    y1='0'
                    y2='1'
                >
                    <stop offset='0' stop-color='#e9b1bf' />
                    <stop offset='1' stop-color='#ffffff' />
                </linearGradient>
            </defs>
        </svg>
        <svg>
            <defs>
                <linearGradient
                    id='greenLinearGradient'
                    x1='0'
                    x2='0'
                    y1='0'
                    y2='1'
                >
                    <stop offset='0' stop-color='#afd4cb' />
                    <stop offset='1' stop-color='#ffffff' />
                </linearGradient>
            </defs>
        </svg>
        <svg>
            <defs>
                <linearGradient
                    id='blueLinearGradient'
                    x1='0'
                    x2='0'
                    y1='0'
                    y2='1'
                >
                    <stop offset='0' stop-color='#b0cbf6' />
                    <stop offset='1' stop-color='#f3f6fc' />
                </linearGradient>
            </defs>
        </svg>
        <svg>
            <defs>
                <linearGradient id='LinearGradient' x1='0' x2='0' y1='0' y2='1'>
                    <stop
                        offset='0'
                        stop-color='rgba(11, 105, 239, 0.3)'
                    />
                    <stop offset='1' stop-color='rgba(11, 105, 239, 0)' />
                </linearGradient>
            </defs>
        </svg>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Peity from '@ct/components/peity/peity'
export default {
    components: {
        Peity,
    },
    data () {
        return {
            data: [91.695, 66.456, 98.656, 114.189, 96.068, 113.634, 99.481, 66.56, 102.605, 170.448, 259.308, 138.143, 125.109, 133.169, 139.786, 92.563, 87.310, 238.07, 87.03, 67.945, 85.478, 94.274, 81.160, 63.895, 75.294, 100.880, 83.504, 99.481, 66.56, 102.605, 170.448, 138.143, 125.109, 133.169, 139.786, 92.563, 87.310, 138.07, 87.03, 67.945, 85.478, 94.274, 81.160, 63.895, 75.294, 100.880, 83.504, 121.058, 131.62]
        }
    },
    computed: {
        ...mapState(['quoteMode']),
        pieData () {
            return this.data.toString()
        }
    },
    emits: ['open'],
}
</script>

<style lang="scss" scoped>
@import "~@/sass/mixin.scss";
.productItem {
    position: relative;
    display: flex;
    padding: rem(20px) rem(40px);
    overflow: hidden;
    @include active();
    .hd {
        font-size: rem(22px);
        color: var(--mutedColor);
        line-height: 1.3;
        flex: 1;
    }
    .productName {
        font-size: rem(36px);
        font-weight: normal;
        color: var(--color);
    }
    .col {
        text-align: right;
        font-size: rem(24px);
        margin-left: rem(46px);
        flex: 1;
        &:first-of-type {
            margin-left: 0;
        }
    }
    .van-icon-success {
        vertical-align: -2px;
        color: var(--success);
    }
    .positions {
        display: inline-block;
        font-size: rem(22px);
        line-height: 1;
        vertical-align: text-top;
        margin-top: rem(2px);
        margin-left: rem(5px);
        padding: 2px 5px;
        color: var(--placeholder);
        border-radius: rem(5px);
        border: 1px solid var(--placeholder);
    }
    .priceUp {
        padding: rem(10px) 0;
    }
}
:deep(.peity) {
    display: block;
    width: 100%;
    height: rem(100px);
}
.orderBtnRow {
    display: flex;
    margin-top: rem(20px);
    .btn {
        padding: 2px 0;
        width: rem(165px);
        text-align: center;
        border-radius: 4px;
        &:first-of-type {
            margin-right: rem(36px);
        }
        &.riseColor {
            border: 1px solid var(--riseColor);
        }
        &.fallColor {
            border: 1px solid var(--fallColor);
        }
        .label {
            font-size: rem(22px);
        }
        .price {
            padding-top: rem(3px);
            font-size: rem(30px);
        }
    }
}
</style>
