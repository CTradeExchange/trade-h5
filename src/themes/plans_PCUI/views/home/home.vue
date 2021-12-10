<template>
    <div class='homePage'>
        <router-view />

        <!-- 轮播模块 -->
        <FullBanner v-if='fullBannerData' :data='fullBannerData.data' />

        <div class='relativeFloor'>
            <!-- 产品模块 -->
            <BannerProducts v-if='bannerProductsData' :data='bannerProductsData.data' @update='setProductKeys' />
            <!-- 公共模块 -->
            <HomeNotice v-if='homeNoticeData' :data='homeNoticeData.data' />
            <!-- 内容模块 -->
            <div v-if='pageModules.length>0' class='content-module'>
                <PageComp class='homePageComp' :data='pageModulesList' />

                <!-- 下载模块 -->
                <download />
                <!-- 指引模块 -->
                <guide />
                <!-- 为什么选择模块 -->
                <why />
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

import { reactive, toRefs, onMounted, onUnmounted, computed } from 'vue'
import { QuoteSocket } from '@/plugins/socket/socket'
import { useStore } from 'vuex'
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

        // 获取首页配置
        store.dispatch('_base/getPageConfig', 'Home').then(res => {
            console.log('首页配置', res)
            state.pageModules = res
        })

        // 发送行情订阅
        onMounted(() => {
            if (state.allProductKeys.length > 0) {
                sendSubscribe()
            }
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
            pageModulesList,
            fullBannerData,
            homeNoticeData,
            bannerProductsData,
            switchFlow,
            setProductKeys,
            setTradeKeys
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

.homePage{
    position: relative;
    padding-top: 490px;
    .relativeFloor{
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
        font-size: 32px;
        font-weight: bold;
        color: var(--color);
    }
    .case {
        height: 600px;
    }
    .tabs {
        @include font();
        margin-bottom: 38px;
        span {
            padding-bottom: 6px;
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
</style>

<style lang="scss">
.homePageComp{
    .m-layout{
        width: 1200px;
        margin-left: auto !important;
        margin-right: auto !important;
    }
}
</style>
