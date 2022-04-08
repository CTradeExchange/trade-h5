
<template>
    <div class='new-footer'>
        <!-- 页脚 -->
        <div class='footer-wrap'>
            <div class='menu'>
                <div class='main' @click="expand('about')">
                    <span>{{ $t('newHomeFooter.aboutus') }}</span>
                    <van-icon :name='aboutVis ? "minus" : "plus"' />
                </div>
                <div v-show='aboutVis' class='sub'>
                    <p class='link' @click='jumpUrl("about")'>
                        {{ $t('newHomeFooter.aboutus') }}
                    </p>
                    <p class='link' @click='jumpUrl("fees")'>
                        {{ $t('newHomeFooter.fees') }}
                    </p>
                </div>
            </div>
            <div class='menu'>
                <div class='main' @click="expand('product')">
                    <span>{{ $t('newHomeFooter.product') }}</span>
                    <van-icon :name='productVis ? "minus" : "plus"' />
                </div>
                <div v-show='productVis' class='sub'>
                    <p class='link' @click='jumpUrl("trading")'>
                        {{ $t('newHomeFooter.trading') }}
                    </p>
                    <p class='link' @click='jumpUrl("fund")'>
                        {{ $t('newHomeFooter.fund') }}
                    </p>
                </div>
            </div>
            <div class='menu'>
                <div class='main' @click="expand('service')">
                    <span>{{ $t('newHomeFooter.service') }}</span>
                    <van-icon :name='serviceVis ? "minus" : "plus"' />
                </div>
                <div v-show='serviceVis' class='sub'>
                    <!-- <p class='link' @click='jumpUrl("program")'>
                        {{ $t('newHomeFooter.program') }}
                    </p> -->
                    <p class='link' @click='jumpUrl("vip")'>
                        {{ $t('newHomeFooter.vip') }}
                    </p>
                    <p class='link' @click='jumpUrl("customer")'>
                        {{ $t('newHomeFooter.customer') }}
                    </p>
                </div>
            </div>
            <div class='menu'>
                <div class='main' @click="expand('help')">
                    <span>{{ $t('newHomeFooter.help') }}</span>
                    <van-icon :name='helpVis ? "minus" : "plus"' />
                </div>
                <div v-show='helpVis' class='sub'>
                    <p class='link' @click='jumpUrl("faqs")'>
                        {{ $t('newHomeFooter.faqs') }}
                    </p>
                    <p class='link' @click='jumpUrl("terms")'>
                        {{ $t('newHomeFooter.terms') }}
                    </p>
                    <p class='link' @click='jumpUrl("policy")'>
                        {{ $t('newHomeFooter.policy') }}
                    </p>
                </div>
            </div>
        </div>

        <div class='social'>
            <p class='nav-dt'>
                {{ $t('newHomeFooter.followus') }}
            </p>
            <ul class='community-box f-b-t'>
                <li class='box-item' @click='jumpUrl("fb")'>
                    <img alt='facebook' class='item-icon' src='../../../../images/home/facebook.png' />
                </li>
                <li class='box-item' @click='jumpUrl("ig")'>
                    <img alt='instagram' class='item-icon' src='../../../../images/home/instagram.png' />
                </li>
                <li class='box-item' @click='jumpUrl("twitter")'>
                    <img alt='twitter' class='item-icon' src='../../../../images/home/twitter.png' />
                </li>
                <li class='box-item' @click='jumpUrl("telegram")'>
                    <img alt='telegram' class='item-icon' src='../../../../images/home/telegram.png' />
                </li>
                <li class='box-item' @click='jumpUrl("yt")'>
                    <img alt='youtube' class='item-icon' src='../../../../images/home/youtube.png' />
                </li>
            </ul>

            <div class='langWrap'>
                <van-button block class='langBtn' plain type='primary' @click='langShow=true'>
                    <span>{{ langObj[lang] }}</span>
                    <span class='arrow icon_icon_arrow'></span>
                </van-button>
            </div>

            <div class='copyright'>
                Vitatoken © 2022
            </div>
        </div>
        <div class='serviceIcon' @click='toService'>
            <!-- <img alt='' src='/images/serviceIcon.png' /> -->
            <i class='icon icon_xiaoxizhongxin'></i>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCookie } from '@/utils/util'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const store = useStore()
const { t } = useI18n({ useScope: 'global' })
const customerInfo = computed(() => store.state._user.customerInfo)

const langShow = ref(false)
const langObj = ref({
    'zh-CN': '简体中文',
    'en-US': 'English',
})

const lang = ref(getCookie('lang') || 'zh-CN')
const aboutVis = ref(false)
const serviceVis = ref(false)
const productVis = ref(false)
const helpVis = ref(false)

const expand = module => {
    if (module === 'product') {
        productVis.value = !productVis.value
    } else if (module === 'service') {
        serviceVis.value = !serviceVis.value
    } else if (module === 'help') {
        helpVis.value = !helpVis.value
    } else if (module === 'about') {
        aboutVis.value = !aboutVis.value
    }
}

// 底部nav跳转
const jumpUrl = (index) => {
    const lang = getCookie('lang') || 'zh-CN'
    let linkList = {}
    if (lang === 'zh-CN') {
        linkList = {
            trading: 'https://www.vitatoken.io/zh-CN/order?symbolId=364&tradeType=5',
            fund: 'https://www.vitatoken.io/zh-CN/fund',
            program: 'https://www.vitatoken.io/zh-CN/new1',
            vip: 'https://www.vitatoken.io/zh-CN/vip',
            customer: 'https://cs.vitatoken.io:443/im/text/1cayxu.html?lang=en',
            // faqs: 'https://www.vitatoken.io/site/faqs',
            terms: 'https://www.vitatoken.io/site/terms-conditions',
            // policy: 'https://www.vitatoken.io/site/privacy-policy',
            // abount: 'https://www.vitatoken.io/site/about-us'
        }
    } else {
        linkList = {
            trading: 'https://www.vitatoken.io/en-US/order?symbolId=364&tradeType=5',
            fund: 'https://www.vitatoken.io/en-US/fund',
            program: 'https://www.vitatoken.io/en-US/new1',
            vip: 'https://www.vitatoken.io/en-US/vip',
            customer: 'https://cs.vitatoken.io:443/im/text/1cayxu.html?lang=en',
            // faqs: 'https://www.vitatoken.io/site/faqs',
            terms: 'https://www.vitatoken.io/site/terms-conditions',
            // policy: 'https://www.vitatoken.io/site/privacy-policy',
            // abount: 'https://www.vitatoken.io/site/about-us'
        }
    }
    const community = {
        fb: 'https://www.facebook.com/Vitatoken-100578379186941',
        ig: 'https://www.instagram.com/vitatoken_official/',
        twitter: 'https://twitter.com/Vitatoken_',
        telegram: 'https://t.me/VitatokenEnglish',
        yt: 'https://www.youtube.com/channel/UCWrIoUETskxOU9zIVpba6Hg'
    }
    const symbolId = store.state._quote.productList.find(el => Number(el.tradeType) === 5 && el.symbolName)?.symbolId
    switch (index) {
        case 'fees':
            router.push({ path: 'fees' })
            break
        case 'trading':
            router.push({
                path: '/order',
                query: {
                    symbolId,
                    tradeType: 5
                }
            })
            break
        case 'fund':
            router.push({ path: '/fundProductList' })
            break
        case 'vip':
            if (customerInfo.value) {
                router.push({ path: '/assets' })
            } else {
                router.push({
                    path: '/register',
                    query: {
                        openAccountType: 1
                    }
                })
            }
            break
        case 'about':
            router.push({ path: 'about' })
            break
        case 'faqs':
            router.push({ path: 'faqs' })
            break
        case 'policy':
            router.push({ path: 'privacy-policy' })
            break
        case 'terms':
            router.push({ path: 'terms-conditions' })
            break
        default:
            const newLinkList = { ...linkList, ...community }
            if (newLinkList[index]) {
                window.open(newLinkList[index])
            }
    }
}

const toService = () => {
    const onlineService = store.state._base.wpCompanyInfo?.onlineService
    if (onlineService) {
        router.push({
            name: 'Otherpage',
            params: { type: 'page' },
            query: { title: t('route.onlineService'), url: onlineService }
        })
    }
}

</script>

<style lang="scss">
    .new-footer{
        .footer-wrap {
            margin-top: rem(50px);
            padding: rem(30px);
            color: #FFF;
            font-size: rem(28px);
            background: #12161C;
            .menu {
                .main {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: rem(84px);
                    font-weight: bold;
                    font-size: rem(30px);
                    line-height: rem(84px);
                    .van-icon {
                        font-weight: bold;
                    }
                }
                .sub {
                    padding-bottom: 20px;
                    .link {
                        position: relative;
                        padding: rem(15px) 0 rem(15px) 28px;
                        color: var(--normalColor);
                        &::before {
                            position: absolute;
                            top: 2px;
                            display: inline-block;
                            margin-left: -20px;
                            color: #959595;
                            font-size: 24px;
                            font-family: Arial, sans-serif;
                            content: '\2022';
                        }
                    }
                }
            }
        }
        .social {
            position: relative;
            padding: 0 rem(30px) rem(30px) rem(30px);
            color: rgb(234, 236, 239);
            background: rgb(18, 22, 28);
            .nav-dt {
                padding: rem(40px) 0;
                font-size: 16px;
                text-align: center;
            }
            .community-box {
                display: flex;
                justify-content: center;
                .box-item {
                    display: inline-block;
                    flex: 1;
                    text-align: center;
                    .icon-label {
                        font-size: rem(20px);
                    }
                    .item-icon {
                        margin-bottom: rem(10px);
                    }
                }
            }
            .langWrap {
                margin: 10px 20%;
                .langBtn {
                    height: 40px;
                    color: #333;
                    background: #999;
                    border-color: #999;
                }
                .van-button__text {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                }
            }
            .copyright {
                margin-top: rem(30px);
                padding-top: rem(30px);
                color: rgb(234, 236, 239);
                font-size: 14px;
                text-align: center;
                border-top: 1px solid #555;
            }
        }
        .serviceIcon {
            position: fixed;
            right: 24px;
            bottom: 16px;
            z-index: 109;
            display: flex;
            align-items: center;
            justify-content: center;
            width: rem(80px);
            height: rem(80px);
            background: #0062FF;
            border-radius: 50%;
            .icon {
                color: #FFF;
                font-size: rem(40px);
            }
        }
    }
</style>
