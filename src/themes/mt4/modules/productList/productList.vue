<template>
    <div>
        <template v-for='item in productList' :key='item'>
            <productItem v-if='item.symbolName' :product='item' @open='openProduct(item)' />
        </template>
    </div>
    <van-popup v-model:show='show'>
        <section class='popContainer'>
            <p class='title'>
                {{ cur.symbolName }}
            </p>
            <div class='menulist'>
                <a class='item of-1px-bottom ' href='javascript:;' @click='toOrder'>
                    新交易
                </a>
                <a class='item of-1px-bottom ' href='javascript:;' @click="show=false;$router.push('/chart')">
                    打开图表
                </a>
                <a class='item of-1px-bottom ' href='javascript:;' @click='toContract'>
                    交易品种属性
                </a>
                <a v-if='quoteMode===2' class='item of-1px-bottom ' href='javascript:;' @click='switchQuoteMode'>
                    简单查看模式
                </a>
                <a v-else class='item of-1px-bottom ' href='javascript:;' @click='switchQuoteMode'>
                    高级查看模式
                </a>
            </div>
        </section>
    </van-popup>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import productItem from './productItem'
import { useRouter } from 'vue-router'
export default {
    components: {
        productItem,
    },
    setup () {
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            list: [...new Array(10)],
            show: false,
            cur: {},
        })
        let symbolId = null
        // 行情列表模式 1高级模式 2简单模式
        const quoteMode = computed(() => store.state.quoteMode)
        // 产品列表
        const productList = computed(() => store.state._quote.productList)
        // 切换行情列表模式
        const switchQuoteMode = () => {
            store.commit('Update_quoteMode', quoteMode.value === 1 ? 2 : 1)
            state.show = false
        }
        // 点击某个产品
        const openProduct = (item) => {
            store.commit('_quote/Update_productActivedID', item.symbol_id)
            symbolId = item.symbol_id
            state.cur = item
            state.show = true
        }
        // 去交易
        const toOrder = () => {
            router.push({ name: 'Order', query: { symbolId } })
        }
        // 去合约属性
        const toContract = () => {
            router.push({ name: 'Contract', query: { symbolId } })
        }
        return {
            ...toRefs(state),
            quoteMode,
            productList,
            switchQuoteMode,
            toOrder,
            openProduct,
            toContract,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.popContainer {
    width: 80vw;
    background: var(--white);
    .title {
        padding: rem(35px) rem(30px);
        color: var(--primary);
        font-size: rem(40px);
        border-bottom: 2px solid var(--primary);
    }
    .menulist {
        .item {
            @include active()
        ;
            display: block;
            padding: 0 rem(30px);
            color: var(--color);
            line-height: rem(94px);
        }
    }
}
</style>
