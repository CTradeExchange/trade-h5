<template>
    <div v-if='product' class='directions' :class="{ 'center': dealModeShowMap[product.dealMode]?.handicap }">
        <div class='item buy' :class="{ 'active':modelValue==='buy' }" @click="setDirection('buy')">
            <span>
                {{ $t('trade.buy') }}
            </span>
            <span v-if='!dealModeShowMap[product.dealMode]?.handicap' class='price flRight'>
                {{ product.buy_price }}
            </span>
        </div>
        <div class='item sell' :class="{ 'active':modelValue==='sell' }" @click="setDirection('sell')">
            <span>
                {{ $t('trade.sell') }}
            </span>
            <span v-if='!dealModeShowMap[product.dealMode]?.handicap' class='price flRight'>
                {{ product.sell_price }}
            </span>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { toolHooks } from '@plans/hooks/handicap'
export default {
    props: ['modelValue', 'product'],
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const store = useStore()
        const { dealModeShowMap } = toolHooks()

        // 颜色值
        const style = computed(() => store.state.style)
        const setDirection = (data) => {
            emit('update:modelValue', data)
        }
        // 16进制颜色透明度
        const fallColor = style.value.fallColor + '80'
        const riseColor = style.value.riseColor + '80'
        return {
            setDirection,
            dealModeShowMap,
            fallColor,
            riseColor
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.directions {
    position: relative;
    display: flex;
    margin-top: rem(38px);
    &.center {
        text-align: center;
        .item {
            padding: 0 !important;
            line-height: rem(75px);
        }
        .flRight {
            float: none;
            text-align: center;
        }
    }
    .item {
        flex: 1;
        box-sizing: border-box;
        height: rem(80px);
        padding: rem(10px) rem(20px);
        color: var(--color);
        line-height: rem(56px);
        border-radius: rem(6px);
        font-weight: 500;
        font-size: rem(26px);
        &.sell {
            margin-left: 5px;
            border: solid rem(2px) #F25B51;
            color: #F25B51;
            &.active {
                opacity: 1;
                color: #FFF;
                background: #F25B51;
                //background: var(--riseColor);

            }
        }
        &.buy {
            margin-right: 5px;
            border: solid rem(2px) #349A71;
            color: #349A71;
            &.active {
                opacity: 1;
                color: #FFF;
                //background: var(--fallColor);
                background: #349A71;
            }
        }
    }
    .price {
        font-size: rem(26px);
    }
    .flRight {
        float: right;
    }
}
</style>
