<template>
    <router-view />
    <div class='download-module'>
        <span>
            <div id='craigPart-2' class='craigPart-2'>
                <div class='part2Box'>
                    <h2>{{ $t('homePage.Part2title') }}</h2>
                    <div class='download-link'>
                        <div class='download-col'>
                            <a href='https://t.me/Headline_OfficialBot' target='_blank'>
                                <img alt='' class='telegram' src='../../images/craigIndexImg/TG@2x.png' />
                            </a>
                        </div>
                        <div class='download-col'>
                            <a href='https://play.google.com/store/apps/details?id=com.mc900.mc900&pli=1' target='_blank'>
                                <img alt='' class='googlePlay' src='../../images/craigIndexImg/GP@2x.png' />
                            </a>
                        </div>
                        <div class='download-col'>
                            <a href='https://apps.apple.com/app/headline-net/id1639509598' target='_blank'>
                                <img alt='' class='googlePlay' src='../../images/craigIndexImg/IOS@2x.png' />
                            </a>
                        </div>
                    </div>
                    <el-row :gutter='40'>
                        <el-col
                            :lg='12'
                            :md='24'
                            :sm='24'
                            style='text-align: center;'
                            :xl='12'
                            :xs='24'
                        >
                            <img alt='' class='mobile' src='../../images/craigIndexImg/twomobile-1.png' @click='jump(1)' />
                        </el-col>
                        <el-col :lg='12' :md='24' :sm='24' :xl='12' :xs='24'>
                            <div class='instructions'>
                                <ul>
                                    <li>
                                        <img alt='' class='arrow' src='../../images/craigIndexImg/Polygon-9@2x.png' @click='jump(1)' /><p>{{ $t('homePage.Part2text2') }}</p>
                                    </li>
                                    <li>
                                        <img alt='' class='arrow' src='../../images/craigIndexImg/Polygon-9@2x.png' @click='jump(1)' /><p>{{ $t('homePage.Part2text3') }}</p>
                                    </li>
                                    <li>
                                        <img alt='' class='arrow' src='../../images/craigIndexImg/Polygon-9@2x.png' @click='jump(1)' /><p>{{ $t('homePage.Part2text4') }}</p>
                                    </li>
                                    <li>
                                        <img alt='' class='arrow' src='../../images/craigIndexImg/Polygon-9@2x.png' @click='jump(1)' /><p>{{ $t('homePage.Part2text5') }}</p>
                                    </li>
                                    <li>
                                        <img alt='' class='arrow' src='../../images/craigIndexImg/Polygon-9@2x.png' @click='jump(1)' /><p>{{ $t('homePage.Part2text1') }}</p>
                                    </li>
                                </ul>
                                <div class="QRcode-boxs">
                                    <div class="QRcode-box">
                                        <img alt='' src='../../images/craigIndexImg/tg_bot.png' />
                                        <h4>Telegram</h4>
                                    </div>
                                    <div class="QRcode-box">
                                        <img alt='' src='../../images/craigIndexImg/app.png' />
                                        <h4>Mobile App</h4>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </span>
    </div>
</template>

<script>
import { getCookie } from '@/utils/util'
export default {
    name: 'Download',
    components: {
    },
    setup () {
        // const route = useRoute()
        // const router = useRouter()
        // const state = reactive({
        //     // 控制聊天框显示和隐藏
        //     controlLive: true,
        // })
        // const store = useStore()
        // const { toOrderPriority } = useMethods()
        // const { t } = useI18n({ useScope: 'global' })
        // const logoUrl = computed(() => {
        //     // return store.state.businessConfig?.pcuiLogo || logoImg;
        //     return logoImg
        // })
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
                    faqs: 'https://www.vitatoken.io/site/faqs',
                    terms: 'https://www.vitatoken.io/site/terms-conditions',
                    policy: 'https://www.vitatoken.io/site/privacy-policy',
                }
            } else {
                linkList = {
                    trading: 'https://www.vitatoken.com/en-US/order?symbolId=364&tradeType=5',
                    fund: 'https://www.vitatoken.com/en-US/fund',
                    program: 'https://www.vitatoken.com/en-US/new1',
                    vip: 'https://www.vitatoken.com/en-US/vip',
                    customer: 'https://cs.vitatoken.io:443/im/text/1cayxu.html?lang=en',
                    faqs: 'https://www.vitatoken.io/site/faqs',
                    terms: 'https://www.vitatoken.io/site/terms-conditions',
                    policy: 'https://www.vitatoken.io/site/privacy-policy'
                }
            }
            const community = {
                fb: 'https://www.facebook.com/Vitatoken-100578379186941',
                ig: 'https://www.instagram.com/vitatoken_official/',
                twitter: 'https://twitter.com/Vitatoken_',
                telegram: 'https://t.me/vitatoke',
                yt: 'https://www.youtube.com/channel/UCWrIoUETskxOU9zIVpba6Hg'
            }
            const newLinkList = { ...linkList, ...community }
            window.open(newLinkList[index])
        }

        const jumpdownload = (attr) => {
            switch (attr) {
                case 9 :
                    window.open('https://t.me/headline_official')
                    break
                case 10 :
                    window.open('https://apps.apple.com/app/id1639509598')
                    break
                case 11 :
                    window.open('https://play.google.com/store/apps/details?id=com.mc900.mc900&pli=1')
                    break
            }
        }
        return {
            //   ...toRefs(state),
            jumpUrl,
            jumpdownload,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

.download-module{
  overflow: hidden;
}
.QRcode-boxs {
    display: flex;
    margin: 24px 0 52px;
}
.QRcode-box {
    width: 160px;
    height: 195px;
    border-radius: 8px;
    background: #FFFFFF;
    box-shadow: 0px 6px 18px 0px #0000001A;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 18px;
    font-weight: 500;
    color: #0B357F;
    margin-right: 32px;
    & > img {
        width: 132px;
        height: 132px;
        margin: 14px 0 8px;
    }
}
.craigPart-2{
      width: 100%;
      box-sizing: border-box;
      background-color: #F6F9FF;
      .mobile{
          position: relative;
          width: 100%;
          max-width: 500px;
          min-width: 420px;
      }
      .part2Box{
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-width: 1200px;
          h2{
              text-align: center;
          }
          .download-link{
            padding: 30px 0 42px;
            display: flex;
            flex-wrap: wrap;
            .download-col{
                text-align: center;
                margin: 0 16px;
            }
          }
          .download{
              padding: 40px 0 62px;
              text-align: center;
              .xs12{
                  width: 180px;
                  text-align: center;
              }
          }
          .instructions{
              align-content: center;
              li{
                  display: -webkit-box;
                  width: 100%
              }
              .arrow{
                  width: 13px;
                  padding-top: 5px;
              }
              p{
                  padding-left: 15px;
                  font-size: 23px;
              }
          }
          .QRcode{
              display: inline;
              width: 30%;
              padding-top: 30px;
              padding-left: 30px;
              position: relative;
              max-width: 270px;
          }
          .telegram{
              width: 150px;
              cursor: pointer;
          }
          .ios{
              width: 180px;
              cursor: pointer;
          }
          .googlePlay{
              width: 150px;

              cursor: pointer;
          }
          h2{
              font-size: 36px;
              color: #1C3466;
              padding-top: 110px;
          }
          p{
              color: #1C3466;
              font-size: 18px;
              text-align: left;
          }
          ul{
              display: flex;
              display: inline;
              padding-left: 50px;
              li{
                  display: flex;
                  flex-direction: column;
                  padding: 10px 10px;
                  span:nth-child(2){
                      font-weight: 600;
                      color: #1C3466;
                      font-size: 18px;
                  }
              }
          }
      }
  }
</style>
