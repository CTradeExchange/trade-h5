<template>
    <div class='events-item-token'>
        <div v-for='(k, i) in list' :key='i' class='events-item-token-item' @click.stop='goToDetail(k)'>
            <span class='token-name'>
                {{ k.symbolName }}
            </span>
            <span class='token-price'>
                {{ k.rolling_last_price }}
            </span>
            <span :class="['token-ups-and-downs', k.rolling_upDownColor]">
                {{ !k.rolling_upDownWidth && k.rolling_upDownWidth != 0 ? '- -' : k.rolling_upDownWidth }}
            </span>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getProductList, isEmpty } from '@/utils/util.js'
import { QuoteSocket } from '@/plugins/socket/socket'
import { useStore } from 'vuex'
export default {
    props: {
        trades: {
            type: Array,
            default: () => [],
        },
    },
    setup (props) {
        const router = useRouter()
        const store = useStore()
        const state = reactive({
            list: [],
            productList: [],
            productKeys: [],
        })

        const goToDetail = (item) => {
            const { symbolId, symbolName, tradeType } = item || {}
            if (!symbolId) return
            store.commit('_quote/Update_productActivedID', `${symbolId}_${tradeType}`)
            router.push(`/order?name=${symbolName || ''}&symbolId=${symbolId || ''}&tradeType=${tradeType}`)
        }

        watch(
            () => props.trades,
            (newVal) => {
                if (!isEmpty(newVal)) {
                    const productList = getProductList(newVal) || []
                    const symbolKeys = productList.map((i) => i.symbolKey)
                    state.list = productList

                    if (!isEmpty(symbolKeys)) {
                        QuoteSocket.send_subscribe24H(symbolKeys)
                    }
                }
            },
            { immediate: true },
        )

        return {
            goToDetail,
            ...toRefs(state),
        }
    },
}
</script>

<style scoped lang="scss">
.events-item-token {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 10px 0;
    .events-item-token-item {
        min-height: 102px;
        border-radius: 4px;
        background-color: var(--fafColor);
        // flex: 1;
        width: 46%;
        // width: 48%;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 10px;
        margin:5px;
        .token-name {
            color: var(--mainColor);
            font-family: 'DM Sans';
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px;
        }
        .token-price {
            color: var(--mainColor);
            font-family: 'DM Sans';
            font-size: 18px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px;
            margin-bottom: 6px;
        }
        .token-ups-and-downs {
            color: var(--normalColor);
            font-family: 'DM Sans';
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px;
        }
    }
}
</style>
