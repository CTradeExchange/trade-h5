<template>
    <div class='swipe-wrap' :style='data.styleObj'>
        <div v-if='h5Preview' class='default-wrap'>
            <img alt='' src='./productsTimeSharing.png' />
        </div>
        <van-swipe
            v-else
            :autoplay='0'
            class='my-swipe'
            indicator-color='white'
            :show-indicators='false'
            @change='onChangeSwipe'
        >
            <van-swipe-item
                v-for='(item,i ) in swiperList'
                :key='i'
            >
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
                            {{ product.cur_price || '--' }}
                        </p>
                        <p class='text3' :class='[product.upDownColor]'>
                            {{ product.upDownWidth || '--' }}
                        </p>
                        <klineSvg :data='klineData.slice(0,48)' :height='30' :product='product' :width='90' />
                    </div>
                </div>
            </van-swipe-item>
        </van-swipe>
    </div>
</template>

<script>
import { computed, unref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { QuoteSocket } from '@/plugins/socket/socket'
import klineSvg from '@plans/components/klineSvg.vue'
export default {
    components: { klineSvg },
    props: {
        data: {
            type: Object,
            default () { return {} }
        },
    },
    setup (props) {
        const h5Preview = process.env.VUE_APP_h5Preview
        const store = useStore()
        const router = useRouter()
        // 产品map数据
        const productMap = computed(() => store.state._quote.productMap)

        const customerGroupId = computed(() => store.getters.customerGroupId)
        const symbolKeys = Object.entries(props.data.product || {}).map(([tradeType, item]) => {
            const list = item[customerGroupId.value] || []
            return list.map(symbolId => `${symbolId}_${tradeType}`)
        }).flat()
        const products = symbolKeys.map(symbolKey => productMap.value[symbolKey]).filter(el => el)

        const klineData = [1.13472, 1.13502, 1.13441, 1.13339, 1.13247, 1.13274, 1.13313, 1.13271, 1.13212, 1.13167, 1.13213, 1.13127, 1.13173, 1.13202, 1.13217, 1.13216, 1.13232, 1.13222, 1.13265, 1.13231, 1.13214, 1.13219, 1.13113, 1.12888, 1.12979, 1.12981, 1.12918, 1.12991, 1.13012, 1.13023, 1.13132, 1.13027, 1.13183, 1.13175, 1.13111, 1.13125, 1.13132, 1.13077, 1.13142, 1.13246, 1.13247, 1.13169, 1.13145, 1.12989, 1.13089, 1.13182, 1.13094, 1.1308, 1.13041, 1.13207, 1.1321, 1.1319, 1.13244, 1.1318, 1.13149, 1.13146, 1.13175, 1.13226, 1.13199, 1.13195, 1.13209, 1.13195, 1.13231, 1.13232, 1.1328, 1.13243, 1.13352, 1.13343, 1.13293, 1.13281, 1.13282, 1.13251, 1.13197, 1.13181, 1.13192, 1.13196, 1.13287, 1.13348, 1.13384, 1.13337, 1.13304, 1.13319, 1.13306, 1.13374, 1.13443, 1.13443, 1.13407, 1.134, 1.13339, 1.13346, 1.13406, 1.13416, 1.13507, 1.13482, 1.13477, 1.13586, 1.13732, 1.13699, 1.13689, 1.13676]

        const getSubscribeData = (index) => {
            return swiperList[index] && swiperList[index].map(item => {
                return {
                    symbol_id: item.symbolId,
                    trade_type: item.tradeType,
                    trade_mode: item.dealMode,
                    kline_type: 4,
                    query_kline_num: 50,
                    kline_timestamp_end: Math.round(new Date().getTime() / 1000).toString()
                }
            })
        }

        // 产品列表数据
        const productList = symbolKeys.map(key => productMap[key]).filter(elem => elem)
        const swiperList = []
        products.forEach((el, i) => { // 将产品分成3个一组，显示成swiper轮播
            debugger
            if (i % 3 === 0) swiperList.push([])
            const lastItem = swiperList[swiperList.length - 1]
            lastItem.push(el)
        })

        const openProduct = (data) => {
            router.push({ name: 'Product', query: { symbolId: data.symbolId, tradeType: data.tradeType } })
        }

        const onChangeSwipe = (index) => {
            QuoteSocket.batchGetKlineData(getSubscribeData(index))
        }

        // onMounted(() => {
        if (!h5Preview && getSubscribeData(0)) {
            QuoteSocket.batchGetKlineData(getSubscribeData(0))
        }
        // })

        return {
            productList,
            openProduct,
            swiperList,
            symbolKeys,
            klineData,
            onChangeSwipe
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
