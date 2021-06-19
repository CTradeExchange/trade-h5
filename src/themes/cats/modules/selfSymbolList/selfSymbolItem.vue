<template>
    <div v-if='product' class='productItem'>
        <div class='cell'>
            <div class='th' @click='toDetail(product)'>
                <span
                    class='name'
                    :class="{
                        'small': product.symbolName && getLen(product.symbolName) > 16,
                        'mini': product.symbolName && getLen(product.symbolName) > 20
                    }"
                >
                    {{ product.symbolName }}
                </span>
                <p class='short_name'>
                    {{ product.symbolCode }}
                </p>
                <div class='riseLenght'>
                    <span :class='product.upDownColor'>
                        <template
                            v-if='displayType == 1'
                        >
                            {{ product.upDownAmount_pip + $t("trade.dot") }}
                        </template>
                        <template v-else>
                            {{ product.upDownAmount }}
                        </template>
                    </span>
                    <span :class='product.upDownColor'>
                        {{ product.upDownWidth }}
                    </span>
                </div>
            </div>
            <div class='ft actionBox'>
                <div class='btn-wrap'>
                    <button
                        class='btn'
                        :class="product.sell_color==='grayColor'?'grayColorBg':'fallColorBg'"
                        @click.stop="toOrder(product, 'sell')"
                    >
                        <span class='row direction' :class="product.sell_color+'Arrow'">
                            {{ $t('trade.sell') }}
                        </span>
                        <span
                            class='row'
                        >
                            {{ !product.sell_price && product.sell_price != 0 ? '--' : product.sell_price }}
                        </span>
                    </button>
                    <div v-if='product.spread_text' class='spread_text'>
                        <span>{{ product.spread_text }}</span>
                    </div>
                    <button
                        class='btn '
                        :class="product.buy_color==='grayColor'?'grayColorBg':'riseColorBg'"
                        @click.stop="toOrder(product, 'buy')"
                    >
                        <span class='row direction' :class="product.buy_color+'Arrow'">
                            {{ $t('trade.buy') }}
                        </span>
                        <span class='row'>
                            {{ !product.buy_price && product.buy_price != 0 ? '--' : product.buy_price }}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/**  点数（pip）换算为价格：X * 大点比率 * point
 *  1、市价卖
       止损价格范围：卖价+最小点数转价格<=X<=卖价+最大点数转价格
       止盈价格范围：卖价-最大点数转价格 <=X<=卖价-最小点数转价格
    2、市价买
       止损价格范围：买价-最大点数转价格<=X<=买价-最小点数转价格
       止盈价格范围：买价+最小点数转价格<=X<=买价+最大点数转价格
 */

import { getLen } from '@/utils/util'
import { useRouter } from 'vue-router'

export default {
    name: 'ProductItem',
    props: ['product', 'index', 'activeTab', 'tabIndex', 'displayType'],
    data () {
        return {
        }
    },
    setup () {
        const router = useRouter()
        const toOrder = (data, direction) => {
            router.push({ name: 'Order', query: { symbolId: data.symbolId, direction } })
        }
        const toDetail = () => {}
        return {
            getLen,
            toOrder,
            toDetail,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.productItem {
    .mtop {
        margin-top: 7px;
    }
    .cell {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 5px;
        padding: 0 rem(30px);
        color: var(--mutedColor);
        font-size: rem(24px);
        .th {
            position: relative;
            flex: 1;
            overflow: hidden;
        }
        .bd {
            flex: 1;
            padding-right: rem(30px);
            text-align: center;
        }
        .ft {
            width: rem(366px);
            text-align: right;
        }
        .name {
            @include ellipsis();
            display: block;
            width: 100%;
            padding: rem(5px) rem(10px) 0 0;
            color: var(--color);
            font-size: rem(30px);
            line-height: rem(32px);
            vertical-align: middle;
            &.small {
                font-size: rem(28px);
            }
            &.mini {
                font-size: rem(24px);
            }
        }
        .short_name {
            @include ellipsis
        ;
            padding-top: rem(18px);
            font-size: rem(20px);
            line-height: rem(24px);
        }
        .riseLenght {
            padding-top: rem(16px);
            font-size: rem(24px);
            line-height: rem(24px);
            span {
                display: inline-block;
                &:last-child {
                    margin-left: rem(15px);
                }
            }
        }
    }
    .chart {
        padding: 0 rem(30px);
    }
    .klineIcon {
        position: absolute;
        top: 50%;
        right: rem(30px);
        width: rem(52px);
        height: rem(48px);
        font-size: 16px;
        font-style: normal;
        text-align: center;
        border-radius: rem(6px);
        transform: translateY(-50%);
        &.loading {
            margin-top: rem(-24px);
            font-size: 0;
            background: url(~@public/images/loading.svg) center no-repeat;
            background-size: rem(52px) rem(48px);
            opacity: 0.7;
            animation: loading 1s linear infinite;
            &::before {
                content: '';
            }
        }
        &.hidden {
            color: #477FD3;
            background-color: #F3F8FF;
        }
        &.visible {
            color: #FFF;
            background-color: #477FD3;
        }
    }
}
.actionBox {
    .btn-wrap {
        position: relative;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        .btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            width: rem(176px);
            height: rem(84px);
            border-radius: rem(6px);
            cursor: pointer;
        }
        .row {
            display: block;
            padding: 0 rem(12px);
            overflow: hidden;
            font-size: rem(28px);
            line-height: rem(28px);
            word-break: break-all;
        }
        .direction {
            position: relative;
            padding-right: 12px;
            padding-bottom: rem(5px);
            font-size: rem(20px);
            line-height: 1.1;
            &.fallColorArrow::after {
                position: absolute;
                top: 2px;
                right: 0;
                font-weight: normal;
                font-size: 18px;
                font-family: 'iconfont' !important;
                vertical-align: middle;
                transform: scale(0.5);
                transform-origin: 100% 0;
                content: '\e674';
            }
            &.riseColorArrow::after {
                position: absolute;
                top: 2px;
                right: 0;
                font-weight: normal;
                font-size: 18px;
                font-family: 'iconfont' !important;
                transform: scale(0.5);
                transform-origin: 100% 0;
                content: '\e675';
            }
        }
        .spread_text {
            position: absolute;
            top: 50%;
            left: 50%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            width: rem(53px);
            min-height: rem(26px);
            padding: rem(5px) 0;
            background: #FFF;
            border-radius: rem(3px);
            transform: translate(-50%, -50%);
            span {
                color: rgba(72, 72, 72, 1);
                color: #666;
                font-weight: 300;
                font-size: rem(18px);
                line-height: rem(26px);
                text-align: center;
                word-break: break-all;
            }
        }
    }
    .diff-wrap {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        padding-top: 6px;
        color: rgba(153, 153, 153, 1);
        font-size: rem(18px);
        line-height: rem(18px);
        > span {
            flex: 0 0 50%;
            text-align: left;
            &:last-child {
                padding-right: rem(10px);
                text-align: right;
            }
        }
    }
}
</style>
