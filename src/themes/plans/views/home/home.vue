<template>
    <div id='homeContent' ref='homeContent' class='home'>
        <Banner :list='BannerConfig.large' />
        <Products ref='productsRef' />
        <Fastlink />
        <BanderBanner class='BanderBanner' :list='BannerConfig.mini' />
        <!-- <News class='newBar' /> -->
        <InformationFlow class='newBar' :lang='lang' :orgid='$store.state._base.wpCompanyInfo.orgid' />
    </div>
</template>

<script>
import BannerConfig from './configs/banner'
import NoticeConfig from './configs/notice'
import Banner from '@plans/modules/banner/banner'
import Fastlink from './components/fastlink'
import BanderBanner from '@plans/modules/handerBanner/handerBanner'
// import News from './components/news'
import InformationFlow from './components/informationFlow'
import Products from './components/products'
import { QuoteSocket } from '@/plugins/socket/socket'
import { ref } from '@vue/reactivity'
import { onActivated, onMounted } from '@vue/runtime-core'
import { localGet } from '@/utils/util'
import { useStore } from 'vuex'

export default {
    name: 'Home',
    components: {
        Banner,
        Fastlink,
        Products,
        BanderBanner,
        // News,
        InformationFlow,
    },
    setup () {
        const productsRef = ref(null)
        const lang = ref(localGet('lang'))
        const calcSubscribeProducts = () => {
            let list = productsRef.value?.products || []
            list = list.map(el => el.symbolId)
            return list
        }
        onActivated(() => {
            lang.value = localGet('lang')
            // 订阅产品
            const subscribList = calcSubscribeProducts()
            if (subscribList.length > 0) QuoteSocket.send_subscribe(subscribList)
        })
        return {
            lang,
            productsRef,
            BannerConfig,
            NoticeConfig

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
