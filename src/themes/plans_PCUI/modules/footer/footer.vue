<template>
    <div id='footerNavID' class='footer-nav' :style='data.styleObj'>
        <div class='craigPart-6'>
            <div class='part6Box'>
                <el-row :gutter='2'>
                    <el-col
                        class='footerBar'
                        :lg='16'
                        :md='24'
                        :sm='24'
                        style='padding-top: 30px; justify-content: space-around;'
                        :xl='16'
                        :xs='24'
                    >
                        <div class='footerMenu' style='display: flex; justify-content: space-between;padding-bottom: 6px;'>
                            <div class='footerMenu'>
                                <h1>{{ $t('footerInfo.Market') }}</h1>
                                <router-link
                                    class='logoButton'
                                    to='/home'
                                >
                                    <p class='footerCol1'>
                                        {{ $t('footerInfo.Home') }}
                                    </p>
                                </router-link>
                                <router-link
                                    class='logoButton'
                                    to='/quote'
                                >
                                    <p class='footerCol2'>
                                        {{ $t('footerInfo.Quote') }}
                                    </p>
                                </router-link>
                            </div>
                            <div class='footerMenu'>
                                <h1>{{ $t('footerInfo.Platforms') }}</h1>
                                <p class='footerCol1' @click='jumpdownload(9)'>
                                    {{ $t('footerInfo.HeadlineWebApp') }}
                                </p>
                                <router-link to='/download'>
                                    <p class='footerCol2'>
                                        {{ $t('footerInfo.HeadlineMobileApp') }}
                                    </p>
                                </router-link>
                                <p class='footerCol2' @click='jump(2)'>
                                    {{ $t('footerInfo.TelegramTradingPlatform') }}
                                </p>
                            </div>
                            <div class='footerMenu'>
                                <h1>{{ $t('footerInfo.Company') }}</h1>
                                <router-link to='/aboutus'>
                                    <p class='footerCol1'>
                                        {{ $t('footerInfo.AboutHeadline') }}
                                    </p>
                                </router-link>
                            </div>
                            <div class='footerMenu'>
                                <h1>{{ $t('footerInfo.Legal') }}</h1>
                                <p class='footerCol1' @click='jump(7)'>
                                    {{ $t('footerInfo.TermsAndConditions') }}
                                </p>
                                <p class='footerCol2' @click='jump(8)'>
                                    {{ $t('footerInfo.PrivacyPolicy') }}
                                </p>
                                <p class='footerCol2' @click='jump(9)'>
                                    {{ $t('footerInfo.RiskDisclosure') }}
                                </p>
                            </div>
                        </div>
                        <div class='companyInfo'>
                            <el-divider class='line' style='margin: unset' />
                            <h1>{{ $t('footerInfo.RiskWarning') }}</h1>
                            <p>
                                {{ $t('footerInfo.RiskWarningContent') }}
                            </p>
                        </div>
                        <p class='copyRight' style='color: #FFFFFF; margin: 30px 0 40px;'>
                            Copyright © 2016-{{ currYear }} Headline.net. All rights reserved
                        </p>
                    </el-col>
                    <el-col :lg='8' :md='24' :sm='24' :xl='8' :xs='24'>
                        <div class='part6Top'>
                            <p>{{ $t('footerInfo.FollowUsOn') }}:</p>
                            <p style='padding-top:10px'>
                                <img alt='fb' class='socialMedia fb footer_fb' src='../../images/craigIndexImg/FB1.png' style='height: 21px; width: auto;' @click='jump(1)' />
                                <!--<img alt='' src='../../images/craigIndexImg/IG1.png' @click='jump(6)' />
                                  <img alt='' src='../../images/craigIndexImg/TW1.png' @click='jump(4)' />
                                  <img alt='' src='../../images/craigIndexImg/YT1.png' @click='jump(3)' />-->
                                <img alt='tg' class='socialMedia tg footer_tgGroup' src='../../images/craigIndexImg/TG1.png' style='height: 18px; width: auto' @click='jump(2)' />
                                <!--<img alt='' src='../../images/craigIndexImg/LINE1.png' @click='jump(5)' />-->
                            </p>
                            <p v-if="$route.path.indexOf('/support') > -1">
                                {{ $t("newHomeFooter.contactUs") }}: support@headline.net
                            </p>
                            <img alt='tg' class='tg footer_tgBot' src='../../images/craigIndexImg/TG@2x.png' style='width: 180px; margin-top: 80px;' @click='jumpdownload(12)' /><br />
                            <img alt='google' class='googlePlay footer_googlePlay' src='../../images/craigIndexImg/GP@2x.png' style='width: 180px; margin-top: 20px;' @click='jumpdownload(11)' /><br />
                            <img
                                v-if="$route.path !== '/event/non-event2-cw'"
                                alt='google'
                                class='googlePlay footer_googlePlay'
                                src='../../images/craigIndexImg/IOS@2x.png'
                                style='width: 180px; margin-top: 20px;'
                                @click='jumpdownload(10)'
                            />
                        </div>
                    </el-col>
                </el-row>
                <img alt='' src='../../images/craigIndexImg/ContentImage.jpg' style='display: none' />
            </div>
        </div>
    </div>
</template>

<script>
import { computed, reactive } from 'vue'
import { useStore } from 'vuex'
import useMethods from '@planspc/hooks/useMethods'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import jwtBtn from '@/components/jwtBtn.vue'
export default {
    components: {
        jwtBtn
    },
    props: {
        data: {
            type: Object,
            default: function () {
                return {
                    href: '',
                    src: '',
                    target: '',
                }
            }
        },
        moduleId: {
            type: String,
            default: ''
        },
    },
    setup () {
        const route = useRoute()
        const router = useRouter()
        const state = reactive({
            // 控制聊天框显示和隐藏
            controlLive: true,
        })
        const store = useStore()
        const { toOrderPriority } = useMethods()
        const { t } = useI18n({ useScope: 'global' })
        const changePlans = (item) => {
            // 跳转到下单页面并优先显示指定产品
            toOrderPriority(item.tradeType)
        }

        const plansList = computed(() => {
            const userProductCategory = store.getters.userProductCategory
            const resultPlans = store.state._base.plans.filter(e => {
                return userProductCategory[e.tradeType]?.find(o => o.listByUser?.length)
            })
                .map(el => {
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
                case 1 :
                    window.open('https://www.facebook.com/HeadlineTrade')
                    break
                case 2 :
                    // window.open('https://t.me/headline_official')
                    // window.open('https://t.me/Headline_OfficialBot')
                    window.open('https://t.me/Headline_Group')
                    break
                case 3 :
                    window.open('https://www.youtube.com/channel/UCRuLhEVnVK_NUIIGWBHUHRA')
                    break
                case 4 :
                    window.open('https://twitter.com/mc900_global')
                    break
                case 5 :
                    window.open('https://page.line.me/?accountId=152iogjg')
                    break
                case 6 :
                    window.open('https://www.instagram.com/mc900_global/')
                    break
                case 7 :
                    window.open('https://www.headline.net/html/headline_agreement.html?v=1')
                    break
                case 8 :
                    window.open('https://www.headline.net/html/headline_privacy.html?v=1')
                    break
                case 9 :
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
            };
        }

        const symbolKey = computed(() => store.state._quote.productActivedID)

        const jumpdownload = (attr) => {
            switch (attr) {
                case 9 :
                    const [symbolId, tradeType] = symbolKey.value?.split('_') || []
                    router.push(`/order?symbolId=${symbolId || ''}&tradeType=${tradeType || ''}`)
                    // window.open('https://t.me/MC900bot')
                    break
                case 10 :
                    // window.open('https://apps.apple.com/us/app/mc900-trade-btc-100-forex-gold/id1639509598')
                    window.open('https://apps.apple.com/app/headline-net/id1639509598')
                    break
                case 11 :
                    window.open('https://play.google.com/store/apps/details?id=com.mc900.mc900&pli=1')
                    break
                case 12 :
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
        const currYear = new Date().getFullYear()
        return {
            changePlans,
            plansList,
            plansName,
            jump,
            goTop,
            jumpdownload,
            linkThirdPartyLogin,
            currYear,
        }
    }
}
</script>

<style lang="scss" scoped>

.waveui{
min-height: auto;
font-family: "Roboto";
background: #383838;
}

.footerMenu{
  h1{
    font-size: 16px;
    font-weight: 600;
    color: #FFF ;
  }
  .footerCol1{
    font-size: 14px;
    color: #EEEEEE;
    padding: 10px 0 10px;
  }
  .footerCol2{
    font-size: 14px;
    color: #EEEEEE;
    padding: 0px 0 10px;
  }
  p:hover{
    cursor: pointer;
    color: #BE1E2D;
  }
}
.companyInfo{
    h1{
      color: #fff;
      font-size: 14px;
      padding: 20px 0 10px;
    }
    p{
      color: #fff;
      font-size: 14px;
    }
  }

.table {
width: 100%;
margin: 0;
box-sizing: border-box;
text-align: -webkit-center; //之後要刪掉
}
.header-row {
background: white;
color: black;
}

.row {
display: table-cell;
width: 28%; //22% 之後改返
padding: 40px 0 0px;
}

.cell {
display: flex;
text-align: left;
padding-bottom: 20px;
p{
cursor: pointer;
color: #FFF
}
p:hover{
color:#BE1E2D;
}
}
.footerterms {
text-align: left;
color: #FFF;
font-weight: 600;
padding-bottom: 20px;
}

input[type="radio"],
input[type="checkbox"]{
display: none;
}

.Accordion {
display: none;
width: 100%;
}

.Accordioncell {
padding: 6px;
border-bottom: 1px solid #e5e5e5;
}

@media only screen and (max-width: 1000px)  {

.row {
display: none;
}

.header-row {
display: none;
        }

.cell {
display: none;
}
.Accordion {
display: block;
}

.Accordionrow {
position: relative;
display: block;
border-bottom: 1px solid #ccc;
}

.header-row {
display: none;
}

.Accordioncell {
display: block;
border: none;
position: relative;
height: 45px;
line-height: 45px;
text-align: left;
    color: #2D3436 !important;
}

.primary:after {
content: "";
position: absolute;
right:20px;
top:18px;
z-index: 2;
width: 0;
height: 0;
    border: solid #787E95;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    display: inline-block;
    padding: 3px;
}

.Accordioncell:nth-of-type(n+2) {
display: none;
}

input[type="radio"],
input[type="checkbox"] {
display: block;
position: absolute;
z-index: 1;
width: 99%;
height: 100%;
opacity: 0;
}

input[type="radio"]:checked,
input[type="checkbox"]:checked {
z-index: -1;
}

input[type="radio"]:checked ~ .Accordioncell,
input[type="checkbox"]:checked ~ .Accordioncell {
display: block;
}

input[type="radio"]:checked ~ .Accordioncell:nth-of-type(n+2),
input[type="checkbox"]:checked ~ .Accordioncell:nth-of-type(n+2) {

background: #F6F9FF;
}

input[type="radio"]:checked ~ .primary,
input[type="checkbox"]:checked ~ .primary  {
border-bottom: 2px solid #999;
}

input[type="radio"]:checked ~ .primary:after,
input[type="checkbox"]:checked ~ .primary:after {
    transform: rotate(-135deg);
    -webkit-transform: rotate(-135deg);
}
}
.footer-nav {
//margin-left: 65px;
overflow: hidden;
position: relative;
font-family: "Roboto";
.nav-left {
.year {
    margin-top: 18px;
    color: #9293A3;
    font-size: 12px;
}
}
.nav-right {
padding-top: 90px;
ul {
    display: flex;
}
li {
    margin-right: 110px;
    &:last-of-type {
        margin-right: 0;
    }
    .title {
        color: #515366;
        font-size: 14px;
    }
    .name {
        margin-top: 10px;
        a {
            color: #9293A3;
            font-size: 14px;
        }
    }
}
}
.craigPart-6{
width: 100%;
position: relative;
background: #383838;
.el-backtop{
  right: unset;
}
.backtop{
width: 50px;
height: 50px;
background: linear-gradient(90deg, #EF4050 0%, #BE1E2D 100%);
&:hover{
  background: linear-gradient(90deg, #FFA7AF 0%, #FF5F6E 100%);
  img{
    filter: invert(80%) sepia(87%) saturate(3550%) hue-rotate(344deg) brightness(87%) contrast(91%);
  }
  }
}
.part6Box{
    max-width: 1260px;
    padding: 0 30px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    :deep{
        .el-row{
            width:100%
        }
    }
    .part6Top{
        width: 100%;
        align-items: center;
        text-align: center;
        img{
            width: 160px;
            height: auto;
            cursor: pointer;
        }
        p{
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            padding: 10px 0 0 0px;
            justify-content: center;
            margin-bottom: 10px;
            color: #fff;
            img{
                width: 20px;
                height: auto;
                margin-left: 20px;
                cursor: pointer;
            }
            img:hover{
              filter: invert(80%) sepia(87%) saturate(3550%) hue-rotate(344deg) brightness(87%) contrast(91%);
            }
        }
    }
    hr{
        width: 100%;
        height: 1px;
        background-color: #E4E4E4;
    }
    ul{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        inline-size: -webkit-fill-available;

        li{
            text-align: left;
        }
        li:nth-child(1){
            font-size: 14px;
            color: #fff;
            padding-top: 40px;
            font-weight: 600;
        }
        li:nth-child(2){
            padding-top: 10px;
            font-size: 14px;
            color: #fff;
        }
    }
    .part6Bottom{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 30px;
        padding-bottom: 40px;
        span{
            font-size: 16px;
            color: #727272;
        }
    }
    .part6Position{
        position: fixed;
        right: 14px;
        bottom: 20px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
        z-index: 999;
        p{
          background: linear-gradient(90deg, #EF4050 0%, #BE1E2D 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            img{
                width: 30px;
                height: auto;
            }
            span{
                display: none;
            }
        }

        p:nth-child(1){
            width: 50px;
            height: 50px;
            border-radius: 30px;
            margin-top: 30px;
        }
        p:hover{
            background: linear-gradient(90deg, #FFA7AF 0%, #FF5F6E 100%);
            width: 130px;
            -webkit-transition: width .3s;
            transition: width .3s;
            overflow: hidden;
            img{
              -webkit-transition: width .5s ease-in-out;
              filter: invert(70%) sepia(61%) saturate(4371%) hue-rotate(341deg) brightness(75%) contrast(99%);
        }
        span{
            display: block;
            margin-left: 10px;
            color: #BE1E2D;
        }
        }
    }
}
}
}

@media screen and (max-width: 600px){
  .footerMenu{
    display: none !important;
  }
  .line{
    display: none !important;
  }
  .footerBar{
  padding-top: unset !important;
}
}

@media (max-width:1199px) {
  .copyRight{
    display: none;
  }
}

@media (max-width:1100px) {
  .footer-nav {
    margin-left: unset;
  }
  .part6Box{
    padding: 0 30px;
  }
}
@import '@/sass/mixin.scss';
</style>
