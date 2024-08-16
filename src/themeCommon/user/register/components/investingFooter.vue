<template>
    <div class='footer-nav'>
        <div class='auto-width'>
            <div class='footer-auto'>
                <el-row class='row1' :gutter='10'>
                    <el-col
                        class='col1'
                        :lg='5'
                        :md='6'
                        :sm='6'
                        :xl='5'
                        :xs='22'
                    >
                        <img alt='' class='logo' src='../../../../themes/plans_PCUI/images/investingCom/headlineLogo.png' @click='jumpUrl("home")' />
                        <a class='email' href='mailto:support@headline.net'>
                            <span>{{ $t('investingFooter.email') }}</span> support@headline.net
                        </a>
                    </el-col>
                    <el-col
                        class='col2'
                        :lg='10'
                        :md='10'
                        :sm='10'
                        :xl='8'
                        :xs='22'
                    >
                        <p class='title'>
                            {{ $t('investingFooter.platform') }}
                        </p>
                        <div class='downloadRow'>
                            <img alt='' class='download' src='../../../../themes/plans_PCUI/images/investingCom/googlePlay.png' @click='jumpUrl("gg")' />
                            <img alt='' class='download download2' src='../../../../themes/plans_PCUI/images/investingCom/appleStore.png' @click='jumpUrl("apple")' />
                            <img alt='' class='download download2' src='../../../../themes/plans_PCUI/images/investingCom/telegram.png' @click='jumpUrl("tg")' />
                        </div>
                    </el-col>
                    <el-col
                        class='col3'
                        :lg='7'
                        :md='7'
                        :sm='7'
                        :xl='5'
                        :xs='22'
                    >
                        <p class='title'>
                            {{ $t('investingFooter.follow') }}
                        </p>
                        <div class='socialMediaRow'>
                            <img alt='' class='socialMedia socialMedia1' src='../../../../themes/plans_PCUI/images/investingCom/facebook.png' @click='jumpUrl("fb")' />
                            <img alt='' class='socialMedia socialMedia2 socialMedia6' src='../../../../themes/plans_PCUI/images/investingCom/twitter.png' @click='jumpUrl("twitter")' />
                            <img alt='' class='socialMedia socialMedia3 socialMedia6' src='../../../../themes/plans_PCUI/images/investingCom/youtube.png' @click='jumpUrl("yt")' />
                            <img alt='' class='socialMedia socialMedia4 socialMedia6' src='../../../../themes/plans_PCUI/images/investingCom/instagram.png' @click='jumpUrl("ig")' />
                            <img alt='' class='socialMedia socialMedia5 socialMedia6' src='../../../../themes/plans_PCUI/images/investingCom/linkedin.png' @click='jumpUrl("linkedin")' />
                        </div>
                    </el-col>
                </el-row>
                <div class='newDiv'>
                    <p class='title'>
                        {{ $t('investingFooter.contact') }}
                    </p>
                    <div class='downloadRow'>
                        <img alt='' class='download' src='../../../../themes/plans_PCUI/images/investingCom/telegram.png' @click='jumpUrl("tg")' />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 语言弹窗 -->
    <lang-dialog ref='langDialogRef' v-model='langDialogShow' />
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getCookie } from '@/utils/util.js'
import langDialog from '../../../../themes/plans_PCUI/layout/components/lang-dialog.vue'
import useMethods from '@planspc/hooks/useMethods'
export default {
    components: {
        langDialog
    },
    setup () {
        const store = useStore()
        const router = useRouter()

        const { toOrderPriority } = useMethods()

        // 用户信息
        const customerInfo = computed(() => store.state._user.customerInfo)
        // 语言列表
        const langActions = store.state.supportLanguages
        // 当前语言
        const currentLang = langActions.find(el => el.val === getCookie('lang'))
        // 组件ref
        const langDialogRef = ref(null)
        // 是否显示语言弹窗
        const langDialogShow = ref(false)

        // 打开语言弹窗
        const openLangDialog = () => {
            langDialogRef.value.open()
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
                    faqs: 'https://www.vitatoken.io/site/faqs',
                    terms: 'https://www.vitatoken.io/site/terms-conditions',
                    policy: 'https://www.vitatoken.io/site/privacy-policy',
                    // about: 'https://www.vitatoken.io/site/about-us'
                }
            } else {
                linkList = {
                    trading: 'https://www.vitatoken.io/en-US/order?symbolId=364&tradeType=5',
                    fund: 'https://www.vitatoken.io/en-US/fund',
                    program: 'https://www.vitatoken.io/en-US/new1',
                    vip: 'https://www.vitatoken.io/en-US/vip',
                    customer: 'https://cs.vitatoken.io:443/im/text/1cayxu.html?lang=en',
                    faqs: 'https://www.vitatoken.io/site/faqs',
                    terms: 'https://www.vitatoken.io/site/terms-conditions',
                    policy: 'https://www.vitatoken.io/site/privacy-policy',
                    // about: 'https://www.vitatoken.io/site/about-us'
                }
            }
            const community = {
                fb: 'https://www.facebook.com/HeadlineTrade',
                ig: 'https://www.instagram.com/headlinenet/',
                twitter: 'https://twitter.com/headline_trade',
                linkedin: 'https://www.linkedin.com/company/headline-net',
                yt: 'https://www.youtube.com/@Headline.net_offical',
                tg: 'https://t.me/Headline_Group',
                gg: 'https://play.google.com/store/apps/details?id=com.mc900.mc900&pli=1',
                apple: 'https://apps.apple.com/us/app/headline-net-finance-invest/id1639509598',
                home: 'https://www.headline.net/en-US/home'

            }
            switch (index) {
                case 'trading':
                    toOrderPriority(5)
                    break
                case 'fund':
                    router.push({ path: '/fund' })
                    break
                case 'fees':
                    router.push({ path: '/fees' })
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
                    router.push('/about')
                    break
                default:
                    const newLinkList = { ...linkList, ...community }
                    if (newLinkList[index]) {
                        window.open(newLinkList[index])
                    }
            }
        }

        return {
            jumpUrl,
            currentLang,
            langDialogRef,
            openLangDialog,
            langDialogShow
        }
    }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter&family=Poppins&display=swap');
.auto-width{
max-width: 1350px;
width: 100% !important;
}
.footer-nav {
  background: #fff;
  .row1{
      padding: 92px 0 112px;
      justify-content: space-between;
      .col1{
        .logo{
          width: 226px;
          margin-bottom: 25px;
        }
        .logo:hover{
          cursor: pointer;
        }
        .email{
          color: #000;
          font-family: 'Inter';
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
          display: block;
          span{
            color: #999;
          }
        }
      }
      .col2{
        .title{
          color: #000;
          font-family: Inter;
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
        }
        .downloadRow{
          padding-top: 20px;
          .download{
            max-width: 136px;
            width: 100%
          }
          .download:hover{
            cursor: pointer;
          }
          .download2{
            margin-left: 14px;
          }
        }
      }
      .col3{
        .title{
          color: #000;
          font-family: 'inter';
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
        }
        .socialMediaRow{
          margin-top: 24px;
          .socialMedia{
            width: 32px;
            height: 32px;
          }
          .socialMedia1:hover{
              content: url("../../../../themes/plans_PCUI/images/investingCom/facebook-hover.png");
              cursor: pointer;
          }
          .socialMedia2:hover{
              content: url("../../../../themes/plans_PCUI/images/investingCom/twitter-hover.png");
              cursor: pointer;
          }
          .socialMedia3:hover{
              content: url("../../../../themes/plans_PCUI/images/investingCom/youtube-hover.png");
              cursor: pointer;
          }
          .socialMedia4:hover{
              content: url("../../../../themes/plans_PCUI/images/investingCom/instagram-hover.png");
              cursor: pointer;
          }
          .socialMedia5:hover{
              content: url("../../../../themes/plans_PCUI/images/investingCom/linkedin-hover.png");
              cursor: pointer;
          }
          .socialMedia6{
            margin-left: 24px;
          }
        }
        .row3{
          padding-top: 20px;
          .row3col{
            padding: unset !important;
            text-align: center;
            .socialMedia{
            max-width: 32px;
            width: 100%;
          }
          }
        }
      }
  }
}
.newDiv{
display: none;
}
@media screen and (max-width: 1400px) {
.footer-nav {
  .row1{
      padding: 80px 0 80px;
      justify-content: space-evenly !important;
      .col2{
        align-content: space-between;
        display: grid;
      }
  }
}
}
@media screen and (max-width: 1100px) {
.col1{
        .logo{
          width: 200px !important;
        }
      }
.col2{
        .downloadRow{
          .download{
            max-width: 110px !important;
          }
        }
      }
      .socialMedia6{
            margin-left: 16px !important;
      }
}
@media screen and (max-width: 880px) {
.footer-nav{
  padding: 44px 0px 62px 25px !important;
}
.row1{
      padding: unset !important;
      display: block;
    }
    .col1{
      max-width: unset !important;
      .logo{
          margin-bottom: 16px;
        }
    }

.col2{
  display: none !important;
  display: block;
}
.col3{
  max-width: unset !important;
  margin-top: 32px;
  .socialMediaRow{
    margin-top: 16px !important;
  }
}
.newDiv{
  display: unset !important;
  .title{
    color: #000;
    font-family: Inter;
    font-size: 14px;
    font-weight: 700;
    margin-top: 24px;
  }
  .downloadRow{
    margin-top: 16px;
    .download{
      width: 136px;
    }
  }
}
}
</style>
