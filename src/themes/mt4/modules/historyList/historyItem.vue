<template>
    <div class='positionItem of-1px-bottom' @click='detailVisible=!detailVisible'>
        <div class='mainWrap'>
            <div class='hd'>
                <p class='productName'>
                    {{ data.symbolName }},
                    <span class='volumn'>
                        {{ data.direction===1?'buy':'sell' }} 1.00
                    </span>
                </p>
                <p>
                    <span>{{ executePrice }}</span>
                    <span> →</span>
                    <span>{{ executePrice }}</span>
                </p>
            </div>
            <div class='col'>
                <p class='price riseColor'>
                    -34.66
                </p>
            </div>
        </div>
        <div v-if='detailVisible' class='detail muted'>
            <p class='date '>
                2021.01.12 09:03
            </p>
            <ul class='list'>
                <li class='flexWrap'>
                    <span class='title'>
                        S/L
                    </span>
                    <span class='value'>
                        --
                    </span>
                </li>
                <li class='flexWrap'>
                    <span class='title'>
                        库存费
                    </span>
                    <span class='value'>
                        --
                    </span>
                </li>
                <li class='flexWrap'>
                    <span class='title'>
                        T/P
                    </span>
                    <span class='value'>
                        --
                    </span>
                </li>
                <li class='flexWrap'>
                    <span class='title'>
                        税金
                    </span>
                    <span class='value'>
                        --
                    </span>
                </li>
                <li class='flexWrap'>
                    <span class='title'>
                        ID
                    </span>
                    <span class='value'>
                        692666666
                    </span>
                </li>
                <li class='flexWrap'>
                    <span class='title'>
                        手续费
                    </span>
                    <span class='value'>
                        --
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
export default {
    props: ['data'],
    setup ({ data }) {
        const onceState = {
            executePrice: data.executePrice
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
}
.detail {
    margin-top: rem(10px);
    font-size: rem(22px);
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
    }
}
</style>
