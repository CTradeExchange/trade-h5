<template>
    <div v-show='downloadVis' class='download-app'>
        <div class='brand'>
            <img alt='' class='logo' src='/images/vitamin_logo.png' srcset='' />
            <div class='text'>
                <p>Vitatoken APP</p>
                <p>{{ $t('vitaHome.app') }}</p>
            </div>
        </div>

        <div class='icons'>
            <div class='dowonload' @click='download'>
                <svg class='dowonload-img' fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                    <path d='M19 20H5v2h14v-2zM13 14.5l4.6-4.7 1.5 1.4-7.1 7.1-7.1-7.1 1.4-1.4 4.7 4.7V2h2v12.5z' fill='currentColor' />
                </svg>
            </div>
            <van-icon class='close' color='#fff' name='cross' size='18' @click='downloadVis=false' />
        </div>
    </div>
    <div class='nav-wrap'>
        <div class='logo' @click="$router.push('/')">
            <img alt='' src='/images/logo_vitamin.png' srcset='' />
        </div>
        <div class='right'>
            <div class='menu' @click='menuVis=true'>
                <svg class='icon-svg' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                    <use xlink:href='#menu-hamburger-f' />
                    <symbol id='menu-hamburger-f' viewBox='0 0 24 24'>
                        <path clip-rule='evenodd' d='M4 4H20V7H4V4ZM4 10.5H20V13.5H4V10.5ZM20 17H4V20H20V17Z' fill='currentColor' fill-rule='evenodd' />
                    </symbol>
                </svg>
            </div>
        </div>
    </div>

    <van-popup
        v-model:show='menuVis'
        class='menu-wrap'
        close-on-popstate
        closeable
        position='right'
        :style="{ height: '100%',width: '100%',paddingTop: '50px' }"
        teleport='body'
    >
        <div v-if='!customerInfo' class='menu-list'>
            <router-link class='btn' to='/login'>
                {{ $t('login.loginBtn') }}
            </router-link>
            <router-link class='reg-btn' to='register'>
                {{ $t('register.registerBtn') }}
            </router-link>
        </div>
        <div v-else>
            <minePerson :data='minePersonData' />
        </div>
        <van-cell-group class='cellGroup'>
            <van-cell class='cellItem' is-link :title='$t("cRoute.msg")' @click="routerTo('msg')">
                <template #icon>
                    <div class='icon-wrap'>
                        <svg class='svg-icon' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                            <use xlink:href='#notification-f' />
                            <symbol id='notification-f' viewBox='0 0 24 24'>
                                <path clip-rule='evenodd' d='M12 3C8.13401 3 5 6.13401 5 10L5 13L4 14V16H5L19 16H20L20 14L19 13V10C19 6.13401 15.866 3 12 3ZM12 21C9.94965 21 8.18757 19.7659 7.41602 18H16.5839C15.8124 19.7659 14.0503 21 12 21Z' fill='currentColor' fill-rule='evenodd' />
                            </symbol>
                        </svg>
                    </div>
                </template>
            </van-cell>
            <van-cell class='cellItem' is-link :title='$t("cRoute.regKyc")' @click="routerTo('authentication')">
                <template #icon>
                    <div class='icon-wrap'>
                        <svg class='svg-icon' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                            <use xlink:href='#id-f' />
                            <symbol id='id-f' viewBox='0 0 24 24'>
                                <path clip-rule='evenodd' d='M3 5H21V19H3V5ZM10 10.0003C10 11.1048 9.10457 12.0003 8 12.0003C6.89543 12.0003 6 11.1048 6 10.0003C6 8.8957 6.89543 8.00027 8 8.00027C9.10457 8.00027 10 8.8957 10 10.0003ZM13 9.00027H19V11.5003H13V9.00027ZM19 13.4997H13V15.9997H19V13.4997ZM11 13.4997V15.9997H5V13.4997H11Z' fill='currentColor' fill-rule='evenodd' />
                            </symbol>
                        </svg>
                    </div>
                </template>
            </van-cell>
            <van-cell class='cellItem' is-link :title='$t("cRoute.securitySetting")' @click="routerTo('securitySetting')">
                <template #icon>
                    <div class='icon-wrap'>
                        <svg class='svg-icon' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                            <use xlink:href='#security-f' />
                            <symbol id='security-f' viewBox='0 0 24 24'>
                                <path clip-rule='evenodd' d='M4 4V16L12 21L20 16V4H4ZM12 8L8.5 11.5L12 15L15.5 11.5L12 8Z' fill='currentColor' fill-rule='evenodd' />
                            </symbol>
                        </svg>
                    </div>
                </template>
            </van-cell>
            <van-cell class='cellItem' is-link :title='$t("cRoute.commonSetting")' @click="routerTo('commonSetting')">
                <template #icon>
                    <div class='icon-wrap'>
                        <svg class='svg-icon' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                            <use xlink:href='#task-center-f' />
                            <symbol id='task-center-f' viewBox='0 0 24 24'>
                                <path clip-rule='evenodd' d='M15 2H9V4H5V21H19V4H15V2ZM16 9H8V11.5H16V9ZM16 14.5H8V17H16V14.5Z' fill='currentColor' fill-rule='evenodd' />
                            </symbol>
                        </svg>
                    </div>
                </template>
            </van-cell>
            <van-cell class='cellItem' is-link :title='$t("fundInfo.fund")' @click="routerTo('fundProductList')">
                <template #icon>
                    <div class='icon-wrap'>
                        <svg class='svg-icon' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                            <use xlink:href='#piggy-bank-f' />
                            <symbol id='piggy-bank-f' viewBox='0 0 24 24'>
                                <path clip-rule='evenodd' d='M12.0135 1C9.30088 1 7.10183 3.19905 7.10183 5.91171C7.10183 6.83267 7.3553 7.69443 7.79628 8.43103C5.55306 9.4109 3.95023 11.5837 3.7896 14.1476H2V15.9337H3.91462C4.26878 17.6501 5.27957 19.1265 6.67276 20.0888L5.02451 21.7371L6.28746 23L8.3573 20.9302C9.023 21.1518 9.73515 21.2719 10.4753 21.2719H15.7789L17.3705 22.8635L18.6334 21.6006L17.2935 20.2606L21.6429 15.9112L21.6429 13.2243H19.7091C19.5089 12.122 19.0149 11.1221 18.311 10.3087L20.7459 7.87386H16.5177C16.7798 7.27288 16.9252 6.60927 16.9252 5.91171C16.9252 3.19905 14.7262 1 12.0135 1ZM8.88791 5.91171C8.88791 4.18547 10.2873 2.78608 12.0135 2.78608C13.7398 2.78608 15.1392 4.18547 15.1392 5.91171C15.1392 7.63795 13.7398 9.03734 12.0135 9.03734C10.2873 9.03734 8.88791 7.63795 8.88791 5.91171ZM10.674 5.91171L12.0135 4.57215L13.3531 5.91171L12.0135 7.25127L10.674 5.91171ZM9.7484 13.2344H14.2787V11.4484H9.7484V13.2344Z' fill='currentColor' fill-rule='evenodd' />
                            </symbol>
                        </svg>
                    </div>
                </template>
            </van-cell>
            <van-cell class='cellItem' is-link :title='$t("route.quote")' @click="routerTo('quote')">
                <template #icon>
                    <div class='icon-wrap'>
                        <svg class='svg-icon' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                            <use xlink:href='#icon-h-market' />
                            <symbol id='icon-h-market' viewBox='0 0 24 24'>
                                <path clip-rule='evenodd' d='M9.5 4H14.5V19H9.5V4ZM3 11H7.5V19H3V11ZM21 9H16.5V19H21V9Z' fill='currentColor' fill-rule='evenodd' />
                            </symbol>
                        </svg>
                    </div>
                </template>
            </van-cell>
            <van-cell class='cellItem' is-link :title='$t("vitaHome.trade")' @click="routerTo('order')">
                <template #icon>
                    <div class='icon-wrap'>
                        <svg class='svg-icon' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                            <use xlink:href='#trade-f' />
                            <symbol id='trade-f' viewBox='0 0 24 24'>
                                <path clip-rule='evenodd' d='M15.0002 3.5C12.471 3.5 10.3406 5.20717 9.6983 7.53206C13.2833 7.86295 16.1373 10.7169 16.4682 14.3019C18.7931 13.6597 20.5002 11.5292 20.5002 9C20.5002 5.96243 18.0378 3.5 15.0002 3.5ZM14.5 15C14.5 11.9624 12.0376 9.5 9 9.5C5.96243 9.5 3.5 11.9624 3.5 15C3.5 18.0376 5.96243 20.5 9 20.5C12.0376 20.5 14.5 18.0376 14.5 15ZM6.5 15L9 17.5L11.5 15L9 12.5L6.5 15Z' fill='currentColor' fill-rule='evenodd' />
                            </symbol>
                        </svg>
                    </div>
                </template>
            </van-cell>
            <van-cell class='cellItem' is-link :title='$t("route.assets")' @click="routerTo('assets')">
                <template #icon>
                    <div class='icon-wrap'>
                        <svg class='svg-icon' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                            <use xlink:href='#earn-s24' />
                            <symbol id='earn-s24' viewBox='0 0 24 24'>
                                <path d='M11.3363 8.57657C10.5672 8.72738 10.2354 9.13457 10.2354 9.72274C10.2354 10.2958 10.5672 10.5974 11.3363 10.8086V8.57657Z' fill='currentColor' /><path d='M12.6785 15.3933C13.3873 15.1972 13.7191 14.7297 13.7191 14.1566C13.7191 13.7193 13.5382 13.2668 12.6785 13.0104V15.3933Z' fill='currentColor' /><path clip-rule='evenodd' d='M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12.8595 17.0522V18.5H11.1402V17.1125C9.61705 16.9768 8.60661 16.3585 7.85255 15.529L9.20985 14.2923C9.78294 14.8956 10.4918 15.3028 11.3363 15.4234V12.7088C9.07412 12.2413 8.15417 11.2459 8.15417 9.78306C8.15417 8.19954 9.19477 7.14385 11.1402 6.91763V5.5H12.8595V6.91763C14.066 7.05336 14.9558 7.52088 15.6194 8.27494L14.247 9.5116C13.885 9.10441 13.4024 8.77262 12.6785 8.60673V11.1102C14.7899 11.5928 15.8003 12.4524 15.8003 13.9907C15.8003 15.4687 14.8653 16.7204 12.8595 17.0522Z' fill='currentColor' fill-rule='evenodd' />
                            </symbol>
                        </svg>
                    </div>
                </template>
            </van-cell>
        </van-cell-group>
    </van-popup>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { changeLang } from '@/api/base'
import i18n, { loadLocaleMessages } from '@/themeCommon/i18n/i18n.js'
import { setCookie, getCookie, isEmpty, localGet, localSet, getDevice } from '@/utils/util'
import Colors, { setRootVariable } from '@plans/colorVariables'
import minePerson from '@plans/modules/minePerson/minePerson.vue'

const store = useStore()
const router = useRouter()
const route = useRoute()

const downloadVis = ref(true)
const menuVis = ref(false)
const menuListData = ref([])
const minePersonData = ref([])

const customerInfo = computed(() => store.state._user.customerInfo)

const routerTo = path => {
    router.push(path)
    menuVis.value = false
}

const download = () => {
    const device = getDevice()
    if (device === 2) {
        window.open('https://play.google.com/store/apps/details?id=uni.UNI8B7D0E0')
    } else if (device === 3) {
        // 苹果端
        window.open('https://starapp016.com:1888/i7qq.app')
    }
}

watch(() => route.path, val => {
    downloadVis.value = val === '/home'
})

store.dispatch('_base/getPageConfig', 'Mine').then(res => {
    menuListData.value = res.find(el => el.tag === 'menulist')?.data
    minePersonData.value = res.find(el => el.tag === 'minePerson')?.data
})
</script>

<style lang="scss" scoped>
.download-app {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: rem(26px) 0;
    background: rgba(18, 22, 28, 0.9);
    .brand {
        .logo {
            display: inline-block;
            width: 34px;
            height: 34px;
            margin-right: 12px;
            margin-left: 16px;
            vertical-align: middle;
        }
        .text {
            display: inline-block;
            color: #FFF;
            vertical-align: middle;
        }
    }
    .icons {
        .dowonload {
            display: inline-block;
            width: 36px;
            height: 36px;
            margin-top: -2px;
            margin-right: 12px;
            margin-left: 12px;
            padding: 8px rem(10px);
            text-align: center;
            background-color: #F0B90B;
            border-radius: 50%;
            .dowonload-img {
                width: 20px;
                height: 20px;
            }
        }
        .close {
            margin-right: rem(30px);
            vertical-align: rem(10px);
        }
    }
}
.nav-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--contentColor);
    .logo {
        display: inline-block;
        display: flex;
        align-items: center;
        height: 64px;
        padding-left: rem(30px);
        img {
            height: rem(48px);
        }
    }
    .right {
        >div {
            display: inline-block;
            margin-right: rem(30px);
        }
        .icon-svg {
            width: rem(40px);
            height: rem(40px);
        }
    }
}
.menu-wrap {
    .menu-list {
        padding: rem(30px) rem(30px) rem(30px) rem(30px);
        font-size: rem(28px);
        .reg-btn {
            display: inline-block;
            width: 100%;
            height: rem(96px);
            margin-left: 0;
            color: rgb(24, 26, 32);
            font-size: 16px;
            line-height: rem(96px);
            text-align: center;
            background-color: #FCD535;
            border-radius: rem(10px);
        }
        .btn {
            display: inline-block;
            width: 100%;
            margin-bottom: rem(30px);
            color: rgb(30, 35, 41);
            font-size: 14px;
            text-align: center;
        }
    }
    .cellGroup {
        .cellItem {
            //background: none;
            display: flex;
            align-items: center;
            height: rem(120px);
            font-size: rem(32px);
            line-height: rem(120px);
            background: var(--contentColor);
            //border-top: solid rem(10px) var(--bgColor);
            //margin-top: rem(10px);
            &::after {
                border: none;
            }
            :deep(.van-cell__title) {
                color: var(--color);
            }
            .lang-icon {
                width: rem(56px);
                margin-right: rem(20px);
            }
            .right-arrow {
                margin-top: -2px;
                color: var(--minorColor);
            }
            .updown-icon {
                width: rem(40px);
                margin-right: rem(20px);
            }
            .icon-wrap {
                display: flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                width: 24px;
                min-width: 0;
                height: 24px;
                margin-right: rem(10px);
                color: rgb(112, 122, 138);
                -webkit-box-align: center;
                -webkit-box-pack: center;
                .svg-icon {
                    box-sizing: border-box;
                    width: 24px;
                    min-width: 0;
                    height: 24px;
                    margin: 0;
                    color: currentColor;
                    font-size: 24px;
                    fill: #1E2329;
                    fill: currentColor;
                }
            }
        }
    }
}
.lang-popup {
    .popup-wrap {
        display: flex;
        flex-wrap: wrap;
        padding: 0 0 0 rem(25px);
        .lang-item {
            box-sizing: content-box;
            margin-right: rem(20px);
            margin-bottom: rem(42px);
            padding: rem(8px) rem(8px) rem(2px) rem(8px);
            border: rem(4px) solid transparent;
            .lang-icon {
                width: rem(120px);
                height: rem(120px);
            }
            &.active {
                border: rem(4px) solid var(--primary);
                border-radius: 50%;
            }
        }
    }
}
.custom-popup {
    --van-cell-group-inset-padding: 0;
    --van-cell-group-background-color: var(--bgColor);
    --van-cell-group-inset-border-radius: 0;
    .popup-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: rem(20px);
        padding: 0 rem(30px);
        line-height: rem(130px);
        background: var(--contentColor);
        border-radius: rem(10px);
        &:last-child {
            margin-bottom: 0;
        }
        .left {
            .label {
                font-size: rem(32px);
                vertical-align: middle;
            }
            .color-icon {
                width: rem(40px);
            }
            .icon {
                margin-left: -3px;
                font-size: rem(50px);
                vertical-align: middle;
            }
            .color-red {
                color: #B72122;
            }
            .color-green {
                color: #2B70AE;
            }
        }
        .van-radio {
            .van-radio__icon--checked {
                .van-icon {
                    line-height: normal;
                }
            }
        }
        &::after {
            border-bottom: none;
        }
    }
}

</style>
