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
                        <svg class='peity' height='16' width='50'>
                            <polygon fill='rgba(0,0,0,0)' points='0 15.5 0 5.860121304018202 1.8518518518518519 6.84950720242608 3.7037037037037037 6.155799848369973 5.555555555555555 7.520470053070513 7.407407407407407 8.4529946929492 9.25925925925926 15.5 11.11111111111111 14.840409401061418 12.962962962962964 13.559135708870354 14.814814814814815 11.508339651250946 16.666666666666668 5.716072782410915 18.51851851851852 7.1679302501895386 20.37037037037037 6.716830932524644 22.22222222222222 6.197498104624717 24.074074074074073 9.108794541319185 25.925925925925927 5.439347990902199 27.77777777777778 7.895754359363152 29.62962962962963 7.349886277482939 31.48148148148148 6.110310841546632 33.333333333333336 0.5 35.18518518518518 6.064821834723277 37.03703703703704 4.051933282789996 38.888888888888886 3.3923426838514015 40.74074074074074 5.670583775587572 42.592592592592595 5.101971190295686 44.44444444444444 7.71758908263836 46.2962962962963 3.70318423047763 48.148148148148145 3.843442001516298 50 5.219484457922665 50 15.5' /><polyline fill='none' points='0 5.860121304018202 1.8518518518518519 6.84950720242608 3.7037037037037037 6.155799848369973 5.555555555555555 7.520470053070513 7.407407407407407 8.4529946929492 9.25925925925926 15.5 11.11111111111111 14.840409401061418 12.962962962962964 13.559135708870354 14.814814814814815 11.508339651250946 16.666666666666668 5.716072782410915 18.51851851851852 7.1679302501895386 20.37037037037037 6.716830932524644 22.22222222222222 6.197498104624717 24.074074074074073 9.108794541319185 25.925925925925927 5.439347990902199 27.77777777777778 7.895754359363152 29.62962962962963 7.349886277482939 31.48148148148148 6.110310841546632 33.333333333333336 0.5 35.18518518518518 6.064821834723277 37.03703703703704 4.051933282789996 38.888888888888886 3.3923426838514015 40.74074074074074 5.670583775587572 42.592592592592595 5.101971190295686 44.44444444444444 7.71758908263836 46.2962962962963 3.70318423047763 48.148148148148145 3.843442001516298 50 5.219484457922665' stroke='#008555' stroke-linecap='square' stroke-width='1' />
                        </svg>
                    </div>
                </div>
            </van-swipe-item>
            <van-swipe-item>2</van-swipe-item>
            <van-swipe-item>3</van-swipe-item>
            <van-swipe-item>4</van-swipe-item>
        </van-swipe>
    </div>
</template>

<script>
import { computed, unref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { QuoteSocket } from '@/plugins/socket/socket'
export default {
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
            text-align: center;
            padding: rem(23px);
            .text1{
                font-size: rem(24px);
            }
        }
    }
}
</style>
