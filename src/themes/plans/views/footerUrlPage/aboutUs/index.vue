<template>
    <div class='about-us'>
        <div class='content'>
            <h2 class='title'>
                <template v-if="lang == 'en-US'">
                    {{ $t("aboutUs.introduceTitle.about") }}<span>{{ $t("aboutUs.introduceTitle.us") }}</span>
                </template>
                <template v-else>
                    {{ $t("aboutUs.introduceTitle.about") }}{{ $t("aboutUs.introduceTitle.us") }}
                </template>
            </h2>
            <div class='video'>
                <video controls poster='../../../images/aboutus/video_index.png' preload>
                    <source src='https://www.vitatoken.io/site/about-us.mp4' type='video/mp4' />
                </video>
            </div>
            <div class='introduce'>
                <img class='img' src='../../../images/aboutus/photo.png' @click='isShowImg = true' />
                <div class='text'>
                    <p>
                        {{ $t("aboutUs.introduce1") }}
                    </p>
                    <p>
                        {{ $t("aboutUs.introduce2") }}
                    </p>
                    <p>
                        {{ $t("aboutUs.introduce3") }}
                    </p>
                </div>
            </div>
        </div>
        <div class='content'>
            <h2 class='title'>
                <template v-if="lang == 'en-US'">
                    {{ $t("aboutUs.our") }}<span>{{ $t("aboutUs.servicesTitle") }}</span>
                </template>
                <template v-else>
                    {{ $t("aboutUs.servicesTitle") }}
                </template>
            </h2>
            <div class='services'>
                <img class='img' :src='serviceImg' />
            </div>
        </div>
        <div class='content'>
            <h2 class='title'>
                <template v-if="lang == 'en-US'">
                    {{ $t("aboutUs.our") }}<span>{{ $t("aboutUs.visionsTitle") }}</span>
                </template>
                <template v-else>
                    {{ $t("aboutUs.visionsTitle") }}
                </template>
            </h2>
            <div class='vision'>
                <p>{{ $t("aboutUs.visionsTextCell1") }}</p>
                <p>{{ $t("aboutUs.visionsTextCell2") }}</p>
                <p>{{ $t("aboutUs.visionsTextCell3") }}</p>
                <p>{{ $t("aboutUs.visionsTextCell4") }}</p>
            </div>
        </div>
        <NewFooter />
        <div v-if='isShowImg' class='view-img' @click='isShowImg = !isShowImg'>
            <img class='big-photo' src='../../../images/aboutus/photo.png' @click.stop='isShowImg = true' />
        </div>
    </div>
</template>

<script>
import { getCookie } from '@/utils/util.js'
import { computed, ref, onMounted } from 'vue'
import NewFooter from '../components/Footer/index.vue'
export default {
    components: {
        NewFooter
    },
    setup () {
        onMounted(() => {
            window.scrollTo(0, 0)
        })
        const lang = getCookie('lang') || 'zh-CN'
        const isShowImg = ref(false)
        const serviceImg = computed(() => {
            if (lang === 'zh-CN') return require('../../../images/aboutus/services_zh.png')
            else return require('../../../images/aboutus/services_en.png')
        })
        return {
            lang,
            serviceImg,
            isShowImg
        }
    }
}
</script>

<style lang="scss" scoped>
.about-us {
    width: 100%;
    text-align: left;
    color:#333;
    background: #fff;
    .content {
        padding: rem(78px) rem(30px) 0;
        // width: 100vw;
        font-size: rem(28px);
        font-weight: 400;
    }
    .title {
        font-size: rem(40px);
        font-weight: 500;
        margin-bottom: rem(54px);
        span {
            color:#ebb650;
        }
    }
    .video {
        width: 100%;
        height: rem(328px);
        margin: 0 auto;
        background: #000;
        video {
            width: 100%;
            height: rem(328px);
        }
    }
    .introduce {
        .img {
            display: block;
            width: rem(270px);
            height: auto;
            margin:rem(70px) auto rem(58px);
        }
        .text {
            text-align: left;
            line-height: rem(40px);
        }
    }
    .services {
        .img {
            display: block;
            width: rem(592px);
            margin: 0 auto;
        }
    }
    .vision {
        line-height: rem(40px);
    }
    .view-img {
        position: fixed;
        top:0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 3;
        background: rgba(0, 0 , 0, .5);
        .big-photo {
            display: block;
            width: rem(560px);
            margin: 20vh auto 0;
        }
    }
}
</style>
