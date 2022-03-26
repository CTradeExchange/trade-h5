<template>
    <div class='homePage'>
        <router-view />
        <!-- 轮播模块 -->
        <swiper />
        <div class='relativeFloor'>
            <!-- 产品模块 -->
            <!-- <product @update='setProductKeys' /> -->

            <!-- 公告模块 -->
            <!-- <notice /> -->

            <!-- 内容模块 -->
            <div class='content-module'>
                <!-- 快速注册模块 -->
                <quick />
                <FundDesc />

                <!-- 指引模块 -->
                <!-- <guide /> -->
                <!-- 交易模块 -->
                <trade @update='setProductKeys' />

                <protfolio-create />

                <!-- 信息流模块 -->
                <div class='newsFullWidth'>
                    <div class='flow-module auto-width'>
                        <div class='flow-left'>
                            <h3 class='title'>
                                {{ $t('information.focusNews') }}
                            </h3>
                            <!-- 新闻 -->
                            <news />
                        </div>
                        <div class='flow-right'>
                            <h3 class='title'>
                                {{ $t('information.newsFlash') }}
                            </h3>
                            <!-- 7x24 -->
                            <seven />
                        </div>
                    </div>
                </div>

                <portfolio />

                <!-- why模块 -->
                <why />

                <div v-if='!$store.state._user.customerInfo' class='registerFooter'>
                    <div class='css-128y11d'>
                        <div class='immediatelyText'>
                            {{ $t('home.getProfit') }}
                        </div>
                        <div class='css-1r4nzjd'>
                            <a id='buttom_cta_trade_now' class=' css-1alo8h7' data-bn-type='button' href='https://accounts.binance.com/zh-CN/register'>
                            </a>
                            <van-button class='lijiRegister' type='primary' @click="$router.push('/register')">
                                {{ $t('home.toReg') }}
                            </van-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 客服 -->
    <service />
    <!-- 底部隐私协议 -->
    <privacy-tip />
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { QuoteSocket } from '@/plugins/socket/socket'
import swiper from './components/swiper.vue'
import product from './components/product.vue'
import notice from './components/notice.vue'
import quick from './components/quick.vue'
import guide from './components/guide.vue'
import trade from './components/trade.vue'
import news from './components/news.vue'
import seven from './components/seven.vue'
import why from './components/why.vue'
import protfolioCreate from './components/protfolio-create.vue'
import portfolio from './components/portfolio.vue'
import FundDesc from './components/fundDesc.vue'
import service from './components/service.vue'
import privacyTip from './components/privacy-tip.vue'

// 当前页面的产品symbolKey
const productKeys = ref([])

// 发起行情订阅
const sendSubscribe = () => {
    QuoteSocket.send_subscribe(productKeys.value)
}
// 设置页面产品的symbolKey
const setProductKeys = (arr) => {
    const list = productKeys.value.concat(arr)
    productKeys.value = Array.from(new Set(list))
    sendSubscribe()
}

onUnmounted(() => {
    // 取消行情订阅
    QuoteSocket.cancel_subscribe()
})
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.homePage {
    position: relative;
    padding-top: 540px;
    .relativeFloor {
        position: relative;
        z-index: 101;
    }
}
// 内容模块
.content-module {
    padding-bottom: 20px;
    overflow: auto;
    background-color: var(--bgColor);
}

// 信息流模块
.newsFullWidth{
    margin-top: 20px;
    padding: 50px 0;
    background-color: var(--contentColor);
}
.flow-module {
    display: flex;
    .flow-left {
        flex: 1;
    }
    .flow-right {
        flex: 1;
        padding-left: 30px;
    }
    .title {
        margin-bottom: 38px;
        color: var(--color);
        font-weight: bold;
        font-size: 30px;
    }
    .case {
        height: 600px;
    }
    .tabs {
        margin-bottom: 38px;
        span {
            margin-right: 45px;
            color: var(--minorColor);
            font-weight: bold;
            font-size: 32px;
            cursor: pointer;
            &:last-of-type {
                margin-right: 0;
            }
            &:hover {
                color: var(--color);
            }
        }
        .active {
            color: var(--color);
            border-bottom: 3px solid var(--primary);
        }
    }
}
.registerFooter {
    padding: 86px 16px 60px;
    text-align: center;
    .immediatelyText {
        color: #1E2329;
        font-weight: 600;
        font-size: 40px;
        line-height: 48px;
        text-align: center;
    }
    .lijiRegister {
        padding: 0 50px;
        height: 44px;
        margin-top: 30px;
        font-size: 16px;
        background-color: #0062FF;
        border-color: #0062FF;
        border-radius: 5px;
        @include hover();
    }
}
</style>
