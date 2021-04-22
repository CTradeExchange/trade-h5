<template>
    <div class='positionItem van-hairline--bottom' @click='detailVisible=!detailVisible'>
        <div class='mainWrap'>
            <div class='hd'>
                <p class='productName'>
                    {{ data.symbolName }},
                    <span class='volumn'>
                        {{ data.direction===1?'buy':'sell' }}
                        {{ data.closeVolume }}
                    </span>
                </p>
                <p class='volums'>
                    <span>{{ data.openPrice }}</span>
                    <span> → </span>
                    <span>{{ data.closePrice }}</span>
                </p>
            </div>
            <div class='col'>
                <p class='date'>
                    {{ closeTime }}
                </p>
                <p class='price' :class='{ riseColor:data.profit>=0,fallColor:data.profit<0 }'>
                    {{ data.profit }}
                </p>
            </div>
        </div>
        <div v-if='detailVisible' class='detail muted'>
            <p class='date '>
                ID: {{ data.orderId }}
            </p>
            <ul class='list'>
                <li class='flexWrap'>
                    <span class='title'>
                        S/L
                    </span>
                    <span class='value'>
                        {{ data.stopLoss || '--' }}
                    </span>
                </li>
                <li class='flexWrap'>
                    <span class='title'>
                        手续费
                    </span>
                    <span class='value'>
                        {{ data.commission||'--' }}
                    </span>
                </li>
                <li class='flexWrap'>
                    <span class='title'>
                        T/P
                    </span>
                    <span class='value'>
                        {{ data.takeProfit || '--' }}
                    </span>
                </li>
                <!-- <li class='flexWrap'>
                    <span class='title'>
                        税金
                    </span>
                    <span class='value'>
                        --
                    </span>
                </li> -->
            </ul>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import dayjs from 'dayjs'
export default {
    props: ['data'],
    setup ({ data }) {
        const onceState = {
            closeTime: dayjs(data.closeTime).format('YYYY.MM.DD HH:mm:ss')
        }
        const state = reactive({
            detailVisible: false
        })
        return {
            ...toRefs(state),
            ...onceState
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.positionItem {
    position: relative;
    padding: rem(20px) rem(40px);
    .mainWrap {
        position: relative;
        display: flex;
        align-items: center;
        overflow: hidden;
        .date {
            line-height: rem(40px);
        }
    }
    .hd {
        flex: 1;
        color: var(--mutedColor);
        font-size: rem(24px);
        line-height: 1.3;
    }
    .productName {
        color: var(--color);
        font-weight: bold;
        font-size: rem(30px);
        line-height: rem(40px);
        .volumn {
            font-weight: normal;
        }
    }
    .volums {
        padding-top: 3px;
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
}
.detail {
    margin-top: rem(10px);
    font-size: rem(24px);
    .date {
        font-weight: normal;
    }
    .list {
        display: grid;
        grid-column-gap: rem(30px);
        grid-template-columns: repeat(2, 1fr);
        margin-top: rem(10px);
    }
    .flexWrap {
        display: flex;
        justify-content: space-between;
        padding: 3px 0;
    }
}
</style>
