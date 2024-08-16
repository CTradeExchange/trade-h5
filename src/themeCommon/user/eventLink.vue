<template>
    <div v-if='state.customPage' class='eventPage'>
        <div v-if='state.customPage?.EmbedLink && state.isOnload' :class="getDevice() == 1 ? 'eventHeader' : 'pc-eventHeader'">
            <img :class="getDevice() == 1 ? 'logo' : 'pc-logo'" height='30' :src='logoUrl' @click="onPage('home')" />
            <div>
                <div
                    v-for='(item, index) in state.customPage?.EmbedHeadButton'
                    :key='index'
                    :class="getDevice() == 1 ? 'register' : 'pc-register register'"
                    @click='onPage(item.type)'
                >
                    {{ item.content }}
                </div>
            </div>
        </div>
        <div id='iframeBox' ref='content'>
            <div :class="state.mobile ? 'mobile_iframe' : 'web_iframe'" :style="{ height: state.mobile ? '100%' : `${height * scale}px` }">
                <iframe
                    ref='iframeRef'
                    :height="state.mobile ? 'auto' : height"
                    :scrolling="state.mobile ? 'yes' : 'no'"
                    :src='state.customPage?.EmbedLink'
                    :style='{ transform: `scale(${scale})` }'
                    :width='width'
                    @scroll='handleScroll'
                ></iframe>
            </div>
            <div
                v-if='getDevice() !== 1 && state.customPage?.EmbedLink && state.isOnload'
                :class="getDevice() == 1 ? 'productList' : 'pc-productList'"
            >
                <TradeList class='trade-card' :link='true' :trades='state.customPage.Trades' />
            </div>
            <footerNav v-if='!state.mobile && state.customPage?.EmbedLink && state.isOnload' style='font-size: initial' />
        </div>
        <div class='custom-footer-box'>
            <div v-if='state.isOnload && state.customPage?.EmbedLink' :class="getDevice() == 1 ? 'eventFooter' : 'pc-eventFooter'">
                <TradeList v-if='getDevice() == 1' class='trade-card' :link='true' :trades='state.customPage.Trades' />

                <div class='login-type-box'>
                    <div
                        v-if="thirdLoginArr.includes('google') && !isTGweb"
                        class='login-box'
                        :style="getDevice() == 1 ? 'width: 43%;padding:5px 0;' : 'width:30%'"
                    >
                        <LoginByGoogle />
                        <p>
                            <!-- <span>{{ $t("login.tLogin") }}</span> -->
                            <span>Continue with</span>
                            <img
                                alt=''
                                :class="getDevice() == 1 ? 'h5-img' : 'pc-img'"
                                src='../../themes/plans_PCUI/images/craigIndexImg/g_icon.png'
                            />
                        </p>
                    </div>
                    <div
                        v-if="thirdLoginArr.includes('telegram')"
                        class='login-box'
                        :style="getDevice() == 1 ? 'width: 43%;padding:5px 0;' : 'width:30%'"
                    >
                        <LoginByTelegram />
                        <p>
                            <!-- <span>{{ $t("login.tLogin") }}</span> -->
                            <span>Continue with</span>
                            <img
                                alt=''
                                :class="getDevice() == 1 ? 'h5-img' : 'pc-img'"
                                src='../../themes/plans_PCUI/images/craigIndexImg/t_icon.png'
                            />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import LoginByGoogle from '@/themeCommon/user/login/components/loginByGoogle.vue'
import LoginByTelegram from '@/themeCommon/user/login/components/loginByTelegram'
import footerNav from '@/themes/plans_PCUI/layout/footer.vue'
import TradeList from '@plans/components/TradeList'

import { computed, reactive, onMounted, onUnmounted, ref, watch } from 'vue'
import { Toast } from 'vant'
import { useStore } from 'vuex'
import { GetCustomPage } from '@/api/newApi'
import { useRoute, useRouter } from 'vue-router'
import { getDevice, sessionGet, isMobile, parseJSON, isEmpty, getProductList, getCookie, getDefaultZoneIndex } from '@/utils/util'

const content = ref()

const route = useRoute()
const store = useStore()
const router = useRouter()
const { ID } = route.params
const dfw = [320, 980]
const iframeRef = ref()

const state = reactive({
    loading: false,
    customPage: {},
    mobile: isMobile(),
    widBox: null,
    isOnload: false,
})
// 获取三方登录配置
store.dispatch('_base/getLoginConfig')
const thirdLoginArr = computed(() => store.state._base.wpCompanyInfo?.thirdLogin || [])
const isTGweb = sessionGet('isTGweb') == '1'
const logoImg = require('@planspc/images/logo-color.png')
const logoUrl = computed(() => {
    return logoImg
})
const width = computed(() => {
    // 如果是leadpages生成的页面使用100%
    if (state.customPage?.EmbedLink?.indexOf('lead.headline.net') !== -1) return '100%'
    return isMobile() ? Number(state.customPage?.EmbedExtra?.WidthAPP) || dfw[0] : Number(state.customPage?.EmbedExtra?.WidthPC) || dfw[1]
})
const scale = computed(() => {
    // 如果是leadpages生成的页面不缩放
    if (state.customPage?.EmbedLink?.indexOf('lead.headline.net') !== -1) return 1
    const result = state.widBox / width.value
    return result.toFixed(6) * 1
})
const height = computed(() => {
    const { HeightAPP, HeightPC } = parseJSON(state.customPage.EmbedExtra) || {}
    return isMobile() ? HeightAPP : HeightPC + 12
})

const getDetail = () => {
    const body = { RequestPostfix: ID }
    state.loading = true
    GetCustomPage({ body })
        .then((res) => {
            if (res.Code === 1000 && res.CustomPage) {
                state.customPage = res.CustomPage
                state.customPage.EmbedHeadButton = parseJSON(res.CustomPage.EmbedHeadButton) || []
                state.customPage.EmbedExtra = parseJSON(res.CustomPage.EmbedExtra)
                state.loading = false
            } else {
                router.replace('/home')
            }
        })
        .catch(({ Msg }) => {
            Toast(Msg)
            state.loading = false
        })
}
const onPage = (type) => {
    switch (type) {
        case 'register':
            router.push('/register')
            break
        case 'home':
            router.push('/home')
            break
        default:
            break
    }
}

const handleWidBox = () => {
    const widthbox = document.getElementById('iframeBox').offsetWidth
    state.widBox = widthbox
}

const iframeLoaded = () => {
    if (!iframeRef.value) return
    iframeRef.value.onload = () => {
        state.isOnload = true
    }
}

let hasScrolled30 = false
let hasScrolled50 = false
let hasScrolled80 = false
const handleScroll = (event) => {
    const scrollPosition = event.target.scrollTop
    const scrollHeight = event.target.scrollHeight
    const windowHeight = event.target.clientHeight
    const scrollThreshold = Math.round((scrollHeight - windowHeight) * 0.3)
    const scrollThreshold2 = Math.round((scrollHeight - windowHeight) * 0.5)
    const scrollThreshold3 = Math.round((scrollHeight - windowHeight) * 0.8)

    if (scrollPosition >= scrollThreshold && !hasScrolled30) {
        hasScrolled30 = true
        const data = {
            event: 'scroll',
            scrollPercentage: 30,
        }

        // Push data to data layer
        dataLayer.push(data)
    }
    if (scrollPosition >= scrollThreshold2 && !hasScrolled50) {
        hasScrolled50 = true
        const data2 = {
            event: 'scroll-50%',
            scrollPercentage: 50,
        }

        // Push data to data layer
        dataLayer.push(data2)
    }
    if (scrollPosition >= scrollThreshold3 && !hasScrolled80) {
        hasScrolled80 = true
        const data3 = {
            event: 'scroll-80%',
            scrollPercentage: 80,
        }

        // Push data to data layer
        dataLayer.push(data3)
    }
}

onMounted(() => {
    iframeLoaded()
    getDetail()
    handleWidBox()
    if (!isMobile()) {
        window.addEventListener('resize', handleWidBox)
    }
    // 获取支持企业注册国家
    store.dispatch('getCompanyCountry')
    // 获取国家区号
    store.dispatch('getCountryListByParentCode')
    // 监听滚动
    if (content.value) {
        content.value.addEventListener('scroll', handleScroll)
    }
})

onUnmounted(() => {
    if (!isMobile()) {
        window.removeEventListener('resize', handleWidBox)
    }
    if (content.value) {
        content.value.removeEventListener('scroll', handleScroll)
    }
})
</script>

<style lang="scss">
.login-box {
  position: relative;
  width: 30%;
  overflow: hidden;
  margin: 0 8px;
  display: flex;
  border-radius: 4px;
  justify-content: center;
  &:first-of-type {
      background: #000;
  }
  &:last-of-type {
      background: #28a7e8;
  }
  & > p {
      display: flex;
      align-items: center;
      font-size: 16px;
      color: #fff;
      & > img {
          width: 32px;
          height: 32px;
          margin-left: 12px;
      }
  }
  & > a {
      position: absolute !important;
      width: 100% !important;
      height: 100% !important;
      opacity: 0.0001;
      left: 0;
      top: 0;
      transform: scale(5);
      transform-origin: 0 0;
      cursor: pointer;
  }
  & > div {
      position: absolute !important;
      width: 100% !important;
      height: 100% !important;
      opacity: 0.0001;
      left: 0;
      top: 0;
  }
  .telegram {
      width: 100% !important;
      height: 100% !important;
      transform: scale(5);
      transform-origin: 0 0;
      cursor: pointer;
  }
}
</style>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.eventPage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .eventHeader {
      height: rem(96px);
      padding: 0 rem(20px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
      .logo {
          width: auto;
          cursor: pointer;
      }
      .register {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--contentColor);
          background: var(--primary);
          border-radius: rem(8px);
          padding: rem(12px) rem(40px);
          cursor: pointer;
      }
  }
  .pc-eventHeader {
      height: 70px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
      .pc-logo {
          width: auto;
          cursor: pointer;
      }
      .pc-register {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--contentColor);
          border-radius: 4px;
          background: linear-gradient(90deg, var(--primary) 0%, var(--primary) 100%);
          border-radius: 8px;
          padding: 12px 40px;
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          cursor: pointer;
      }
  }

  #iframeBox {
      flex: 1;
      overflow: auto;
      width: 100%;
      height: auto;
      background: var(--contentColor);
      @include scroll-bar-vertical;
      .pc-productList {
          width: 65%;
          margin: auto;
          :deep(.titleBar) {
              font-size: 16px !important;
              height: 50px;
              line-height: 50px;
              justify-content: space-between;
          }
          :deep(.sell_price) {
              font-size: 16px !important;
          }
          :deep(.buy_price) {
              font-size: 16px !important;
          }
          :deep(.name) {
              width: 245px;
              font-size: 16px !important;
              flex: none;
          }
          :deep(.customTableCell) {
              width: 245px;
          }
          :deep(.productItem) {
              height: auto !important;
              line-height: 50px !important;
              padding: 20px 0;
          }
          :deep(.link-btn) {
              margin-top: 0;
          }
          :deep(.item) {
              width: 245px;
              flex: none;
          }
      }
      .productList {
          width: 100%;
      }
  }
  .mobile_iframe {
      width: 100%;
      overflow: hidden;
      display: flex;
      justify-content: center;
      iframe {
          transform-origin: top;
      }
  }
  .web_iframe {
      width: 100%;
      overflow: hidden;
      iframe {
          transform-origin: 0 0;
      }
  }
  .custom-footer-box{
    .login-type-box {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-bottom: 10px;
      }
    .eventFooter {
      flex-shrink: 0;
      min-height: rem(140px);
      box-shadow: rem(0px) rem(-30px) rem(18px) rgba(247, 248, 248, 0.5);
      display: flex;
      flex-direction: column;

      & > div > p {
          font-size: rem(28px);
      }
  }

  .pc-eventFooter {
      flex-shrink: 0;
      height: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
  }
  }

  .pc-img {
      height: 46px;
      object-fit: contain;
  }
}
</style>
