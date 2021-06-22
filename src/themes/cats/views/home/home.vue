<template>
    <div id='homeContent' ref='homeContent' class='home'>
        <Banner :list='BannerConfig.list' />
        <Fastlink />
        <img src='https://www.se6868w.com/upload/2021/06-22/09-14-0309361852188263.png' style='width: 100%;' />
        <Notice class='noticeBar' :data='NoticeConfig' />
        <BanderBanner class='BanderBanner' :list='BannerConfig.list' />
        <News class='newBar' />
    </div>
</template>

<script>
import BannerConfig from './configs/banner'
import NoticeConfig from './configs/notice'
import Banner from '@c/modules/banner/banner'
import Fastlink from './components/fastlink'
import Notice from '@c/modules/notice/notice'
import BanderBanner from '@c/modules/handerBanner/handerBanner'
import News from './components/news'

export default {
    components: {
        Banner,
        Fastlink,
        Notice,
        BanderBanner,
        News,
    },
    setup () {
        const modules = []
        modules.push(BannerConfig)
        return {
            modules,
            BannerConfig,
            NoticeConfig,
        }
    }
}
</script>

<style lang="scss" scoped >
@import '~@/sass/mixin.scss';
.home {
    height: 100%;
    margin-bottom: rem(100px);
    overflow: auto;
}
.noticeBar,
.newBar {
    margin-top: rem(20px);
}
</style>
