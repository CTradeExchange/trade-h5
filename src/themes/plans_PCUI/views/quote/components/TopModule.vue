<template>
    <div class='header'>
        <div v-for='symbolKey in symbolKeys' :key='symbolKey' class='item' @click='gotoOrder(symbolKey)'>
            <span class='name'>
                {{ productMap[symbolKey]?.symbolCode || '- -' }}
            </span>
            <span class='price'>
                {{ productMap[symbolKey]?.price || '- -' }}
            </span>
            <div class='change'>
                <span class='upDownAmount'>
                    {{ productMap[symbolKey]?.upDownAmount || '- -' }}
                </span>
                <span class='upDownWidth' :class='[productMap[symbolKey]?.upDownColor]'>
                    {{ productMap[symbolKey]?.upDownWidth || '- -' }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { QuoteSocket } from '@/plugins/socket/socket'
const store = useStore()
const router = useRouter()
const gotoOrder = (symbolKey) => {
    const [symbolId, tradeType] = symbolKey.split('_')
    router.push({
        name: 'Order',
        query: {
            symbolId,
            tradeType
        }
    })
}
// 产品列表
const productMap = computed(() => store.state._quote.productMap)
const symbolKeys = ['27_1', '4_1', '7_1', '33_2', '12_2']
const unSubscribe = QuoteSocket.add_subscribe({ moduleId: 'topQuote', symbolKeys })

onUnmounted(() => {
    unSubscribe()
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.header{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    margin-bottom: 20px;
    .item{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 224px;
        height: 116px;
        color: var(--color);
        background: var(--contentColor);
        border-radius: 10px;
        padding: 20px;
        cursor: pointer;
        .name{
            font-size: 16px;
            font-weight: 400;
            line-height: 18px;
        }
        .price{
            font-size: 24px;
            line-height: 26px;
        }
        .change{
            height: 12px;
            line-height: 14px;
            .upDownAmount{
                margin-right: 10px;
            }
        }
    }
}
</style>
