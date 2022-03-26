<!--
 ** Author : WangLimei
 ** Time   : 2022/03/26 14:55:26
-->
<template>
    <div class='about'>
        <div class='head'>
            <div class='head_logo' @click="$router.push('/')">
                <img class='img' src='/images/logo_top.png' />
            </div>
        </div>
        <h1 class='title'>
            {{ $t('about.aboutUs') }}
        </h1>
        <div class='introduce'>
            <img class='left_img' src='/images/about/photo.png' />
            <div class='right'>
                <span class='text'>
                    Vitatoken {{ $t('about.desc') }}
                </span>
                <div class='video'>
                    <iframe
                        allowfullscreen='true'
                        border='0'
                        frameborder='no'
                        framespacing='0'
                        height='390'
                        scrolling='no'
                        src='https://www.vitatoken.io/site/V10.mp4'
                        width='754'
                    >
                    </iframe>
                </div>
            </div>
        </div>
        <h1 class='title'>
            {{ $t('about.base') }}
        </h1>
        <div class='service'>
            <img class='left_img' :src='"/images/about/services-"+ lang +".png"' />
        </div>
        <h1 class='title'>
            {{ $t('about.hope') }}
        </h1>
        <div class='future'>
            <span class='text'>
                {{ $t('about.hopeT1') }}
            </span>
            <span class='text'>
                {{ $t('about.hopeT2') }}
            </span>
            <span class='text'>
                {{ $t('about.hopeT3') }}
            </span>
            <span class='text'>
                {{ $t('about.hopeT4') }}
            </span>
            <span class='text'>
                {{ $t('about.hopeT5') }}
            </span>
            <span class='text'>
                {{ $t('about.hopeT6') }}
            </span>
            <span class='text'>
                {{ $t('about.hopeT7') }}
            </span>
        </div>
        <div class='footer'>
            Vitatoken @ 2022
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { setCookie, getCookie, isEmpty, localGet, localSet } from '@/utils/util'
const lang = ref(getCookie('lang') || 'zh-CN')
</script>

<style lang="scss" scoped>
.about {
    color: rgba(51, 51, 51, 0.85);
    font-family: PingFang SC;
    .head {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 50px;
        background-color: #000;
        &_logo {
            width: 1200px;
            text-align: initial;
            cursor: pointer;
            .img {
                width: 100px;
                height: 20px;
                margin-top: 15px;
            }
        }
    }
    .title {
        margin-top: 60px;
        font-weight: 500;
        font-size: 32px;
        text-align: center;
    }
    .introduce {
        display: flex;
        width: 1152px;
        margin: 24px auto 0;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 2px 15px 0 rgba(1, 26, 108, 0.08);
        .left_img {
            width: 374px;
            height: 538px;
        }
        .right {
            margin-left: 24px;
            .text {
                font-weight: 400;
                font-size: 14px;
                line-height: 31px;
                letter-spacing: 0;
            }
            .video {
                width: 754px;
                height: 390px;
                margin-top: 24px;
                background: rgba(1, 26, 108, 0.6);
                border-radius: 8px;
            }
        }
    }
    .service {
        width: 600px;
        margin: 60px auto;
        .shape {
            width: 151.4px;
            height: 174.39px;
            background: #FFF;
            border: 4px solid rgba(255, 255, 255, 1);
            border: 2px solid rgba(1, 26, 108, 1);
            border: 4px solid rgba(255, 255, 255, 1);
            border: 2px solid rgba(1, 26, 108, 1);
            &1 {
                transform: rotate(133deg);
            }
        }
    }
    .future {
        margin-top: 24px;
        .text {
            display: block;
            font-weight: 400;
            font-size: 14px;
            line-height: 40px;
            letter-spacing: 0;
            text-align: center;
        }
    }
    .footer {
        width: 100%;
        height: 60px;
        margin-top: 60px;
        font-weight: 400;
        font-size: 14px;
        line-height: 60px;
        letter-spacing: 0;
        text-align: center;
        background: #F8F8F8;
    }
}
</style>
