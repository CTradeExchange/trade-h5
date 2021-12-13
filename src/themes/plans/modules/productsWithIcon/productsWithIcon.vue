<template>
    <div class='wrap' :style='data.styleObj'>
        <div class='product-wrap'>
            <div v-if='data.items.length === 0' class='default'>
                <img alt='' :src="require('./productsWithIcon.png')" />
            </div>

            <div v-for='(item, index) in data.items' v-else :key='index' class='product' @click='openProduct(item)'>
                <i class='icon'>
                    <img alt='' :src='item.src' srcset='' />
                </i>
                {{ item.product }}
                <div class='symbol'>
                    <p class='symbol-name'>
                        {{ item.symbolName || '产品名称' }}
                    </p>
                    <p class='symbol-code'>
                        {{ item.symbolCode || '产品编码' }}
                    </p>
                </div>
                <div class='price'>
                    <p class='cur-price' :class='[item.cur_color]'>
                        {{ item.cur_price || '--' }}
                    </p>
                    <p class='up-down' :class='[item.upDownColor]'>
                        {{ item.upDownWidth || '--' }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { QuoteSocket } from '@/plugins/socket/socket'
import { computed, unref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { isEmpty } from '@/utils/util'
export default {
    props: {
        data: {
            type: Object,
            default: function () {
                return {
                    href: '',
                    src: '',
                    target: ''
                }
            }
        }
    },
    setup (props) {
        const h5Preview = process.env.VUE_APP_h5Preview
        const store = useStore()
        const router = useRouter()
        const customerGroupId = computed(() => store.getters.customerGroupId)
        // 产品map数据
        const productMap = unref(computed(() => store.state._quote.productMap))

        const symbolKeys = Object.entries(props.data.product || {}).map(([tradeType, item]) => {
            const list = item[customerGroupId.value] || []
            return list.map(symbolId => `${symbolId}_${tradeType}`)
        }).flat()

        // const symbolKeysss = props.data.items.map(el => {
        //     if (!isEmpty(el.product)) {
        //         Object.entries(el.product).map(([tradeType, item]) => {
        //             const list = item[customerGroupId.value] || []
        //             return list.map(symbolId => `${symbolId}_${tradeType}`)
        //         })
        //     }
        // })

        const productList = symbolKeys.map(key => productMap[key]).filter(elem => elem)

        if (!h5Preview) { QuoteSocket.add_subscribe({ moduleId: 'productsWithIcon', symbolKeys }) }

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
    background: var(--contentColor);
    padding: rem(43px) rem(50px);
    .default{
        img{
            width: 100%;
        }

    }
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
