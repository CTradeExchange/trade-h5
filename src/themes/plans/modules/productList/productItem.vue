<template>
    <div class='productItem of-1px-bottom customTableRowContainer' :class='[bgClass]' :data-symbolId='product.symbolId' @click="$emit('open')">
        <div v-if='product.symbolName' class='cell'>
            <div
                class='th name customTableCell'
                :class='[
                    getLen(product.simplified) > 10 && "small",
                    getLen(product.simplified) > 15 && "mini"]'
            >
                {{ product.symbolName }}
                <p v-if='product.etf'>
                    <ETF />
                </p>
            </div>
            <div class='ft customTableCell'>
                <span
                    class='buy_price'
                    :class='[product.last_color, "digits"+product.symbolDigits]'
                >
                    {{ !product.rolling_last_price && product.rolling_last_price != 0 ? '- -' : product.rolling_last_price }}
                    <!-- {{ !product.buy_price && product.buy_price != 0 ? '- -' : product.buy_price }} -->
                </span>
            </div>
            <div class='tb customTableCell'>
                <span
                    class='sell_price'
                    :class='[product.rolling_upDownColor,"digits"+product.symbolDigits]'
                >
                    {{ !product.rolling_upDownWidth && product.rolling_upDownWidth != 0 ? '- -' : product.rolling_upDownWidth }}
                    <!-- {{ !product.sell_price && product.sell_price != 0 ? '- -' : product.sell_price }} -->
                </span>
            </div>
            <template v-if='showTrade'>
                <div v-if='!!tradeData[product.symbolId] && !!tradeData[product.symbolId].num' class='sj' @click.stop='showPopup = true'>
                    <img alt='' src='@/assets/newUI/matter.png' />
                    <div>{{ tradeData[product.symbolId].num }}</div>
                </div>
                <div v-else class='sj'>
                    - -
                </div>
            </template>
        </div>
        <!-- <div v-if='product.symbolName' class='cell'>
            <p>
                <span class='upDownAmount' :class='product.upDownColor'>
                    {{ product.upDownAmount }}
                </span>
                <span class='upDownWidth' :class='product.upDownColor'>
                    {{ product.upDownWidth }}
                </span>
            </p>
        </div> -->
    </div>

    <!-- 事件弹窗 -->
    <van-popup v-model:show='showPopup' round>
        <div class='mPopupBox'>
            <div class='mpb-header'>
                <span>{{ $t('common.Related') }}</span>
                <van-icon name='cross' @click='showPopup = false' />
            </div>
            <div
                v-for='item in tradeItemList'
                :key='item.ID'
                class='mpb-content'
                :onclick="item.ID === 35630 ? () => handleDatalayerEvent('click_home_popup') : null"
                @click='handleSkip(item)'
            >
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
</template>

<script>
import { computed, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { getLen, localGet, getQueryString, parseJSON, getCookie } from '@/utils/util'
import ETF from '@plans/components/etfIcon'
import { GetTradeByID } from '@/api/newApi'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
export default {
    components: {
        ETF,
    },
    props: {
        product: {
            type: Object,
            default: () => ({})
        },
        tradeData: {
            default: {}
        },
        showTrade: {
            type: Boolean,
            default: true
        }
    },
    emits: ['open'],
    setup (props, context) {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const quoteMode = computed(() => store.state.quoteMode)
        const longName = computed(() => getLen(props.product?.symbolName) > 10)
        const tickTime = computed(() => {
            const tick_time = props.product.tick_time ?? ''
            return tick_time ? window.dayjs(Number(tick_time)).format('HH:mm:ss') : ''
        })

        const chartColorType = computed(() => getQueryString('chartColorType') || Number(JSON.parse(localGet('CHART_CONFIG'))?.chartColorType) || 1)

        const state = reactive({
            bgClass: '',
            showPopup: false,
            tradeItemCount: 0,
            tradeItemList: [],
            tradeCurPage: 1,
            tradeItemObj: {},
        })
        let price = 0

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
            const { ItemLanguageID, ID, Type } = item || {}
            state.showPopup = false
            if (Type === 1) {
                router.push(`/infoDetail?id=${ID}`)
                return
            }
            router.push(`/economicCalendar?id=${ID}`)
        }

        const handleGetTrade = async (Offset = 1) => {
            if (!props.tradeData[props.product?.symbolId]?.id) return
            await GetTradeByID({
                body: {
                    ID: Number(props.tradeData[props.product?.symbolId]?.id),
                    Language: getCookie('lang'),
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

        watch(() => state.showPopup, (newVal) => {
            if (newVal) handleGetTrade()
        })

        watch(
            () => props.product.sell_price,
            (val) => {
                if (price === 0) {
                    if ((props.product.sell_color === 'riseColor' && chartColorType.value === 1) || (props.product.sell_color === 'fallColor' && chartColorType.value === 2)) {
                        state.bgClass = 'riseColorBgAni'
                    } else if ((props.product.sell_color === 'fallColor' && chartColorType.value === 1) || (props.product.sell_color === 'riseColor' && chartColorType.value === 2)) {
                        state.bgClass = 'fallColorBgAni'
                    }
                    price = val
                } else {
                    if (val - price > 0) {
                        state.bgClass = 'riseColorBgAni'
                    } else if (val - price < 0) {
                        state.bgClass = 'fallColorBgAni'
                    }
                    price = val
                }
            })
        const handleDatalayerEvent = () => {
            const dataLayer = window.dataLayer || []
            dataLayer.push({
                'event': 'clickRate',
                'gtm.elementId': 'click_quote_hotevent'
            })
        }

        return {
            ...toRefs(state),
            tickTime,
            quoteMode,
            getLen,
            longName,
            handleSkip,
            handleTradePage,
            handleDatalayerEvent,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.productItem {
    @include active();
    position: relative;
    height: rem(118px);
    padding: rem(20px) 0;
    overflow: hidden;
    line-height: rem(76px);
    background-color: var(--contentColor);
    .cell {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0 rem(30px);
        color: var(--minorColor);
        font-size: rem(24px);
        .th {
            position: relative;
            flex: 1;
            overflow-y: visible;
        }
        .tb {
            width: rem(200px);
            text-align: center;
            @include ellipsis();
        }
        .ft {
            width: rem(200px);
            text-align: center;
            @include ellipsis();
        }
        .sj {
            width: rem(76px);
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
                width: rem(32px);
                height: rem(34px);
            }
            div {
                text-align: center;
                min-width: rem(24px);
                height: rem(24px);
                line-height: rem(24px);
                font-size: rem(18px);
                background: var(--primary);
                padding: rem(1px) rem(3px);
                color: var(--contentColor);
                border-radius: 3px;
                position: absolute;
                right: rem(7px);
                top: rem(-15px);
            }
        }
    }
    .price {
        font-size: rem(30px);
    }
    .hd {
        flex: 1;
        color: var(--minorColor);
        font-size: rem(22px);
        line-height: 1.3;
    }
    .name {
        @include ellipsis();
        color: var(--color);
        font-weight: 400;
        font-size: rem(28px);
        line-height: 1.15;
        padding-bottom: 1px;
        &.small {
            font-size: rem(26px);
        }
        &.mini {
            font-size: rem(22px);
        }
    }
    .symbolCode {
        margin-top: 5px;
        color: var(--minorColor);
    }
    .sell_price,
    .buy_price {
        font-size: rem(30px);
        &.digits11,
        &.digits12,
        &.digits13 {
            font-size: rem(26px);
        }
        &.digits14,
        &.digits15,
        &.digits16 {
            font-size: rem(22px);
        }
    }
    .sell_price{
        font-weight: bold;
    }
    .col {
        width: rem(280px);
        margin-left: rem(10px);
        font-size: rem(24px);
        text-align: right;
    }
    .upDownAmount {
        padding-right: rem(15px);
    }
}
.mPopupBox {
    width: rem(670px);
    height: rem(1010px);
    background: #FFFFFF;
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
        & > i {
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
        & > div {
            flex: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            font-size: rem(30px);
            color: var(--primary);
            padding-right: rem(10px);
            box-sizing: border-box;
            &.content-1{
                justify-content: center;
            }
            &.content-2{
                justify-content: space-between
            }
            & > p {
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
        & > div {
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
</style>
