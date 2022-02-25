<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' />
        <div class='bigIcon'>
            <i class='icon icon_shoujixiazai'></i>
        </div>
        <dl class='stepsContent'>
            <dt>安装步骤</dt>
            <dd>
                <p>1、请下载并安装Google Authenticator，然后点击“绑定”，以绑定您的账户</p>
                <p class='alignRight'>
                    <a class='download' :href='downloadURL' target='_blank'>
                        下载Google验证器
                        <span class='icon icon_zhiding1'></span>
                    </a>
                </p>
            </dd>
            <dd>
                <p>2、安装完成后打开GoogleAuthentication，选择"手动输入密钥"，页面中填入您的账户名和密钥</p>
            </dd>
            <dd>
                <p>3、添加成功后，您将得到一个有一定时效的6位数验证码，输入到指定输入框</p>
            </dd>
        </dl>

        <div class='footerBox'>
            <van-button block class='nobd' plain type='primary' @click="$router.push({ name:'MFA_secretKey' })">
                我已下载并安装
            </van-button>
        </div>
    </div>
</template>

<script setup>
import { isIOS } from 'vant/lib/utils'

const androidUrl = 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=zh&gl=US'
const iosUrl = 'https://apps.apple.com/cn/app/google-authenticator/id388497605'
const downloadURL = isIOS() ? iosUrl : androidUrl
</script>

<style lang="scss" scoped>
.page-wrap {
    width: 100%;
    height: 100%;
    margin-top: rem(110px);
    margin-bottom: rem(110px);
    overflow: auto;
    .bigIcon{
        padding-top: rem(60px);
        text-align: center;
        font-size: rem(180px);
        color: var(--primary);
    }
    .stepsContent{
        margin: rem(50px) rem(30px) 0;
        line-height: 1.7;
        dt{
            font-size: rem(30px);
            font-weight: bold;
            padding-bottom: rem(20px);
        }
        dd{
            padding-bottom: rem(20px);
        }
        .download{
            position: relative;
            color: var(--primary);
            padding-right: rem(30px);
        }
        .icon_zhiding1{
            position: absolute;
            right: 0;
            transform: rotate(180deg);
        }
    }
    .footerBox{
        position: absolute;
        left: 0;
        bottom: rem(20px);
        width: 100%;
        .nobd{
            border: 0;
            background: none;
        }
    }
}
</style>
