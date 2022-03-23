<template>
    <div class='page-wrap'>
        <div class='banner'>
            <img alt='' :src='require("../../images/banner/h5banner-"+ lang +".png")' srcset='' />
        </div>

        <div v-if='!customerInfo' class='reg-wrap'>
            <div class='input-wrap'>
                <input v-model='regVal' :placeholder='$t("register.input")' type='text' />
            </div>
            <div class='btn' @click='start'>
                {{ $t('register.registerBtn') }}
            </div>
        </div>

        <div class='product-wrap'>
            <h1>{{ $t('vitaHome.trend') }}</h1>
            <div class='list'>
                <div class='header'>
                    <span>{{ $t('trade.symbol') }}</span>
                    <span>{{ $t('trade.positionLastPrice') }}</span>
                    <span>24h{{ $t('chart.quoteChange') }}</span>
                </div>
                <ul class='content'>
                    <li v-for='item in productList' :key='item.symbolKey' class='product' @click='openProduct(item)'>
                        <i class='icon'>
                            <img alt='' :src='"/images/currency_icon/"+item.baseCurrency+".png"' srcset='' />
                        </i>
                        <div class='symbol'>
                            <p class='symbol-name'>
                                {{ item.symbolName }}
                            </p>
                            <p class='symbol-code'>
                                {{ item.symbolCode }}
                            </p>
                        </div>
                        <div class='price'>
                            <p class='cur-price' :class='item.upDownColor'>
                                {{ item.cur_price }}
                            </p>
                        </div>
                        <div class='price'>
                            <p class='up-down' :class='item.upDownColor'>
                                {{ item.upDownWidth }}
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

        <!-- 信息流 -->
        <div class='news-wrap'>
            <News :data='newsData' />
        </div>

        <!-- 页脚 -->
        <div class='footer-wrap'>
            <div class='menu'>
                <div class='main' @click="expand('product')">
                    <span>{{ $t('newHomeFooter.product') }}</span>
                    <van-icon :name='productVis ? "minus" : "plus"' />
                </div>
                <div v-show='productVis' class='sub'>
                    <p class='link' @click='jumpUrl("trading")'>
                        {{ $t('newHomeFooter.trading') }}
                    </p>
                    <p class='link' @click='jumpUrl("fund")'>
                        {{ $t('newHomeFooter.fund') }}
                    </p>
                </div>
            </div>
            <div class='menu'>
                <div class='main' @click="expand('service')">
                    <span>{{ $t('newHomeFooter.service') }}</span>
                    <van-icon :name='serviceVis ? "minus" : "plus"' />
                </div>
                <div v-show='serviceVis' class='sub'>
                    <p class='link' @click='jumpUrl("program")'>
                        {{ $t('newHomeFooter.program') }}
                    </p>
                    <p class='link' @click='jumpUrl("vip")'>
                        {{ $t('newHomeFooter.vip') }}
                    </p>
                    <p class='link' @click='jumpUrl("customer")'>
                        {{ $t('newHomeFooter.customer') }}
                    </p>
                </div>
            </div>
            <div class='menu'>
                <div class='main' @click="expand('help')">
                    <span>{{ $t('newHomeFooter.help') }}</span>
                    <van-icon :name='helpVis ? "minus" : "plus"' />
                </div>
                <div v-show='helpVis' class='sub'>
                    <p class='link' @click='jumpUrl("faqs")'>
                        {{ $t('newHomeFooter.faqs') }}
                    </p>
                    <p class='link' @click='jumpUrl("terms")'>
                        {{ $t('newHomeFooter.terms') }}
                    </p>
                    <p class='link' @click='jumpUrl("policy")'>
                        {{ $t('newHomeFooter.policy') }}
                    </p>
                </div>
            </div>
            <div class='social'>
                <p class='nav-dt'>
                    {{ $t('newHomeFooter.community') }}
                </p>
                <ul class='community-box f-b-t'>
                    <li class='box-item' @click='jumpUrl("fb")'>
                        <img alt='facebook' class='item-icon' src='../../images/home/facebook.png' />
                        <p class='icon-label'>
                            Facebook
                        </p>
                    </li>
                    <li class='box-item' @click='jumpUrl("ig")'>
                        <img alt='instagram' class='item-icon' src='../../images/home/instagram.png' />
                        <p class='icon-label'>
                            Instagram
                        </p>
                    </li>
                    <li class='box-item' @click='jumpUrl("twitter")'>
                        <img alt='twitter' class='item-icon' src='../../images/home/twitter.png' />
                        <p class='icon-label'>
                            Twitter
                        </p>
                    </li>
                    <li class='box-item' @click='jumpUrl("telegram")'>
                        <img alt='telegram' class='item-icon' src='../../images/home/telegram.png' />
                        <p class='icon-label'>
                            Telegram
                        </p>
                    </li>
                    <li class='box-item' @click='jumpUrl("yt")'>
                        <img alt='youtube' class='item-icon' src='../../images/home/youtube.png' />
                        <p class='icon-label'>
                            Youtube
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { setCookie, getCookie, isEmpty, localGet, localSet } from '@/utils/util'
import News from '@plans/modules/news/news.vue'
import { useStore } from 'vuex'
import { QuoteSocket } from '@/plugins/socket/socket'

const router = useRouter()
const store = useStore()
const customerInfo = computed(() => store.state._user.customerInfo)

const downloadVis = ref(true)
const regVal = ref('')
const lang = ref(getCookie('lang') || 'zh-CN')
const newsData = ref({ orgid: 1 })
const serviceVis = ref(false)
const productVis = ref(false)
const helpVis = ref(false)
// const symbolKeys = ['368_5', '328_5', '329_5', '331_5', '332_5']
const symbolKeys = ['1_5', '21_5', '22_5', '23_5', '26_5', '28_5']
// uat 测试 1 、 21 、22、23、26、28

// 产品列表数据
const productList = symbolKeys.map(key => store.state._quote.productMap[key]).filter(elem => elem)

const start = () => {
    const param = regVal.value.includes('@') ? { email: regVal.value } : { mobile: regVal.value }
    debugger
    router.push({
        path: 'register',
        query: param
    })
    // register?email=545665@32.add
}

const expand = module => {
    if (module === 'product') {
        productVis.value = !productVis.value
    } else if (module === 'service') {
        serviceVis.value = !serviceVis.value
    } else if (module === 'help') {
        helpVis.value = !helpVis.value
    }
}

const jumpUrl = (index) => {
    console.log('=======', index, getCookie('lang'))
    const lang = getCookie('lang') || 'zh-CN'
    let linkList = {}
    if (lang === 'zh-CN') {
        linkList = {
            trading: 'https://www.vitatoken.com/zh-CN/order?symbolId=364&tradeType=5',
            fund: 'https://www.vitatoken.com/zh-CN/fund',
            program: 'https://www.vitatoken.com/zh-CN/new1',
            vip: 'https://www.vitatoken.com/zh-CN/vip',
            customer: 'https://cs.vitatoken.io:443/im/text/1cayxu.html?lang=en',
            faqs: 'https://www.vitatoken.com/site/faqs',
            terms: 'https://www.vitatoken.com/site/terms-conditions',
            policy: 'https://www.vitatoken.com/site/privacy-policy'
        }
    } else {
        linkList = {
            trading: 'https://www.vitatoken.com/en-US/order?symbolId=364&tradeType=5',
            fund: 'https://www.vitatoken.com/en-US/fund',
            program: 'https://www.vitatoken.com/en-US/new1',
            vip: 'https://www.vitatoken.com/en-US/vip',
            customer: 'https://cs.vitatoken.io:443/im/text/1cayxu.html?lang=en',
            faqs: 'https://www.vitatoken.com/site/faqs',
            terms: 'https://www.vitatoken.com/site/terms-conditions',
            policy: 'https://www.vitatoken.com/site/privacy-policy'
        }
    }
    const community = {
        fb: 'https://www.facebook.com/Vitatoken-100578379186941',
        ig: 'https://www.instagram.com/vitatoken_official/',
        twitter: 'https://twitter.com/Vitatoken_',
        telegram: 'https://t.me/vitatoke',
        yt: 'https://www.youtube.com/channel/UCWrIoUETskxOU9zIVpba6Hg'
    }
    const newLinkList = { ...linkList, ...community }
    window.open(newLinkList[index])
}

QuoteSocket.add_subscribe({ moduleId: 'home', symbolKeys })

</script>

<style lang="scss">
.page-wrap {
    .banner {
        height: rem(450px);
        //background-image: linear-gradient(120deg, #84FAB0 0%, #8FD3F4 100%);
        img {
            width: 100%;
        }
    }
    .reg-wrap {
        margin-top: rem(80px);
        padding: 0 rem(30px);
        .input-wrap {
            height: rem(76px);
            margin-bottom: rem(32px);
            line-height: rem(76px);
            background-color: #FFF;
            border: 1px solid transparent;
            border-color: var(--lineColor);
            border-radius: 4px;
            input {
                padding-left: rem(20px);
            }
        }
        .btn {
            width: 100%;
            height: rem(96px);
            margin-left: 0;
            line-height: rem(96px);
            text-align: center;
            background-color: #FCD535;
            border-radius: rem(10px);
        }
    }
    .product-wrap {
        margin-top: rem(50px);
        padding: rem(60px) rem(30px);
        background: var(--contentColor);
        border-top-left-radius: 40px;
        border-top-right-radius: 40px;
        h1 {
            padding: 0 0 rem(40px) 0;
        }
        .list {
            .header {
                display: flex;
                margin: rem(20px) 0 rem(50px);
                color: var(--minorColor);
                >span {
                    flex: 1;
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
                            width: rem(320px);
                            margin-bottom: rem(10px);
                            overflow: hidden;
                            color: var(--color);
                            font-weight: bold;
                            font-size: rem(28px);
                            white-space: nowrap;
                            text-overflow: ellipsis;
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
                        .cur-price {
                            font-size: rem(32px);
                            text-align: right;
                        }
                        .up-down {
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
            color: var(--pirmary);
            font-weight: bold;
            font-size: rem(28px);
        }
    }
    .footer-wrap {
        margin-top: rem(50px);
        padding: rem(30px);
        font-size: rem(28px);
        background: var(--contentColor);
        .menu {
            .main {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: rem(84px);
                font-weight: bold;
                font-size: rem(30px);
                line-height: rem(84px);
                .van-icon {
                    font-weight: bold;
                }
            }
            .sub {
                .link {
                    padding: rem(15px) 0;
                    color: var(--normalColor);
                }
            }
        }
        .social {
            .nav-dt {
                padding: rem(40px) 0;
                text-align: center;
            }
            .community-box {
                display: flex;
                justify-content: center;
                .box-item {
                    display: inline-block;
                    flex: 1;
                    text-align: center;
                    .icon-label {
                        font-size: rem(20px);
                    }
                    .item-icon {
                        margin-bottom: rem(10px);
                    }
                }
            }
        }
    }
}

</style>
