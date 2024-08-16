<template>
    <router-view />
    <div class="home-box">
        <div class="header">
            <div class="header-safe-box">
                <h3 class="header-title">
                    {{ $t('headLineHome.tophead') }}
                    <span class="header-title-flag">
                        {{ $t('headLineHome.tophead1') }}
                    </span>
                    {{ $t('headLineHome.tophead2') }}
                </h3>

                <p class="header-sub-text">
                    {{ $t('headLineHome.topheadtext') }}
                </p>

                <div class="start-trading" @click="goToTradeHandle">
                    <span>{{ $t('headLineHome.startTrade') }}</span>
                </div>

                <div class="trading-list-pc">
                    <div :class="['trading-list-item-box']">
                        <div class="pc-van-tabs">
                            <div class="pc-van-tabs-scroll">
                                <div
                                    v-for="item in topicList"
                                    :key="item.id"
                                    class="pc-van-tabs-scroll-nav"
                                    @click="currentTopicIDChange(item.id)"
                                >
                                    <div :class="['pc-van-tabs-scroll-nav-con', item.id === currentTopicID ? 'active' : '']">
                                        <span :class="['pc-van-tabs-scroll-nav-con-title', item.id === currentTopicID ? 'active' : '']">
                                            {{ item.title }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="trading-list-item-content">
                                <div
                                    v-for="(k, i) in currentTopicList"
                                    :key="i"
                                    :class="['list-item', symbolKey == k.symbolKey ? 'active' : '']"
                                    @click="selectItemIDChange(k.symbolKey)"
                                >
                                    <div class="list-item-left">
                                        <span>{{ k.symbolName }}</span>
                                        <!-- <img alt='' src='../../images/fire.png' /> -->
                                    </div>
                                    <div class="list-item-right">
                                        <span :class="k.last_color">
                                            {{ k.rolling_last_price }}
                                        </span>
                                        <div :class="['ups-and-downs', k.rolling_upDownColor]">
                                            <span>{{ k.rolling_upDownWidth }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 移动端的结构 -->

                    <div v-if="formatSelfSymbolList?.length" class="h5-van-tabs">
                        <div class="h5-van-tabs-scroll">
                            <div
                                v-for="item in formatSelfSymbolList"
                                :key="item.symbolKey"
                                @click="h5CurrentProductIDChange(item.symbolKey)"
                            >
                                <div class="trading-list-item-type">
                                    <div :class="['trading-list-item-type-item', item.symbolKey == h5CurrentProductID ? 'active' : '']">
                                        <div class="trading-list-item-type-item-icon">
                                            <img :src="`/images/currency_icon/${setH5FormatIconHandle(item.symbolKey, 0)}.png`" />
                                            <img :src="`/images/currency_icon/${setH5FormatIconHandle(item.symbolKey, 1)}.png`" />
                                        </div>
                                        <span class="trading-list-item-type-item-title">
                                            {{ item.symbolName }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="trading-list-item-box">
                        <div class="active-title">
                            <span>{{ $t('headLineHome.orderBook') }}</span>
                        </div>
                        <div class="active-info">
                            <div class="active-name">
                                <div class="active-name-text">
                                    <!-- <img alt='' src='../../images/fire.png' /> -->
                                    <span>{{ product?.symbolName || '' }}</span>
                                </div>

                                <div class="trade-now" @click="tradeNowHandle">
                                    <span>{{ $t('headLineHome.trade-now') }}</span>
                                </div>
                            </div>

                            <div class="active-price">
                                <div class="actice-price-left">
                                    <span class="actice-price-num" :class="product?.cur_color">
                                        {{
                                            product?.rolling_last_price
                                                ? product.rolling_last_price === 'NaN'
                                                    ? '--'
                                                    : parseFloat(product?.rolling_last_price).toFixed(product?.symbolDigits)
                                                : '--'
                                        }}
                                    </span>
                                    <div class="active-up-down">
                                        <span :class="product?.upDownColor">
                                            {{
                                                product?.rolling_upDownAmount
                                                    ? product.rolling_upDownAmount === 'NaN'
                                                        ? '--'
                                                        : product.rolling_upDownAmount
                                                    : '--'
                                            }}
                                        </span>
                                        <span :class="product?.upDownColor">
                                            {{
                                                product?.rolling_upDownWidth
                                                    ? product.rolling_upDownWidth === 'NaN'
                                                        ? '--'
                                                        : product.rolling_upDownWidth
                                                    : '--'
                                            }}
                                        </span>
                                    </div>
                                </div>

                                <div class="actice-price-right">
                                    <div class="actice-price-right-item">
                                        <span class="actice-price-high">
                                            {{ $t('headLineHome.24HHigh') }}
                                        </span>
                                        <span class="actice-price-high-num">
                                            {{ product?.rolling_high_price || '--' }}
                                        </span>
                                    </div>

                                    <div class="actice-price-right-item">
                                        <span class="actice-price-high">
                                            {{ $t('headLineHome.24HLow') }}
                                        </span>
                                        <span class="actice-price-high-num">
                                            {{ product?.rolling_low_price || '--' }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="active-depth">
                                <div class="depth-type">
                                    <div class="depth-type-item">
                                        <span>{{ $t('headLineHome.long') }}</span>
                                    </div>
                                    <div class="depth-type-item">
                                        <span>{{ $t('headLineHome.short') }}</span>
                                        <div class="depth-select">
                                            <van-popover
                                                v-model:show="showPopover"
                                                :actions="digitLevelList"
                                                class="depth-select-drownpper"
                                                @select="onSelect"
                                            >
                                                <template #reference>
                                                    <button class="depth-select-btn">
                                                        {{ curDigit }}
                                                        <i class="depth-select-icon"></i>
                                                    </button>
                                                </template>
                                            </van-popover>
                                        </div>
                                    </div>
                                </div>

                                <div class="depth-list">
                                    <div class="depth-list-title">
                                      <span v-if='isQuantity' class='ft alignRight'>
                                          {{ $t('trade.volumes') }}({{ $t('trade.volumeUnit') }})
                                      </span>
                                      <span v-else class='ft alignRight'>
                                          {{ $t('trade.amount') }}{{ assetsInfo?.currency ? `(${assetsInfo.currency})` : `(USDT)` }}
                                      </span>
                                        <span>
                                            {{ $t('headLineHome.price') + `(${product?.profitCurrency ? product.profitCurrency : ''})` }}
                                        </span>
                                        <span v-if='isQuantity' class='ft alignRight'>
                                            {{ $t('trade.volumes') }}({{ $t('trade.volumeUnit') }})
                                        </span>
                                        <span v-else class='ft alignRight'>
                                            {{ $t('trade.amount') }}{{ assetsInfo?.currency ? `(${assetsInfo.currency})` : `(USDT)` }}
                                        </span>
                                    </div>
                                    <div class="depth-list-content">
                                        <div v-for="(item, index) in bid_deep" :key="index" class="depth-list-box">
                                            <div class="depth-list-box-left">
                                                <span class="box-up-num">
                                                    <!-- {{ item.volume_bid }} -->
                                                    {{
                                                        item.volume_bid && item.price_bid
                                                            ? formatVolume(item.volume_bid, item.price_bid)
                                                            : '--'
                                                    }}
                                                </span>
                                                <div class="box-up-price">
                                                    <span>
                                                        {{ item.price_bid }}
                                                    </span>
                                                </div>
                                                <span v-if="item.width" class="volunmePercent" :style="{ width: item.width + '%' }"></span>
                                            </div>
                                            <div class="depth-list-box-right">
                                                <div class="box-up-price">
                                                    <span>
                                                        {{ ask_deep[index].price_ask }}
                                                    </span>
                                                </div>
                                                <span class="box-up-num">
                                                    {{
                                                        ask_deep[index].volume_ask && ask_deep[index].price_ask
                                                            ? formatVolume(ask_deep[index].volume_ask, ask_deep[index].price_ask)
                                                            : '--'
                                                    }}
                                                </span>
                                                <span
                                                    v-if="ask_deep[index].width"
                                                    :class="['volunmePercent', 'buy']"
                                                    :style="{ width: ask_deep[index].width + '%' }"
                                                ></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="trading-list-item-box">
                        <div class="market-title">
                            <span>{{ $t('headLineHome.marketHistory') }}</span>
                        </div>

                        <div class="market-content">
                            <div class="market-content-type">
                                <span>{{ $t('headLineHome.TradeTime') }}</span>
                                <span>{{ $t('headLineHome.price') + `(${product?.profitCurrency ? product.profitCurrency : ''})` }}</span>
                                <span class="market-content-type-amount">
                                  <template v-if='isQuantity' class='col volume-col'>
                                      {{ $t("trade.volumes") }}({{ $t("trade.volumeUnit") }})
                                  </template>
                                  <template v-else class='col volume-col'>
                                      {{ $t("trade.totalAmount")
                                      }}{{ assetsInfo?.currency ? `(${assetsInfo.currency})` : "(USDT)" }}
                                  </template>
                                </span>

                            </div>
                            <div class="market-content-list">
                                <div v-for="(item, index) in dealList" :key="index" class="market-content-item">
                                    <span>{{ formatTime(item.dealTime) }}</span>
                                    <span
                                        :class="[
                                            Number(item.trade_direction) === 1 ? 'riseColor' : 'fallColor',
                                            'market-content-item-price',
                                        ]"
                                    >
                                        {{ item.price }}
                                    </span>
                                    <span class="market-content-item-amount">
                                        {{ formatVolume(item.volume, item.price) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="matching">
            <div class="matching-safe-box">
                <div class="matching-left">
                    <h4>{{ $t('headLineHome.matchingTitle') }}</h4>
                    <div class="matching-left-p mt-4">
                        <p>{{ $t('headLineHome.matchingSubTitle') }}</p>
                    </div>
                    <div class="video-box">
                        <div class="bar-video">
                            <!-- <iframe
                                v-if='globalVideo.iframeUrl'
                                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                                allowfullscreen
                                class='cont'
                                frameborder='0'
                                :src='globalVideo.iframeUrl'
                            ></iframe> -->
                            <video
                                id="video-id"
                                autoplay
                                class="cont"
                                controls
                                controlsList="nodownload  footbar noplaybackrate"
                                disablePictureInPicture
                                loop
                                muted
                                playsinline="true"
                                :poster="videoCover"
                                src="https://www.headline.net/wp-content/uploads/2023/12/order_matching.mp4"
                                webkit-playsinline="true"
                            ></video>
                        </div>

                        <!--
                    <img alt='' src='../../images/videocover.png' /> -->
                    </div>
                </div>
                <span class="matching-center">
                    {{ $t('headLineHome.matching-center') }}
                </span>
                <div class="matching-right">
                    <!-- <div class='matching-right-h5'>
                        <span>{{ 'Advantages of Order matching' }}</span>
                    </div> -->

                    <div class="matching-item">
                        <div class="matching-item-title">
                            <img alt="" src="@/themeCommon/image/home/macthing-01.png" />
                            <h5>{{ $t('headLineHome.fairness') }}</h5>
                        </div>
                        <p>
                            {{ $t('headLineHome.fairnessText') }}
                        </p>
                    </div>

                    <div class="matching-item">
                        <div class="matching-item-title">
                            <img alt="" src="@/themeCommon/image/home/macthing-02.png" />
                            <h5>{{ $t('headLineHome.transparency') }}</h5>
                        </div>
                        <p>
                            {{ $t('headLineHome.transparencyText') }}
                        </p>
                    </div>

                    <div class="matching-item">
                        <div class="matching-item-title">
                            <img alt="" src="@/themeCommon/image/home/macthing-03.png" />
                            <h5>{{ $t('headLineHome.NOManipulation') }}</h5>
                        </div>
                        <p>
                            {{ $t('headLineHome.NOManipulationText') }}
                        </p>
                    </div>

                    <div class="matching-item">
                        <div class="matching-item-title">
                            <img alt="" src="@/themeCommon/image/home/macthing-04.png" />
                            <h5>
                                {{ $t('headLineHome.Fraudulent') }}
                            </h5>
                        </div>
                        <p>
                            {{ $t('headLineHome.FraudulentText') }}
                        </p>
                    </div>

                    <div class="matching-item">
                        <div class="matching-item-title">
                            <img alt="" src="@/themeCommon/image/home/macthing-05.png" />
                            <h5>{{ $t('headLineHome.Effective') }}</h5>
                        </div>
                        <p>
                            {{ $t('headLineHome.EffectiveText') }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="summary">
            <div class="summary-safe-box">
                <h4 class="summary-title">
                    {{ $t('headLineHome.TradeEasy') }}
                </h4>

                <p class="summary-sub-title">
                    {{ $t('headLineHome.TradeEasySub') }}
                </p>
                <div class="summary-content">
                    <div class="summary-content-left">
                        <h5>{{ $t('headLineHome.Supported') }}</h5>
                        <p>
                            {{ $t('headLineHome.SupportedSub') }}
                        </p>
                        <div class="summary-content-left-con">
                            <div class="coin-list">
                                <div class="coin-list-title">
                                    <span>{{ $t('headLineHome.Selectcoin') }}</span>
                                </div>
                                <div class="coin-list-con">
                                    <div
                                        :class="['coin-list-item', selectedToken == 'usdt' ? 'active' : '']"
                                        @click="tokenSelect('usdt')"
                                        @touch="tokenSelect('usdt')"
                                    >
                                        <div class="coin-list-item-left">
                                            <img alt="" src="@/themeCommon/image/home/usdt.png" />
                                            <span>{{ 'USDT' }}</span>
                                        </div>
                                        <div class="coin-list-item-right">
                                            <img v-if="selectedToken == 'usdt'" alt="" src="@/themeCommon/image/home/selected.png" />
                                        </div>
                                    </div>

                                    <div
                                        :class="['coin-list-item', selectedToken == 'usdc' ? 'active' : '']"
                                        @click="tokenSelect('usdc')"
                                        @touch="tokenSelect('usdc')"
                                    >
                                        <div class="coin-list-item-left">
                                            <img alt="" src="@/themeCommon/image/home/usdc.png" />
                                            <span>{{ 'USDC' }}</span>
                                        </div>
                                        <div class="coin-list-item-right">
                                            <img v-if="selectedToken == 'usdc'" alt="" src="@/themeCommon/image/home/selected.png" />
                                        </div>
                                    </div>
                                    <div
                                        :class="['coin-list-item', selectedToken == 'dai' ? 'active' : '']"
                                        @click="tokenSelect('dai')"
                                        @touch="tokenSelect('dai')"
                                    >
                                        <div class="coin-list-item-left">
                                            <img alt="" src="@/themeCommon/image/home/dai.png" />
                                            <span>{{ 'DAI' }}</span>
                                        </div>
                                        <div class="coin-list-item-right">
                                            <img v-if="selectedToken == 'dai'" alt="" src="@/themeCommon/image/home/selected.png" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <img alt="" class="dai-token" src="@/themeCommon/image/home/dai-token.png" />
                            <img alt="" class="usdc-token" src="@/themeCommon/image/home/usdc-token.png" />
                            <img alt="" class="usdt-token" src="@/themeCommon/image/home/usdt-token.png" />
                        </div>
                    </div>

                    <div class="summary-content-right px-4">
                        <h5>{{ $t('headLineHome.Elevate') }}</h5>
                        <p>{{ $t('headLineHome.ElevateSub') }}</p>
                        <div class="summary-content-right-con">
                            <div class="step-item">
                                <span>{{ $t('headLineHome.Step01') }}</span>
                                <p>{{ $t('headLineHome.Step01Text') }}</p>
                            </div>
                            <div class="step-item">
                                <span>{{ $t('headLineHome.Step02') }}</span>
                                <p>{{ $t('headLineHome.Step02Text') }}</p>
                            </div>
                            <div class="step-item">
                                <span>{{ $t('headLineHome.Step03') }}</span>
                                <p>{{ $t('headLineHome.Step03Text') }}</p>
                            </div>
                            <img alt="" src="@/themeCommon/image/home/usdt-roboot.png" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="highlight">
            <div class="highlight-safe-box">
                <h4 class="highlight-title">
                    {{ $t('headLineHome.highlight1') }}
                    <span>{{ $t('headLineHome.highlight2') }}</span>
                </h4>
                <p class="highlight-sub-title">
                    {{ $t('headLineHome.highlightSub') }}
                </p>
                <div class="highlight-content">
                    <div
                        class="highlight-content-left"
                        :style="{ '--bgImg': `url(${topicItem.CoverPC || topicItem.CoverURL})` }"
                        @click="handleClickBanner2(topicItem)"
                    >
                        <div v-if="bannerLive.includes(topicItem.ItemID)" class="events-item-live">
                            <img alt="" src="@/assets/newUI/live.gif" />
                        </div>
                    </div>
                    <div class="highlight-caption">
                        <div class="caption-title-box" @click="handleClickBanner2(topicItem)">
                            <h5 class="caption-title">
                                {{ topicItem.Title }}
                            </h5>
                            <p class="caption-sub-text">
                                {{ topicItem.Description }}
                            </p>
                        </div>
                        <div v-if="topicItem?.Trades" class="caption-list-box">
                            <TradeBtn :trades="topicItem.Trades" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="whytrade">
            <div class="color-mask"></div>
            <div class="color-mask2"></div>
            <div class="whytrade-color-box">
                <div class="whytrade-safe-box">
                    <div class="whytrade-left">
                        <div class="whytrade-left-item">
                            <div class="whytrade-left-item-top">
                                <img alt="" src="@/themeCommon/image/home/whytrade-01.png" />
                                <h5>{{ $t('headLineHome.Spread') }}</h5>
                            </div>

                            <p>
                                {{ $t('headLineHome.SpreadText') }}
                            </p>
                        </div>

                        <div class="whytrade-left-item">
                            <div class="whytrade-left-item-top">
                                <img alt="" src="@/themeCommon/image/home/whytrade-02.png" />
                                <h5>{{ $t('headLineHome.Confident') }}</h5>
                            </div>
                            <p>
                                {{ $t('headLineHome.ConfidentText') }}
                            </p>
                        </div>

                        <div class="whytrade-left-item">
                            <div class="whytrade-left-item-top">
                                <img alt="" src="@/themeCommon/image/home/whytrade-03.png" />
                                <h5>{{ $t('headLineHome.Lighting') }}</h5>
                            </div>
                            <p>
                                {{ $t('headLineHome.LightingText') }}
                            </p>
                        </div>

                        <div class="whytrade-left-item">
                            <div class="whytrade-left-item-top">
                                <img alt="" src="@/themeCommon/image/home/whytrade-04.png" />
                                <h5>{{ $t('headLineHome.Economic') }}</h5>
                            </div>
                            <p>
                                {{ $t('headLineHome.EconomicText') }}
                            </p>
                        </div>

                        <div class="start-trading" @click="goToTradeHandle">
                            <span>{{ $t('headLineHome.startTrade') }}</span>
                        </div>
                    </div>
                    <div class="whytrade-right">
                        <h4>{{ $t('headLineHome.whytrade') }}</h4>
                        <p>{{ $t('headLineHome.whytradeText01') }}</p>
                        <p>{{ $t('headLineHome.whytradeText02') }}</p>
                        <p>{{ $t('headLineHome.whytradeText03') }}</p>
                        <div class="start-trading" @click="goToTradeHandle">
                            <span>{{ $t('headLineHome.startTrade') }}</span>
                        </div>
                    </div>
                </div>

                <div class="partner-safe-box">
                    <h4 class="partner-title">
                        {{ $t('headLineHome.Partners') }}
                    </h4>
                    <div class="partner-content">
                        <div v-for="item in [1, 2, 3, 4, 5, 6]" :key="item" class="partner-item">
                            <img alt="" :src="require(`@/themeCommon/image/home/partner-0${item}.png`)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, toRefs, reactive, watch, computed, ref, unref, onUnmounted } from 'vue'
import { getCookie, isEmpty, localGet, localSet, parseJSON } from '@/utils/util'
import { useStore } from 'vuex'
import useProduct from '@planspc/hooks/useProduct'
import { QuoteSocket } from '@/plugins/socket/socket'
import { useRouter } from 'vue-router'
import { map } from 'lodash'
import useFormatVolume from '@/hooks/trade/useFormatVolume'
import { pow } from '@/utils/calculation'
import computeHandicap from '@planspc/hooks/handicap'
import TradeBtn from './components/TradeBtn.vue'
import { GetItems } from '@/api/newApi'
import videoCover from '@/themeCommon/image/home/videocover.png'
import useSymbolIcon from '@/hooks/useSymbolIcon'
import { useAssets } from '@/hooks/assets'
import useGetTradeExchangeRate from '@/hooks/trade/useGetTradeExchangeRate'

export default {
    components: {
        TradeBtn,
    },
    setup() {
        const store = useStore()
        const router = useRouter()
        const { formatVolume ,isQuantity} = useFormatVolume()
        const state = reactive({
            lang: getCookie('lang') || 'en-US',
            currentTopicID: '',
            h5CurrentProductID: '',
            showPopover: false,
            curDigit: '',
            homeData: [],
            videoShow: true,
            selectedToken: 'usdt',
            isFirstLoading: true,
        })
        const tradeType = computed(() => store.state._base.tradeType)
        const assetsInfo = useAssets()

        // 设置首页默认的板块列表索引
        const categoryType = ref('1')
        // 玩法版本的产品数据
        const { categoryList, productList } = useProduct({
            tradeType,
            categoryType,
            sortEnabled:false,
            notUseType:true
        })

        // 玩法加密类型的数据
        const {  productList: cryptoList } = useProduct({
            tradeType,
            categoryType:ref('1'),
            sortEnabled:false,
            notUseType:true
        })

        const bitcoinId = computed(() => store.state._quote.bitcoinId)

        const planMap = computed(() => store.state._quote.planMap) // 每个玩法下配置的产品


        const symbolKey = computed(() => store.state._quote.productActivedID)

        // 获取成交数据
        const dealList = computed(() => {
            return store.state._quote.dealList.filter((item) => {
                if (Number(item.symbolId) === Number(symbolKey.value?.split('_')[0])) {
                    return item
                }
            })
        })

        // 需要订阅的产品列表
        const subscribeSymbolsList = computed(() => {
            const symbolList = planMap.value[tradeType.value]?.symbolList || []
            const symbolKeys = symbolList.map((symbolId) => `${symbolId}_${tradeType.value}`).sort((a, b) => a.localeCompare(b))
            return symbolKeys
        })

        // 当前订阅的产品信息
        const product = computed(() => store.getters.productActived)

        // 类目数据
        const topicList = computed(() => {
            const filterResult = categoryList?.value?.filter((item) => item.id !== 'selfSymbol')
            return filterResult
        })



        // 当前类目下的产品数据
        const currentTopicList = computed(() => {
            let arr = [...productList.value]
            // 找到目标元素并从数组中移除
            let targetItem = arr.find(item => item.symbolId === Number(bitcoinId.value));
            if(targetItem){
              arr = arr.filter(item => item.symbolId !== Number(bitcoinId.value));
              arr.unshift(targetItem);
              return arr
            }
            return productList.value
        })

        // 卖盘深度的数据
        const ask_deep = computed(() => {
            const askResult = handicapResult.value?.ask_deep?.slice(0, 5) || []
            if (askResult?.length < 5) {
                return fillPosition(askResult, 1)
            } else {
                return askResult
            }
        })
        // 买盘深度的数据
        const bid_deep = computed(() => {
            const bidREsult = handicapResult.value.bid_deep.slice(0, 5)
            if (bidREsult?.length < 5) {
                return fillPosition(bidREsult, 2)
            } else {
                return bidREsult
            }
        })

        // 移动端的收藏列表-------------------------------------------------------------------------------------------

        const productMap = computed(() => store.state._quote.productMap)



        const formatSelfSymbolList = computed(() => {
            const productMapVal = unref(productMap)
            const renderSelfList = []
            // 固定写死h5的id
            let arr = ['1419_1', '1416_1', '1439_1', '1437_1', '1436_1', '1421_1']

               // 玩法版本的产品数据

             if(cryptoList.value.length){
              let cryptoArr=[]
              cryptoList.value.forEach(item=>{
                cryptoArr.push(item.symbolKey)
              })
              arr=[...cryptoArr,...arr]
             }

            arr.forEach((item) => {
                if (productMapVal[item]) {
                    renderSelfList.push(productMapVal[item])
                }
            })

            return renderSelfList
        })

        // 生成h5页面对应的产品图标[]
        const setH5FormatIconHandle = (symbolKey, number) => {
            const { currencyList } = useSymbolIcon(symbolKey)
            return currencyList?.value ? currencyList.value[number] : ''
        }


        //  --------------------------------------------------------------------------------------------------

        let unSubscribe = () => {}

        const moduleId = 'quote_' + Date.now()

        // 选择类目处理
        const currentTopicIDChange = (id, flagId) => {
            state.currentTopicID = id
            const currentIndex = topicList.value.findIndex((item) => item.id == id)
            if (currentIndex > -1) {
                categoryType.value = currentIndex + 1
                if (flagId) {
                    if (topicList.value[currentIndex].listByUser.includes(flagId)) {
                        selectItemIDChange(`${flagId}_${tradeType.value}`)
                    } else {
                        selectItemIDChange(productList.value[0]?.symbolKey)
                    }
                } else {
                    selectItemIDChange(productList.value[0]?.symbolKey)
                }
            }
        }

        // 选择产品处理
        const selectItemIDChange = (symbol) => {
            if (!symbol) {
            } else {
                store.commit('_quote/Update_productActivedID', symbol)
                unSubscribe = QuoteSocket.add_subscribe24H({ moduleId, symbolKeys: subscribeSymbolsList.value })

                const [symbolId, tradeType] = symbol.split('_')

                symbolId && tradeType && resetTradeHistory(symbolId, tradeType)
            }
        }

        watch(
            () => [productList.value, product.value],
            (value) => {
                if (value[0]?.length && !value[1]) {
                    // console.log(value[0])
                    findCacheCurrent(symbolKey)
                }
            },
        )

        watch(
            product,
            (value) => {
                if (value) {
                    // 产品变化，订阅产品报价
                    QuoteSocket.send_subscribe([value])
                }
            },
            {
                immediate: true,
            },
        )

        watch(
            () => product.value?.symbolDigits,
            (value) => {
                // 设置产品默认报价小数位
                if (value) {
                    state.curDigit = pow(0.1, value)
                }
            },
            {
                immediate: true,
            },
        )

        onMounted(() => {
            getTopicData()
            useGetTradeExchangeRate()
            findCacheCurrent(symbolKey)
            if (unref(subscribeSymbolsList).length === 0) return false
            unSubscribe = QuoteSocket.add_subscribe24H({ moduleId, symbolKeys: subscribeSymbolsList.value })
        })

        onUnmounted(() => {
            unSubscribe()
        })

        // h5选中产品切换数据
        const h5CurrentProductIDChange = (name) => {
            state.h5CurrentProductID = name
            selectItemIDChange(name)
        }

        // 根据symbolKey寻找缓存的状态，如果没有，就设置默认值
        const findCacheCurrent = (symbolKey) => {
            // 设置h5的默认选择产品的symbolKey
            if (formatSelfSymbolList.value?.length) {
                const flag = planMap.value[2]?.symbolList.find((item) => item == `${bitcoinId.value}`)
                //设置默认的顺序（最先取交易页缓存的产品id，如果没有，
                //则检查环境内是否有btc，如果有，设置btc为默认,否则设置列表默认的第一条）
                if (symbolKey) {
                    state.h5CurrentProductID = symbolKey
                    //检查是否包含了btc这个产品，如有，则设置默认
                } else if (flag) {
                    state.h5CurrentProductID = `${bitcoinId.value}_${tradeType.value}`
                } else {
                    state.h5CurrentProductID = formatSelfSymbolList.value[0].symbolKey
                }
            }
            const defaultTrade = tradeType.value
            // 设置pc的选择产品数据
            if (symbolKey) {
                const [symbolId, tradeType] = symbolKey.value.split('_')
                const listByUser = map(topicList.value, 'listByUser')
                const index = listByUser.findIndex((list) => list.includes(symbolId))
                // 有可能出现切换语言找不到这个产品的id
                if (index > -1 && topicList.value[index]?.id) {
                    state.currentTopicID = topicList.value[index]?.id
                    categoryType.value = index + 1
                    tradeType && resetTradeHistory(symbolId, tradeType)
                } else {
                    categoryType.value = '1'
                    currentTopicIDChange(topicList.value[0]?.id, bitcoinId.value)
                }
            } else {
                categoryType.value = '1'
                currentTopicIDChange(topicList.value[0]?.id, bitcoinId.value)
            }
        }

        // 设置订阅交易历史
        const resetTradeHistory = (symbolId, tradeType) => {
            store.dispatch('_quote/querySymbolInfo', { symbolId, tradeType }).then((product) => {
                // 订阅产品五档报价(交易历史)
                const curDigits = pow(0.1, product?.symbolDigits)
                QuoteSocket.deal_subscribe(symbolId, product?.priceBreadth || 0, curDigits, tradeType, 5)
            })
        }

        // 获取处理后的盘口数据
        const { handicapResult } = computeHandicap({
            showPending: true,
        })

        // 报价不够5档，补空位（重组数据）
        const fillPosition = (data, type) => {
            const keyLabel = {
                priceLabel: {
                    1: 'price_ask',
                    2: 'price_bid',
                },
                volume: {
                    1: 'volume_ask',
                    2: 'volume_bid',
                },
            }
            const result = data
            if (Array.isArray(result)) {
                let fillLength = 5 - data.length
                while (fillLength > 0) {
                    result.push({
                        [keyLabel.priceLabel[type]]: '--',
                        [keyLabel.volume[type]]: '--',
                        with: 0,
                        unitNum: 0,
                    })
                    fillLength--
                }
            }

            return result
        }

        // 计算报价小数位档数
        const digitLevelList = computed(() => {
            const digits = []
            // 部分产品price_digits可能不存在
            let symbolDigits = product.value?.price_digits || product.value?.symbolDigits || 0
            // 优先取昨收，如果没有则读开盘,首页加载的时候，拿不到这yesterday_close_price和open_price
            const price = product.value?.yesterday_close_price || product.value?.open_price
            while (symbolDigits > -3) {
                const v = pow(0.1, symbolDigits)
                // 当前档位不能大于报价缩进一位的值
                if (v <= price / 10) {
                    digits.push({ text: v })
                } else {
                    break
                }
                symbolDigits--
            }
            return digits.splice(0, 5)
        })

        // 切换深度报价小数位的长度
        const onSelect = (val) => {
            state.curDigit = val.text
            QuoteSocket.deal_subscribe(product.value?.symbolId, product?.value?.priceBreadth || 0, val.text, product?.value?.tradeType, 5)
        }

        // 格式化时间
        const formatTime = (val) => {
            return window.dayjs(Number(val)).format('HH:mm:ss')
        }

        const topicItem = computed(() => {
            if (isEmpty(state.homeData)) {
                return {}
            } else {
                const { ID, ItemLanguages, CoverURL, CoverPC, Trades, ExternalLink, TActivitySetting } = state.homeData[0] || {}
                return Object.assign(
                    {
                        ItemID: ID,
                        CoverURL,
                        CoverPC,
                        Trades,
                        ExternalLink,
                        TActivitySetting,
                    },
                    ItemLanguages[0],
                )
            }
        })

        //事件后台的配置参数
        const newsSysConfig = computed(() => store.state._base.newsSysConfig)

        const eventConfig = computed(() => {
            const result = newsSysConfig.value.find((o) => o.Key === 'indexHotEventPC') || {}
            return parseJSON(result.Value) || {}
        })

        const bannerLive = computed(() => {
            const result = newsSysConfig.value.find((o) => o.Key === 'bannerLiveEventID') || {}
            const value = parseJSON(result?.Value) || {}
            return value?.webPC || []
        })
        // 获取
        const getTopicData = () => {
            const { num = 4 } = eventConfig.value || {}
            const body = {
                Limit: num,
                Offset: 1,
                Conditions: {
                    Type: 1,
                    Status: 2,
                    Language: state.lang,
                    SortType: 6,
                    // Label: 1
                },
            }
            GetItems({ body })
                .then((res) => {
                    const { List } = res
                    // console.log('从接口拿到的数据', List)
                    if (!isEmpty(List)) {
                        state.homeData = List
                        localSet('homeData', JSON.stringify(List))
                    } else {
                        const homeDataCache = localGet('homeData')
                        if (!isEmpty(homeDataCache)) {
                            state.homeData = JSON.parse(homeDataCache)
                        }
                    }
                })
                .catch((err) => {
                    const homeDataCache = localGet('homeData')
                    if (!isEmpty(homeDataCache)) {
                        state.homeData = JSON.parse(homeDataCache)
                    }
                })
        }

        // 点击文章跳转页面
        const handleClickBanner2 = (item) => {
            const { ExternalLink, ItemID } = item || {}
            if (ExternalLink) {
                window.open(ExternalLink)
            } else {
                ItemID &&
                    router.push({
                        name: 'InfoDetail',
                        query: { id: ItemID },
                    })
            }
        }
        // 视频数据
        const globalVideo = computed(() => {
            const arr = store.state._base.newsSysConfig
            const obj = arr.find((i) => i.Key === 'globalVideoConf') || {}
            return parseJSON(obj.Value) || {}
        })

        // 当前类目下的产品数据
        const tokenSelect = (name) => {
            state.selectedToken = name
        }

        // 跳转指定产品（1501_2黄金）路由页面
        const goToTradeHandle = () => {
            // 检查是否有这个产品访问权限，没有则读取缓存选择的产品
            if (bitcoinId.value) {
                const findProduct = productList.value.find((item) => item.symbolId == `${bitcoinId.value}`)
                if (findProduct) {
                    router.push(`/order?symbolId=${bitcoinId.value}&tradeType=${findProduct.tradeType}`)
                } else {
                    tradeNowHandle()
                }
            } else {
                tradeNowHandle()
            }
        }

        // 根据选择跳转路由
        const tradeNowHandle = () => {
            const [symbolId, tradeType] = symbolKey.value?.split('_') || []
            if (symbolId && tradeType) {
                const href = `/order?symbolId=${symbolId || ''}&tradeType=${tradeType || ''}`
                router.push(href)
            }
        }
        return {
            ...toRefs(state),
            topicList,
            digitLevelList,
            currentTopicIDChange,
            currentTopicList,
            selectItemIDChange,
            product,
            goToTradeHandle,
            symbolKey,
            formatVolume,
            dealList,
            formatTime,
            ask_deep,
            bid_deep,
            onSelect,
            topicItem,
            handleClickBanner2,
            videoCover,
            globalVideo,
            tokenSelect,
            bannerLive,
            formatSelfSymbolList,
            setH5FormatIconHandle,
            h5CurrentProductIDChange,
            assetsInfo,
            tradeNowHandle,
            isQuantity
        }
    },
}
</script>

<style lang="scss">
.depth-select-drownpper {
    --van-popover-light-background-color: var(--assistColor);
    --van-popover-action-font-size: 12px;
    //width: 72px;
}
</style>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

.start-trading {
    width: 240px;
    height: 56px;
    margin-top: 64px;
    margin-bottom: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    cursor: pointer;
    background: linear-gradient(91deg, #ff3251 0.42%, #e32e49 98.85%);
    & > span {
        color: #fff;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
    }
}

@media screen and (max-width: 767px) {
    .start-trading {
        width: 200px;
        height: 46px;
        margin-top: 48px;
        margin-bottom: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        cursor: pointer;
        background: linear-gradient(91deg, #ff3251 0.42%, #e32e49 98.85%);
        & > span {
            color: #fff;
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
        }
    }
}

.header {
    width: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    background-position: center;
    background-image: url('../../image/home/bg.png');
    .header-safe-box {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        .header-title {
            color: var(--mainColor);
            text-align: center;
            font-size: 60px;
            font-weight: 600;
            margin-top: 92px;
            max-width: 870px;
            .header-title-flag {
                color: var(--primary);
            }
        }
        .header-sub-text {
            max-width: 600px;
            color: var(--normalColor);
            text-align: center;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
            margin-top: 0;
        }

        .trading-list-pc {
            width: 100%;
            height: 520px;
            border-radius: 8px;
            background: linear-gradient(111deg, rgba(255, 255, 255, 0.2) 3.6%, rgba(255, 255, 255, 0.77) 129.69%);
            backdrop-filter: blur(10.252809524536133px);
            display: flex;
            justify-content: space-between;
            padding: 40px 20px;
            padding-bottom: 0;
            .h5-van-tabs {
                display: none;
            }
            .trading-list-item-box {
                width: 32%;
                height: 100%;
                padding: 24px;
                background: #fff;
                display: flex;
                flex-direction: column;
                border-radius: 16px;
                .pc-van-tabs {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    .pc-van-tabs-scroll {
                        width: 100%;
                        display: flex;
                        align-items: center;
                        // justify-content:center;
                        overflow: auto;
                        height: 50px;

                        border-radius: 4px;
                        padding-bottom: 4px;

                        background-color: var(--bgColor);
                        @include scroll();
                        .pc-van-tabs-scroll-nav {
                            min-width: 41%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            .pc-van-tabs-scroll-nav-con {
                                cursor: pointer;
                                padding: 6px 10px;
                                width: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                border: 1px solid transparent;
                                &.active {
                                    width: calc(100% - 4px);
                                    padding: 8px;
                                    background-color: #fff;
                                    border: 1px solid #fff;
                                }
                                .pc-van-tabs-scroll-nav-con-title {
                                    color: #666;
                                    text-align: center;
                                    font-family: 'DM Sans';
                                    font-size: 14px;
                                    font-style: normal;
                                    font-weight: 500;
                                    line-height: 16px;
                                    white-space: nowrap;
                                    &.active {
                                        color: #000;
                                        text-align: center;
                                        font-size: 14px;
                                        font-style: normal;
                                        font-weight: 700;
                                        line-height: 16px;
                                    }
                                }
                            }
                        }
                    }
                    .trading-list-item-content {
                        height: calc(100% - 50px);
                        overflow: auto;
                        @include scroll();
                        .list-item {
                            display: flex;
                            align-items: center;
                            height: 48px;

                            margin: 8px 0;
                            padding: 0 8px;
                            cursor: pointer;
                            &.active {
                                border-radius: 4px;
                                background: #f9f9fb;
                            }
                            &:hover {
                                border-radius: 4px;
                                background: #f9f9fb;
                            }
                            .list-item-left {
                                flex: 1;
                                display: flex;
                                align-items: center;
                                justify-content: flex-start;
                                & > span {
                                    margin-right: 8px;
                                    color: #000;
                                    font-size: 14px;
                                    font-weight: 700;
                                    line-height: 24px;
                                }
                            }
                            .list-item-right {
                                flex: 1;
                                display: flex;
                                align-items: center;
                                justify-content: flex-end;
                                & > .fallColor {
                                    font-size: 14px;
                                    font-weight: 700;
                                    line-height: 24px;
                                    color: var(--fallColor);
                                }
                                & .riseColor {
                                    font-size: 14px;
                                    font-weight: 700;
                                    line-height: 24px;
                                    color: var(--riseColor);
                                }
                                .ups-and-downs {
                                    margin-left: 33px;
                                    width: 78px;
                                    display: flex;
                                    border-radius: 4px;
                                    align-items: center;
                                    justify-content: center;
                                    &.riseColor {
                                        background-color: var(--riseColor);
                                    }

                                    &.fallColor {
                                        background-color: var(--fallColor);
                                    }
                                    &.grayColor {
                                        background-color: #f4f4f4;
                                        & > span {
                                            color: #000;
                                        }
                                    }
                                    & > span {
                                        color: #fff;
                                    }
                                }
                            }
                        }
                    }
                }

                .active-title {
                    min-height: 24px;
                    margin-bottom: 32px;
                    & > span {
                        color: #000;
                        font-size: 16px;
                        font-weight: 700;
                        line-height: 24px;
                    }
                }
                .active-info {
                    height: calc(100% - 56px);
                    display: flex;
                    flex-direction: column;
                    .active-name {
                        min-height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 16px;
                        .active-name-text {
                            & > img {
                                max-width: 24px;
                                margin-right: 8px;
                            }
                            & > span {
                                color: #000;
                                font-size: 16px;
                                font-weight: 700;
                                line-height: 24px;
                            }
                        }

                        .trade-now {
                            padding: 4px 12px;
                            border-radius: 4px;
                            min-width: 112px;
                            background-color: var(--primary);
                            // background-color: #FEF7F6;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                            & > span {
                                color: #fff;
                                // color:var(--primary);
                                font-family: 'DM Sans';
                                font-size: 16px;
                                font-style: normal;
                                font-weight: 700;
                                text-align: center;
                                // white-space:nowrap;
                            }
                        }
                    }
                    .active-price {
                        display: flex;
                        justify-content: space-between;
                        height: 56px;
                        margin-bottom: 28px;
                        .actice-price-left {
                            // flex: 1;
                            width: 50%;
                            display: flex;
                            flex-direction: column;
                            .actice-price-num {
                                color: #000;
                                font-size: 28px;
                                font-weight: 700;
                                line-height: 24px;
                                margin-bottom: 8px;
                            }
                            .active-up-down {
                                display: flex;
                                width: 100%;
                                justify-content: space-between;
                                color: var(--primary);
                                font-size: 14px;
                                font-weight: 700;
                                line-height: 24px;
                            }
                        }
                        .actice-price-right {
                            flex: 1;
                            max-width: 35%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: flex-end;
                            .actice-price-right-item {
                                width: 100%;
                                display: flex;
                                justify-content: space-between;
                                .actice-price-high {
                                    color: var(--minorColor);
                                    font-size: 12px;
                                    font-weight: 400;
                                }
                                .actice-price-high-num {
                                    color: var(--mainColor);
                                    font-size: 12px;
                                    font-weight: 400;
                                }
                            }
                        }
                    }
                    .active-depth {
                        height: calc(100% - 114px);
                        display: flex;
                        flex-direction: column;
                        .depth-type {
                            display: flex;
                            height: 24px;
                            .depth-type-item {
                                flex: 1;
                                height: 24px;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                & > span {
                                    color: var(--minorColor);
                                    font-size: 12px;
                                    font-weight: 400;
                                    white-space: nowrap;
                                }
                                .depth-select {
                                    height: 24px;
                                    min-width: 74px;
                                    .depth-select-btn {
                                        border-radius: 4px;
                                        min-width: 74px;
                                        cursor: pointer;
                                        position: relative;
                                        height: 24px;
                                        padding: 0 24px 0 10px;
                                        font-size: 12px;
                                        color: var(--minorColor);
                                        line-height: 24px;
                                        background: var(--assistColor);
                                    }
                                    .depth-select-icon {
                                        position: absolute;
                                        top: 10px;
                                        right: 8px;
                                        display: inline-block;
                                        width: 0;
                                        height: 0;
                                        border: 5px solid var(--minorColor);
                                        border-color: var(--minorColor) transparent transparent transparent;
                                        border-width: 5px 5px 0;
                                        border-radius: 3px;
                                    }
                                }
                            }
                        }

                        .depth-list {
                            height: calc(100% - 24px);
                            display: flex;
                            flex-direction: column;
                            .depth-list-title {
                                height: 14px;
                                display: flex;
                                justify-content: space-between;
                                & > span {
                                    color: var(--minorColor);
                                    font-size: 12px;
                                    font-weight: 400;
                                    white-space: nowrap;
                                }
                            }
                            .depth-list-content {
                                height: calc(100% - 24px);
                                overflow: hidden;
                                // @include scroll();
                                padding-right: 6px;
                                display: flex;
                                flex-direction: column;
                                margin-top: 6px;
                                .depth-list-box {
                                    margin: 6px 0;
                                    height: 23px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: space-between;
                                    .depth-list-box-left {
                                        display: flex;
                                        align-items: center;
                                        justify-content: space-between;
                                        width: 49%;
                                        position: relative;
                                        .volunmePercent {
                                            position: absolute;
                                            top: 0;
                                            right: 0;
                                            height: 100%;
                                            background: var(--riseColor);
                                            opacity: 0.05;
                                            transition: all 0.3s linear;
                                            content: '';
                                            &.buy {
                                                background: var(--fallColor);
                                            }
                                        }
                                        .box-up-num {
                                            color: #666666;
                                            font-size: 12px;
                                            font-weight: 400;
                                        }
                                        .box-up-price {
                                            color: var(--riseColor);
                                            font-size: 12px;
                                            font-weight: 400;
                                            border-radius: 2px;
                                            // background: #f5faf8;
                                            padding: 5px;
                                        }
                                    }
                                    .depth-list-box-right {
                                        display: flex;
                                        width: 49%;
                                        justify-content: space-between;
                                        align-items: center;
                                        position: relative;
                                        .volunmePercent {
                                            position: absolute;
                                            top: 0;
                                            left: 0;
                                            height: 100%;
                                            background: var(--riseColor);
                                            opacity: 0.05;
                                            transition: all 0.3s linear;
                                            content: '';
                                            &.buy {
                                                background: var(--fallColor);
                                            }
                                        }
                                        .box-up-num {
                                            color: #666666;
                                            font-size: 12px;
                                            font-weight: 400;
                                        }
                                        .box-up-price {
                                            color: var(--fallColor);
                                            font-size: 12px;
                                            font-weight: 400;
                                            border-radius: 2px;
                                            // background: #f5faf8;
                                            padding: 5px;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                .market-title {
                    height: 24px;
                    margin-bottom: 16px;
                    & > span {
                        color: #000;
                        font-size: 16px;
                        font-weight: 700;
                        line-height: 24px;
                    }
                }
                .market-content {
                    height: calc(100% - 56px);
                    display: flex;
                    flex-direction: column;
                    .market-content-type {
                        display: flex;
                        justify-content: space-between;
                        & > span {
                            width: 33%;
                            text-align: left;
                            color: #666666;
                            font-size: 12px;
                            font-weight: 400;
                        }
                        .market-content-type-amount {
                            text-align: right;
                        }
                    }
                    .market-content-list {
                        height: calc(100% - 18px);
                        overflow: hidden;
                        display: flex;
                        flex-direction: column;
                        // @include scroll();

                        .market-content-item {
                            margin: 5px 0;
                            display: flex;
                            // padding: 0 10px;
                            justify-content: space-between;
                            & > span {
                                width: 33%;
                                color: #666666;
                                font-size: 12px;
                                font-weight: 400;
                            }
                            .market-content-item-price {
                                color: var(--riseColor);
                            }
                            .market-content-item-amount {
                                text-align: right;
                            }
                        }
                    }
                }
            }
        }
    }
}

@media screen and (max-width: 767px) {
    .header {
        height: auto;
        background-repeat: no-repeat;
        background-size: revert;
        background-position: center;
        .header-safe-box {
            padding: 0;
            flex-direction: column;
            align-items: flex-start;
            .header-title {
                padding: 0 16px;
                color: var(--mainColor);
                font-size: 36px;
                font-family: 'Inter';
                margin-top: 62px;
                max-width: 600px;
                text-align: left;
                letter-spacing: -0.612px;
                line-height: 46px;
                .header-title-flag {
                }
            }
            .header-sub-text {
                margin-top: 0;
                max-width: 500px;
                color: var(--normalColor);
                text-align: left;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 24px;
                margin-top: 14px;
                padding: 0 16px;
            }
            .start-trading {
                width: 240px;
                height: 56px;
                margin-left: 16px;
                margin-top: 32px;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                justify-content: flex;
                border-radius: 4px;
                cursor: pointer;
                background: linear-gradient(91deg, #ff3251 0.42%, #e32e49 98.85%);
                & > span {
                    color: #fff;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 500;
                }
            }

            .trading-list-pc {
                display: flex;
                flex-direction: column;
                align-items: center;
                // padding:0;
                padding-top: 0;
                height: auto;
                .h5-van-tabs {
                    display: inline-block;
                    width: 100vw;
                    // margin-bottom: 14px;
                    .h5-van-tabs-scroll {
                        display: flex;
                        width: 100vw;
                        overflow: auto;
                        // background-color:#fff;
                    }

                    .trading-list-item-type {
                        height: 44px;
                        width: 100%;
                        margin: 10px 20px;
                        display: flex;
                        align-items: center;
                        border-radius: 4px;
                        .trading-list-item-type-item {
                            height: 100%;
                            display: flex;
                            align-items: center;
                            border-radius: 8px;
                            padding: 0 10px;
                            border: 1px solid #f9f9fb;
                            &.active {
                                background: #f9f9fb;
                                border: 1px solid #f2f2f2;
                            }
                            & > span {
                                font-size: 14px;
                                font-weight: 700;
                                color: #000;
                                line-height: 16px;
                                white-space:nowrap
                            }
                            .trading-list-item-type-item-icon {
                                display: flex;
                                align-items: center;
                                img {
                                    width: 24px;
                                    height: 24px;
                                    border: 1px solid #fff;
                                    border-radius: 100%;
                                    &:last-child {
                                        margin-left: -10px;
                                    }
                                }
                            }
                        }
                    }
                }

                .trading-list-item-box {
                    width: 100vw;
                    height: 100%;

                    background-color: transparent;
                    display: flex;
                    flex-direction: column;
                    border-radius: 0;
                    padding: 16px;
                    .pc-van-tabs {
                        display: none;
                    }
                    .trading-list-item-content {
                        height: 100%;
                        overflow: auto;
                        @include scroll();
                        .list-item {
                            display: flex;
                            align-items: center;
                            height: 48px;

                            margin: 8px 0;
                            padding: 0 8px;
                            cursor: pointer;
                            &.active {
                                border-radius: 4px;
                                background: #f9f9fb;
                            }
                            &:hover {
                                border-radius: 4px;
                                background: #f9f9fb;
                            }
                            .list-item-left {
                                flex: 1;
                                display: flex;
                                align-items: center;
                                justify-content: flex-start;
                                & > span {
                                    margin-right: 8px;
                                    color: #000;
                                    font-size: 14px;
                                    font-weight: 700;
                                    line-height: 24px;
                                }
                            }
                            .list-item-right {
                                flex: 1;
                                display: flex;
                                align-items: center;
                                justify-content: flex-end;
                                & > .fallColor {
                                    font-size: 14px;
                                    font-weight: 700;
                                    line-height: 24px;
                                    color: var(--fallColor);
                                }
                                & .riseColor {
                                    font-size: 14px;
                                    font-weight: 700;
                                    line-height: 24px;
                                    color: var(--riseColor);
                                }
                                .ups-and-downs {
                                    margin-left: 33px;
                                    width: 78px;
                                    display: flex;
                                    border-radius: 4px;
                                    align-items: center;
                                    justify-content: center;
                                    &.riseColor {
                                        background-color: var(--riseColor);
                                    }

                                    &.fallColor {
                                        background-color: var(--fallColor);
                                    }
                                    & > span {
                                        color: #fff;
                                    }
                                }
                            }
                        }
                    }

                    .active-title {
                        height: 24px;
                        margin-bottom: 32px;
                        & > span {
                            color: #000;
                            font-size: 16px;
                            font-weight: 700;
                            line-height: 24px;
                        }
                    }
                    .active-info {
                        height: calc(100% - 56px);
                        display: flex;
                        flex-direction: column;
                        .active-name {
                            height: 24px;
                            display: flex;
                            align-items: center;
                            margin-bottom: 16px;
                            & > img {
                                max-width: 24px;
                                margin-right: 8px;
                            }
                            & > span {
                                color: #000;
                                font-size: 16px;
                                font-weight: 700;
                                line-height: 24px;
                            }
                        }
                        .active-price {
                            display: flex;
                            justify-content: space-between;
                            height: 56px;
                            margin-bottom: 28px;
                            .actice-price-left {
                                // flex: 1;
                                width: 50%;
                                display: flex;
                                flex-direction: column;
                                .actice-price-num {
                                    color: #000;
                                    font-size: 28px;
                                    font-weight: 700;
                                    line-height: 24px;
                                    margin-bottom: 8px;
                                }
                                .active-up-down {
                                    display: flex;
                                    width: 100%;
                                    justify-content: space-between;
                                    color: var(--primary);
                                    font-size: 14px;
                                    font-weight: 700;
                                    line-height: 24px;
                                }
                            }
                            .actice-price-right {
                                flex: 1;
                                max-width: 35%;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                align-items: flex-end;
                                .actice-price-right-item {
                                    width: 100%;
                                    display: flex;
                                    justify-content: space-between;
                                    .actice-price-high {
                                        color: var(--minorColor);
                                        font-size: 12px;
                                        font-weight: 400;
                                    }
                                    .actice-price-high-num {
                                        color: var(--mainColor);
                                        font-size: 12px;
                                        font-weight: 400;
                                    }
                                }
                            }
                        }
                        .active-depth {
                            height: calc(100% - 114px);
                            display: flex;
                            flex-direction: column;
                            .depth-type {
                                display: flex;
                                height: 24px;
                                .depth-type-item {
                                    flex: 1;
                                    height: 24px;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    & > span {
                                        color: var(--minorColor);
                                        font-size: 12px;
                                        font-weight: 400;
                                    }
                                    .depth-select {
                                        height: 24px;
                                        min-width: 74px;
                                        .depth-select-btn {
                                            border-radius: 4px;
                                            min-width: 74px;
                                            cursor: pointer;
                                            position: relative;
                                            height: 24px;
                                            padding: 0 24px 0 10px;
                                            font-size: 12px;
                                            color: var(--minorColor);
                                            line-height: 24px;
                                            background: var(--assistColor);
                                        }
                                        .depth-select-icon {
                                            position: absolute;
                                            top: 10px;
                                            right: 8px;
                                            display: inline-block;
                                            width: 0;
                                            height: 0;
                                            border: 5px solid var(--minorColor);
                                            border-color: var(--minorColor) transparent transparent transparent;
                                            border-width: 5px 5px 0;
                                            border-radius: 3px;
                                        }
                                    }
                                }
                            }

                            .depth-list {
                                height: calc(100% - 24px);
                                display: flex;
                                flex-direction: column;
                                .depth-list-title {
                                    height: 14px;
                                    display: flex;
                                    justify-content: space-between;
                                    & > span {
                                        color: var(--minorColor);
                                        font-size: 12px;
                                        font-weight: 400;
                                    }
                                }
                                .depth-list-content {
                                    height: calc(100% - 30px);
                                    overflow: hidden;
                                    // @include scroll();
                                    padding-right: 6px;
                                    display: flex;
                                    flex-direction: column;
                                    margin-top: 6px;
                                    .depth-list-box {
                                        margin: 6px 0;
                                        height: 23px;
                                        display: flex;
                                        align-items: center;
                                        justify-content: space-between;
                                        .depth-list-box-left {
                                            display: flex;
                                            align-items: center;
                                            justify-content: space-between;
                                            width: 49%;
                                            .box-up-num {
                                                color: #666666;
                                                font-size: 12px;
                                                font-weight: 400;
                                            }
                                            .box-up-price {
                                                color: var(--riseColor);
                                                font-size: 12px;
                                                font-weight: 400;
                                                border-radius: 2px;
                                                background: #f5faf8;
                                                padding: 5px;
                                                position: relative;
                                            }
                                        }
                                        .depth-list-box-right {
                                            display: flex;
                                            width: 49%;
                                            justify-content: space-between;
                                            align-items: center;

                                            .box-up-num {
                                                color: #666666;
                                                font-size: 12px;
                                                font-weight: 400;
                                            }
                                            .box-up-price {
                                                color: var(--fallColor);
                                                font-size: 12px;
                                                font-weight: 400;
                                                border-radius: 2px;
                                                background: #f5faf8;
                                                padding: 5px;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    .market-title {
                        height: 24px;
                        margin-bottom: 16px;
                        & > span {
                            color: #000;
                            font-size: 16px;
                            font-weight: 700;
                            line-height: 24px;
                        }
                    }
                    .market-content {
                        max-height: 180px;
                        display: flex;
                        flex-direction: column;
                        .market-content-type {
                            display: flex;
                            justify-content: space-between;
                            & > span {
                                width: 33%;
                                text-align: left;
                                color: #666666;
                                font-size: 12px;
                                font-weight: 400;
                            }
                            .market-content-type-amount {
                                text-align: right;
                            }
                        }
                        .market-content-list {
                            min-height: 112px;
                            height: calc(100%);
                            overflow: hidden;
                            display: flex;
                            flex-direction: column;
                            // @include scroll();

                            .market-content-item {
                                margin: 5px 0;
                                display: flex;
                                padding: 0 10px;
                                min-height: 14px;
                                justify-content: space-between;
                                & > span {
                                    width: 33%;
                                    color: #666666;
                                    font-size: 12px;
                                    font-weight: 400;
                                }
                                .market-content-item-price {
                                    color: var(--riseColor);
                                }
                                .market-content-item-amount {
                                    text-align: right;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

.matching {
    margin-top: 84px;
    .matching-safe-box {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        padding: 160px 0;
        .matching-left {
            flex: 1;
            & > h4 {
                color: var(--mainColor);
                text-align: left;
                font-size: 48px;
                font-weight: 600;
                margin-bottom: 11px;
            }
            .matching-left-p {
                & > p {
                    color: #2b2b2b;
                    text-align: left;
                    font-size: 20px;
                    max-width: 700px;
                    font-weight: 400;
                    margin: 0 auto;
                }
            }

            .video-box {
                margin-top: 94px;
                // width: 640px;
                // height: 360px;
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                .bar-video {
                    z-index: 90;
                    width: 640px;
                    height: 360px;
                    // height: auto;
                    display: flex;
                    & > div {
                        width: 32px;
                        height: min-content;
                        display: flex;
                        flex-direction: column;
                        & > div {
                            width: 32px;
                            height: 32px;
                            font-size: 18px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            background: #ebebeb;
                            margin-bottom: 1px;
                            cursor: pointer;
                            border-radius: 6px 0 0 6px;
                            &:active {
                                background: #dcdcdc;
                            }
                            & > i {
                                color: #686868;
                            }
                        }
                    }
                    .cont {
                        width: 640px;
                        height: 360px;
                        background: #000;
                        iframe {
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
                // background: url(../../images/videocover.png), lightgray 50% / cover no-repeat;
            }
        }
        .matching-center {
            display: none;
        }
        .matching-right {
            flex: 1;
            padding-left: 144px;
            display: flex;
            flex-direction: column;
            .matching-right-h5 {
                display: none;
            }
            .matching-item {
                display: flex;
                flex-direction: column;
                margin-bottom: 32px;
                .matching-item-title {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                    & > img {
                        max-width: 24px;
                        max-height: 24px;
                    }
                    & > h5 {
                        margin-left: 8px;
                        color: #000;
                        font-size: 20px;
                        font-weight: 700;
                    }
                }
                & > p {
                    color: var(--normalColor);
                    text-align: justify;
                    font-size: 14px;
                    font-weight: 400;
                    line-height: 20px;
                }
            }
        }
    }
}

@media screen and (max-width: 767px) {
    .matching {
        .matching-safe-box {
            max-width: 100vw;
            // flex-wrap: wrap;
            flex-direction: column;
            padding: 0;
            .matching-left {
                width: 100vw;
                flex: auto;
                padding: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                & > h4 {
                    max-width: 400px;
                    padding: 0 16px;
                    color: var(--mainColor);
                    text-align: left;
                    font-size: 30px;
                    margin-bottom: 0;
                }
                .matching-left-p {
                    display: flex;
                    width: 100%;
                    padding: 0 20px;
                    & > p {
                        color: #2b2b2b;
                        text-align: left;
                        font-size: 14px;
                        max-width: 700px;
                        font-weight: 400;
                        margin: 0;
                    }
                }

                .video-box {
                    margin-top: 24px;
                    // width: 640px;
                    // height: 360px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    .bar-video {
                        width: 92vw;
                        height: auto;
                        & > div {
                            width: 32px;
                            height: min-content;
                            display: flex;
                            flex-direction: column;
                            & > div {
                                width: 32px;
                                height: 32px;
                                font-size: 18px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                background: #ebebeb;
                                margin-bottom: 1px;
                                cursor: pointer;
                                border-radius: 6px 0 0 6px;
                                &:active {
                                    background: #dcdcdc;
                                }
                                & > i {
                                    color: #686868;
                                }
                            }
                        }
                        .cont {
                            width: 92vw;
                            height: 200px;
                            background: #fff;
                            iframe {
                            }
                        }
                    }
                    // background: url(../../images/videocover.png), lightgray 50% / cover no-repeat;
                }
            }
            .matching-center {
                display: inline-block;
                padding: 0 20px;
                margin-top: 24px;
                color: var(--mainColor);
                font-family: 'Inter';
                font-size: 16px;
                font-weight: 700;
            }
            .matching-right {
                margin-top: 34px;
                flex: 1;
                padding-left: 0;
                padding: 0 16px;
                .matching-right-h5 {
                    display: inline-block;
                    margin: 32px 0;
                    & > span {
                        color: var(--mainColor);
                        font-family: 'Inter';
                        font-size: 16px;
                        font-weight: 700;
                    }
                }
                .matching-item {
                    .matching-item-title {
                        & > img {
                        }
                        & > h5 {
                            font-size: 16px;
                        }
                    }
                    & > p {
                    }
                }
            }
        }
    }
}

.summary {
    margin-top: 0;
    margin-bottom: 80px;
    .summary-safe-box {
        max-width: 1200px;
        margin: 0 auto;
        .summary-title {
            color: var(--mainColor);
            text-align: center;
            font-size: 48px;
            font-weight: 600;
            margin-bottom: 11px;
        }
        .summary-sub-title {
            color: #2b2b2b;
            text-align: center;
            font-size: 20px;
            max-width: 700px;
            font-weight: 400;
            margin: 0 auto;
        }
        .summary-content {
            margin-top: 80px;
            display: flex;
            .summary-content-left {
                flex: 1;
                border-radius: 8px;
                min-height: 666px;
                padding-bottom: 44px;
                background: linear-gradient(139deg, #fbfeff 15.39%, #eefdf4 53.63%);
                margin-right: 24px;
                display: flex;
                flex-direction: column;
                align-items: center;
                & > h5 {
                    margin-top: 56px;
                    color: #000;
                    text-align: center;
                    font-size: 32px;
                    font-weight: 600;
                    max-width: 408px;
                    margin-bottom: 16px;
                }
                & > p {
                    max-width: 500px;
                    color: #000;
                    text-align: center;
                    font-size: 16px;
                    font-weight: 400;
                }
                .summary-content-left-con {
                    display: flex;
                    margin-top: 42px;
                    width: 100%;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    .dai-token {
                        position: absolute;
                        top: 15px;
                        right: 58px;
                    }
                    .usdc-token {
                        position: absolute;
                        top: 112px;
                        left: 38px;
                    }
                    .usdt-token {
                        position: absolute;
                        bottom: 10px;
                        right: 96px;
                        max-width: 58px;
                        max-height: 58px;
                    }
                    .coin-list {
                        padding: 24px;
                        border-radius: 8px;
                        width: 400px;
                        background: linear-gradient(111deg, rgba(255, 255, 255, 0.2) 3.6%, rgba(255, 255, 255, 0.77) 129.69%);
                        backdrop-filter: blur(10px);
                        .coin-list-title {
                            & > span {
                                color: #000;
                                text-align: center;
                                font-size: 16px;
                                font-weight: 400;
                            }
                        }
                        .coin-list-con {
                            .coin-list-item {
                                margin-top: 24px;
                                padding: 20px 35px;
                                display: flex;
                                align-items: center;
                                border-radius: 8px;
                                border: 1px solid #fff;
                                background: #fff;
                                &.active {
                                    border: 1px solid #e82f4b;
                                }
                                .coin-list-item-left {
                                    display: flex;
                                    align-items: center;
                                    flex: 1;
                                    & > img {
                                        max-width: 32px;
                                        margin-right: 24px;
                                    }
                                    & > span {
                                        color: #000;
                                        font-size: 14px;
                                        font-weight: 400;
                                    }
                                }
                                .coin-list-item-right {
                                    flex: 1;
                                    min-height: 40px;
                                    display: flex;
                                    justify-content: flex-end;
                                    & > img {
                                        max-width: 40px;
                                        max-height: 40px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .summary-content-right {
                flex: 1;
                border-radius: 8px;
                min-height: 666px;
                border-radius: 8px;
                background: linear-gradient(137deg, #fbfeff 11.92%, #fdecea 89.2%);
                display: flex;
                flex-direction: column;
                align-items: center;
                & > h5 {
                    margin-top: 56px;
                    color: #000;
                    text-align: center;
                    font-size: 32px;
                    font-weight: 600;
                    max-width: 408px;
                    margin-bottom: 16px;
                }
                & > p {
                    max-width: 500px;
                    color: #000;
                    text-align: center;
                    font-size: 16px;
                    font-weight: 400;
                }
                .summary-content-right-con {
                    margin-top: 80px;
                    display: flex;
                    width: 100%;
                    padding-left: 73px;
                    flex-direction: column;
                    position: relative;
                    .step-item {
                        margin-bottom: 40px;
                        & > span {
                            color: #000;
                            font-size: 16px;
                        }
                        & > p {
                            margin-top: 16px;
                            color: #000;
                            font-size: 20px;
                            font-weight: 600;
                        }
                    }
                    & > img {
                        position: absolute;
                        right: 10px;
                        bottom: -10px;
                        max-width: 240px;
                        max-height: 240px;
                    }
                }
            }
        }
    }
}

@media screen and (max-width: 767px) {
    .summary {
        margin-top: 68px;
        margin-bottom: 40px;
        .summary-safe-box {
            max-width: 100vw;
            margin: 0 auto;
            padding: 0;
            .summary-title {
                font-size: 32px;
                font-weight: 600;
                text-align: left;
                padding: 0 16px;
            }
            .summary-sub-title {
                font-size: 16px;
                text-align: left;
                margin-bottom: 40px;
                padding: 0 16px;
            }
            .summary-content {
                margin-top: 0px;
                flex-wrap: wrap;
                .summary-content-left {
                    flex: auto;
                    width: 100vw;
                    padding-bottom: 44px;
                    margin-right: 0;
                    padding: 0 16px;

                    & > h5 {
                        margin-top: 36px;
                        text-align: center;
                        font-size: 24px;
                        max-width: 408px;
                        padding: 0 20px;
                    }
                    & > p {
                        max-width: 500px;
                        color: #000;
                        text-align: center;
                        font-size: 14px;
                        padding: 0 20px;
                    }
                    .summary-content-left-con {
                        display: flex;
                        margin-top: 42px;
                        .dai-token {
                            display: none;
                            top: 35px;
                            right: 8px;
                        }
                        .usdc-token {
                            position: absolute;
                            display: none;

                            top: 230px;
                            left: 2px;
                        }
                        .usdt-token {
                            position: absolute;
                            bottom: 10px;
                            right: 46px;
                            display: none;
                        }
                        .coin-list {
                            .coin-list-title {
                            }
                            .coin-list-con {
                                .coin-list-item {
                                    &.active {
                                    }
                                    .coin-list-item-left {
                                        & > img {
                                        }
                                        & > span {
                                            font-size: 16px;
                                        }
                                    }
                                    .coin-list-item-right {
                                    }
                                }
                            }
                        }
                    }
                }
                .summary-content-right {
                    min-height: 520px;
                    & > h5 {
                        font-size: 24px;
                    }
                    & > p {
                        max-width: 500px;
                        color: #000;
                        text-align: center;
                        font-size: 14px;
                        font-weight: 400;
                    }
                    .summary-content-right-con {
                        margin-top: 40px;
                        display: flex;
                        width: 100%;
                        padding-left: 0;
                        flex-direction: column;
                        position: relative;
                        .step-item {
                            margin-bottom: 40px;
                            & > span {
                                color: #000;
                                font-size: 16px;
                            }
                            & > p {
                                margin-top: 16px;
                                color: #000;
                                font-size: 20px;
                                font-weight: 600;
                            }
                        }
                        & > img {
                            position: absolute;
                            right: 3px;
                            bottom: 20px;
                            max-width: 160px;
                            max-height: 160px;
                        }
                    }
                }
            }
        }
    }
}

.highlight {
    border-radius: 80px;
    min-height: 742px;
    .highlight-safe-box {
        padding-top: 80px;
        padding-bottom: 80px;
        max-width: 1200px;
        margin: 0 auto;
        .highlight-title {
            color: var(--mainColor);
            font-size: 48px;
            font-weight: 600;
            letter-spacing: -1px;
            & > span {
                color: var(--primary);
            }
        }
        .highlight-sub-title {
            font-size: 20px;
            font-weight: 400;
            letter-spacing: 1px;
            margin-bottom: 64px;
        }
        .highlight-content {
            width: 100%;
            display: flex;
            background-color: #fff;
            overflow: hidden;
            border-radius: 16px;
            .highlight-content-left {
                background-size: cover;
                background-position: center center;
                background-image: var(--bgImg);
                width: 584px;
                min-height: 496px;
                height: 100%;
                cursor: pointer;
                position: relative;
                .events-item-live {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    width: 80px;
                    height: 28px;
                    border-radius: 28px;
                    overflow: hidden;
                    background-color: rgba(255, 255, 255, 0.95);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    & > img {
                        // width: 80px;
                        height: 78px;
                    }
                }
                // display: flex;
                // align-items: center;
                // & > img {
                //     max-width: 584px;
                //     min-height: 480px;
                // }
            }
            .highlight-caption {
                padding-left: 24px;
                padding-right: 24px;
                width: calc(100% - 584px);
                display: flex;
                flex-direction: column;
                justify-content: center;
                .caption-title-box {
                    display: flex;
                    flex-direction: column;
                    cursor: pointer;

                    .caption-title {
                        color: var(--mainColor);
                        font-size: 32px;
                        font-weight: 600;
                        line-height: 36px;
                        margin-top: 16px;
                    }
                    .caption-sub-text {
                        color: var(--normalColor);
                        font-size: 14px;
                        line-height: 16px;
                        font-weight: 400;
                        margin-top: 16px;
                    }
                }
                .caption-list-box {
                    display: flex;
                    margin-top: 24px;
                    margin-bottom: 24px;
                    flex-wrap: wrap;
                }
            }
        }
    }
}

@media screen and (max-width: 767px) {
    .highlight {
        min-height: auto;
        margin-top: 100px;
        .highlight-safe-box {
            padding-top: 30px;
            max-width: 100vw;
            padding: 0 16px;
            .highlight-title {
                font-size: 30px;
                text-align: left;
                & > span {
                }
            }
            .highlight-sub-title {
                margin-bottom: 30px;
                text-align: left;
                color: #2b2b2b;
                font-family: 'Poppins';
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
            }
            .highlight-content {
                width: 100%;
                display: flex;
                background-color: transparent;
                overflow: hidden;
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 0;
                border-radius: 0;
                .highlight-content-left {
                    width: 100vw;
                    overflow: hidden;
                    height: 160px;
                    min-height: 160px;
                    cursor: pointer;
                    border-radius: 4px;
                }
                .highlight-caption {
                    padding-left: 0;
                    padding-right: 0;
                    width: 100vw;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding-bottom: 0;
                    .caption-title-box {
                        display: flex;
                        flex-direction: column;
                        cursor: pointer;

                        .caption-title {
                            color: var(--mainColor);
                            font-size: 16px;
                            font-weight: 600;
                            line-height: 26px;
                            text-align: left;
                            margin-top: 20px;
                        }
                        .caption-sub-text {
                            color: var(--normalColor);
                            font-size: 14px;
                            line-height: 18px;
                            text-align: left;
                            font-weight: 400;
                            margin-top: 16px;
                        }
                    }
                    .caption-list-box {
                        display: flex;
                        margin-top: 24px;
                        align-items: center;
                        justify-content: center;
                    }
                }
            }
        }
    }
}

.whytrade {
    position: relative;
    min-height: 1811px;
    .color-mask {
        position: absolute;
        top: 450px;
        right: 300px;
        width: 917.02px;
        height: 1008.661px;
        transform: rotate(-25.013deg);
        flex-shrink: 0;
        border-radius: 1008.661px;
        background: rgba(229, 255, 68, 0.06);
        filter: blur(80px);
    }
    .color-mask2 {
        position: absolute;
        bottom: 100px;
        right: 100px;
        width: 791px;
        height: 282px;
        flex-shrink: 0;
        border-radius: 791px;
        background: rgba(106, 238, 167, 0.15);
        filter: blur(100px);
    }
    .whytrade-color-box {
        z-index: 10;
        position: absolute;
        width: 100%;
        .whytrade-safe-box {
            padding-top: 80px;
            padding-bottom: 104px;
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            .whytrade-left {
                width: 428px;
                display: flex;
                flex-direction: column;
                .whytrade-left-item {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 56px;

                    .whytrade-left-item-top {
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        margin-bottom: 16px;
                        & > img {
                            max-width: 40px;
                            max-height: 40px;
                            margin-bottom: 16px;
                        }
                        & > h5 {
                            font-size: 16px;
                            font-weight: 700;
                            line-height: 24px;
                            margin-bottom: 24px;
                        }
                    }

                    & > p {
                        color: var(--normalColor);
                        font-size: 14px;
                        font-weight: 400;
                        line-height: 20px;
                    }
                }
                .start-trading {
                    display: none;
                }
            }

            .whytrade-right {
                display: flex;
                flex-direction: column;
                justify-content: center;

                & > h4 {
                    color: var(--mainColor);
                    text-align: center;
                    font-size: 48px;
                    font-weight: 600;
                    margin-bottom: 32px;
                }
                & > p {
                    color: var(--normalColor);
                    font-size: 16px;
                    font-weight: 400;
                    margin-top: 16px;
                }
            }
        }

        .awards-safe-box{
            padding-bottom: 160px;
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
           flex-direction: column;
            .awards-title{
              max-width: 1000px;
              margin: 0 auto;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              &>h4{
                text-align: center;
                color: var(--mainColor);
                font-size: 48px;
                font-weight: 600;
                letter-spacing: -1px;
                margin-bottom: 10px;
                margin-bottom: 64px;

              }
              &>p{
                text-align: center;
                font-size: 20px;
                font-weight: 400;
                margin-bottom: 64px;
              }
            }
            .awards-content{
              display: flex;
              background-color:#F9F9FB;
              border-radius:8px;

              .awards-con-video{
                overflow:hidden;
                position:relative;
                width:400px;
                  height:400px;
                  border-radius:8px;
                .video-text-info{
                  position:absolute;
                  left:46px;
                  top:35px;
                  display:flex;
                  flex-direction:column;
                  .total-num{
                    color: #FFF;
                    font-family: "DM Sans";
                    font-size: 32px;
                    font-weight: 700;
                    line-height: 24px; /* 75% */
                    margin-bottom:18px;
                  }
                  .user-num{
                    color: #FFF;
                    font-family: "Inter";
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    letter-spacing: -0.272px;
                  }
                }
                #video-awards{
                  max-height: 400px;
                }
              }
              .awards-con-info{
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content:center;
                padding-left: 50px;

                .awards-con-info-title{
                  color: var(--mainColor);
                  font-family: "Inter";
                  font-size: 32px;
                  font-weight: 600;
                  letter-spacing: -0.544px;
                }
                .awards-con-info-list{
                  margin-top: 64px;
                  display: flex;
                  justify-content:space-between;
                  .awards-con-info-item{
                    // margin-left: 100px;
                    flex:0.3;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    &:nth-of-type(1){
                      margin-left: 0;
                    }
                    &>img{
                      max-width: 134px;
                      margin-bottom: 18px;
                    }
                    &>span{
                      color: #000;
                      text-align: center;
                      font-family: "Inter";
                      font-size: 16px;
                      font-weight: 400;
                      line-height: 18px;
                    }
                  }
                }
              }
            }
        }

        .partner-safe-box {
            padding-top: 0;
            padding-bottom: 160px;
            max-width: 1200px;
            margin: 0 auto;
            .partner-title {
                color: var(--mainColor);
                text-align: center;
                font-size: 40px;
                font-weight: 600;
                margin-bottom: 16px;
            }
            .partner-content {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                .partner-item {
                    width: 370px;
                    height: 200px;
                    margin: 24px 0 0 24px;
                    border-radius: 16px;
                    border: 1px solid #f0f0f0;
                    background: linear-gradient(120deg, rgba(255, 255, 255, 0) 3.15%, rgba(255, 255, 255, 0.23) 79.52%);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
    }
}

@media screen and (max-width: 1192px) {
    .whytrade {
        min-height: 2200px;
    }
}
@media screen and (max-width: 767px) {
    .whytrade {
        position: static;
        min-height: auto;
        margin-top: 40px;
        margin-bottom: 0px;
        .color-mask {
            display: none;
        }
        .color-mask2 {
            display: none;
        }
        .whytrade-color-box {
            z-index: 10;
            position: static;
            width: 100%;
            .whytrade-safe-box {
                padding-top: 30px;
                padding-bottom: 0;
                max-width: 100vw;
                margin: 0 auto;
                display: flex;
                flex-direction: column-reverse;
                flex-wrap: wrap;
                justify-content: space-between;
                .whytrade-left {
                    width: 100vw;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    .whytrade-left-item {
                        display: flex;
                        padding: 0 20px;
                        margin-bottom: 40px;
                        flex-direction: column;
                        justify-content: center;
                        width: 100%;
                        .whytrade-left-item-top {
                            width: 100%;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            margin-bottom: 16px;
                            & > img {
                                max-width: 40px;
                                max-height: 40px;
                                margin-bottom: 0;
                                margin-right: 16px;
                            }
                            & > h5 {
                                color: #000;
                                font-family: 'Poppins';
                                font-size: 16px;
                                font-style: normal;
                                font-weight: 700;
                                line-height: normal;
                                margin-bottom: 0;
                            }
                        }

                        & > p {
                            color: #2b2b2b;
                            font-size: 14px;
                            font-weight: 400;
                            line-height: 20px;
                            text-align: left;
                            font-family: 'Inter';
                        }
                    }

                    .start-trading {
                        display: inline-block;
                        width: 240px;
                        height: 56px;
                        margin-top: 0;
                        margin-bottom: 100px;
                        display: flex;
                        align-items: center;
                        justify-content: flex;
                        border-radius: 4px;
                        cursor: pointer;
                        background: linear-gradient(91deg, #ff3251 0.42%, #e32e49 98.85%);
                        & > span {
                            color: #fff;
                            font-size: 14px;
                            font-style: normal;
                            font-weight: 500;
                        }
                    }
                }

                .whytrade-right {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 0px;
                    & > h4 {
                        color: var(--mainColor);
                        text-align: center;
                        font-size: 30px;
                        font-weight: 600;
                        margin-bottom: 28px;
                        max-width: 80vw;
                    }
                    & > p {
                        display: none;
                    }
                    .start-trading {
                        display: none;
                    }
                }
            }
            .awards-safe-box{
            padding-bottom: 100px;
            max-width: 100%;
            margin: 0 auto;
            display: flex;
           flex-direction: column;
            .awards-title{
              max-width: 88%;
              margin: 0 auto;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              &>h4{
                text-align: center;
                color: var(--mainColor);
                font-size: 30px;
                font-weight: 600;
                letter-spacing: -1px;
                margin-bottom: 24px;
              }
              &>p{
                text-align: center;
                font-size: 14px;
                font-weight: 400;
                margin-bottom: 24px;
              }
            }
            .awards-content{
              flex-direction:column;
              // padding:0 20px;
              margin:0 20px;
              width:calc(100% - 40px);
              .awards-con-video{
                width:100%;

                height:auto;
                position:relative;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                .video-text-info{
                  position:absolute;
                  left:50px;
                  top:30px;
                  .total-num{
                    font-size: 32px;
                    margin-bottom:16px;
                  }
                  .user-num{
                    font-family: "Inter";
                    font-size: 14px;

                  }
                }
                #video-awards{
                  max-width:100%;
                  border-radius:6px;
                }

              }
              .awards-con-info{
                flex: 1;
                display: flex;
                flex-direction: column;
                padding-left: 0;
                .awards-con-info-title{
                  display:none;
                  color: var(--mainColor);
                  font-family: "Inter";
                  font-size: 32px;
                  font-weight: 600;
                  letter-spacing: -0.544px;
                  text-align:center;
                }
                .awards-con-info-list{
                  margin-top:16px;
                  flex-direction:column;
                  justify-content:center;
                  align-items:center;
                  .awards-con-info-item{
                    margin-left: 0;
                    max-width:72vw;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    margin-bottom:24px;

                    &>img{
                      max-width: 134px;
                      margin-bottom: 18px;
                    }
                    &>span{
                      color: #000;
                      text-align: center;
                      font-family: "Inter";
                      font-size: 16px;
                      font-weight: 400;
                      line-height: 18px;
                    }
                  }
                }
              }
            }
        }

            .partner-safe-box {
                padding-top: 0;
                padding-bottom: 100px;
                max-width: 100vw;
                margin: 0 auto;
                .partner-title {
                    color: var(--mainColor);
                    text-align: center;
                    font-size: 30px;
                    font-weight: 600;
                    margin-bottom: 24px;
                }
                .partner-content {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    .partner-item {
                        width: 43vw;
                        height: 120px;
                        margin: 8px;
                        border-radius: 4px;
                        background: #f9f9fb;
                        border: 1px solid #f0f0f0;
                        backdrop-filter: blur(10px);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        & > img {
                            max-width: 38vw;
                        }
                    }
                }
            }
        }
    }
}
</style>
