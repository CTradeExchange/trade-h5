<template>
    <div id='homeContent' ref='homeContent' class='home'>
        <Banner :list='BannerConfig.list' />
        <Products ref='productsRef' />
        <Fastlink />
        <BanderBanner class='BanderBanner' :list='BannerMiniConfig.list' />
        <News class='newBar' />
    </div>
</template>

<script>
import BannerConfig from './configs/banner'
import BannerMiniConfig from './configs/banner_mini'
import NoticeConfig from './configs/notice'
import Banner from '@c/modules/banner/banner'
import Fastlink from './components/fastlink'
import BanderBanner from '@c/modules/handerBanner/handerBanner'
import News from './components/news'
import Products from './components/products'
import { QuoteSocket } from '@/plugins/socket/socket'
import { ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'

export default {
    name: 'Home',
    components: {
        Banner,
        Fastlink,
        Products,
        BanderBanner,
        News,
    },
    setup () {
        const productsRef = ref(null)
        const calcSubscribeProducts = () => {
            let list = productsRef.value?.products || []
            list = list.map(el => el.symbolId)
            return list
        }
        onMounted(() => {
            // 订阅产品
            const subscribList = calcSubscribeProducts()
            if (subscribList.length > 0) QuoteSocket.send_subscribe(subscribList)
        })
        return {
            productsRef,
            BannerConfig,
            NoticeConfig,
            BannerMiniConfig
        }
    }
}
</script>

<style lang="scss" scoped >
@import '~@/sass/mixin.scss';
.home {
    height: 100%;
    margin-bottom: rem(80px);
    overflow: auto;
    background: var(--contentColor);
}
.noticeBar,
.newBar {
    margin-top: rem(20px);
}
</style>
