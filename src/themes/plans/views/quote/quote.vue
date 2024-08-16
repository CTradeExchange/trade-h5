<template>
    <div class='quoteWrap' :class='{ hasNav: $hasNav }'>
        <div class='headerBox'>
            <plansType
                v-if='plansLen > 0'
                :list='plansList'
                :new-u-i='true'
                :value='tradeType'
                @change='handleTradeType'
            />
            <AssetsPopover />
        </div>
        <div
            v-if='tradeBanner.state == 1 && itemDetail'
            class='quote-banner-mb'
            :style="{ backgroundImage: 'url(' + itemDetail?.CoverURL + ')' }"
            @click='handleItemDetail'
        >
            <div>
                <h4 :style="{ color: tradeBanner?.textColor || '#EDBE2C' }">
                    {{ itemDetail?.ItemLanguages[0]?.Title }}
                </h4>
            </div>
        </div>
        <div class='tradeNav'>
            <TopTab
                ref='tabList'
                v-model='categoryType'
                :background='$style.contentColor'
                class='tradeSortNav'
                :dot='true'
                line-height='0'
                line-width='0'
                :list='categoryList'
                @change='tabChange'
                @tabClick='tabClick'
            />
            <i class='icon_sousuo iconSearch' @click='openSearch'></i>
        </div>
        <a
            v-if='
                String(categoryType) === fundBannerPosition[1] &&
                    tradeType === fundBannerPosition[0]
            '
            class='etfBanner'
            href='javascript:;'
            @click='toETF'
        >
            <img alt='' :src="'/images/ETF_banner_' + locale + '.png'" />
        </a>
        <div class='titleBar van-hairline--bottom'>
            <span class='item' @click="sortHandler('symbolName')">
                {{ $t("trade.nameCode") }}
                <SortIcon
                    name='symbolName'
                    :sort-field='sortField'
                    :sort-type='sortType'
                />
            </span>
            <span class='item' @click="sortHandler('rolling_last_price')">
                {{ $t("trade.newPrice") }}
                <SortIcon
                    name='rolling_last_price'
                    :sort-field='sortField'
                    :sort-type='sortType'
                />
            </span>
            <span class='item' @click="sortHandler('rolling_upDownWidth')">
                {{ $t("trade.changePercent") }}
                <SortIcon
                    name='rolling_upDownWidth'
                    :sort-field='sortField'
                    :sort-type='sortType'
                />
            </span>
            <span class='item'>
                {{ $t('information.event' ) }}
            </span>
        </div>
        <productListComp ref='productListEl' :product-list='productList' :trade-data='tradeObj' />
        <div
            v-if='categoryType === 0 && productList.length === 0'
            class='AddToOptional'
        >
            <van-button plain size='small' type='primary' @click='goSearchPage'>
                <van-icon name='add' /> {{ $t("trade.addToOptional") }}
            </van-button>
        </div>
        <ProductSearchSwipeModal v-if="$route.path.indexOf('/quote') !== -1" key='quote' />
    </div>
</template>

<script>
import TopTab from '@plans/components/topTab'
import productListComp from '@plans/modules/productList/productList.vue'
import SortIcon from '@plans/components/sortIcon.vue'
import AssetsPopover from '@plans/components/assetsPopover.vue'
import {
    ref,
    watch,
    computed,
    onActivated,
    unref,
    nextTick,
    reactive,
    toRefs,
    onMounted
} from 'vue'
import plansType from '@plans/components/plansType.vue'
import useProduct from '@plans/hooks/useProduct'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { MsgSocket } from '@/plugins/socket/socket'
import { useI18n } from 'vue-i18n'
import { getCookie, localGet, parseJSON } from '@/utils/util'
import { GetItemByID, GetTrade } from '@/api/newApi'
import ProductSearchSwipeModal from '@/themeCommon/components/productSearch/productSearchSwipeModal.vue'

export default {
    name: 'Quote',
    components: {
        productListComp,
        TopTab,
        SortIcon,
        plansType,
        ProductSearchSwipeModal,
        AssetsPopover
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { t, locale } = useI18n({ useScope: 'global' })

        const state = reactive({
            tradeObj: {},
            itemDetail: null
        })

        const productListEl = ref(null)
        // 玩法列表
        const isWallet = store.state._base.wpCompanyInfo.isWallet

        const plansList = computed(() => {
            const userProductCategory = store.getters.userProductCategory
            const resultPlans = store.state._base.plans
                .filter((e) => {
                    const userFlag = userProductCategory[e.tradeType]?.find(
                        (o) => o.listByUser?.length
                    )
                    return userFlag
                })
                .map((el) => {
                    el.name = t('tradeType.' + el.tradeType)
                    return el
                })

            return resultPlans
        })

        const tradeBanner = computed(() => {
            const arr = store.state._base.newsSysConfig
            const obj = arr.find(i => i.Key === 'quoteBanner') || {}
            return parseJSON(obj.Value) || {}
        })

        const symbolKey = computed(
            () => store.state._quote.productActivedID || ''
        )
        const productTradeType = computed(
            () => unref(symbolKey).split('_')[1] || 0
        )
        const customerInfo = computed(() => store.state._user.customerInfo)
        // 1.玩法类型
        const tradeType = ref(unref(productTradeType))

        const tradeTypeOld = ref(0)
        const categoryTypeOld = ref(0)
        // 2.板块类型
        const categoryType = ref(1)
        // 获取板块列表和所选板块的产品列表
        const { categoryList, productList, sortField, sortType, sortFunc } =
            useProduct({
                tradeType,
                categoryType
            })

        const localSelfSymbolListCur = ref(localGet('selfSymbolListStorage'))

        const localSymbolUpdate = computed(
            () => store.state._user.localSelfSymbolList
        )

        const plansLen = computed(() => {
            const userProductCategory = store.getters.userProductCategory
            let arr = Object.keys(userProductCategory)
            if (isWallet) {
                arr = arr.filter((el) => {
                    return (
                        userProductCategory[el]?.find(
                            (o) => o.listByUser?.length
                        ) && Number(el) !== 5
                    )
                })
            } else {
                arr = arr.filter((el) => {
                    return userProductCategory[el]?.find(
                        (o) => o.listByUser?.length
                    )
                })
            }
            return arr.length
        })

        // 点击排序
        const sortHandler = (field) => {
            sortFunc(field)
        }

        // 监听玩法类型
        const handleTradeType = async (val) => {
            tradeType.value = val
            tradeTypeOld.value = val
            categoryType.value = 0
            await nextTick()
            unref(productList).length &&
                store.commit(
                    '_quote/Update_productActivedID',
                    unref(productList)[0].symbolId + '_' + val
                )
        }

        // 监听玩法类型/板块类型的变化，触发产品订阅
        // 获取productList.vue组件的ref对象和产品列表均是异步，所以第一次产品订阅在productList.vue组件内
        watch([tradeType, categoryType, productList], async () => {
            await nextTick()
            if (productListEl.value) productListEl.value.subscribeAll()
        })

        onActivated(async () => {
            await nextTick()
            if (productListEl.value) productListEl.value.subscribeAll()
            // 未登录游客自选操作后返回过滤更新列表
            if (!customerInfo.value) {
                if (categoryType.value === 0) {
                    categoryType.value = null
                    // await nextTick()
                    // 定时切换一下玩法，触发刷新列表
                    var st = setTimeout(() => {
                        categoryType.value = 0
                        localSelfSymbolListCur.value = localGet(
                            'selfSymbolListStorage'
                        )
                        clearTimeout(st)
                    }, 150)
                }
            }
        })

        // 路由变化取消订阅
        watch(
            () => route.path,
            (newVal) => {
                if (newVal !== '/quote') {
                    MsgSocket.cancelSubscribeAsset()
                }
            }
        )

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

        const tabChange = (i) => {}
        const tabClick = (i) => {}

        const showSidebar = ref(false)
        const openSearch = () => {
            store.commit('_trade/Update_productSearchVisible', true)
        }

        // 进入基金产品列表页面
        const toETF = () => {
            store.commit('del_cacheViews', 'FundProductList')
            router.push('/fundProductList')
        }

        const goSearchPage = () => {
            store.commit('_trade/Update_productSearchVisible', true)
        }

        watch(tradeBanner, () => {
            const { jumpValue } = tradeBanner.value || {}
            if (!jumpValue) return
            GetItemByID({
                body: {
                    ID: Number(jumpValue),
                    Language: getCookie('lang')
                }
            }).then(res => {
                state.itemDetail = res.Item
            })
        }, {
            immediate: true
        })

        const handleItemDetail = () => {
            const { jumpType, jumpValue } = tradeBanner.value
            if (!jumpValue) return
            const url = jumpType == 1 ? 'infoDetail' : 'economicCalendar'
            router.push(`/${url}?id=${jumpValue}`)
        }

        return {
            locale,
            fundBannerPosition: window['fundBannerPosition'].split('-'),
            openSearch,
            categoryType,
            productListEl,
            plansLen,
            plansList,
            categoryList,
            productList,
            sortField,
            sortType,
            sortHandler,
            tabChange,
            tabClick,
            handleTradeType,
            tradeType,
            toETF,
            localSelfSymbolListCur,
            tradeTypeOld,
            categoryTypeOld,
            showSidebar,
            goSearchPage,
            customerInfo,
            tradeBanner,
            handleItemDetail,
            localSymbolUpdate,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.headerBox {
    width: 100%;
    height: rem(110px);
    background: #FFF;
    padding: 0 rem(30px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position:relative;
    z-index: 9999;
    :deep {
      .van-popover__wrapper {
        height: 100%
      }
    }
}
.quoteWrap {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    overflow: auto;
    background: var(--bgColor);
    .productListWrap {
        flex: 1;
        overflow-y: auto;
    }
}
.quote-banner-mb {
    flex-shrink: 0;
    width: 100%;
    height: rem(200px);
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
    &>div {
        width: 100%;
        height: 100%;
        background: rgba(1, 1, 1, 0.35);
        padding: rem(24px);
        display: flex;
        align-items: center;
        cursor: pointer;
        &>h4 {
            line-height: 1.8;
            font-size: rem(36px);
            color: #EDBE2C;
            text-align: center;
            word-break: keep-all !important;
            @include ellipsisLn(2);
        }
    }
}
.headerIcon {
    height: 100%;
    display: flex;
    align-items: center;
    &>img {
        width: rem(48px);
        height: rem(48px);
        &:active {
            opacity: 0.6;
        }
    }
}
.tradeNav {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    background-color: var(--contentColor);
    .van-tab {
        background: yellow !important;
    }
    .tradeSortNav {
        padding-right: rem(64px) !important;
    }
    .search-btn {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        width: rem(64px);
        display: flex;
        justify-content: center;
        align-items: center;
        &>img {
            width: rem(32px);
            height: rem(32px);
        }
    }
    .iconSearch {
        position: absolute;
        top: rem(36px);
        right: rem(24px);
        font-size: rem(26px);
    }
}
.titleBar {
    display: flex;
    height: rem(60px);
    padding: 0 rem(30px);
    color: var(--minorColor);
    font-size: rem(20px);
    line-height: rem(60px);
    background-color: var(--contentColor);
    &::after {
        border-color: var(--bgColor);
    }
    .item {
        width: rem(200px);
        text-align: center;
        &:first-child {
            flex: 1;
            text-align: left;
        }
        &:last-child {
            width: rem(76px);
        }
    }
}
.etfBanner {
    display: block;
    padding: 4px 0;
    background: var(--contentColor);
    img {
        display: block;
        width: 100%;
    }
}
.AddToOptional {
    position: absolute;
    top: 45%;
    right: 20%;
    left: 20%;
    display: inline-block;
    margin: 0 0 rem(20px) 0;
    text-align: center;
    .van-button {
        width: 80%;
        height: rem(160px);
        color: var(--primary);
        font-weight: bold;
        line-height: rem(160px);
        border: none;
    }
}
</style>
