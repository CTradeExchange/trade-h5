<template>
    <div class='home'>
        <!-- 轮播模块 -->
        <swiper />
        <!-- 产品模块 -->
        <product />
        <!-- 公共模块 -->
        <notice />
        <!-- 内容模块 -->
        <div class='content-module'>
            <!-- 快速注册 -->
            <quick />
            <!-- 广告模块 -->
            <ad />
            <!-- 交易模块 -->
            <trade />
            <!-- 信息流模块 -->
            <div class='flow-module auto-width'>
                <div class='flow-left'>
                    <h3 class='title'>
                        要闻
                    </h3>
                    <div class='case'>
                        <news />
                    </div>
                </div>
                <div class='flow-right'>
                    <div class='tabs'>
                        <span class='active'>
                            7x24
                        </span>
                        <span>
                            财经日历
                        </span>
                    </div>
                    <div class='case'></div>
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

import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
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
        why
    },
    setup () {
        const store = useStore()
        return {}
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
        .case {
            height: 600px;
        }
    }
}
</style>
