<template>
    <div class='btnGroup'>
        <div v-for='item in list' :key='item.symbolName' class='btnOutSide' :class='position'>
            <div v-if='item.symbolName' class='list-item' @click.stop='goToDetail(item)'>
                <div class='list-item-name'>
                    <!-- <img alt='' src='../../images/fire.png' /> -->
                    <span>{{ item.symbolName }}</span>
                </div>
                <div class='list-item-price'>
                    <span class='item-price-num'>
                        {{ item.rolling_last_price }}
                    </span>
                    <span :class="['item-up-down',item.rolling_upDownColor]">
                        {{ !item.rolling_upDownWidth && item.rolling_upDownWidth != 0 ? '- -' : item.rolling_upDownWidth }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getProductList, isEmpty } from '@/utils/util.js'
import { QuoteSocket } from '@/plugins/socket/socket'
export default {
    props: {
        trades: {
            type: Array,
            default: () => [],
        },
        position: {
            type: String,
            default: 'top',
        },
    },
    setup (props) {
        const router = useRouter()

        const state = reactive({
            list: [],
            productList: [],
            productKeys: [],
        })

        const goToDetail = (item) => {
            const { symbolId, symbolName, tradeType } = item || {}
            if (!symbolId) return
            router.push(`/order?name=${symbolName || ''}&symbolId=${symbolId || ''}&tradeType=${tradeType}`)
        }

        watch(
            () => props.trades,
            (newVal) => {
                if (!isEmpty(newVal)) {
                    const productList = getProductList(newVal) || []
                    const symbolKeys = productList.map((i) => i.symbolKey)
                    state.list = productList

                    console.log(productList, '?????????????')
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
.btnGroup {
    display: flex;
    flex-wrap: wrap;
    .btnOutSide {
        .list-item {
            border-radius: 16px;
            border: 1px solid #ffebee;
            background: #fff;
            width: 220px;
            min-height: 102px;
            padding: 16px 10px;
            margin-right: 24px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            cursor:pointer;
            .list-item-name {
                display: flex;
                align-items: center;
                & > img {
                    max-width: 24px;
                    max-height: 24px;
                    margin-right: 4px;
                }
                & > span {
                    color: var(--mainColor);
                    font-size: 14px;
                    font-weight: 700;
                    line-height: 24px;
                }
            }
            .list-item-price {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                .item-price-num {
                    color: var(--mainColor);
                    font-size: 20px;
                    font-weight: 700;
                }
                .item-up-down {
                    font-size: 16px;
                    font-weight: 700;
                    line-height: 24px;
                }
            }
        }
    }
}

@media screen and (max-width: 767px){
  .btnGroup {
    max-width:100vw;
    display: flex;
    flex-wrap: wrap;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    .btnOutSide {
        margin:20px;
        .list-item {
            border-radius: 16px;
            border: 1px solid #ffebee;
            background: #fff;
            width: 220px;
            min-height: 102px;
            padding: 16px 10px;
            margin-right: 24px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            cursor:pointer;
            .list-item-name {
                display: flex;
                align-items: center;
                & > img {
                    max-width: 24px;
                    max-height: 24px;
                    margin-right: 4px;
                }
                & > span {
                    color: var(--mainColor);
                    font-size: 14px;
                    font-weight: 700;
                    line-height: 24px;
                }
            }
            .list-item-price {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                .item-price-num {
                    color: var(--mainColor);
                    font-size: 20px;
                    font-weight: 700;
                }
                .item-up-down {
                    font-size: 16px;
                    font-weight: 700;
                    line-height: 24px;
                }
            }
        }
    }
}
}

</style>
