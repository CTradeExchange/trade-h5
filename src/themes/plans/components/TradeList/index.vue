<template>
    <div v-if='!isEmpty(sortProdctList)' class='cardBox'>
        <template v-if='!link'>
            <div class='tradeTitle'>
                <div>{{ $t("news.relatedTrade") }}</div>
            </div>
            <div class='tradeList customTableContainer'>
                <TrandeBar
                    :show-trade='showTrade'
                    :sort-field='sortField'
                    :sort-type='sortType'
                    @changeSortField='changeSortField'
                    @changeSortType='changeSortType'
                />
                <ProductListComp ref='productListEl' :product-list='sortProdctList' :show-trade='showTrade' :trade-data='tradeObj' />
            </div>
        </template>
        <template v-else-if='Array.isArray(sortProdctList) && sortProdctList.length'>
            <div class='link-btn'>
                <div
                    v-for='(item, index) in embedList'
                    :key='index'
                    :class='btnsObj[item].class'
                    :style="item === 'trade' ? { background: 'var(--primaryText)' } : {}"
                    @click='btnsObj[item].click(sortProdctList[0])'
                >
                    <span :class='btnsObj[item].class'>
                        {{ btnsObj[item].label }}
                    </span>
                </div>
            </div>
            <div class='tradeList customTableContainer'>
                <TrandeBar
                    :show-trade='showTrade'
                    :sort-field='sortField'
                    :sort-type='sortType'
                    @changeSortField='changeSortField'
                    @changeSortType='changeSortType'
                />
                <ProductListComp ref='productListEl' :product-list='sortProdctList' :show-trade='showTrade' :trade-data='tradeObj' />
            </div>
        </template>
    </div>
</template>

<script>
import ProductListComp from '@plans/modules/productList/productList.vue'
import { localGet, isEmpty, getProductList, getCookie, parseJSON, getPathParams } from '@/utils/util.js'
import { gte } from '@/utils/calculation.js'
import {
    toRefs,
    reactive,
    computed,
    onMounted,
    ref,
    unref,
    watch
} from 'vue'
import { MsgSocket } from '@/plugins/socket/socket'
import { useRoute, useRouter } from 'vue-router'
import { GetTrade } from '@/api/newApi'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import TrandeBar from './bar.vue'

export default {
    components: { TrandeBar, ProductListComp },
    props: {
        trades: {
            type: Array,
            default: () => {
                return []
            }
        },
        link: {
            type: Boolean,
            default: false
        },
        embed: {
            type: String,
            default: ''
        }
    },

    setup (props, { emit }) {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { isUniapp } = getPathParams()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            sortField: localGet('productListSortField') || '',
            sortType: localGet('productListSortType') || '',
            currentIndex: 0,
            tradeObj: {},
            showTrade: false,
            embedList: computed(() => props.embed.split(',').filter(i => i)),
            btnsObj: {
                trade: {
                    label: t('bannerTopic.tradeNow'),
                    class: 'tradeBtn',
                    click: (item) => {
                        if (isUniapp) {
                            uni.postMessage({
                                data: {
                                    action: 'eventMessage',
                                    type: 'click',
                                    data: {
                                        path: 'trade'
                                    }
                                }
                            })
                            return
                        }

                        router.push(`/product?symbolId=${item.symbolId}&tradeType=${item.tradeType}`)
                    }
                },
                deposit: {
                    label: t('common.deposit'),
                    class: 'depositBtn',
                    click: () => {
                        if (isUniapp) {
                            uni.postMessage({
                                data: {
                                    action: 'eventMessage',
                                    type: 'click',
                                    data: {
                                        path: 'deposit'
                                    }
                                }
                            })
                            return
                        }
                        if (!store.state._user.customerInfo) {
                            router.push('/login')
                            return
                        }
                        const columns = store.state._user.customerInfo.accountList.filter(
                            (el) => el.tradeType === 5 && el.currency === 'USDT'
                        ) || []
                        const accountIds = columns[0]?.accountId || ''
                        router.push('/deposit')
                    }
                }
            }
        })

        const symbolKey = computed(
            () => store.state._quote.productActivedID || ''
        )
        const productTradeType = computed(
            () => unref(symbolKey).split('_')[1] || 0
        )

        const tradeType = ref(unref(productTradeType))

        onMounted(() => {
            // 订阅资产数据
            MsgSocket.subscribeAsset(tradeType.value)
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
                state.tradeObj = objs
            })
        })

        const productList = computed(() => {
            if (isEmpty(props.trades)) return []
            return getProductList(props.trades)
        })

        const sortProdctList = computed(() => {
            const resultList = productList.value.filter((el) => el.symbolName)

            if (state.sortField || state.sortType) {
                resultList.sort((a, b) => {
                    // 根据享元模式封装，默认是asc排序
                    let firstEl = a
                    let secondEl = b
                    const defaultInfinity =
                        state.sortType === 'asc' ? Infinity : -Infinity

                    if (state.sortType === 'desc') {
                        firstEl = b
                        secondEl = a
                    }
                    if (state.sortField === 'symbolName') {
                        // 将有报价的产品排序到前面
                        if (
                            parseFloat(firstEl['rolling_last_price']) &&
                            parseFloat(secondEl['rolling_last_price'])
                        ) {
                            return firstEl[state.sortField].localeCompare(
                                secondEl[state.sortField]
                            )
                        } else if (
                            parseFloat(firstEl['rolling_last_price']) ||
                            parseFloat(secondEl['rolling_last_price'])
                        ) {
                            const firtstValue =
                                firstEl['rolling_last_price'] || defaultInfinity
                            const secondValue =
                                secondEl['rolling_last_price'] ||
                                defaultInfinity
                            return gte(firtstValue, secondValue) ? 1 : -1
                        } else {
                            return 0
                        }
                    } else if (state.sortField === 'rolling_upDownWidth') {
                        const firtstValue =
                            parseFloat(firstEl[state.sortField]) ||
                            defaultInfinity
                        const secondValue =
                            parseFloat(secondEl[state.sortField]) ||
                            defaultInfinity
                        return firtstValue - secondValue
                    } else {
                        const firtstValue =
                            firstEl[state.sortField] || defaultInfinity
                        const secondValue =
                            secondEl[state.sortField] || defaultInfinity
                        return gte(firtstValue, secondValue) ? 1 : -1
                    }
                })
            }

            return resultList
        })

        const changeSortType = (e) => {
            state.sortType = e
        }
        const changeSortField = (e) => {
            state.sortField = e
        }

        watch(
            () => route.path,
            (newVal) => {
                if (newVal !== '/quote' || newVal !== '/infoDetail' || newVal !== '/economicCalendar') {
                    MsgSocket.cancelSubscribeAsset()
                }
            }
        )

        return {
            isEmpty,
            sortProdctList,
            changeSortField,
            changeSortType,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
.cardBox {
    .tradeTitle {
        position: relative;
        height: rem(62px);
        display: flex;
        align-items: center;
        border-radius: rem(10px) rem(10px) 0 0;
        background: var(--primaryLc);
        font-size: rem(24px);
        padding-left: rem(30px);
        &::before {
            position: absolute;
            content: "";
            width: rem(7px);
            height: rem(30px);
            background: var(--color1);
            left: 0;
        }
    }
}
.link-btn {
    display: flex;
    flex-direction: column;
    margin-top: rem(50px);
    & > div {
        width: 100%;
        height: rem(72px);
        background: var(--primary);
        color: var(--contentColor);
        font-size: rem(24px);
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: rem(24px);
        border-radius: rem(8px);
    }
}
</style>
