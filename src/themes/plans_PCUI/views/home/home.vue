<template>
    <div class='homePage'>
        <router-view />

        <!-- 轮播模块 -->
        <FullBanner v-if='fullBannerData' :data='fullBannerData.data' />

        <div class='relativeFloor'>
            <!-- 产品模块 -->
            <BannerProducts v-if='bannerProductsData' :data='bannerProductsData.data' />
            <!-- 公共模块 -->
            <HomeNotice v-if='homeNoticeData' :data='homeNoticeData.data' />
            <!-- 内容模块 -->
            <div v-if='pageModules.length>0' class='content-module'>
                <PageComp class='homePageComp' :data='pageModulesList' />

                <!-- 指引模块 -->
                <!-- <guide /> -->
                <!-- 为什么选择模块 -->
                <!-- <why /> -->
            </div>
        </div>
    </div>
</template>

<script>
// components
import ad from './components/ad.vue'
import trade from './components/trade.vue'
import download from './components/download.vue'
import guide from './components/guide.vue'
import why from './components/why.vue'
import seven from './components/seven.vue'
import FullBanner from '../../modules/fullBanner/fullBanner'
import BannerProducts from '../../modules/bannerProducts/bannerProducts'
import HomeNotice from '../../modules/homeNotice/homeNotice'

import { reactive, toRefs, onMounted, onUnmounted, computed, watch } from 'vue'
import { QuoteSocket } from '@/plugins/socket/socket'
import { useStore } from 'vuex'
import { getCookie } from '@/utils/util'
export default {
    name: 'Home',
    components: {
        ad,
        trade,
        download,
        guide,
        why,
        seven,
        HomeNotice,
        FullBanner,
        BannerProducts,
    },
    setup () {
        const store = useStore()
        const state = reactive({
            // 当前信息流选项卡
            currentFlow: 1,
            // 页面
            pageModules: [],
            // 产品组件symbolKey
            productKeys: [],
            // 行情组件symbolKey
            tradeKeys: [],
            // 需要订阅产品的symbolKey
            allProductKeys: []
        })

        const fullBannerData = computed(() => state.pageModules.find(el => el.tag === 'fullBanner'))
        const bannerProductsData = computed(() => state.pageModules.find(el => el.tag === 'bannerProducts'))
        const homeNoticeData = computed(() => state.pageModules.find(el => el.tag === 'homeNotice'))
        const pageModulesList = computed(() => state.pageModules.filter(el => ['homeNotice', 'bannerProducts', 'fullBanner'].indexOf(el.tag) === -1))
        const subscribeList = computed(() => store.state.home.subscribeBannerList.concat(store.state.home.subscribeQuoteList))

        // 切换信息流
        const switchFlow = (num) => {
            state.currentFlow = num
        }

        // 发送行情订阅
        watch(
            () => subscribeList.value,
            (newval, oldval) => {
                QuoteSocket.send_subscribe(newval)
            },
            { immediate: true }
        )

        // 获取首页配置
        store.dispatch('_base/getPageConfig', 'Home').then(res => {
            console.log('首页配置', res)
            state.pageModules = res
        })

        // WL--start 底部nav跳转
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
                    faqs: 'https://www.vitatoken.io/site/faqs',
                    terms: 'https://www.vitatoken.io/site/terms-conditions',
                    policy: 'https://www.vitatoken.io/site/privacy-policy'
                }
            } else {
                linkList = {
                    trading: 'https://www.vitatoken.com/en-US/order?symbolId=364&tradeType=5',
                    fund: 'https://www.vitatoken.com/en-US/fund',
                    program: 'https://www.vitatoken.com/en-US/new1',
                    vip: 'https://www.vitatoken.com/en-US/vip',
                    customer: 'https://cs.vitatoken.io:443/im/text/1cayxu.html?lang=en',
                    faqs: 'https://www.vitatoken.io/site/faqs',
                    terms: 'https://www.vitatoken.io/site/terms-conditions',
                    policy: 'https://www.vitatoken.io/site/privacy-policy'
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

        // 发送行情订阅
        onMounted(() => {
            // 头部固定
            const headerEl = document.querySelector('.header-nav')
            if (headerEl) headerEl.classList.add('fixedHeader')
        })

        // 取消行情订阅
        onUnmounted(() => {
            const headerEl = document.querySelector('.header-nav')
            if (headerEl) headerEl.classList.remove('fixedHeader')
            QuoteSocket.cancel_subscribe()
        })

        return {
            ...toRefs(state),
            jumpUrl,
            pageModulesList,
            fullBannerData,
            homeNoticeData,
            bannerProductsData,
            switchFlow,
        }
    }
}
</script>

<style lang="scss" scoped>

// WL--end
.homePage {
    position: relative;
    padding-top: 490px;
    .relativeFloor {
        position: relative;
        z-index: 101;
    }
}

// 内容模块
.content-module {
    padding-bottom: 80px;
    overflow: auto;
    background-color: var(--contentColor);
}

// 信息流模块
.flow-module {
    display: flex;
    margin-top: 90px;
    .flow-left {
        flex: 1;
    }
    .flow-right {
        flex: 1;
        padding-left: 30px;
    }
    .title {
        @include font();
        margin-bottom: 38px;
        color: var(--color);
        font-weight: bold;
        font-size: 32px;
    }
    .case {
        height: 600px;
    }
    .tabs {
        @include font();
        margin-bottom: 38px;
        span {
            margin-right: 45px;
            padding-bottom: 6px;
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

@import '@/sass/mixin.scss';
</style>
