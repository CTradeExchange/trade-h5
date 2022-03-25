<template>
    <div class='footer-nav'>
        <div class='auto-width'>
            <div class='footer-auto'>
                <div class='nav-left'>
                    <ul>
                        <li>
                            <h4 class='title'>
                                {{ $t('newHomeFooter.product') }}
                            </h4>
                            <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("about")'>
                                    {{ $t('newHomeFooter.aboutus') }}
                                </a>
                            </p>
                            <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("trading")'>
                                    {{ $t('newHomeFooter.trading') }}
                                </a>
                            </p>
                            <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("fund")'>
                                    {{ $t('newHomeFooter.fund') }}
                                </a>
                            </p>
                        </li>
                        <li>
                            <h4 class='title'>
                                {{ $t('newHomeFooter.service') }}
                            </h4>
                            <!-- <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("program")'>
                                    {{ $t('newHomeFooter.program') }}
                                </a>
                            </p> -->
                            <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("vip")'>
                                    {{ $t('newHomeFooter.vip') }}
                                </a>
                            </p>
                            <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("customer")'>
                                    {{ $t('newHomeFooter.customer') }}
                                </a>
                            </p>
                        </li>
                        <li>
                            <h4 class='title'>
                                {{ $t('newHomeFooter.help') }}
                            </h4>
                            <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("faqs")'>
                                    {{ $t('newHomeFooter.faqs') }}
                                </a>
                            </p>
                            <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("terms")'>
                                    {{ $t('newHomeFooter.terms') }}
                                </a>
                            </p>
                            <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("policy")'>
                                    {{ $t('newHomeFooter.policy') }}
                                </a>
                            </p>
                        </li>
                    </ul>
                </div>
                <div class='nav-right'>
                    <h4 class='title'>
                        {{ $t('newHomeFooter.followus') }}
                    </h4>
                    <ul>
                        <li @click='jumpUrl("fb")'>
                            <img class='icon' src='../images/home/facebook.png' />
                            <p class='name'>
                                Facebook
                            </p>
                        </li>
                        <li @click='jumpUrl("ig")'>
                            <img class='icon' src='../images/home/instagram.png' />
                            <p class='name'>
                                Instagram
                            </p>
                        </li>
                        <li @click='jumpUrl("twitter")'>
                            <img class='icon' src='../images/home/twitter.png' />
                            <p class='name'>
                                Twitter
                            </p>
                        </li>
                        <li @click='jumpUrl("telegram")'>
                            <img class='icon' src='../images/home/telegram.png' />
                            <p class='name'>
                                Telegram
                            </p>
                        </li>
                        <li @click='jumpUrl("yt")'>
                            <img class='icon' src='../images/home/youtube.png' />
                            <p class='name'>
                                Youtube
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
            <div class='footer-last'>
                <p class='year'>
                    Vitatoken © 2022
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { getCookie } from '@/utils/util.js'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
    setup () {
        const store = useStore()
        const router = useRouter()

        // 用户信息
        const customerInfo = computed(() => store.state._user.customerInfo)

        // 底部nav跳转
        const jumpUrl = (index) => {
            const lang = getCookie('lang') || 'zh-CN'
            let linkList = {}
            if (lang === 'zh-CN') {
                linkList = {
                    trading: 'https://www.vitatoken.com/zh-CN/order?symbolId=364&tradeType=5',
                    fund: 'https://www.vitatoken.com/zh-CN/fund',
                    program: 'https://www.vitatoken.com/zh-CN/new1',
                    vip: 'https://www.vitatoken.com/zh-CN/vip',
                    customer: 'https://cs.vitatoken.io:443/im/text/1cayxu.html?lang=en',
                    faqs: 'https://www.vitatoken.com/site/faqs',
                    terms: 'https://www.vitatoken.com/site/terms-conditions',
                    policy: 'https://www.vitatoken.com/site/privacy-policy',
                    abount: ''
                }
            } else {
                linkList = {
                    trading: 'https://www.vitatoken.com/en-US/order?symbolId=364&tradeType=5',
                    fund: 'https://www.vitatoken.com/en-US/fund',
                    program: 'https://www.vitatoken.com/en-US/new1',
                    vip: 'https://www.vitatoken.com/en-US/vip',
                    customer: 'https://cs.vitatoken.io:443/im/text/1cayxu.html?lang=en',
                    faqs: 'https://www.vitatoken.com/site/faqs',
                    terms: 'https://www.vitatoken.com/site/terms-conditions',
                    policy: 'https://www.vitatoken.com/site/privacy-policy',
                    abount: ''
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
                    router.push({ path: '/fund' })
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
                default:
                    const newLinkList = { ...linkList, ...community }
                    if (newLinkList[index]) {
                        window.open(newLinkList[index])
                    }
            }
        }

        return {
            jumpUrl
        }
    }
}
</script>

<style lang="scss" scoped>
.footer-nav {
    min-width: 1200px;
    height: 380px;
    background: #15191E;
    position: relative;
    .footer-auto {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 90px;
    }
     .nav-left {
        ul {
            display: flex;
        }
        li {
            margin-right: 150px;
            &:last-of-type {
                margin-right: 0;
            }
            .title {
                margin-bottom: 20px;
                color: #9293A3;
                font-size: 20px;
                font-weight: 500;
            }
            .name {
                margin-top: 10px;
                a {
                    color: #515366;
                    font-size: 14px;
                    &:hover {
                        color: var(--primary);
                    }
                }
            }
        }
    }
    .nav-right {
        display: flex;
        flex-direction: column;
        align-items: center;
       .title {
            margin-bottom: 20px;
            color: #9293A3;
            font-size: 20px;
            font-weight: 500;
        }
        ul {
            display: flex;
            li {
                display: inline-flex;
                flex-direction: column;
                align-items: center;
                margin-right: 30px;
                cursor: pointer;
                &:last-of-type {
                    margin-right: 0;
                }
                .name {
                    margin-top: 10px;
                    color: #515366;
                    font-size: 14px;
                    &:hover {
                        color: var(--primary);
                    }
                }
            }
        }
    }
}
.footer-last {
    position: absolute;
    left: 50%;
    bottom: 40px;
    transform: translateX(-50%);
    .year {
        color: #9293A3;
        font-size: 12px;
    }
}
</style>
