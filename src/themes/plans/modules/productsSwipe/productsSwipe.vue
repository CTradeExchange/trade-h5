<template>
    <ul v-if='products.length' class='productsSwipe'>
        <li v-for='product in products' :key='product.symbolId' class='item' @click='handlerItem(product)'>
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
    <div v-else class='default-wrap'>
        <img alt='' :src='defaultImg' />
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
const defaultImg = require('./productSwipe.png')
export default {
    props: {
        symbolKeys: {
            type: Array,
            default () { return [] }
        },
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const productMap = computed(() => store.state._quote.productMap)
        const products = props.symbolKeys.map(symbolKey => productMap.value[symbolKey]).filter(el => el)
        // 点击进入产品详情页面
        const handlerItem = item => {
            router.push({ name: 'Product', query: { symbolId: item.symbolId, tradeType: item.tradeType } })
        }
        return {
            productMap,
            handlerItem,
            products,
            defaultImg
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.productsSwipe {
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
.default-wrap {
    img {
        width: 100%;
    }
}
</style>
