<template>
    <div class='page-wrap' :class='{ isIframe: isUniapp }'>
        <LayoutTop v-if='!isUniapp' bottom-line :custom-back='true' @back='backHandle'>
            <template #main>
                <p class='symbolName' @click="$store.commit('_trade/Update_productSearchVisible', true)">
                    <span v-if='product?.symbolName' class='sortIconSpan'>
                        <svg fill='none' height='17' viewBox='0 0 18 17' width='18' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M0 0.5C0 0.223858 0.223858 0 0.5 0H17.5C17.7761 0 18 0.223858 18 0.5V1.5C18 1.77614 17.7761 2 17.5 2H0.5C0.223858 2 0 1.77614 0 1.5V0.5ZM0 15.5C0 15.2239 0.223858 15 0.5 15H17.5C17.7761 15 18 15.2239 18 15.5V16.5C18 16.7761 17.7761 17 17.5 17H0.5C0.223858 17 0 16.7761 0 16.5V15.5ZM0 10.5C0 10.2239 0.223858 10 0.5 10H9.5C9.77614 10 10 10.2239 10 10.5V11.5C10 11.7761 9.77614 12 9.5 12H0.5C0.223858 12 0 11.7761 0 11.5V10.5ZM0 5.5C0 5.22386 0.223858 5 0.5 5H9.5C9.77614 5 10 5.22386 10 5.5V6.5C10 6.77614 9.77614 7 9.5 7H0.5C0.223858 7 0 6.77614 0 6.5V5.5Z' fill='black' />
                            <path d='M16.1585 10.5488L17.6399 9.25258C18.0952 8.85417 18.0952 8.14584 17.6399 7.74742L16.1585 6.45119C15.5119 5.88543 14.5 6.34461 14.5 7.20377V9.79623C14.5 10.6554 15.5119 11.1146 16.1585 10.5488Z' fill='black' />
                        </svg>
                    </span>
                    {{ product?.symbolName }}
                </p>
            </template>
            <template #right>
                <div class='right-wrap'>
                    <van-icon
                        class='cursor-pointer mr-2'
                        :color="isSelfSymbol ? 'var(--focusColor)' : 'var(--color)'"
                        :name="isSelfSymbol ? 'star' : 'star-o'"
                        size='20'
                        @click.stop='addOptional'
                    />
                    <van-icon v-if='![3, 5, 9].includes(product?.tradeType)' name='info-o' :size='20' @click='toContractInfo' />
                </div>
            </template>
        </LayoutTop>
        <Loading :show='loading' />
        <!-- <div v-if='!isUniapp && showTrade && tradeItemCount > 0' class='matterBox' @click='showPopup = true'>
            <span>{{ $t('common.Impacting') }}</span>
            <span>{{ tradeItemObj.Title || '- -' }}</span>
            <div>
                <span>{{ tradeItemCount }}</span>
                <img alt='' src='@/assets/newUI/matter.png' />
            </div>
            <van-icon name='cross' @click.stop='showTrade = false' />
        </div> -->
        <!-- <AssetShow v-if="!isUniapp && fundInfo === 'userShow'" /> -->
        <div class='productInfo'>
            <div v-if="typeof(product?.symbolDigits)=='number'" class='hd'>
                <div class='hd-left'>
                    <p class='cur_price' :class='product?.cur_color'>
                        {{
                            product?.cur_price
                                ? product.cur_price === 'NaN'
                                    ? '--'
                                    : parseFloat(product?.cur_price).toFixed(product.symbolDigits)
                                : '--'
                        }}
                    </p>
                </div>
                <div class='others'>
                    <span v-if='[1,2].includes(product?.tradeType)' :class='product?.rolling_upDownColor'>
                        {{ product.rolling_upDownAmount }}
                        <span>
                            ({{ product?.rolling_upDownAmount_pip }} {{ $t('trade.dot') }})
                        </span>
                    </span>
                    <div class='others-bottom'>
                        <span class='upDownAmount' :class='product.rolling_upDownColor'>
                            {{ product.rolling_upDownWidth }}
                        </span>
                    </div>
                </div>
                <div v-if='product.etf' class='ft'>
                    <ETF @click='etfTip' />
                </div>
            </div>
            <div v-if='product' class='bd'>
                <div class='item'>
                    <template v-if='product.isCryptocurrency'>
                        <p class='priceBottom'>
                            <span>
                                {{ $t('common.24hHigh') }}
                            </span>
                            <span>
                                {{ product.rolling_high_price }}
                            </span>
                        </p>
                        <p>
                            <span>
                                {{ $t('common.24hLow') }}
                            </span>
                            <span>
                                {{ product.rolling_low_price }}
                            </span>
                        </p>
                    </template>
                    <template v-else>
                        <p class='priceBottom'>
                            <span>
                                {{ $t('trade.todayOpen') }}
                            </span>
                            <span>
                                {{ product.open_price }}
                            </span>
                        </p>
                        <p>
                            <span>
                                {{ $t('trade.yesterdayClosed') }}
                            </span>
                            <span>
                                {{ product.yesterday_close_price }}
                            </span>
                        </p>
                    </template>
                    <p v-if='product.etf' class='priceTop'>
                        <span>
                            {{ $t('fundInfo.realtimeJZ') }}({{ product.fundCurrency }})
                        </span>
                        <span>
                            {{ product.currentNav || '--' }}
                        </span>
                    </p>
                </div>
                <div class='item'>
                    <template v-if='product.isCryptocurrency'>
                        <p class='priceBottom'>
                            {{ $t('common.24hNumber') }}({{ product.baseCurrency }})
                            <span>
                                {{ formatAmount(product.rolling_transactions_number) }}
                            </span>
                        </p>
                        <!-- <p>
                            {{ $t('common.24hAmount') }}({{ product.profitCurrency }})
                            <span>
                                {{ formatAmount(product.rolling_amount) }}
                            </span>
                        </p> -->
                    </template>
                    <template v-else>
                        <p class='priceBottom'>
                            {{ $t('trade.high') }}
                            <span>
                                {{ product.high_price }}
                            </span>
                        </p>
                        <p>
                            {{ $t('trade.low') }}
                            <span>
                                {{ product.low_price }}
                            </span>
                        </p>
                    </template>

                    <p v-if='product.etf' class='priceTop'>
                        {{ $t('fundInfo.premiumRate') }}({{ product.fundCurrency }})
                        <span>
                            {{ product.premiumRate || '--' }}
                        </span>
                    </p>
                </div>
            </div>
        </div>

        <div class='h-125'>
            <chart :disabled-features="[
                'left_toolbar',
            ]"
            />
        </div>
        <TradeDataInfo :symbol-code='product?.symbolCode' :symbol-name='product?.symbolName' :symbolid='product?.symbolId' :trade-type='tradeType' />
    </div>

    <!-- 事件弹窗 -->
    <van-popup v-model:show='showPopup' round>
        <div class='mPopupBox'>
            <div class='mpb-header'>
                <span>{{ $t('common.Related') }}</span>
                <van-icon name='cross' @click='showPopup = false' />
            </div>
            <div v-for='item in tradeItemList' :key='item.ID' class='mpb-content' @click='handleSkip(item)'>
                <div :class="[item.Type===1?'content-1':'content-2']">
                    <van-rate v-if='item.Type===2' v-model='item.Important' count='3' readonly :size='18' />
                    <p>{{ item.Title }}</p>
                </div>
                <van-icon name='arrow' />
            </div>
            <div class='mpb-footer'>
                <div :style="{ background: tradeCurPage === 1 ? '#dedede' : '#8D8D8D' }" @click='handleTradePage(-1)'>
                    <van-icon name='arrow-left' />
                </div>
                <div @click='handleTradePage(1)'>
                    <van-icon name='arrow' />
                </div>
            </div>
        </div>
    </van-popup>

    <ProductSearchSwipeModal v-if="$route.path.indexOf('/product') !== -1" />
</template>

<script>
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed, reactive, toRefs, ref, unref, watch, onMounted, nextTick, } from 'vue'
import { useStore } from 'vuex'
import { Dialog, Toast } from 'vant'
import { isEmpty, localGet, getCookie, parseJSON } from '@/utils/util'
import { formatAmount } from '@/utils/calculation'
import { QuoteSocket } from '@/plugins/socket/socket'
import { addCustomerOptional, removeCustomerOptional } from '@/api/trade'
import Loading from '@/components/loading.vue'
import ETF from '@plans/components/etfIcon.vue'
import Base from '@/store/modules/base'
import { toolHooks } from '@plans/hooks/handicap'
import { GetTrade, GetTradeByID } from '@/api/newApi'
import useGetTradeExchangeRate from '@/hooks/trade/useGetTradeExchangeRate'
import TradeDataInfo from './components/tradeDataInfo.vue'
import ProductSearchSwipeModal from '@/themeCommon/components/productSearch/productSearchSwipeModal.vue'
import chart from '@/components/chart/index.vue'

export default {
    components: { chart, Loading, ETF, TradeDataInfo, ProductSearchSwipeModal },
    setup (props) {
        const route = useRoute()
        const router = useRouter()
        const symbolId = ref(route.query.symbolId)
        const tradeType = ref(route.query.tradeType)
        const getSymbolId = () => unref(symbolId)
        const getTradeType = () => unref(tradeType)
        const { dealModeShowMap } = toolHooks()
        const originTitle = document.title
        useGetTradeExchangeRate()

        // uniapp传参
        const { isUniapp, miniChart } = route.query
        const lang = route.query.lang || getCookie('lang')

        const { t, } = useI18n({ useScope: 'global' })
        const collect = ref(null)
        const firstDetail = ref(false)
        const store = useStore()

        const state = reactive({
            activeTab: 0,
            moreKType: {
                title: t('chart.more'),
                ktype: null
            },
            symbolId: getSymbolId(),
            tradeType: getTradeType(),
            loading: false,
            isSelfSymbol: false,
            findFundPageList: [], // 基金产品列表
            showPopup: false,
            showTrade: true,
            tradeItemCount: 0,
            tradeItemList: [],
            tradeCurPage: 1,
            tradeItemObj: {},
            fundInfo: computed(() => store.state._user.fundInfoStatic)
        })

        if (symbolId.value && tradeType) store.commit('_quote/Update_productActivedID', `${symbolId.value}_${tradeType.value}`)

        const customerInfo = computed(() => store.state._user.customerInfo)
        const primaryColor = computed(() => Base.state.wpCompanyInfo.themeColor)

        const product = computed(() => store.getters.productActived)

        const positionList = computed(() => store.state._trade.positionList[getTradeType()] || [])
        const selfSymbolList = computed(() => store.state._user.selfSymbolList)
        const plansLen = computed(() => {
            const userProductCategory = store.getters.userProductCategory
            let arr = Object.keys(userProductCategory)
            arr = arr.filter(el => {
                return userProductCategory[el]?.find(o => o.listByUser?.length)
            })
            return arr.length
        })

        // 颜色值
        const style = computed(() => store.state.style)

        // 订阅产品
        const subscribeToProduct = () => {
            QuoteSocket.send_subscribe([`${getSymbolId()}_${getTradeType()}`])
            QuoteSocket.send_subscribe24H([`${getSymbolId()}_${getTradeType()}`])
        }

        const checkIsSelfSymbol = () => {
            if (isEmpty(customerInfo.value)) {
                const newId = getSymbolId() + '_' + getTradeType()
                if (localGet('selfSymbolListStorage')) {
                    if (JSON.parse(localGet('selfSymbolListStorage')).find(el => el === newId)) {
                        state.isSelfSymbol = true
                    } else {
                        state.isSelfSymbol = false
                    }
                } else {
                    state.isSelfSymbol = false
                }
            } else {
                state.isSelfSymbol = !isEmpty(selfSymbolList.value[getTradeType()]?.find(el => el.symbolId === parseInt(getSymbolId())))
            }
        }

        const dealLastPrice = computed(() => store.state._quote.dealLastPrice)

        // 现货产品的基础货币是【基金代币】的，显示【申/赎】按钮
        const fundtoken = computed(() => {
            return state.findFundPageList.find(el => el.shareTokenCode === product.value?.baseCurrency)
        })

        const showTips = () => {
            Dialog.alert({
                title: t('trade.descTitle'),
                message: t('trade.nonStocksAndnonBullPointDesc'),
                confirmButtonColor: '#477fd3'
            }).then(() => {})
        }

        // 添加自选
        const addOptional = () => {
            if (isEmpty(customerInfo.value)) {
                // 未登录 缓存到本地
                var localSelfSymbolList = localGet('selfSymbolListStorage') ? JSON.parse(localGet('selfSymbolListStorage')) : []
                const newId = getSymbolId() + '_' + getTradeType()
                if (localSelfSymbolList.find(el => el === newId)) {
                    localSelfSymbolList.map((it, index) => {
                        if (it === newId) {
                            localSelfSymbolList.splice(index, 1)
                            state.isSelfSymbol = false
                            Toast(t('trade.removeOptionalOk'))
                        }
                    })
                } else {
                    localSelfSymbolList.push(newId)
                    state.isSelfSymbol = true
                    Toast(t('trade.addOptionalOk'))
                }
                store.dispatch('_user/queryLocalCustomerOptionalList', localSelfSymbolList)
            } else {
                state.loading = true
                if (state.isSelfSymbol) {
                    removeCustomerOptional({ symbolList: [getSymbolId()], tradeType: getTradeType() }).then(res => {
                        if (res.check()) {
                            state.loading = false
                            store.dispatch('_user/queryCustomerOptionalList')
                            state.isSelfSymbol = false
                            Toast(t('trade.removeOptionalOk'))
                        }
                    }).catch(err => {
                        state.loading = false
                    })
                } else {
                    addCustomerOptional({ symbolList: [getSymbolId()], tradeType: getTradeType() }).then(res => {
                        if (res.check()) {
                            state.loading = false
                            // 手动修改optional值
                            store.commit('_user/Update_optional', 1)
                            store.dispatch('_user/queryCustomerOptionalList')
                            state.isSelfSymbol = true
                            Toast(t('trade.addOptionalOk'))
                        }
                    }).catch(err => {
                        state.loading = false
                    })
                }
            }
        }

        // 格式化时间
        const formatTime = (val) => {
            if (val) { return window.dayjs(Number(val)).format('HH:mm:ss') }
        }

        const toContractInfo = () => {
            router.push({ path: '/contract', query: { symbolId: getSymbolId(), tradeType: getTradeType() } })
        }

        // 侧边栏-切换产品
        const onSelect = (product, close) => {
            router.replace({
                query: {
                    ...route.query,
                    symbolId: product.symbolId,
                    tradeType: product.tradeType,
                }
            }).then(() => {
                close()
            })
        }

        // 点击etf图标的提示
        const etfTip = () => {
            Dialog.alert({
                message: t('trade.productEtfTip'),
            })
        }

        // 切换产品时重新初始化数据
        watch(
            () => route.query.symbolId,
            async () => {
                await nextTick()
                const query = route.query
                if (query.symbolId) {
                    symbolId.value = parseInt(query.symbolId)
                    tradeType.value = parseInt(query.tradeType)
                    store.dispatch('_quote/querySymbolInfo', { symbolId: getSymbolId(), tradeType: getTradeType() })
                    store.commit('_quote/Update_productActivedID', `${query.symbolId}_${query.tradeType}`)
                    await nextTick()
                    subscribeToProduct()
                }
            }
        )

        // 价格跳动修改页面title
        const unWatchPrice = watch(
            () => product.value?.cur_price,
            (newval, oldval) => {
                if (newval) {
                    document.title = `${newval} | ${product.value.symbolCode} | ${originTitle}`
                }
            },
            { immediate: true }
        )

        const handleGetTrade = async (Offset = 1) => {
            const { symbolId } = route.query || {}
            let tradeId = state.tradeId
            if (!tradeId && symbolId) {
                await GetTrade({
                    body: {
                        Conditions: {
                            SymbolId: symbolId
                        },
                        Language: lang
                    }
                }).then(res => {
                    const [{ ID } = {}] = res.List || []
                    tradeId = ID
                })
            }
            if (!tradeId) return
            await GetTradeByID({
                body: {
                    ID: tradeId,
                    Language: lang,
                    Limit: 5,
                    Offset
                }
            }).then(res => {
                if (state.tradeItemCount !== res.TotalCount) {
                    state.tradeItemCount = res.TotalCount
                }
                state.tradeCurPage = res.CurPage || 1
                state.tradeItemList = (res.Trade?.Items || []).map(i => ({
                    ...i,
                    ...(parseJSON(i.Description) || {})
                }))
                if (!state.tradeItemObj.ID) {
                    state.tradeItemObj = res.Trade?.Items ? res.Trade?.Items[0] || {} : {}
                }
            })
        }

        const handleTradePage = (num) => {
            const Offset = state.tradeCurPage + num
            if (num > 0 && state.tradeCurPage * 5 >= state.tradeItemCount) {
                Toast(t('common.noMore'))
                return
            } else if (num < 0 && Offset <= 0) {
                Toast(t('common.noMore'))
                return
            }
            handleGetTrade(Offset)
        }

        const handleSkip = (item) => {
            const { ID, Type } = item || {}
            state.showPopup = false
            if (Type === 1) {
                router.push(`/infoDetail?id=${ID}`)
            } else {
                router.push(`/economicCalendar?id=${ID}`)
            }
        }

        const handleAssets = () => {
            if (state.fundInfo === 'unUser') {
                router.push('/login')
            } else {
                store.dispatch('_user/saveFundInfoStatic', { FI: state.fundInfo })
            }
        }

        const backHandle = () => {
            if (miniChart) {
                router.replace({ path: 'order', query: { symbolId: product.value.symbolId, tradeType: product.value.tradeType, miniChart: 1 } })
            } else {
                router.go(-1)
            }
        }

        onMounted(() => {
            subscribeToProduct()
            checkIsSelfSymbol()
            !isUniapp && handleGetTrade()
        })

        watch(() => state.showPopup, (newVal) => {
            if (newVal && !isUniapp) handleGetTrade()
        })

        onBeforeRouteLeave(() => {
            unWatchPrice()
            QuoteSocket.cancel_subscribe(0)
            document.title = originTitle
        })

        return {
            ...toRefs(state),
            showTips,
            checkIsSelfSymbol,
            product,
            positionList,
            addOptional,
            collect,
            formatTime,
            toContractInfo,
            onSelect,
            style,
            primaryColor,
            dealModeShowMap,
            etfTip,
            fundtoken,
            formatAmount,
            plansLen,
            isUniapp,
            firstDetail,
            dealLastPrice,
            lang,
            handleTradePage,
            handleSkip,
            handleAssets,
            backHandle,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
@import '~@/sass/animations.scss';
.headerIcon {
    height: 100%;
    display: flex;
    align-items: center;
    margin-left: rem(22px);
    &>img {
        width: rem(36px);
        height: rem(36px);
        &:active {
            opacity: 0.6;
        }
    }

}
.page-wrap {
    width: 100%;
    background: var(--bgColor);
    .symbolName {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: rem(32px);
        .icon_chouti1 {
            margin-right: rem(20px);
            font-size: rem(26px);
        }
        .sortIconSpan {
            margin-right: 3px;
            padding-top: 5px;
        }
        .sortIcon {
            font-size: rem(36px);
            transform: rotate(90deg);
        }
    }
    &.isIframe {
        margin-top: 0;
    }
    .infomation {
        padding-top: rem(5px);
        color: var(--minorColor);
        font-size: rem(20px);
        line-height: rem(24px);
    }
    .right-wrap {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
        height: 100%;
        font-size: rem(32px);
        .ft {
            width: rem(42px);
            height: rem(42px);
            margin-left: rem(22px);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            a {
                display: inline-block;
            }
            .icon_guanyu1 {
                color: #000118;
            }
        }
    }
    .productInfo {
      padding: rem(20px) rem(20px) rem(0px) rem(20px);
        background: var(--contentColor);
        .hd {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: flex-start;
            width: 100%;
            min-width: rem(265px);
            font-size: rem(24px);
            line-height: 1;
            margin-top: 6px;
            .others {
                flex: 1;
                margin-left: rem(10px);
                > span {
                    display: block;
                    margin: rem(5px) 0;
                }
                .others-bottom {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                }
            }
            .expire-date {
                display: flex;
                flex: 1;
                flex-direction: row;
                flex-wrap: nowrap;
                align-self: flex-end;
                justify-content: flex-end;
                color: #646566;
                font-size: rem(24px);
                white-space: nowrap;
                .value {
                    min-width: rem(153px);
                    text-align: right;
                }
            }
            .account-info {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: rem(14px) rem(17px) rem(10px);
                color: #FF8400;
                font-weight: 500;
                font-size: rem(21px);
                border: 2px solid #FF8400;
                border-radius: rem(10px);
                .text {
                    display: block;
                    margin-bottom: rem(5px);
                    font-size: rem(22px);
                    line-height: rem(24px);
                }
                .balance {
                    font-weight: 400;
                    font-size: rem(30px);
                    line-height: rem(32px);
                }
            }
            .hd-left {
                &.flex-auto {
                    flex: 1;
                }
                .hd-left-others {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    .others-bottom {
                        margin-left: rem(20px);
                    }
                }
            }
        }
        .bd {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: flex-start;
            width: 100%;
            padding-top: rem(20px);
            color: var(--normalColor);
            font-size: rem(24px);
            padding-bottom: 10px;
            .item {
                display: flex;
                flex: 1;
                flex-direction: column;
                margin-left: rem(40px);
                &:first-child {
                    flex: none;
                    width: 43%;
                    margin-left: 0;
                }
                &:first-child {
                    margin-right: rem(5px);
                }
                > p {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    align-items: center;
                    justify-content: space-between;
                    white-space: nowrap;
                    &.priceBottom {
                        margin-bottom: rem(10px);
                    }
                    &.priceTop {
                        margin-top: rem(10px);
                    }
                }
            }
            .point-value {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                align-items: center;
                justify-content: flex-start;
                .van-icon {
                    padding: 0 rem(5px);
                }
            }
        }
        .priceTime {
            position: absolute;
            top: rem(35px);
            right: rem(20px);
            color: #777;
        }
        .cur_price {
            font-size: rem(60px);
            // padding-bottom: rem(13px);
        }
        .upDownAmount {
            // padding-left: rem(20px);
        }
        .icon_icon_prompt {
            @include active();
            font-size: rem(40px);
            vertical-align: middle;
        }
    }
    .placeholder {
        height: rem(10px);
        background: var(--bgColor);
    }
    .tv-head {
        box-sizing: border-box;
        // 若高度调整，需同时处理vant-tab组件内的高度和行高等
        width: 100%;
        height: rem(60px);
        background-color: var(--contentColor);
    }
    .tabs-wrap {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        height: 100%;
        .van-popup {
            @include scroll();
        }
        .tabs {
            flex: 1;
            :deep(.van-tab) {
                flex: 1;
                flex-basis: auto !important;
                padding: 0;
                font-size: rem(24px);
                line-height: rem(60px);
                white-space: nowrap;
            }
            :deep(.van-tabs__wrap) {
                height: rem(60px);
                .van-tabs__nav--line {
                    padding-right: 0;
                    padding-bottom: 0;
                }
                .van-tabs__line {
                    bottom: 0;
                    width: auto;
                }
            }
        }
        .other-time-tab {
            min-width: rem(61px);
            white-space: nowrap;
            text-align: center;
        }
        .more-time {
            position: relative;
            height: 100%;
            padding: 0 4px 0 0;
            color: #646566;
            font-size: rem(24px);
            line-height: rem(60px);
            background-color: var(--contentColor);
            &.opened {
                &::after {
                    margin-top: -1px;
                    // border-color: transparent transparent currentColor currentColor;
                    transform: rotate(135deg);
                }
            }
            .options {
                position: absolute;
                top: rem(71px);
                left: rem(-100px);
                z-index: 10;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin-top: rem(1px);
                background: var(--contentColor);
                //box-shadow: 0 0 2px 0 #EBEDF0;
                .option {
                    padding: rem(20px) rem(50px) rem(10px);
                    color: var(--normalColor);
                    line-height: rem(30px);
                    white-space: nowrap;
                    &.active {
                        color: var(--primary);
                    }
                }
            }
            .mask {
                position: fixed;
                top: 0;
                left: 0;
                z-index: 9;
                width: 100%;
                height: 100%;
                opacity: 0;
            }
            .icon_icon_arrow {
                color: var(--minorColor);
                font-size: rem(20px);
            }
        }
        .loadingIcon {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            width: rem(80px);
            text-align: center;
            background: #FFF;
        }
        .flex-right {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
        }
        .study-wrap,
        .kIcon-wrap {
            height: auto;
            :deep(.van-dropdown-menu__title) {
                padding-right: 0;
                padding-left: rem(28px);
                color: #646566;
                font-size: rem(24px);
            }
            :deep(.van-dropdown-menu__bar) {
                width: 100%;
                height: 100%;
                box-shadow: none;
            }
            .mainColor {
                color: var(--primary);
            }
        }
        .chartPositinLine {
            font-size: rem(40px);
        }
        .study-wrap {
            width: rem(120px);
            :deep(.van-dropdown-menu__bar) {
                .van-dropdown-menu__bar {
                    box-sizing: border-box;
                    width: 100%;
                    height: 100%;
                    padding-right: 13px;
                }
            }
        }
        .kIcon-wrap {
            width: rem(80px);
            padding-right: 0;
            :deep(.van-dropdown-menu__item) {
                background-color: var(--contentColor);
                .van-dropdown-menu__title::after {
                    display: none;
                }
            }
        }
        .kIcon {
            display: inline-block;
            width: rem(60px);
            color: var(--normalColor);
            text-align: center;
            vertical-align: middle;
        }
        .klineTypeRightIcon {
            padding-top: rem(10px);
            font-size: rem(36px);
        }
        .setting {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: rem(80px);
            background: var(--contentColor);
            .icon {
                color: var(--normalColor);
                font-size: rem(28px);
            }
            .content {
                position: absolute;
                top: rem(72px);
                right: 0;
                z-index: 10;
                display: flex;
                flex-direction: column;
                align-items: center;
                align-items: flex-start;
                justify-content: center;
                background: var(--contentColor);
                box-shadow: 0 0 2px 0 var(--contentColor);
                .item {
                    padding: rem(20px) rem(50px) rem(10px);
                    line-height: rem(30px);
                    white-space: nowrap;
                    &.active {
                        :deep(&.van-checkbox__icon--disabled) {
                            .van-icon {
                                background-color: #EBEDF0;
                                border-color: #C8C9CC;
                            }
                        }
                        .van-icon {
                            background-color: red;
                            border-color: red;
                        }
                        .van-checkbox__label {
                            color: red;
                            &.van-checkbox__label--disabled {
                                color: #C8C9CC;
                            }
                        }
                    }
                    :deep(.van-checkbox__label) {
                        color: var(--color);
                    }
                }
            }
            .mask {
                position: fixed;
                top: 0;
                left: 0;
                z-index: 9;
                width: 100%;
                height: 100%;
                opacity: 0;
            }
        }
    }
    .study-area {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        height: rem(60px);
        line-height: rem(60px);
        background: var(--contentColor);
        .main-study,
        .side-study {
            display: flex;
            flex: 1;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: flex-end;
            justify-content: flex-start;
            height: 100%;
            overflow-x: auto;
            .content {
                display: flex;
                flex: 1;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: space-around;
                white-space: nowrap;
                .item {
                    display: flex;
                    flex: 1;
                    flex-direction: row;
                    align-items: flex-end;
                    justify-content: center;
                    padding: 0 rem(10px);
                    color: #646566;
                    font-size: rem(24px);
                    text-align: center;
                    &.active {
                        color: var(--primary);
                        .inner-label {
                            color: var(--primary);
                        }
                    }
                    &.disabled {
                        color: var(--minorColor);
                    }
                    .inner-label {
                        flex: 1;
                        height: rem(50px);
                        color: var(--normalColor);
                        line-height: rem(45px);
                    }
                }
            }
        }
        .more {
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content: center;
            margin: 0 rem(10px);
            .inner-label {
                flex: 1;
                height: rem(50px);
                line-height: rem(45px);
            }
        }
    }

    // 底部按钮
    .footerBtnBox {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 1000;
        display: flex;
        width: 100%;
        text-align: center;
        background: var(--contentColor);
        .watch {
            @include active();
            width: rem(110px);
            padding-top: rem(20px);
            line-height: 1;
            background-color: #FFF;
            .icon {
                font-size: rem(40px);
            }
            .text {
                padding-top: rem(8px);
                font-size: rem(20px);
            }
        }
        .trade-btn-wrap {
            position: relative;
            display: flex;
            flex: 1;
            flex-direction: row;
            flex-wrap: nowrap;
            padding: rem(20px);
            font-weight: bold;
            white-space: nowrap;
            .buy {
                margin-right: rem(20px);
            }
            .fundTradeBtn {
                flex: none;
                width: rem(140px);
                margin-left: rem(20px);
                color: var(--primary);
                white-space: normal;
                text-align: center;
                word-break: break-word;
                background: none;
                border: 1px solid var(--primary);
                &.en-US {
                    .text {
                        font-size: rem(26px);
                    }
                }
            }
        }
        .sell,
        .fundTradeBtn,
        .buy {
            @include active();
            position: relative;
            flex: 1;
            color: #FFF;
            line-height: rem(100px);
            background-color: #858C9A;
            border-radius: rem(8px);
            &.fallColorBg {
                //background-color: var(--fallColor);
                background: #349A71;
            }
            &.riseColorBg {
                //background-color: var(--riseColor);
                background: #F25B51;
            }
            .icon {
                margin-right: rem(20px);
                font-size: rem(20px);
                vertical-align: middle;
                opacity: 0.5;
            }
            .text {
                font-size: rem(28px);
                vertical-align: middle;
                font-weight: 500;
            }
        }
        .sell::after {
            position: absolute;
            top: 0;
            right: 0;
            width: 1px;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.15);
            content: '';
        }
        .text {
            font-size: rem(28px);
            vertical-align: middle;
        }
        .price {
            padding-top: rem(12px);
            font-size: rem(32px);
            vertical-align: middle;
            &.fallColorArrow::after {
                position: relative;
                left: rem(5px);
                font-weight: normal;
                font-size: rem(17px);
                font-family: 'iconfont' !important;
                vertical-align: middle;
                content: '\e674';
            }
            &.riseColorArrow::after {
                position: relative;
                left: rem(5px);
                font-weight: normal;
                font-size: rem(17px);
                font-family: 'iconfont' !important;
                vertical-align: middle;
                content: '\e675';
            }
        }
        .spread_text {
            position: absolute;
            top: 50%;
            left: 50%;
            height: rem(44px);
            padding: 0 rem(14px);
            color: var(--color);
            font-size: rem(28px);
            line-height: rem(46px);
            background: var(--contentColor);
            border-radius: 3px;
            transform: translate(-50%, -50%);
        }
        .scrollToPosition {
            display: flex;
            flex: 0 0 rem(140px);
            flex-direction: row;
            align-content: center;
            justify-content: center;
            margin-right: rem(20px);
            color: #333;
            font-weight: 500;
            font-size: rem(28px);
            line-height: rem(100px);
            background: #EEE;
            border-radius: 3px;
        }
    }
    .chart-wrap {
        height: rem(720px);
    }
}
.matterBox {
    width: 100%;
    height: rem(76px);
    background: #EEE;
    display: flex;
    align-items: center;
    font-size: rem(26px);
    color: #5B5B5C;
    padding: 0 rem(24px) 0 rem(40px);
    overflow: hidden;
    &>span:last-of-type {
        flex: 1;
        color: var(--primary);
        @include ellipsisLn(1);
    }
    div {
        width: rem(32px);
        height: rem(34px);
        position: relative;
        margin: 0 rem(40px) 0 rem(10px);
        img {
            width: 100%;
            height: 100%;
        }
        span {
            min-width: rem(24px);
            font-size: rem(18px);
            background: var(--primary);
            padding: rem(2px) rem(3px);
            color: var(--contentColor);
            border-radius: 3px;
            position: absolute;
            top: rem(-10px);
            right: rem(-10px);
            text-align: center;
        }
    }
}
.mPopupBox {
    width: rem(670px);
    height: rem(1010px);
    background: #FFF;
    border-radius: rem(15px);
    position: relative;
    padding: rem(130px) 0 rem(110px);
    overflow: hidden;
    .mpb-header {
        width: 100%;
        height: rem(130px);
        position: absolute;
        font-size: rem(34px);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--contentColor);
        top: 0;
        z-index: 1;
        &>i {
            position: absolute;
            right: rem(40px);
            font-size: rem(36px);
        }
    }
    .mpb-content {
        height: rem(153px);
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--lineColor);
        margin: 0 rem(40px);
        padding: rem(20px) 0;
        &>div {
            flex: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            font-size: rem(30px);
            color: var(--primary);
            padding-right: rem(10px);
            box-sizing: border-box;
            &.content-1 {
                justify-content: center;
            }
            &.content-2 {
                justify-content: space-between;
            }
            &>p {
                line-height: 1.2;
                @include ellipsisLn(2);
            }
            :deep(.van-rate__icon) {
                font-size: rem(24px) !important;
            }
        }
    }
    .mpb-footer {
        width: 100%;
        height: rem(110px);
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: 0;
        z-index: 1;
        background: var(--contentColor);
        &>div {
            width: rem(44px);
            height: rem(44px);
            border-radius: 50%;
            background: #8D8D8D;
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--contentColor);
            margin: 0 rem(30px);
            &:active {
                opacity: 0.75;
            }
        }
    }
}
:deep(.van-checkbox__icon--checked .van-icon) {
    color: var(--van-white) !important;
    background-color: var(--primary) !important;
    border-color: var(--primary) !important;
}
.composeBox {
    box-sizing: content-box;
    margin-top: rem(30px);
    padding: rem(20px) rem(20px);
    background: var(--contentColor);
}
</style>
