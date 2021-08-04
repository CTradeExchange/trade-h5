<template>
    <div class='switchTradeType'>
        <div v-if='tradeTypeList.length>1' class='switchWrapper'>
            <span v-for='item in tradeTypeList' :key='item.id' class='item' :class='{ active:item.id == product.tradeType }' @click='onChange(item)'>
                {{ item.name }}
            </span>
        </div>
        <div class='productInfo'>
            <span class='icon_chouti'></span>
            <span class='productName'>
                {{ product.symbolName }}
            </span>
            <span class='upDownWidth' :class='product.upDownColor'>
                {{ product.upDownWidth }}
            </span>
            <span class='chartIcon icon_icon_chart' @click="$router.push({ name:'Product', query: { symbolId:product.symbolId, tradeType:product.tradeType } })"></span>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
export default {
    emits: ['switchTradeType'],
    setup (props, { emit }) {
        const store = useStore()
        const tradeTypeList = computed(() => store.state._base.plans)
        const product = computed(() => store.getters['_trade/product'])
        const onChange = (data) => {
            if (data.id == product.value?.tradeType) return false
            emit('switchTradeType', data)
        }
        return {
            product,
            tradeTypeList,
            onChange
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.switchTradeType {
    position: relative;
    background: var(--contentColor);
}
.switchWrapper {
    display: flex;
    height: rem(90px);
    padding: 0 rem(30px);
    color: var(--minorColor);
    font-size: rem(28px);
    line-height: rem(90px);
    border-bottom: 1px solid var(--assistColor);
    .item {
        margin-right: rem(35px);
        vertical-align: baseline;
    }
    .active {
        color: var(--color);
        font-weight: bold;
        font-size: rem(38px);
    }
}
.productInfo {
    display: flex;
    align-items: center;
    height: rem(104px);
    padding: 0 rem(30px);
    font-size: rem(34px);
    line-height: rem(104px);
    .icon_chouti {
        padding-right: rem(20px);
        font-size: rem(29px);
    }
    .productName {
        padding-right: rem(20px);
    }
    .upDownWidth {
        flex: 1;
    }
    .chartIcon {
        width: rem(62px);
        height: rem(58px);
        color: var(--primary);
        font-weight: 500;
        font-size: rem(30px);
        line-height: rem(58px);
        text-align: center;
        background: var(--primaryAssistColor);
        border-radius: 3px;
    }
}
</style>
