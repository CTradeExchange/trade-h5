<template>
    <div class='swipe-wrap' :style='data.styleObj'>
        <div v-if='h5Preview' class='default-wrap'>
            <img alt='' src='./default.png' />
        </div>
        <van-swipe
            v-else
            :autoplay='0'
            class='my-swipe'
            indicator-color='white'
            :show-indicators='false'
        >
            <van-swipe-item v-for='(item,i ) in swiperList' :key='i'>
                <div class='products-wrap'>
                    <div
                        v-for='product in item'
                        :key='product.symbolId'
                        class='product-item'
                        @click='openProduct(product)'
                    >
                        <p class='text1'>
                            {{ product.symbolName }}
                        </p>
                        <p class='text2' :class='[product.cur_color]'>
                            {{ product.cur_price }}
                        </p>
                        <p class='text3' :class='[product.upDownColor]'>
                            {{ product.upDownWidth || '--' }}
                        </p>
                        <timeSharingSvg :color='product.upDownColor' :product='product' :symbol-keys='symbolKeys' />
                    </div>
                </div>
            </van-swipe-item>
        </van-swipe>
    </div>
</template>

<script>
import { computed, unref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import timeSharingSvg from './components/timeSharingSvg.vue'
export default {
    components: { timeSharingSvg },
    props: {
        data: {
            type: Object,
            default () { return {} }
        },
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        // 产品map数据
        const productMap = computed(() => store.state._quote.productMap)

        const customerGroupId = computed(() => store.getters.customerGroupId)
        const symbolKeys = Object.entries(props.data.product || {}).map(([tradeType, item]) => {
            debugger
            const list = item[customerGroupId.value] || []
            return list.map(symbolId => `${symbolId}_${tradeType}`)
        }).flat()
        const products = symbolKeys.map(symbolKey => productMap.value[symbolKey]).filter(el => el)

        // 产品列表数据
        const productList = symbolKeys.map(key => productMap[key]).filter(elem => elem)
        const swiperList = []
        products.forEach((el, i) => { // 将产品分成3个一组，显示成swiper轮播
            if (i % 3 === 0) swiperList.push([])
            const lastItem = swiperList[swiperList.length - 1]
            lastItem.push(el)
        })

        const openProduct = (data) => {
            router.push({ name: 'Product', query: { symbolId: data.symbolId, tradeType: data.tradeType } })
        }
        return {
            productList,
            openProduct,
            swiperList,
            symbolKeys
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.swipe-wrap{
    background: var(--contentColor);
    padding:0 rem(30px);
    .products-wrap{
        display: flex;
        justify-content: flex-start;
        .product-item{

            flex: 1;
            padding: rem(23px);
            margin-right: rem(30px);
            .text1,.text3{
                font-size: rem(24px);
                margin-bottom: rem(8px);
            }
            .text2{
                font-size: rem(40px);
            }

        }
    }
}
</style>
