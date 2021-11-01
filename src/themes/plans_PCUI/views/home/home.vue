<template>
    <div class='home'>
        <!-- 轮播模块 -->
        <swiper />
        <!-- 产品模块 -->
        <product @update='setProductKeys' />
        <!-- 公共模块 -->
        <notice />
        <!-- 内容模块 -->
        <div class='content-module'>
            <!-- 快速注册 -->
            <quick />
            <!-- 广告模块 -->
            <ad />
            <!-- 交易模块 -->
            <trade @update='setTradeKeys' />
            <!-- 信息流模块 -->
            <div class='flow-module auto-width'>
                <div class='flow-left'>
                    <h3 class='title'>
                        {{ $t('information.focusNews') }}
                    </h3>
                    <news />
                </div>
                <div class='flow-right'>
                    <div class='tabs'>
                        <span :class="{ 'active': currentFlow === 1 }" @click='switchFlow(1)'>
                            {{ $t('information.newsFlash') }}
                        </span>
                        <span :class="{ 'active': currentFlow === 2 }" @click='switchFlow(2)'>
                            {{ $t('information.calendar') }}
                        </span>
                    </div>
                    <!-- 7x24 -->
                    <div v-show='currentFlow === 1'>
                        <seven />
                    </div>
                    <!-- 财经日历 -->
                    <div v-show='currentFlow === 2'>
                        <calendar />
                    </div>
                </div>
            </div>
            <!-- 下载模块 -->
            <download />
            <!-- 指引模块 -->
            <guide />
            <!-- 为什么选择模块 -->
            <why />
        </div>
    </div>
</template>

<script>
// components
import swiper from './components/swiper.vue'
import product from './components/product.vue'
import notice from './components/notice.vue'
import quick from './components/quick.vue'
import ad from './components/ad.vue'
import trade from './components/trade.vue'
import news from './components/news.vue'
import download from './components/download.vue'
import guide from './components/guide.vue'
import why from './components/why.vue'
import seven from './components/seven.vue'
import calendar from './components/calendar.vue'

import { reactive, toRefs, onActivated, onDeactivated } from 'vue'
import { QuoteSocket } from '@/plugins/socket/socket'
export default {
    name: 'Home',
    components: {
        swiper,
        product,
        notice,
        quick,
        ad,
        trade,
        news,
        download,
        guide,
        why,
        seven,
        calendar
    },
    setup () {
        const state = reactive({
            // 当前信息流选项卡
            currentFlow: 1,
            // 产品组件symbolKey
            productKeys: [],
            // 行情组件symbolKey
            tradeKeys: [],
            // 需要订阅产品的symbolKey
            allProductKeys: []
        })

        // 切换信息流
        const switchFlow = (num) => {
            state.currentFlow = num
        }

        // 设置产品组件symbolKey
        const setProductKeys = (keys) => {
            state.productKeys = keys
            sendSubscribe()
        }

        // 设置交易组件symbolKey
        const setTradeKeys = (keys) => {
            state.tradeKeys = keys
            sendSubscribe()
        }

        // 发送行情订阅
        const sendSubscribe = () => {
            const arr = state.productKeys.concat(state.tradeKeys)
            state.allProductKeys = [...new Set(arr)]
            QuoteSocket.send_subscribe(state.allProductKeys)
        }

        // 发送行情订阅
        onActivated(() => {
            if (state.allProductKeys.length > 0) {
                sendSubscribe()
            }
        })

        // 取消行情订阅
        onDeactivated(() => {
            QuoteSocket.cancel_subscribe()
        })

        return {
            ...toRefs(state),
            switchFlow,
            setProductKeys,
            setTradeKeys
        }
    }
}
</script>

<style lang="scss" scoped>
// 内容模块
.content-module {
    padding: 90px 0;
    background-color: var(--contentColor);
}

// 信息流模块
.flow-module {
    display: flex;
    margin-top: 90px;
    .flow-left {
        flex: 1;
        .title {
            margin-bottom: 38px;
            font-size: 32px;
            font-weight: bold;
            color: var(--color);
        }
        .case {
            height: 600px;
        }
    }
    .flow-right {
        flex: 1;
        padding-left: 30px;
        .tabs {
            margin-bottom: 38px;
            span {
                margin-right: 45px;
                font-size: 32px;
                font-weight: bold;
                color: var(--minorColor);
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
}
</style>
