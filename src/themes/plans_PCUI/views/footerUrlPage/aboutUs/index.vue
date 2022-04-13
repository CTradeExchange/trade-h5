<<<<<<< HEAD
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
                <video controls height='560' poster='../../../images/aboutus/video_index.png' preload width='1200'>
                    <source src='https://www.vitatoken.io/site/about-us.mp4' type='video/mp4' />
                </video>
            </div>
            <div class='introduce'>
                <img class='left-img' src='../../../images/aboutus/photo.png' />
                <div class='right-text'>
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
                <p class='text text1'>
                    {{ $t("aboutUs.guide") }}
                </p>
                <p class='text text2'>
                    {{ $t("aboutUs.trading") }}
                </p>
                <p class='text text3'>
                    {{ $t("aboutUs.issuance") }}
                </p>
                <p class='text text4'>
                    {{ $t("aboutUs.ETFTrade") }}
                </p>
                <p class='text text5'>
                    {{ $t("aboutUs.indexFund") }}
                </p>
                <p class='text text6'>
                    {{ $t("aboutUs.assistingTools") }}
                </p>
                <p class='text text7'>
                    {{ $t("aboutUs.newsUpdates") }}
                </p>
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
=======

<template>
    <div class='about'>
        <h1 class='title'>
            {{ $t('aboutUs.title') }}
        </h1>
        <div class='introduce'>
            <img class='left_img' src='../../../images/aboutus/photo.png' />
            <div class='right'>
                <h3 class='text'>
                    {{ $t('aboutUs.introduce') }}
                </h3>
                <div class='video'>
                    <video controls :height='videoHeight' poster='../../../images/aboutus/video_index.png' preload width='755'>
                        <source src='https://www.vitatoken.io/site/V10.mp4' type='video/mp4' />
                    </video>
                    <!-- <iframe
                        allowfullscreen='true'
                        border='0'
                        frameborder='no'
                        framespacing='0'
                        height='390'
                        scrolling='no'
                        src='https://www.vitatoken.io/site/V10.mp4'
                        width='754'
                    >
                    </iframe> -->
                </div>
            </div>
        </div>
        <h3 class='title'>
            {{ $t('aboutUs.servicesTitle') }}
        </h3>
        <div class='service'>
            <img class='left_img' :src='serviceImg' />
        </div>
        <h1 class='title'>
            {{ $t('aboutUs.visionsTitle') }}
        </h1>
        <div class='future'>
            <span class='text'>
                {{ $t('aboutUs.visionsTextCell1') }}
            </span>
            <span class='text'>
                {{ $t('aboutUs.visionsTextCell2') }}
            </span>
            <span class='text'>
                {{ $t('aboutUs.visionsTextCell3') }}
            </span>
            <span class='text'>
                {{ $t('aboutUs.visionsTextCell4') }}
            </span>
            <span class='text'>
                {{ $t('aboutUs.visionsTextCell5') }}
            </span>
            <span class='text'>
                {{ $t('aboutUs.visionsTextCell6') }}
            </span>
            <span class='text'>
                {{ $t('aboutUs.visionsTextCell7') }}
            </span>
>>>>>>> dev_home_vitatoken
        </div>
    </div>
</template>

<script>
import { getCookie } from '@/utils/util.js'
<<<<<<< HEAD
export default {
    setup () {
        const lang = getCookie('lang') || 'zh-CN'
        return {
            lang
=======
import { computed } from 'vue'
export default {
    setup () {
        const lang = getCookie('lang') || 'zh-CN'

        const serviceImg = computed(() => {
            if (lang === 'zh-CN') return require('../../../images/aboutus/services_zh.png')
            else return require('../../../images/aboutus/services_en.png')
        })

        const videoHeight = computed(() => {
            if (lang === 'zh-CN') return 360
            else return 350
        })

        return {
            videoHeight,
            serviceImg
>>>>>>> dev_home_vitatoken
        }
    }
}
</script>

<style lang="scss" scoped>
<<<<<<< HEAD
.about-us {
    width: 100%;
    text-align: center;
    color:#333;
    background: #fff;
    .content {
        font-size: 14px;
        padding-top: 60px;
        width: 1200px;
        margin: 0 auto;
    }
    .title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 28px;
        line-height: 28px;
        span {
            color:#ebb650;
        }
    }
    .video {
        width: 1200px;
        margin: 0 auto 20px;
        background: #000;
        video {
            margin: 10px auto
        }
    }
    .introduce {
        display: flex;
        display: -webkit-flex;
        align-items: center;
        .left-img {
            display: block;
            width: 280px;
            height: 385px;
            margin-right:20px;
        }
        .right-text {
            text-align: left;
            line-height: 20px;
            p {
                margin-bottom: 20px;
            }
        }
    }
    .services {
        width: 520px;
        height: 515px;
        background: url('../../../images/aboutus/services_new.png') center no-repeat;
        margin: 0 auto;
        position: relative;
        .text {
            position: absolute;
            width: 150px;
            height: 150px;
            font-weight: 600;
            word-wrap:break-word;
            line-height: 20px;
            display: flex;
            display: -webkit-flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;

        }
        .text1 {
            top: 5px;
            left: 187px;
        }
        .text2 {
            top: 78px;
            left: 333px;
        }
        .text3 {
            top: 235px;
            left: 368px;
        }
        .text4 {
            top: 365px;
            left: 267px;
        }
        .text5 {
            top: 365px;
            left: 105px;
        }
        .text6 {
            top: 235px;
            left: 4px;
        }
        .text7 {
            top: 78px;
            left: 38px;
        }
    }
    .vision {
        line-height: 20px;
        padding-bottom: 60px;
=======
.about{
    color: rgba(51,51,51,0.85);
    background: #FFFFFF;
    .title{
        font-size: 32px;
        text-align: center;
        font-weight: 500;
        padding-top: 60px;
    }
    .introduce{
        width: 1200px;
        display: flex;
        display: -webkit-flex;
        box-shadow: 0px 2px 15px 0px rgba(1,26,108,0.08);
        margin: 24px auto 0px auto;
        padding: 24px;
        border-radius: 8px;
        .left_img{
            width: 374px;
            height: 538px;
        }
        .right{
            margin-left: 24px;
            display:flex;
            display: -webkit-flex;
            flex-wrap: wrap;
        .text{
            font-size: 14px;
            letter-spacing: 0;
            line-height: 28px;
            font-weight: 400;
        }
        .video {
            width: 755px;
            padding-top: 5px;
            border-radius: 8px;
            background: #000;
            video {
                margin: 5px auto 0;
            }
        }
        }
    }
    .service{
        width: 546px;
        margin: 20px auto 0;
        .left_img {
            display: block;
            width: 546px;
            height: auto;
        }
        .shape{
            width: 151.4px;
            height: 174.39px;
            background: #FFFFFF;
            border: 4px solid rgba(255,255,255,1);border: 2px solid rgba(1,26,108,1);
            border: 4px solid rgba(255,255,255,1);border: 2px solid rgba(1,26,108,1);
            &1{
                transform: rotate(133deg);
            }
        }
    }
    .future{
        margin-top: 24px;
        padding-bottom: 50px;
        .text{
            display:block;
            text-align: center;
            font-size: 14px;
            letter-spacing: 0;
            line-height: 40px;
            font-weight: 400;
        }
>>>>>>> dev_home_vitatoken
    }
}
</style>
