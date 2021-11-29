<template>
    <div class='swipe-wrap'>
        <van-swipe
            :autoplay='0'
            class='my-swipe'
            indicator-color='white'
            :show-indicators='false'
        >
            <van-swipe-item>
                <div class='products-wrap'>
                    <div v-for='(item,index) in productList' :key='index' class='product-item'>
                        <p class='text1'>
                            {{ item.symbolName }}
                        </p>
                        <p class='text2' :class='[item.cur_color]'>
                            {{ item.cur_price }}
                        </p>
                        <p class='text3' :class='[item.upDownColor]'>
                            {{ item.upDownAmount || '--' }}
                        </p>
                        <timeSharingSvg />
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
import { QuoteSocket } from '@/plugins/socket/socket'
import timeSharingSvg from './components/timeSharingSvg.vue'
export default {
    components: { timeSharingSvg },
    setup () {
        const store = useStore()
        const router = useRouter()
        // 产品map数据
        const productMap = unref(computed(() => store.state._quote.productMap))
        const symbolKeys = ['27_1', '4_1', '7_1', '33_2'] // '33_2', '12_2'
        // 产品列表数据
        const productList = symbolKeys.map(key => productMap[key]).filter(elem => elem)
        QuoteSocket.add_subscribe({ moduleId: 'productsTimmeSharing', symbolKeys })
        return {
            productList
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.swipe-wrap{
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
