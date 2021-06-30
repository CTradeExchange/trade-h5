<template>
    <ul v-if='products.length' class='products'>
        <li v-for='product in products' :key='product.symbolId' class='item'>
            <div class='name'>
                {{ product.symbolName }}
            </div>
            <div class='price' :class='[product.cur_color]'>
                {{ product.cur_price || '--' }}
            </div>
            <div class='change' :class='[product.upDownColor]'>
                {{ product.upDownAmount || '--' }} &nbsp; {{ product.upDownWidth }}
            </div>
        </li>
    </ul>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
export default {
    setup () {
        const store = useStore()
        const productMap = computed(() => store.state._quote.productMap)
        const products = [23, 24, 32].map(el => productMap.value[el]).filter(el => el)
        return {
            productMap,
            products
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.products {
    display: flex;
    width: 100%;
    padding: 10px rem(20px);
    line-height: 1.5;
    text-align: center;
    .item {
        flex: 1;
    }
    .name {
        font-size: rem(24px);
    }
    .price {
        padding: rem(10px) 0 rem(3px);
        font-size: rem(38px);
        line-height: 1.2;
    }
    .change {
        font-size: rem(24px);
    }
}
</style>
