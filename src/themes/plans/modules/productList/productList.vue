<template>
    <div ref='productListEl' class='productListWrap'>
        <slot v-for='item in computedProductList' :key='item' :open='() => openProduct(item)' :product='productMap[item.symbolKey]'>
            <productItem :product='productMap[item.symbolKey]' @open='openProduct(item)' />
        </slot>
    </div>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import productItem from './productItem'
import { useRouter } from 'vue-router'
import subscribeProducts from '@planspc/hooks/subscribeProducts'

export default {
    components: {
        productItem,
    },
    props: ['productList'],
    setup (props) {
        const router = useRouter()
        const state = reactive({
            list: [...new Array(10)],
            show: false,
        })

        // 产品列表
        const computedProductList = computed(() => props.productList)
        const { productListEl, productMap } = subscribeProducts(computedProductList)
        const openProduct = (data) => {
            router.push(`/product?symbolId=${data.symbolId}&tradeType=${data.tradeType}`)
        }
        return {
            ...toRefs(state),
            productListEl,
            productMap,
            openProduct,
            computedProductList
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.productListWrap {
    width: 100%;
}
</style>
