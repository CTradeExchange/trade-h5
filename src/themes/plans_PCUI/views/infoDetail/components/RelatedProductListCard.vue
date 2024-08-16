<template>
    <div v-if='isShow' id='cardBoxID'>
        <template v-if='!link'>
            <div class='cardBox'>
                <div class='tradeTitle'>
                    <div>{{ $t("news.relatedTrade") }} </div>
                </div>
                <ProductList :list='productList' :trade-type='2' />
            </div>
        </template>
        <template v-else-if='Array.isArray(productList) && productList.length'>
            <div id='productBuoyID' :style="{ height: productList.length > 1 ? '200px' : '158px' }">
                <div :class='bottomFlag ? "link-box-bt" : "link-box"'>
                    <div>
                        <!-- <ProductList :list='productList' :trade-type='2' /> -->
                        <div class='product-list-box'>
                            <div>
                                <div>{{ $t('trade.nameCode') }}</div>
                                <div>{{ $t('trade.newPrice') }}</div>
                                <div>{{ $t('trade.upDownWidth') }}</div>
                            </div>
                            <div v-for='(item, index) in productList' :key='index' @click='openProduct(item)'>
                                <div class='flex items-center'>
                                    <ProductIcon :symbol-key='item.symbolKey' />
                                    <span class='ml-2'>
                                        {{ item.symbolName }}
                                    </span>
                                </div>
                                <div>
                                    <span
                                        :class='[item.last_color, "digits"+item.symbolDigits]'
                                    >
                                        {{ !item.rolling_last_price && item.rolling_last_price != 0 ? '- -' : item.rolling_last_price }}
                                    </span>
                                </div>
                                <div>
                                    <span
                                        :class='[item.rolling_upDownColor,"digits"+item.symbolDigits]'
                                    >
                                        {{ !item.rolling_upDownWidth && item.rolling_upDownWidth != 0 ? '- -' : item.rolling_upDownWidth }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class='link-btn '>
                            <div
                                v-for='(item, index) in embedList'
                                :key='index'
                                :class='btnsObj[item].class'
                                :style="item === 'trade' ? { background: 'var(--primaryText)' } : {}"
                                @click='btnsObj[item].click(productList[0])'
                            >
                                <span :class='btnsObj[item].class'>
                                    {{ btnsObj[item].label }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <blockAtmDialog ref='blockAtmDialogRef' />
    </div>
</template>

<script>
import { isEmpty, getProductList, localGet } from '@/utils/util.js'
import { computed, watch, reactive, toRefs, onMounted, onBeforeUnmount, ref } from 'vue'
import { QuoteSocket } from '@/plugins/socket/socket'
import ProductList from './ProductList.vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import ProductIcon from '@/components/product-icon.vue'
import { firebaseAnalytics } from '@/utils/firebase'
import blockAtmDialog from '@/components/blockAtmDialog'

export default {
    components: {
        ProductList,
        ProductIcon,
        blockAtmDialog
    },
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
    setup (props) {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const blockAtmDialogRef = ref(null)

        const state = reactive({
            sortField: localGet('productListSortField') || '',
            sortType: localGet('productListSortType') || '',
            tradesProList: [],
            embedList: computed(() => props.embed.split(',').filter(i => i)),
            bottomFlag: false,
            btnsObj: {
                trade: {
                    label: t('bannerTopic.tradeNow'),
                    class: 'tradeBtn',
                    click: (item) => {
                        router.push(`/order?symbolId=${item.symbolId}&tradeType=${item.tradeType}`)
                    }
                },
                deposit: {
                    label: t('common.deposit'),
                    class: 'depositBtn',
                    click: () => {
                        if (!store.state._user.customerInfo) {
                            router.push('/login')
                            return
                        }
                        confirmOpenBlockAtm()
                    }
                }
            }
        })

        const isShow = computed(() => !isEmpty(state.tradesProList))
        const productList = computed(() => {
            // const result = _.intersectionBy(state.list, state.tradesProList, 'symbolKey')
            const result = state.tradesProList.filter((el) => el.symbolName)
            return result.map(i => ({ ...i, icons: i.symbolName.split('/') }))
        })
        const symbolKeys = computed(() => state.tradesProList.map(i => i.symbolKey))
        const customerInfo = computed(() => store.state._user.customerInfo || {})

        // 从事件页进来充值的逻辑
        const confirmOpenBlockAtm = () => {
            firebaseAnalytics('ck_deposit_entrance', {
                key: 'ck_deposit_entrance',
                value: JSON.stringify({
                    email: customerInfo.value?.emailAll || customerInfo.value?.email || '',
                    phone: customerInfo.value?.phoneAll || customerInfo.value?.phone || '',
                    userID: customerInfo.value?.customerNo,
                }),
            })
            const url = route.path + '/' + 'recharge'
            router.push(url)
        }

        watch(symbolKeys, (n) => {
            QuoteSocket.send_subscribe24H(n)
        })

        watch(() => props.trades, (n) => {
            state.tradesProList = getProductList(n)
        }, { deep: true, immediate: true })

        const openProduct = (data) => {
            router.push(`/order?symbolId=${data.symbolId}&tradeType=${data.tradeType}`)
        }

        const handleScroll = () => {
            if (!isShow.value) return
            const offsetHeight = document.body.offsetHeight
            const offsetTop = document.getElementById('infoDetailID').offsetHeight
            const scrollTop = document.getElementById('app').scrollTop
            state.bottomFlag = offsetHeight + scrollTop > offsetTop + 62
        }

        onMounted(() => {
            if (props.link) {
                handleScroll()
                document.getElementById('app').addEventListener('scroll', handleScroll)
            }
        })

        onBeforeUnmount(() => {
            if (props.link) {
                document.getElementById('app').removeEventListener('scroll', handleScroll)
            }
        })

        return {
            isShow,
            isEmpty,
            productList,
            openProduct,
            blockAtmDialogRef,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
.product-list-box {
    display: flex;
    flex-direction: column;
    padding: 0 12px;
    & > div {
        width: 100%;
        height: 36px;
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #333;
        font-weight: 600;
        cursor: pointer;
        &:first-of-type {
            height: 22px;
            font-size: 12px;
            color: #999999;
            font-weight: 400;
            cursor: default;
        }
        & > div {
            flex: 1;
            &:last-of-type {
                flex: 0.5;
                flex-shrink: 0;
            }
            &:first-of-type {
                flex: 1.5;
                display: flex;
                align-items: center;
                & > div {
                    margin-left: -6px;
                    border-radius: 50%;
                    &:first-of-type {
                        margin-left: 0;
                    }
                    &:last-of-type {
                        margin-right: 12px;
                    }
                }
            }
        }
    }
}
.cardBox {
    padding-top:30px;
    .tradeTitle {
        font-size: 36px;
        font-weight: bold;
        color: var(--mainColor);
        margin-bottom:15px;
        margin-top: 15px;
    }
}
#productBuoyID {
    width: 100%;
    height: 214px;
    background: #fff;
}
.link-box {
    width: calc(100% - 100px);
    min-width: min-content;
    position: fixed;
    bottom: 0;
    left: 100px;
    display: flex;
    justify-content: center;
    & > div {
        width: 856px;
        height: auto;
        background: var(--contentColor);
        border-radius: 6px 6px 0 0;
        padding: 14px;
        box-sizing: border-box;
        margin: 0 auto;
        user-select: none;
        box-shadow: 0px 0px 4px 4px #D3D3D340;
        .link-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            & > div {
                flex: 1;
                max-width: 390px;
                height: 38px;
                border-radius: 4px;
                font-size: 12px;
                color: var(--contentColor);
                display: flex;
                justify-content: center;
                align-items: center;
                background: var(--primary);
                cursor: pointer;
                margin: 6px 12px 0;
                &:active {
                    opacity: 0.85;
                }
            }
        }
    }
}
.link-box-bt {
    width: 100%;
    min-width: min-content;
    display: flex;
    justify-content: center;
    background: #fff;
    padding: 0 16px 16px;
    & > div {
        width: 856px;
        height: auto;
        background: var(--contentColor);
        border-radius: 6px 6px 0 0;
        padding: 14px;
        box-sizing: border-box;
        margin: 0 auto;
        user-select: none;
        box-shadow: 0px 0px 4px 4px #D3D3D340;
        .link-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            & > div {
                flex: 1;
                max-width: 390px;
                height: 42px;
                border-radius: 4px;
                font-size: 12px;
                color: var(--contentColor);
                display: flex;
                justify-content: center;
                align-items: center;
                background: var(--primary);
                cursor: pointer;
                margin: 6px 12px 0;
                &:active {
                    opacity: 0.85;
                }
            }
        }
    }
}
#cardBoxID {
    width: 100%;
}
</style>
