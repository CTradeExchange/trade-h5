<template>
    <div v-if='!isEmpty(sortProdctList)' id='cardBoxID' class='cardBox'>
        <div class='tradeList customTableContainer'>
            <div v-if='sortProdctList.length === 1' class='single-list-box' @click='openProduct(sortProdctList[0])'>
                <div>
                    <p>{{ $t('trade.nameCode') }}</p>
                    <div>
                        <CurrencyIcon :size='18' :symbol-key='sortProdctList[0]?.symbolKey' />

                        <span>{{ sortProdctList[0].symbolName }}</span>
                    </div>
                </div>
                <div>
                    <p>{{ $t('trade.newPrice') }}</p>
                    <div
                        :class='[sortProdctList[0].last_color, "digits"+sortProdctList[0].symbolDigits]'
                    >
                        {{ !sortProdctList[0].rolling_last_price && sortProdctList[0].rolling_last_price != 0 ? '- -' : sortProdctList[0].rolling_last_price }}
                    </div>
                </div>
                <div>
                    <p>{{ $t('trade.changePercent') }}</p>
                    <div
                        :class='[sortProdctList[0].rolling_upDownColor,"digits"+sortProdctList[0].symbolDigits]'
                    >
                        {{ !sortProdctList[0].rolling_upDownWidth && sortProdctList[0].rolling_upDownWidth != 0 ? '- -' : sortProdctList[0].rolling_upDownWidth }}
                    </div>
                </div>
            </div>
            <div v-if='sortProdctList.length === 2' class='double-list-box'>
                <div v-for='(item, index) in sortProdctList' :key='index' @click='openProduct(item)'>
                    <div>
                        <CurrencyIcon :size='18' :symbol-key='item.symbolKey' />

                        <span>{{ item.symbolName }}</span>
                    </div>
                    <p>
                        <span
                            :class='[item.last_color, "digits"+item.symbolDigits]'
                        >
                            {{ !item.rolling_last_price && item.rolling_last_price != 0 ? '- -' : item.rolling_last_price }}
                        </span>
                        <span
                            :class='[item.rolling_upDownColor,"digits"+item.symbolDigits]'
                        >
                            {{ !item.rolling_upDownWidth && item.rolling_upDownWidth != 0 ? '- -' : item.rolling_upDownWidth }}
                        </span>
                    </p>
                </div>
            </div>
        </div>
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
    </div>
</template>

<script>
import { localGet, isEmpty, getProductList, getCookie, parseJSON, getPathParams } from '@/utils/util.js'
import CurrencyIcon from '@/components/product-icon.vue'
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
import { MsgSocket, QuoteSocket } from '@/plugins/socket/socket'
import { useRoute, useRouter } from 'vue-router'
import { GetTrade } from '@/api/newApi'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import useSymbolIcon from '@/hooks/useSymbolIcon'

export default {
    components: { CurrencyIcon },
    props: {
        trades: {
            type: Array,
            default: () => {
                return []
            }
        },
        embed: {
            type: String,
            default: ''
        },

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
                        }
                        emit('openBlockAtm')

                        // confirmOpenBlockAtm()
                        // const columns = store.state._user.customerInfo.accountList.filter(
                        //     (el) => el.tradeType === 5 && el.currency === 'USDT'
                        // ) || []
                        // const accountIds = columns[0]?.accountId || ''
                        // router.push(`/deposit?accountId=${accountIds}&currency=USDT&tradeType=5`)
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

        // 生成h5页面对应的产品图标[]
        const setH5FormatIconHandle = (symbolKey, number) => {
            const { currencyList } = useSymbolIcon(symbolKey)

            return currencyList?.value ? currencyList.value[number] : ''
        }

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
            emit('changeDom')
            let resultArr = resultList.slice(0, 2)

            resultArr = resultArr.map(i => ({ ...i, icons: i.symbolName.split('/') }))
            return resultArr
        })

        const openProduct = (data) => {
            if (isUniapp) {
                uni.postMessage({
                    data: {
                        action: 'eventMessage',
                        type: 'click',
                        data: {
                            path: 'product',
                            params: {
                                symbolId: data.symbolId,
                                tradeType: data.tradeType
                            }
                        }
                    }
                })
            } else {
                router.push(`/product?symbolId=${data.symbolId}&tradeType=${data.tradeType}`)
            }
        }

        watch(
            () => route.path,
            (newVal) => {
                if (newVal !== '/quote' || newVal !== '/infoDetail' || newVal !== '/economicCalendar') {
                    MsgSocket.cancelSubscribeAsset()
                }
            }
        )

        watch(() => sortProdctList.value, (list) => {
            if (list.length) {
                const arr = list.map(i => i.symbolKey)
                QuoteSocket.send_subscribe24H(arr)
            }
        }, {
            immediate: true,
        })

        return {
            isEmpty,
            sortProdctList,
            openProduct,
            setH5FormatIconHandle,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
.single-list-box {
    display: flex;
    width: 100%;
    padding: rem(12px) rem(12px) 0;
    & > div {
        flex: 1;
        & > p {
            font-size: rem(24px);
            color: #999999;
            line-height: 1.5;
            margin-bottom: rem(8px);
        }
        & > div {
            font-size: rem(30px);
            height: rem(48px);
            display: flex;
            align-items: center;
        }
    }
    & > div:first-of-type {
        flex: 1.5;
        & > div {
            display: flex;
            align-items: center;
            font-weight: 600;
            & > div {
                margin-left: rem(-16px);
                &:first-of-type {
                    margin-left: 0;
                }
                &:last-of-type {
                    margin-right: rem(12px);
                }
            }
        }
    }
}
.double-list-box {
    display: flex;
    justify-content: space-between;
    width: 100%;
    & > div {
        flex-shrink: 0;
        width: calc(50% - rem(24px));
        height: rem(100px);
        border: 1px solid #EBECEE;
        border-radius: rem(16px);
        margin: rem(12px) rem(12px) 0;
        padding: rem(12px) rem(20px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        & > div {
            height: auto;
            display: flex;
            align-items: center;
            font-size: rem(30px);
            font-weight: 600;
            & > div {
                margin-left: rem(-16px);
                &:first-of-type {
                    margin-left: 0;
                }
                &:last-of-type {
                    margin-right: rem(12px);
                }
            }
            & > span {
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        & > p {
            width: 100%;
            display: flex;
            justify-content: space-between;
            font-size: rem(24px);
        }
    }
}
.cardBox {
    flex-shrink: 0;
    background: #fff;
    border-radius: rem(16px) rem(16px) 0 0;
    box-shadow: 0px rem(-4px) rem(4px) 0px #D3D3D340;
    padding: 0 rem(12px);
    margin-top: rem(6px);
    overflow: hidden;
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    z-index: 10;
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
    & > div {
        flex: 1;
        height: rem(62px);
        background: var(--primary);
        color: var(--contentColor);
        font-size: rem(24px);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: rem(8px);
        margin: rem(12px);
    }
}

.item-icon-box{
  &>img{
    max-width: 24px;
    max-height: 24px;
  }
}
</style>
