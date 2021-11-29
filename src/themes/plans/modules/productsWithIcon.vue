<template>
    <div class='product-wrap'>
        <div v-for='(item, index) in productList' :key='index' class='product' @click='openProduct(item)'>
            <i class='icon'>
                <img alt='' :src='"/images/product/" + item.symbolCode + ".png?5325"' srcset='' />
            </i>
            <div class='symbol'>
                <p class='symbol-name'>
                    {{ item.symbolName }}
                </p>
                <p class='symbol-code'>
                    {{ item.symbolCode }}
                </p>
            </div>
            <div class='price'>
                <p class='cur-price' :class='[item.cur_color]'>
                    {{ item.cur_price }}
                </p>
                <p class='up-down' :class='[item.upDownColor]'>
                    {{ item.upDownAmount || '--' }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { QuoteSocket } from '@/plugins/socket/socket'
import { computed, unref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
    setup () {
        const store = useStore()
        const router = useRouter()
        const symbolKeys = ['59_1', '56_1', '193_1', '28_3', '191_1']
        // 产品map数据
        const productMap = unref(computed(() => store.state._quote.productMap))
        const productList = symbolKeys.map(key => productMap[key]).filter(elem => elem)

        QuoteSocket.add_subscribe({ moduleId: 'productsTimmeSharing', symbolKeys })

        const openProduct = (data) => {
            // router.push({ name: 'Order', query: { symbolId: data.symbolId, direction: 'buy' } })
            router.push(`/product?symbolId=${data.symbolId}&tradeType=${data.tradeType}`)
        }

        return {
            openProduct,
            productList
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.product-wrap{
    padding: rem(43px) rem(50px);
    .product{
        margin-bottom: rem(67px);
        display: flex;
        align-items: center;
        .icon{
            width: rem(65px);
            height: rem(65px);
            margin-right: rem(34px);
            img{
                width: 100%;
            }
        }
        .symbol{
            flex: 1;
            .symbol-name{
                font-size: rem(32px);
                color: var(--color);
            }
            .symbol-code{
                font-size: rem(24px);
                color: var(--minorColor);
            }
        }
        .price{
            .cur-price{
                font-size: rem(32px);
                text-align: right;
            }
            .up-down{
                font-size: rem(24px);
                text-align: right;
            }

        }
         &:last-child{
            margin-bottom: 0;
        }
    }
}

</style>
