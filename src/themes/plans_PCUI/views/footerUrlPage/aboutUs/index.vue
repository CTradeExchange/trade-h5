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
        </div>
    </div>
</template>

<script>
import { getCookie } from '@/utils/util.js'
export default {
    setup () {
        const lang = getCookie('lang') || 'zh-CN'
        return {
            lang
        }
    }
}
</script>

<style lang="scss" scoped>
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
    }
}
</style>
