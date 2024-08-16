<template>
    <div class='btnGroupTop'>
        <div
            v-for='(item, i) in list'
            :key='`${item.symbolName}_${i}`'
            class='btnOutSideTop'
        >
            <template v-if='item.symbolName'>
                <div :class="['btnTop',bodyClass]" @click.stop='goToDetail(item)'>
                    <span>{{ item.symbolName }}</span>
                    <span :class="['upDownSpan',item.rolling_upDownColor]">
                        {{
                            !item.rolling_upDownWidth &&
                                item.rolling_upDownWidth != 0
                                ? "- -"
                                : item.rolling_upDownWidth
                        }}
                    </span>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, toRefs, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getProductList, isEmpty } from '@/utils/util.js'
import { QuoteSocket } from '@/plugins/socket/socket'
export default {
    props: {

        trades: {
            type: Array,
            default: () => []
        },
        bodyClass: {
            type: String,
            default: ''
        }
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()

        const state = reactive({
            userProductCategory: store.getters['_quote/userProductCategory'],
            list: [],
            productList: [],
            productKeys: []
        })

        const goToDetail = (item) => {
            const { symbolId, tradeType } = item || {}
            if (!symbolId) return
            router.push(`/product?symbolId=${symbolId}&tradeType=${tradeType}`)
        }
        watch(() => props.trades, (n) => {
            if (!isEmpty(n)) {
                state.list = getProductList(props.trades)
                const symbolKeys = state.list.map(i => i.symbolKey)
                if (!isEmpty(symbolKeys)) {
                    QuoteSocket.send_subscribe24H(symbolKeys)
                }
            }
        }, { immediate: true })

        return {
            goToDetail,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped lang="scss">
.btnGroupTop {
    display: flex;
    flex-wrap: wrap;
    margin: 0 rem(-9px);
    overflow: hidden;
    max-height: rem(122px);
    .btnOutSideTop {
        height: fit-content;
        padding: rem(4px);
        .btnTop {
            height: rem(52px);
            color: var(--contentColor);
            font-size: rem(22px);
            padding: 0 rem(12px);
            border-radius: rem(8px);
            border: 1px solid var(--contentColor);
            display: flex;
            align-items: center;
            background: rgba(0,0,0,0);
            .upDownSpan{
                margin-left: rem(5px);
            }

        }
    }
}
</style>
