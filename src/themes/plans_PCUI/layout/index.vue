<template>
    <div class='page-wrapper'>
        <!-- <leftSide /> -->
        <div class='page-main'>
            <topNav :class='[$route.name]' />
            <div class='page-container'>
                <Suspense>
                    <template #default>
                        <router-view v-slot='{ Component, route }'>
                            <keep-alive :include='cacheViews'>
                                <component
                                    :is='Component'
                                    :key='
                                        route.meta.usePathKey ? route.path : undefined
                                    '
                                />
                            </keep-alive>
                        </router-view>
                    </template>
                    <template #fallback>
                        Loading...
                    </template>
                </Suspense>
            </div>

            <div class='fixed-bar-group'>
                <div v-if='buoyTG.state == 1' class='bar-item tgBot tg' @click='handleSkip'>
                    <img class='tgBot tg' :src='commonTgBar' />
                </div>
                <div class='bar-item' @click='openPasstoAIChat'>
                    <img :src='commonServiceBar' />
                </div>
                <!-- <jwt-btn>
                    <div class='bar-item'>
                        <img :src='commonHelpBar' />
                    </div>
                </jwt-btn> -->
                <div v-if='videoShow && globalVideo.state == 1' class='bar-video'>
                    <div>
                        <!-- <div @click="handleFadeIn" title="全屏播放">
                            <el-icon><FullScreen /></el-icon>
                        </div>
                        <div @click="handleMuted" title="开启声音">
                            <el-icon><Bell /></el-icon>
                        </div> -->
                        <div title='关闭视频' @click='videoShow = false'>
                            <el-icon><Close /></el-icon>
                        </div>
                    </div>
                    <iframe
                        v-if='globalVideo.iframeUrl'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                        allowfullscreen
                        class='cont'
                        frameborder='0' :src='globalVideo.iframeUrl'
                    ></iframe>
                    <video
                        v-else
                        id='video-id'
                        autoplay
                        class='cont'
                        controls
                        controlsList='nodownload footbar noplaybackrate'
                        disablePictureInPicture
                        loop
                        muted
                        :poster='videoCover'
                        :src='globalVideo.srcUrl'
                    ></video>
                </div>
            </div>

            <footerNav :data='footerData' />
        </div>
        <AutoThirdRegister />
    </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import topNav from './topNav'
import footerNav from './footer.vue'
import leftSide from './left-side.vue'
import jwtBtn from '@/components/jwtBtn.vue'
import { parseJSON } from '@/utils/util'
import commonTgBar from '../images/topNav/common-tg.png'
import commonServiceBar from '../images/topNav/common-service.png'
import commonHelpBar from '../images/topNav/common-help.png'
import videoCover from '../images/videocover.png'
import AutoThirdRegister from '@/themeCommon/components/autoThirdRegister.vue'

export default {
    name: 'Layout',
    components: {
        topNav,
        jwtBtn,
        footerNav,
        leftSide,
        AutoThirdRegister
    },
    computed: {
        footerData () {
            const wpFooter = this.$store.state._base.wpFooter?.find(
                (o) => o.tag === 'footer'
            )
            return wpFooter ? wpFooter.data : {}
        }
    },
    setup () {
        const store = useStore()
        const cacheViews = computed(() => store.state.cacheViews)
        const onlineService = computed(() => store.state._base.wpCompanyInfo?.onlineService)

        const globalVideo = computed(() => {
            const arr = store.state._base.newsSysConfig
            const obj = arr.find(i => i.Key === 'globalVideoConf') || {}
            return parseJSON(obj.Value) || {}
        })

        const buoyTG = computed(() => {
            const arr = store.state._base.newsSysConfig
            const obj = arr.find(i => i.Key === 'buoyTG') || {}
            return parseJSON(obj.Value) || {}
        })

        const state = reactive({
            noticePopShow: false,
            commonTgBar,
            commonServiceBar,
            commonHelpBar,
            videoShow: true,
            videoCover,
        })

        const handleSkip = () => {
            window.open(buoyTG.value?.link)
        }

        const handleFadeIn = () => {
            const doc = document.getElementById('video-id')
            if (doc.muted) {
                doc.muted = false
            }
            if (doc.requestFullscreen) {
                doc.requestFullscreen()
            } else if (doc.mozRequestFullscreen) {
                doc.mozRequestFullscreen()
            } else if (doc.msRequestFullscreen) {
                doc.msRequestFullscreen()
            } else if (doc.oRequestFullscreen) {
                doc.oRequestFullscreen()
            } else if (doc.webkitRequestFullscreen) {
                doc.webkitRequestFullscreen()
            }
        }

        const handleMuted = () => {
            const doc = document.getElementById('video-id')
            if (doc.muted) {
                doc.muted = false
            }
        }

        return {
            buoyTG,
            handleSkip,
            onlineService,
            cacheViews,
            handleMuted,
            handleFadeIn,
            globalVideo,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss">
@import "@/sass/mixin.scss";
.page-wrapper{
    display: flex;
    .page-main{
        flex:1;
        max-width: 100%;
        .page-container{
           display: flex;
           flex-direction: column;
        }

    }
    .fixed-bar-group{
        position: fixed;
        width: 0;
        right: 26px;
        bottom: 80px;
        z-index: 900;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .bar-item{
            position: relative;
            width: 52px;
            height: 52px;
            background: #FFFFFF;
            box-shadow: 0px 0px 20px 0px rgba(4,0,0,0.15);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            padding: 8px;
            & > img {
                width: 100%;
                height: auto;
            }
        }
        & > div {
            margin-top: 20px;
        }
        & > div:first-of-type {
            margin-top: 0;
        }
        .bar-video {
            position: fixed;
            bottom: 0;
            right: 0;
            z-index: 99999;
            width: 280px;
            height: auto;
            display: flex;
            & > div {
                width: 32px;
                height: min-content;
                display: flex;
                flex-direction: column;
                &>div {
                    width: 32px;
                    height: 32px;
                    font-size: 18px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #ebebeb;
                    margin-bottom: 1px;
                    cursor: pointer;
                    border-radius: 6px 0 0 6px;
                    &:active {
                        background: #dcdcdc;
                    }
                    &>i {
                        color: #686868;
                    }
                }
            }
            .cont {
                width: 248px;
                height: 140px;
                background: #000;
                iframe {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
}
</style>
