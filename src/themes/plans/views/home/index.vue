<template>
    <div class='page-wrap'>
        <div class='banner'>
            <van-swipe :autoplay='3000' class='my-swipe' indicator-color='white'>
                <van-swipe-item>
                    <router-link to='fundProductList'>
                        <img alt='' :src='require("../../images/banner/h5banner5-"+ lang +".jpg")' srcset='' />
                    </router-link>
                </van-swipe-item>
                <van-swipe-item>
                    <router-link to='fundProductList'>
                        <img alt='' :src='require("../../images/banner/h5banner3-"+ lang +".png")' srcset='' />
                    </router-link>
                </van-swipe-item>
            </van-swipe>
        </div>

        <div v-if='!customerInfo' class='reg-wrap'>
            <div class='input-wrap'>
                <input v-model='regVal' :placeholder="$t('home.emailOrPhone')" type='text' />
            </div>
            <div class='btn' @click='start'>
                {{ $t('home.getStarted') }}
            </div>
        </div>

        <FundDesc />

        <div class='product-wrap'>
            <h1>{{ $t('home.marketTrend') }}</h1>

            <div class='list'>
                <div class='header'>
                    <span>{{ $t('trade.symbol') }}</span>
                    <span>{{ $t('trade.positionLastPrice') }}</span>
                    <span>{{ $t('trade.upDown') }} </span>
                </div>
                <ul class='content'>
                    <li v-for='item in productList' :key='item.symbolKey' class='product' @click='openProduct(item)'>
                        <currency-icon class='icon' :currency='item.baseCurrency' :size='36' />
                        <div class='symbol'>
                            <p class='symbol-name'>
                                <span class='sn-text'>
                                    {{ item.symbolName }}
                                </span>
                                <span v-if='item.etf' class='etf'>
                                    ETF
                                </span>
                            </p>

                            <p class='symbol-code'>
                                {{ item.symbolCode }}
                            </p>
                        </div>
                        <div class='price'>
                            <p class='cur-price' :class='item.last_color'>
                                {{ !item.rolling_last_price && item.rolling_last_price != 0 ? '- -' : item.rolling_last_price }}
                            </p>
                        </div>
                        <div class='price'>
                            <p class='up-down' :class='item.rolling_upDownColor'>
                                {{ !item.rolling_upDownWidth && item.rolling_upDownWidth != 0 ? '- -' : item.rolling_upDownWidth }}
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
            <router-link class='view-more' to='/quote'>
                {{ $t('common.viewMore') }}
                <van-icon name='arrow' />
            </router-link>
        </div>

        <div class='portfolio'>
            <p class='t1'>
                {{ $t('home.portfolioCreate.text1') }}
            </p>
            <!-- <p class='t2'>
                Start your first trade with these easy steps.
            </p> -->
            <div class='img-wrap'>
                <img alt='' class='pro-img' src='/images/portfolio-section.png' srcset='' />
            </div>
            <ul class='pro-list'>
                <li class='pro-item'>
                    <img alt='' class='icon-img' src='/images/threeStep_img2.png' srcset='' />
                    <p class='t3'>
                        {{ $t('home.portfolioCreate.text2') }}
                    </p>
                    <p class='t4'>
                        {{ $t('home.portfolioCreate.text3') }}
                    </p>
                </li>
                <li class='pro-item'>
                    <img alt='' class='icon-img' src='/images/threeStep_img3.png' srcset='' />
                    <p class='t3'>
                        {{ $t('home.portfolioCreate.text4') }}
                    </p>
                    <p class='t4'>
                        {{ $t('home.portfolioCreate.text5') }}
                    </p>
                </li>
                <li class='pro-item'>
                    <img alt='' class='icon-img' src='/images/threeStep_img4.png' srcset='' />
                    <p class='t3'>
                        {{ $t('home.portfolioCreate.text6') }}
                    </p>
                    <p class='t4'>
                        {{ $t('home.portfolioCreate.text7') }}
                    </p>
                </li>
            </ul>
            <router-link v-if='!customerInfo' class='start-btn' to='/register'>
                {{ $t('home.getStarted') }}
            </router-link>
        </div>

        <Portfolio />

        <!-- 信息流 屏蔽-->
        <!-- <div class='news-wrap'>
            <News :data='newsData' />
        </div> -->

        <!-- why模块 -->
        <div class='why-wrap'>
            <div class='descBarTitle'>
                {{ $t('home.why.text1') }}
            </div>
            <div class='descList'>
                <div class='row'>
                    <img alt='' class='icon' src='~@plans/images/moneyBox.png' />
                    <p class='descTitle'>
                        {{ $t('home.why.text2') }}
                    </p>
                    <p class='descContent'>
                        {{ $t('home.why.text3') }}
                    </p>
                </div>
                <div class='row'>
                    <img alt='' class='icon' src='~@plans/images/trafficLight.png' />
                    <p class='descTitle'>
                        {{ $t('home.why.text4') }}
                    </p>
                    <p class='descContent'>
                        {{ $t('home.why.text5') }}
                    </p>
                </div>
                <div class='row'>
                    <img alt='' class='icon' src='~@plans/images/lock.png' />
                    <p class='descTitle'>
                        {{ $t('home.why.text6') }}
                    </p>
                    <p class='descContent'>
                        {{ $t('home.why.text7') }}
                    </p>
                </div>
                <div class='row'>
                    <img alt='' class='icon' src='~@plans/images/check.png' />
                    <p class='descTitle'>
                        {{ $t('home.why.text8') }}
                    </p>
                    <p class='descContent'>
                        {{ $t('home.why.text9') }}
                    </p>
                </div>
            </div>
        </div>

        <div v-if='!customerInfo' class='registerFooter'>
            <div class='css-128y11d'>
                <div class='immediatelyText'>
                    {{ $t('home.getProfit') }}
                </div>
                <div class='css-1r4nzjd'>
                    <a id='buttom_cta_trade_now' class=' css-1alo8h7' data-bn-type='button' href='https://accounts.binance.com/zh-CN/register'>
                    </a>
                    <van-button block class='lijiRegister' type='primary' @click="$router.push('/register')">
                        {{ $t('home.toReg') }}
                    </van-button>
                </div>
            </div>
        </div>

        <div v-if='privacyVis' class='privacy'>
            <div class='close-wrap'>
                <div class='close' @click='privacyVis=false'>
                    <svg class='icon-svg' height='10' viewBox='0 0 20 20' width='10' xmlns='http://www.w3.org/2000/svg'>
                        <g><polygon points='18.096 19.174 19.497 17.747 1.7 .286 .3 1.714' /><polygon points='19.497 1.714 18.096 .286 .3 17.747 1.7 19.174' /></g>
                    </svg>
                </div>
            </div>

            <div class='content'>
                {{ $t('home.privacy.text1') }}
                <a class='sc-AxiKw cJlLNA' color='light' href='javascript:;' rel='noopener' @click='openPrivacy'>
                    {{ $t('home.privacy.text2') }}
                </a>
            </div>
            <div class='footer'>
                <span class='agree' @click='agree'>
                    {{ $t('home.privacy.agree') }}
                </span>
                <div class='close-btn' @click='privacyVis=false'>
                    {{ $t('home.privacy.close') }}
                </div>
            </div>
        </div>

        <div class='serviceIcon' @click='toService'>
            <!-- <img alt='' src='/images/serviceIcon.png' /> -->
            <i class='icon icon_xiaoxizhongxin'></i>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { setCookie, getCookie, isEmpty, localGet, localSet } from '@/utils/util'
import FundDesc from './components/fundDesc.vue'
import Portfolio from './components/portfolio.vue'
import { useStore } from 'vuex'
import currencyIcon from '@/components/currencyIcon.vue'
import { QuoteSocket } from '@/plugins/socket/socket'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const store = useStore()
const { t } = useI18n({ useScope: 'global' })
const customerInfo = computed(() => store.state._user.customerInfo)

const regVal = ref('')
const lang = ref(getCookie('lang') || 'zh-CN')
const privacyVis = ref(false)
const symbolKeys = ['368_5', '328_5', '329_5', '331_5', '332_5', '323_5'] // prd
// const symbolKeys = ['1_5', '21_5', '22_5', '23_5', '26_5', '28_5']
// const symbolKeys = ['1564_5', '706_5', '709_5', '714_5', '720_5', '717_5'] // pre
// uat 测试 1 、 21 、22、23、26、28

// 产品列表数据
const productList = symbolKeys.map(key => store.state._quote.productMap[key]).filter(elem => elem)

const start = () => {
    const param = regVal.value.includes('@') ? { email: regVal.value } : { mobile: regVal.value }
    router.push({
        path: 'register',
        query: param
    })
}

const openProduct = (data) => {
    // router.push({ name: 'Order', query: { symbolId: data.symbolId, direction: 'buy' } })
    router.push(`/product?symbolId=${data.symbolId}&tradeType=${data.tradeType}`)
}

const toService = () => {
    const onlineService = store.state._base.wpCompanyInfo?.onlineService
    if (onlineService) {
        router.push({
            name: 'Otherpage',
            params: { type: 'page' },
            query: { title: t('route.onlineService'), url: onlineService }
        })
    }
}

// 打开cookie协议页面
const openPrivacy = () => {
    router.push({ path: 'cookies-policy' })
}

const agree = () => {
    localSet('privacyFlag', true)
    privacyVis.value = false
}

if (!localGet('privacyFlag')) {
    privacyVis.value = true
}

QuoteSocket.add_subscribe24H({ moduleId: 'home', symbolKeys })

</script>

<style lang="scss">
.descBarTitle {
    box-sizing: border-box;
    min-width: 0;
    // margin-top: 80px;
    padding-bottom: 10px;
    color: #1E2329;
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    text-align: center;
}
.descList {
    padding-top: 40px;
    padding-right: 16px;
    padding-bottom: 16px;
    padding-left: 16px;
    text-align: center;
    background: var(--contentColor);
    .row {
        margin-bottom: 40px;
    }
    .icon {
        width: 56px;
    }
    .descTitle {
        margin-bottom: 8px;
        padding-top: 10px;
        color: #1E2329;
        font-weight: 500;
        font-size: 20px;
        line-height: 28px;
    }
    .descContent {
        min-height: 1.2em;
        color: #474D57;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
    }
}
.registerFooter {
    padding: 40px 16px 16px;
    text-align: center;
    .immediatelyText {
        color: #1E2329;
        font-weight: 600;
        font-size: 24px;
        line-height: 32px;
        text-align: center;
    }
    .lijiRegister {
        height: 48px;
        margin-top: 24px;
        font-size: 16px;
        background-color: #0062FF;
        border-color: #0062FF;
        border-radius: rem(10px);
    }
}
.page-wrap {
    .banner {
        //background-image: linear-gradient(120deg, #84FAB0 0%, #8FD3F4 100%);
        img {
            width: 100%;
        }
    }
    .reg-wrap {
        padding: rem(50px) rem(30px) 0;
        .input-wrap {
            height: rem(76px);
            margin-bottom: 16px;
            line-height: rem(76px);
            background-color: #FFF;
            border: 1px solid transparent;
            border-color: var(--lineColor);
            border-radius: 4px;
            input {
                width: 100%;
                padding-left: rem(20px);
            }
        }
        .btn {
            width: 100%;
            height: rem(96px);
            margin-left: 0;
            color: #FFF;
            font-size: 16px;
            line-height: rem(96px);
            text-align: center;
            background-color: #0062FF;
            border-radius: rem(10px);
        }
    }
    .portfolio {
        margin-top: rem(40px);
        margin-bottom: rem(30px);
        padding: rem(60px) rem(30px);
        background: var(--contentColor);
        .t1 {
            color: #1E2329;
            font-weight: 600;
            font-size: 24px;
            line-height: 32px;
            text-align: center;
        }
        .t2 {
            margin-top: 8px;
            color: #474D57;
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
        }
        .img-wrap {
            margin-top: 40px;
            margin-bottom: 40px;
            text-align: center;
            .pro-img {
                width: 220px;
            }
        }
        .pro-list {
            text-align: center;
            .pro-item {
                margin-bottom: 40px;
                .icon-img {
                    width: rem(96px);
                    margin-bottom: 16px;
                }
                .t3 {
                    margin-bottom: 8px;
                    color: #1E2329;
                    font-weight: 500;
                    font-size: 20px;
                    line-height: 28px;
                }
                .t4 {
                    color: #474D57;
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 20px;
                }
            }
        }
        .start-btn {
            display: inline-block;
            width: 100%;
            color: #FFF;
            font-size: 16px;
            line-height: 48px;
            text-align: center;
            background-color: #0062FF;
            border-radius: 5px;
            cursor: pointer;
        }
    }
    .product-wrap {
        margin-top: rem(50px);
        padding: rem(60px) rem(30px);
        background: var(--contentColor);
        h1 {
            padding-bottom: 24px;
            font-size: 24px;
        }
        .list {
            .header {
                display: flex;
                margin: rem(20px) 0 rem(50px);
                color: var(--minorColor);
                >span {
                    flex: 1;
                    font-size: 12px;
                    text-align: right;
                    &:first-child {
                        flex: 2;
                        text-align: left;
                    }
                }
            }
            .content {
                .product {
                    display: flex;
                    align-items: center;
                    margin-bottom: rem(40px);
                    .icon {
                        width: rem(65px);
                        height: rem(65px);
                        margin-right: rem(20px);
                        img {
                            width: 100%;
                        }
                    }
                    .symbol {
                        .symbol-name {
                            width: rem(290px);
                            margin-bottom: rem(10px);
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            .sn-text {
                                display: inline-block;
                                margin-right: rem(10px);
                                overflow: hidden;
                                color: var(--color);
                                font-weight: bold;
                                font-size: rem(28px);
                                vertical-align: middle;
                            }
                            .etf {
                                display: inline-block;
                                padding: 0 rem(6px);
                                color: var(--primary);
                                font-size: rem(20px);
                                text-align: center;
                                vertical-align: middle;
                                background: none;
                                border: 1px solid var(--primary);
                                border-radius: rem(10px);
                            }
                        }
                        .symbol-code {
                            width: rem(320px);
                            overflow: hidden;
                            color: var(--minorColor);
                            font-size: rem(24px);
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                    }
                    .price {
                        flex: 1;
                        font-size: 14px;
                        .cur-price {
                            text-align: right;
                        }
                        .up-down {
                            font-weight: 500;
                            font-weight: bold;
                            text-align: right;
                        }
                    }
                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }
        }
        .view-more {
            display: inline-block;
            margin-top: rem(60px);
            color: var(--minorColor);
            font-size: rem(24px);
        }
    }
    .why-wrap {
        margin: rem(50px) 0 0;
        padding: rem(50px) 0;
        background: var(--contentColor);
    }
}
.privacy {
    position: sticky;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    padding: rem(30px);
    overflow: hidden;
    font-size: rem(28px);
    line-height: rem(50px);
    background-color: rgb(250, 251, 252);
    .close-wrap {
        display: flex;
        justify-content: flex-end;
        margin-bottom: rem(10px);
        .close {
            display: flex;
            flex-shrink: 0;
            align-items: center;
            align-self: flex-end;
            justify-content: center;
            width: 24px;
            height: 24px;
            padding: 0;
            background-color: rgb(112, 133, 153);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0.5;
            -webkit-box-align: center;
            -webkit-box-pack: center;
            .icon-svg {
                cursor: pointer;
                transition: fill 0.15s ease 0s;
                fill: rgb(255, 255, 255);
            }
        }
    }
    a {color: #0062FF;}
    .content {
        padding: 0 0 10px;
    }
    .footer {
        text-align: center;
        .close-btn {
            display: inline-block;
            padding: 0 24px;
            color: var(--primary);
            border: solid 1px var(--primary);
            border-radius: 4px;
            cursor: pointer;
        }
        .agree {
            display: inline-block;
            width: fit-content;
            margin-right: rem(40px);
            padding: 0 24px;
            color: rgb(255, 255, 255);
            // font-size: 14px;
            white-space: nowrap;
            background-color: #0062FF;
            border: 1px solid #0062FF;
            border-radius: 4px;
            cursor: pointer;
        }
    }
}
.serviceIcon {
    position: fixed;
    right: 24px;
    bottom: 16px;
    z-index: 109;
    display: flex;
    align-items: center;
    justify-content: center;
    width: rem(80px);
    height: rem(80px);
    background: #0062FF;
    border-radius: 50%;
    .icon {
        color: #FFF;
        font-size: rem(40px);
    }
}
</style>
