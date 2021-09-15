<template>
    <div id='homeContent' ref='homeContent' class='home'>
        <!-- <BanderBanner class='BanderBanner' :list='BannerConfig.mini' /> -->
        <!-- <PageComp :data='pageModules' /> -->

        <Banner :list='BannerConfig.large' />
        <Products ref='productsRef' :symbol-keys='products' />
        <Fastlink />
        <BanderBanner class='BanderBanner' :list='BannerConfig.mini' />
        <InformationFlow class='newBar' :lang='lang' :orgid='$store.state._base.wpCompanyInfo.orgid' />
    </div>
</template>

<script>
import { pageConfig } from '@/api/wpApi'
import BannerConfig from './configs/banner'
import NoticeConfig from './configs/notice'
import Banner from '@plans/modules/banner/banner'
import Fastlink from './components/fastlink'
import BanderBanner from '@plans/modules/ad/ad'
// import News from './components/news'
import InformationFlow from './components/informationFlow'
import Products from '@plans/modules/productsSwipe/productsSwipe'
import { QuoteSocket } from '@/plugins/socket/socket'
import { onActivated, ref } from 'vue'
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
        const store = useStore()
        const pageModules = ref([])
        const productsRef = ref(null)
        const lang = ref(localGet('lang'))
        const products = ['3_1', '33_1', '37_2']

        store.dispatch('_base/getPageConfig', 'Home').then(res => {
            console.log(res)
            pageModules.value = res
        })

        onActivated(() => {
            lang.value = localGet('lang')
            // 订阅产品
            QuoteSocket.send_subscribe(products)
        })
        return {
            lang,
            pageModules,
            products,
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
