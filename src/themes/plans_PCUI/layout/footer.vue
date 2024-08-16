<template>
    <div class='footer-nav'>
        <div class='footer-safe-box'>
            <div class='footer-action'>
                <div class='connect'>
                    <div class='headline-logo'>
                        <img alt='' src='../images/Headline.net.png' />
                    </div>
                    <div class='headline-email'>
                        <span class='email-title'>
                            {{ $t('newHomeFooter.contactUs') + ':' }}
                        </span>
                        <span class='email-val'>
                            {{ 'support@headline.net' }}
                        </span>
                    </div>

                    <div class='followus'>
                        {{ $t('newHomeFooter.followus') }}
                    </div>
                    <ul class='connect-list'>
                        <li
                            v-for='(item, index) in connectArr'
                            :key='item'
                            :class='[`off-0${index + 1}`]'
                            @click='jumpConnectlink(item)'
                        ></li>
                    </ul>

                    <div class='telegram'>
                        <h5>{{ $t('newHomeFooter.contactUs') }}</h5>
                        <div class='telegram-box' @touchstart='handleSkip'>
                            <img src='../images/telegramIcon.jpg' />
                            <span>{{ 'Telegram' }}</span>
                        </div>
                    </div>
                </div>
                <div class='about'>
                    <h5>{{ $t('newHomeFooter.aboutus') }}</h5>
                    <ul class='about-list'>
                        <li @click="jumpTypeLink('aboutus')">
                            {{ $t('footerInfo.AboutHeadline') }}
                        </li>
                    </ul>
                </div>

                <div class='about'>
                    <h5>{{ $t('footerInfo.Legal') }}</h5>
                    <ul class='about-list'>
                        <li @click='jump(8)'>
                            {{ $t('footerInfo.PrivacyPolicy') }}
                        </li>
                        <li @click='jump(9)'>
                            {{ $t('footerInfo.RiskDisclosure') }}
                        </li>
                        <li @click='jump(7)'>
                            {{ $t('footerInfo.TermsAndConditions') }}
                        </li>
                    </ul>
                </div>

                <div class='about'>
                    <h5>{{ $t('footerInfo.Platforms') }}</h5>
                    <ul class='about-list'>
                        <li @click='jumpdownload(9)'>
                            {{ $t('footerInfo.HeadlineWebApp') }}
                        </li>
                        <li @click="jumpTypeLink('download')">
                            {{ $t('footerInfo.HeadlineMobileApp') }}
                        </li>
                        <li @click='jump(2)'>
                            {{ $t('footerInfo.TelegramTradingPlatform') }}
                        </li>
                    </ul>
                </div>
            </div>
            <div class='footer-text'>
                <p>{{ $t('footerInfo.RiskWarning') }}</p>
                <p>
                    {{ $t('footerInfo.RiskWarningContent') }}
                </p>
                <p>Copyright © 2016-{{ currYear }} Headline.net. All rights reserved</p>
            </div>
        </div>
    </div>
    <!-- 语言弹窗 -->
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import useMethods from '@planspc/hooks/useMethods'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { parseJSON } from '@/utils/util'

export default {
    components: {},
    props: {
        data: {
            type: Object,
            default: function () {
                return {
                    href: '',
                    src: '',
                    target: '',
                }
            },
        },
        moduleId: {
            type: String,
            default: '',
        },
    },
    setup () {
        const route = useRoute()
        const router = useRouter()
        const state = reactive({
            // 控制聊天框显示和隐藏
            controlLive: true,
            iconIndex: null,
            connectArr: ['facebook', 'twitter', 'youtube', 'instagram', 'linkedin'],
        })

        const hoverIconHandle = (e) => {
            state.iconIndex = e
        }
        const leaveIconHandle = (e) => {
            state.iconIndex = null
        }
        const store = useStore()
        const { toOrderPriority } = useMethods()
        const { t } = useI18n({ useScope: 'global' })
        const changePlans = (item) => {
            // 跳转到下单页面并优先显示指定产品
            toOrderPriority(item.tradeType)
        }

        const buoyTG = computed(() => {
            const arr = store.state._base.newsSysConfig
            const obj = arr.find(i => i.Key === 'buoyTG') || {}
            return parseJSON(obj.Value) || {}
        })

        const handleSkip = () => {
            // console.log('点击了？', buoyTG.value?.link)
            window.open(buoyTG.value?.link)
        }

        const plansList = computed(() => {
            const userProductCategory = store.getters.userProductCategory
            const resultPlans = store.state._base.plans
                .filter((e) => {
                    return userProductCategory[e.tradeType]?.find((o) => o.listByUser?.length)
                })
                .map((el) => {
                    el.name = t('tradeType.' + el.tradeType)
                    return el
                })
            return resultPlans
        })

        const plansName = computed(() => {
            if (route.query.tradeType) {
                const tradeType = route.query.tradeType
                return t('tradeType[' + tradeType + ']')
            } else {
                return t('header.trade')
            }
        })

        // 链接跳转
        const jump = (attr) => {
            switch (attr) {
                case 1:
                    window.open('https://www.facebook.com/HeadlineTrade')
                    break
                case 2:
                    // window.open('https://t.me/headline_official')
                    // window.open('https://t.me/Headline_OfficialBot')
                    window.open('https://t.me/Headline_Group')
                    break
                case 3:
                    window.open('https://www.youtube.com/channel/UCRuLhEVnVK_NUIIGWBHUHRA')
                    break
                case 4:
                    window.open('https://twitter.com/mc900_global')
                    break
                case 5:
                    window.open('https://page.line.me/?accountId=152iogjg')
                    break
                case 6:
                    window.open('https://www.instagram.com/mc900_global/')
                    break
                case 7:
                    window.open('https://www.headline.net/html/headline_agreement.html?v=1')
                    break
                case 8:
                    window.open('https://www.headline.net/html/headline_privacy.html?v=1')
                    break
                case 9:
                    window.open('https://www.headline.net/legal/RISK_DISCLOSURE.pdf')
                    break
            }
        }
        // 点击回到顶部和跳转客服链接
        const goTop = (num) => {
            if (num == 0) {
                document.documentElement.scrollTop = 0
            } else {
                window.open('https://im.mc900.com/im/text/0mdeth.html?_tt=1&lang=en')
            }
        }

        const symbolKey = computed(() => store.state._quote.productActivedID)

        const jumpdownload = (attr) => {
            const [symbolId, tradeType] = symbolKey.value?.split('_') || []

            switch (attr) {
                case 9:
                    router.push(`/order?symbolId=${symbolId || ''}&tradeType=${tradeType || ''}`)
                    // window.open('https://t.me/MC900bot')
                    break
                case 10:
                    // window.open('https://apps.apple.com/us/app/mc900-trade-btc-100-forex-gold/id1639509598')
                    window.open('https://apps.apple.com/app/headline-net/id1639509598')
                    break
                case 11:
                    window.open('https://play.google.com/store/apps/details?id=com.mc900.mc900&pli=1')
                    break
                case 12:
                    // window.open('https://apps.apple.com/us/app/headline-net/id1639509598')
                    window.open('https://t.me/Headline_OfficialBot')
                    break
            }
        }

        // 锚点链接第三方登录
        const linkThirdPartyLogin = () => {
            const dom = document.querySelector('#craigPart-2')
            const currentPath = router.currentRoute.value.path.toLocaleLowerCase()
            if (currentPath !== '/home') {
                window['wp_homeLinkFn'] = linkThirdPartyLogin
                router.push({ path: '/home' })
            } else if (dom && dom.scrollIntoView) {
                dom.scrollIntoView()
            }
        }
        // 跳转社交媒体
        const jumpConnectlink = (name) => {
            switch (name) {
                case 'facebook':
                    window.open('https://www.facebook.com/HeadlineTrade')
                    break
                case 'instagram':
                    window.open('https://www.instagram.com/headlinenet/')
                    break
                case 'youtube':
                    window.open('https://www.youtube.com/@Headline.net_offical')
                    break
                case 'twitter':
                    window.open('https://twitter.com/headline_trade')
                    break
                case 'linkedin':
                    window.open('https://www.linkedin.com/company/headline-net')
                    break
            }
        }

        const jumpTypeLink = (key) => {
            switch (key) {
                case 'aboutus':
                    router.push({ path: '/aboutus' })
                    break
                case 'download':
                    router.push({ path: '/download' })
                    break
            }
        }

        const currYear = new Date().getFullYear()
        return {
            ...toRefs(state),
            changePlans,
            plansList,
            plansName,
            jump,
            goTop,
            jumpdownload,
            linkThirdPartyLogin,
            currYear,
            hoverIconHandle,
            leaveIconHandle,
            jumpConnectlink,
            jumpTypeLink,
            handleSkip,
        }
    },
}
</script>

<style lang="scss" scoped>
.footer-nav {
    width: 100%;
    min-height: 438px;
    flex-shrink: 0;
    background: #2a2e3f;
    .footer-safe-box {
        max-width: 1200px;
        padding-top: 62px;
        padding-bottom: 62px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        .footer-action {
            width: 100%;
            display: flex;
            color: #fff;
            justify-content: space-between;
            .connect {
                width: 25%;
                display: flex;
                flex-direction: column;
                .headline-logo {
                    margin-bottom: 24px;
                }
                .headline-email {
                    margin-bottom: 34px;
                    font-size: 14px;
                    .email-title {
                        color: #6f7489;
                        font-weight: 700;
                        margin-right: 4px;
                    }
                    .email-val {
                        color: #fff;
                        font-weight: 600;
                    }
                }
                .followus {
                    display: none;
                }

                .connect-list {
                    display: flex;
                    & > li {
                        margin-right: 24px;
                        width: 32px;
                        height: 32px;
                        background-size: cover;
                        background-position: center;
                    }
                    .off-01 {
                        background-image: url('../images/off-01.png');
                        &:hover {
                            background-image: url('../images/on-01.png');
                        }
                    }
                    .off-02 {
                        background-image: url('../images/off-02.png');
                        &:hover {
                            background-image: url('../images/on-02.png');
                        }
                    }
                    .off-03 {
                        background-image: url('../images/off-03.png');
                        &:hover {
                            background-image: url('../images/on-03.png');
                        }
                    }
                    .off-04 {
                        background-image: url('../images/off-04.png');
                        &:hover {
                            background-image: url('../images/on-04.png');
                        }
                    }
                    .off-05 {
                        background-image: url('../images/off-05.png');
                        &:hover {
                            background-image: url('../images/on-05.png');
                        }
                    }
                }

                .telegram {
                    display: none;
                }
            }
            .about {
                & > h5 {
                    color: #fff;
                    font-size: 14px;
                    font-weight: 700;
                    margin-bottom: 26px;
                }
                .about-list {
                    & > li {
                        margin-bottom: 26px;
                        color: #6f7489;
                        font-size: 14px;
                        font-weight: 400;
                        cursor: pointer;
                    }
                }
            }
        }
        .footer-text {
            margin-top: 50px;
            & > p {
                color: #6f7489;
                font-size: 14px;
                font-weight: 400;
                line-height: 20px;
                margin-bottom: 16px;
            }
        }
    }
}

@media screen and (max-width: 767px) {
    .footer-nav {
        width: 100vw;
        min-height: auto;

        .footer-safe-box {
            max-width: 100vw;
            padding-top: 40px;
            .footer-action {
                width: 100%;
                display: flex;
                flex-direction: column;
                color: #fff;
                justify-content: space-between;
                align-items: center;

                .connect {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    padding: 0 40px;

                    .headline-logo {
                        margin-bottom: 4px;
                    }
                    .headline-email {
                        margin-bottom: 26px;
                        font-size: 14px;
                        .email-title {
                            color: #6f7489;
                            font-weight: 700;
                            margin-right: 4px;
                        }
                        .email-val {
                            color: #fff;
                            font-weight: 600;
                        }
                    }
                    .followus {
                        display: inline-block;
                        margin: 16px 0;
                        color: #fff;
                        font-family: 'Inter';
                        font-size: 14px;
                        font-weight: 700;
                    }
                    .connect-list {
                        display: flex;
                        & > li {
                            margin: 0;
                            margin-right: 15px;
                            width: 32px;
                            height: 32px;
                            background-size: cover;
                            background-position: center;
                        }
                        .off-01 {
                            background-image: url('../images/off-01.png');
                            &:hover {
                                background-image: url('../images/on-01.png');
                            }
                        }
                        .off-02 {
                            background-image: url('../images/off-02.png');
                            &:hover {
                                background-image: url('../images/on-02.png');
                            }
                        }
                        .off-03 {
                            background-image: url('../images/off-03.png');
                            &:hover {
                                background-image: url('../images/on-03.png');
                            }
                        }
                        .off-04 {
                            background-image: url('../images/off-04.png');
                            &:hover {
                                background-image: url('../images/on-04.png');
                            }
                        }
                        .off-05 {
                            background-image: url('../images/off-05.png');
                            &:hover {
                                background-image: url('../images/on-05.png');
                            }
                        }
                    }
                    .telegram {
                        display: inline-block;
                        margin-top: 24px;
                        color: #fff;
                        font-family: 'Inter';
                        font-size: 14px;
                        font-weight: 700;

                        .telegram-box {
                            margin-top: 10px;
                            width: 136px;
                            height: 36px;
                            border-radius: 4px;
                            background: #4b516c;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            &>img{
                              width:32px;
                              height:32px;
                              margin-right:4px;
                            }
                            &>span{
                              color: #FFF;
                          font-family: "Inter";
                          font-size: 12px;
                          font-style: normal;
                          font-weight: 500;
                          line-height: normal;
                            }
                        }
                    }
                }
                .about {
                    width: 100vw;
                    margin-top: 40px;
                    display: none;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;

                    & > h5 {
                        color: #fff;
                        font-size: 16px;
                        font-weight: 700;
                        margin-bottom: 14px;
                        text-align: center;
                    }
                    .about-list {
                        & > li {
                            margin-bottom: 10px;
                            color: #6f7489;
                            font-size: 14px;
                            font-weight: 400;
                            cursor: pointer;
                            text-align: center;
                        }
                    }
                }
            }
            .footer-text {
                display: none;
                margin-top: 50px;
                max-width: 100vw;
                padding: 0 30px;
                & > p {
                    color: #6f7489;
                    font-size: 14px;
                    font-weight: 400;
                    line-height: 20px;
                    margin-bottom: 16px;
                    text-align: center;
                }
            }
        }
    }
}
</style>
