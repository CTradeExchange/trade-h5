<template>
    <div class='list'>
        <div v-for='product in productList' :key='product.symbolId' class='item' @click='goToProduct(product)'>
            <div>{{ product.symbolName }}</div>
            <div :class='[productMap[product.symbolKey]?.last_color]'>
                {{ !product.rolling_last_price && product.rolling_last_price != 0 ? '- -' : product.rolling_last_price }}
            </div>
            <div :class='[productMap[product.symbolKey]?.rolling_upDownColor]'>
                {{ !product.rolling_upDownWidth && product.rolling_upDownWidth != 0 ? '- -' : product.rolling_upDownWidth }}
            </div>
            <!-- <div>
                <div v-if='!!tradeData[product.symbolId] && !!tradeData[product.symbolId].num' class='trade-data' @click.stop='handleOpen(product)'>
                    <img src='@/assets/newUI/matter.png' />
                    <span class='trade-num'>
                        {{ tradeData[product.symbolId].num }}
                    </span>
                </div>
                <div class='btn'>
                    {{ $t('route.trade') }}
                </div>
            </div> -->
        </div>
    </div>
    <newsItemDialog
        :trade-i-d='tradeID'
        :visibles='visibles'
        @close='visibles = false'
    />
</template>

<script>
import { useRouter } from 'vue-router'
import { getCookie, parseJSON } from '@/utils/util'
import { GetTrade } from '@/api/newApi.js'
import { onMounted, reactive, toRefs, computed } from 'vue'
import newsItemDialog from '@planspc/components/newsItemDialog.vue'
import { useStore } from 'vuex'
export default {
    components: { newsItemDialog },
    props: {
        productList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    setup () {
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            tradeData: {},
            tradeID: null,
            visibles: false
        })

        const productMap = computed(() => store.state._quote.productMap)

        const goToProduct = (item) => {
            const { tradeType, symbolName, symbolId } = item || {}
            router.push({
                name: 'Order',
                query: {
                    name: symbolName?.replace(/ /g, '_'),
                    symbolId,
                    tradeType
                }
            })
        }

        onMounted(() => {
            GetTrade({
                body: {
                    Limit: -1,
                    Language: getCookie('lang')
                }
            }).then(res => {
                const objs = {}
                res.List.forEach(i => {
                    const { SymbolId } = parseJSON(i.Extra) || {}
                    if (SymbolId) {
                        objs[SymbolId] = {
                            num: i.ItemCount,
                            id: i.ID
                        }
                    }
                })
                state.tradeData = objs
            })
        })

        const handleOpen = (product) => {
            state.tradeID = state.tradeData[product?.symbolId]?.id
            state.visibles = true
        }

        return {
            productMap,
            handleOpen,
            goToProduct,
            ...toRefs(state)
        }
    }

}
</script>

<style scoped lang="scss">
.list{
    .item{
        display: flex;
        align-items: center;
        height: 50px;
        border-bottom:1px solid var(--cellBg);
        padding: 0 20px;
        cursor: pointer;
        &>div{
            flex:1;
            &:nth-of-type(1){
                text-align: left;
            }
            &:nth-of-type(2){
                text-align: center;
            }
            &:nth-of-type(3){
                text-align: right;
            }
            &:nth-of-type(4){
                text-align: right;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                .trade-data{
                    position: relative;
                    width: 20px;
                    height: 22px;
                    margin-right: 20px;
                    &>img{
                        width: 100%;
                    }
                    .trade-num{
                        text-align: center;
                        min-width: 16px;
                        height: 16px;
                        line-height: 16px;
                        font-size: 12px;
                        background: var(--primary);
                        padding: 0px 1px;
                        color: var(--contentColor);
                        border-radius: 4px;
                        position: absolute;
                        left: 14px;
                        top: 0;
                    }
                }
            }
            .btn{
                position: relative;
                display: inline-block;
                width: 80px;
                height: 28px;
                overflow: hidden;
                color: var(--primary);
                font-weight: 400;
                font-size: 14px;
                line-height: 28px;
                text-align: center;
                vertical-align: middle;
                border: 1px solid var(--primary);
                border-radius: 4px;
                cursor: pointer;
                transition: all linear 0.1s;
                &:hover{
                    background: var(--primary);
                    color:var(--contentColor)
                }
            }
        }
    }
}

</style>
