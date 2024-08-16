<template>
    <div class="nav-box">
        <div :class="['nav-safe-box', $route.name == 'Home' ? '' : 'long-box']">
            <div class="nav-logo">
                <router-link class="link-action" to="/home">
                    <img alt="" class="logo" height="50" :src="logoUrl" />
                </router-link>
            </div>

            <div class="language-box">
                <Language />
            </div>

            <div @click="visitHelpCenter" class="help-center">
                <span>{{ $t('cRoute.helpCenter') }}</span>
            </div>

            <div v-if="$route.name == 'Home'" class="start-trade-box">
                <div class="start-trade-btn" @click="goToTradeHandle">
                    <span>{{ $t('headLineHome.startTrade') }}</span>
                </div>
            </div>

            <div v-else class="nav-menu-box">
                <div class="nav-right">
                    <!-- 未登录 -->
                    <van-button block type="primary" @click="goToLogin" v-if="!customerInfo" size="small" class="mr-5 px-4">
                        {{ `${$t('c.login')} / ${$t('c.register')}` }}
                    </van-button>

                    <!-- 已登录 -->
                    <div v-else-if="customerInfo" class="flex items-center white-sapce-nowrap">
                        <AssetsPopover />
                        <van-button block type="primary" @click="confirmOpenBlockAtm" size="small" class="mr-5 px-4">
                            {{ $t('wallet.desposit') }}
                        </van-button>
                    </div>

                    <div class="custom-menu">
                        <div class="custom-menu-item" v-if="customerInfo">
                            <el-popover
                                ref="customerMenuPopoverRef"
                                :popper-style="{ borderRadius: '8px', padding: 0, border: 'none', width: '320px' }"
                                :show-arrow="false"
                            >
                                <template #reference>
                                    <img src="/images/user/user.svg" class="w-6 h-6" />
                                </template>
                                <template #default>
                                    <div class="w-80 p-6 customer-info-menu">
                                        <div class="flex items-center mb-5">
                                            <img src="/images/user/user.svg" class="w-5 h-5 mr-3" />
                                            <div>
                                                <div class="text-base text-color font-bold mb-1">
                                                    {{
                                                        customerInfo.email ||
                                                        customerInfo.phone ||
                                                        (thirdIntactMsg?.first_name || thirdIntactMsg?.last_name
                                                            ? `${thirdIntactMsg?.first_name || ''} ${thirdIntactMsg?.last_name || ''}`
                                                            : '--')
                                                    }}
                                                </div>
                                                <div class="flex items-center text-sm text-minorColor">
                                                    {{ customerInfo.customerNo || '--' }}
                                                    <img
                                                        src="/images/user/copy.svg"
                                                        class="w-4 h-4 ml-1 cursor-pointer"
                                                        @click="copyCustomerNo"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="line"></div>
                                        <div class="flex items-center text-minorColor text-base mb-5">
                                            <img src="/images/user/security.svg" class="w-5 h-5 mr-3" />
                                            {{ $t('common.security') }}
                                        </div>
                                        <div
                                            class="text-sm font-bold cursor-pointer mb-5 text-color ml-8"
                                            @click="handRoutTo('/setFundPwd')"
                                        >
                                            {{ $t('common.fundPwd') }}
                                        </div>
                                        <div
                                            class="text-sm font-bold cursor-pointer mb-5 text-color ml-8"
                                            @click="handRoutTo('/walletAddress')"
                                        >
                                            {{ $t('withdraw.withdrawLink') }}
                                        </div>
                                        <div class="line"></div>
                                        <div class="flex items-center text-minorColor text-base mb-5">
                                            <img src="/images/user/setting.svg" class="w-5 h-5 mr-3" />
                                            {{ $t('cRoute.setting') }}
                                        </div>
                                        <van-radio-group v-model="chartColorActive" @change="changeChartColor">
                                            <van-radio name="1" shape="square" class="mb-5" icon-size="16px">
                                                <div class="font-bold" :class="chartColorActive === '2' ? 'text-color' : 'text-minorColor'">
                                                    <i class="icon_icon_arrow text-xs mx-3 rotate--180 inline-block" style="color:#5FBA6E"></i>
                                                    <span>{{ $t('common.up') }}</span>
                                                    <i class="icon_icon_arrow text-xs mx-3" style="color:#E32E49"></i>
                                                    <span>{{ $t('common.down') }}</span>
                                                </div>
                                            </van-radio>
                                            <van-radio name="2" shape="square" icon-size="16px">
                                                <div class="font-bold" :class="chartColorActive === '1' ? 'text-color' : 'text-minorColor'">
                                                    <i class="icon_icon_arrow text-xs mx-3 rotate--180 inline-block" style="color:#E32E49"></i>
                                                    <span>{{ $t('common.up') }}</span>
                                                    <i class="icon_icon_arrow text-xs mx-3" style="color:#5FBA6E"></i>
                                                    <span>{{ $t('common.down') }}</span>
                                                </div>
                                            </van-radio>
                                        </van-radio-group>
                                        <div class="line"></div>
                                        <div class="flex items-center text-xs text-color font-bold cursor-pointer" @click="logoutHandler">
                                            <img src="/images/user/logout.svg" class="w-5 h-5 mr-3" />
                                            {{ $t('setting.logout') }}
                                        </div>
                                    </div>
                                </template>
                            </el-popover>
                        </div>

                        <Notice v-if="customerInfo" />

                        <img class="w-9 h-9 ml-4 cursor-pointer" :src="connectIconSvg"  @click="openPasstoAIChat"/>
                    </div>
                </div>
            </div>
        </div>
        <BlockAtmDialog ref="blockAtmDialogRef" />
    </div>
</template>

<script>
import { isEmpty, localGet, localSet, isDemoAccount, removeLoginParams } from '@/utils/util'
import { computed, reactive, toRefs,  watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useClipboard } from '@vueuse/core'
import { toast } from 'vue3-toastify'

import Language from './components/language(web).vue'
import { colors, setRootVariable } from '@planspc/colorVariables'
import { MsgSocket } from '@/plugins/socket/socket'
import useMethods from '@planspc/hooks/useMethods'
import msgIcon from '../images/topNav/top-msg.png'
import authIcon from '../images/topNav/top-auth.png'
import safeIcon from '../images/topNav/top-safe.png'
import settingIcon from '../images/topNav/top-setting.png'
import serviceIcon from '../images/topNav/top-service.png'
import logoutIcon from '../images/topNav/top-logout.png'

import downloadIconSvg from '../images/topNav/download.png'
import connectIconSvg from '../images/topNav/connect.png'

import headerImg from '../images/topNav/top-avatar.png'
import { getAcitiveListByItemID } from '@/api/newApi'
import { firebaseAnalytics } from '@/utils/firebase'
import BlockAtmDialog from '@/components/blockAtmDialog'
import AssetsPopover from './components/assetsPopover'
import Notice from './components/notice'

const logoImg = require('@planspc/images/logo-color.png')

export default {
    components: {
        Language,
        BlockAtmDialog,
        AssetsPopover,
        Notice
    },
    mounted() {
        const dataLayer = window.dataLayer || []
        dataLayer.push({
            event: 'detect_user',
            customer_Email: this.customerInfo.email,
            account_Number: this.customerInfo.customerNo,
            account_Phone: this.customInfo.phone,
        })

        // add data-dlp attribute to span tag
        if (this.$refs.customerEmailSpan) {
            this.$refs.customerEmailSpan.setAttribute(
                'data-dlp',
                JSON.stringify({
                    customer_Email: this.customerInfo.email,
                    account_Number: this.customerInfo.customerNo,
                    account_Phone: this.customerInfo.phone,
                }),
            )
        }
    },
    setup() {
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        const { t, locale } = useI18n({ useScope: 'global' })
        const { rouType } = route.query
        const { toOrderPriority } = useMethods()
        const businessConfig = computed(() => store.state.businessConfig)
        const state = reactive({
            chartColorActive: JSON.parse(localGet('CHART_CONFIG'))?.chartColorType
                ? String(JSON.parse(localGet('CHART_CONFIG'))?.chartColorType)
                : '1',
            unReadNoticesNumber: 0,
            raceInfo: {},
            currency: '',
            showPopover: true,
        })
        const customerMenuPopoverRef = ref()

        const newUserInfo = computed(() => store.state._user.newUserInfo || {})

        const topNavs = [
            {
                title: t('cRoute.msg'),
                icon: msgIcon,
                click: () => handRoutTo('/message'),
                rightIcon: true,
                show: true,
            },
            {
                title: t('cRoute.regKyc'),
                icon: authIcon,
                click: () => handRoutTo('/Authentication'),
                rightIcon: true,
                show: true,
            },
            {
                title: t('cRoute.securitySetting'),
                icon: safeIcon,
                click: () => handRoutTo('/SecuritySetting'),
                rightIcon: true,
                show: true,
            },
            {
                title: t('cRoute.commonSetting'),
                icon: settingIcon,
                click: () => handRoutTo('/CommonSetting'),
                rightIcon: true,
                show: true,
            },
            {
                title: t('cRoute.customerService'),
                icon: serviceIcon,
                click: () => window.open(store.state._base.wpCompanyInfo?.onlineService),
                rightIcon: true,
                show: !!store.state._base.wpCompanyInfo?.onlineService,
            },
            {
                title: t('quitLogin'),
                icon: logoutIcon,
                click: () => logoutHandler(),
                rightIcon: false,
            },
        ]
        const chartColorAction = [
            { val: '1', name: t('common.redDown') },
            { val: '2', name: t('common.redUp') },
        ]

        const plansName = computed(() => {
            if (route.query.tradeType) {
                const tradeType = route.query.tradeType
                return t('tradeType[' + tradeType + ']')
            } else {
                return t('header.trade')
            }
        })
        // 获取玩法列表
        const plans = computed(() => store.state._base.plans)
        // 是否模拟账户
        const isDemo = computed(() => {
            return store.state._user.customerInfo?.companyType === 'demo'
        })

        const tradeType = computed(() => (isDemo.value ? plans.value[0].id : 5)) // 和移动端一样写死玩法5

        const logoUrl = computed(() => {
            // return store.state.businessConfig?.pcuiLogo || logoImg;
            return logoImg
        })
        // 判断是否模拟交易
        const isRealTran = computed(() => !isDemoAccount())

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        // 在线客服地址
        const onlineService = computed(() => store.state._base.wpCompanyInfo?.onlineService)

        const accountList = computed(() =>
            store.state._user.customerInfo.accountList.filter((el) => Number(el.tradeType) === Number(tradeType.value)),
        )

        const formatTime = (val) => {
            return window.dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }

        const plansList = computed(() => {
            const userProductCategory = store.getters.userProductCategory
            const resultPlans = store.state._base.plans
                .filter((e) => {
                    return userProductCategory[e.tradeType]?.find((o) => o.listByUser?.length)
                })
                .map((el) => {
                    el.name = t('Crypto.' + el.tradeType)
                    return el
                })
            return resultPlans
        })

        const userAccountType = computed(() => store.getters['_user/userAccountType'])
        const customerInfo = computed(() => store.state._user.customerInfo)
        const { copy } = useClipboard()
        const copyCustomerNo = () => {
            copy(customerInfo.value.customerNo)
            toast.success(t('common.copySuccess'))
        }
        // 已绑定telegram信息
        const thirdIntactMsg = computed(() => {
            try {
                return JSON.parse(store.state._user.thirdAccountInfo?.thirdIntactMsg)
            } catch (error) {
                return null
            }
        })

        const eventId = computed(() => store.state._base.newsSysConfig.find((item) => item.Key === 'navBarActivityEventID')?.Value)
        const bitcoinId = computed(() => store.state._quote.bitcoinId)
        const blockAtmDialogRef = ref(null)

        const getActiveList = (id) => {
            const body = { ItemID: Number(id) }
            getAcitiveListByItemID({ body }).then((res) => {
                const { Code, Data } = res || {}
                if (Code === 1000 && Data?.length > 0) {
                    state.raceInfo = Data.filter((item) => [10, 20].includes(item.Status))?.[0] || {}
                }
            })
        }

        watch(
            () => eventId.value,
            (value) => {
                if (value) {
                    getActiveList(value)
                }
            },
            { immediate: true },
        )

        const changePlans = (item) => {
            // 跳转到下单页面并优先显示指定产品
            toOrderPriority(item.tradeType)
        }

        // 设置涨跌颜色
        const changeChartColor = (item) => {
            const locChartConfig = JSON.parse(localGet('CHART_CONFIG'))
            if (isEmpty(locChartConfig)) {
                localSet(
                    'CHART_CONFIG',
                    JSON.stringify({
                        chartColorType: item,
                    }),
                )
            } else {
                locChartConfig['chartColorType'] = item
                localSet('CHART_CONFIG', JSON.stringify(locChartConfig))
            }

            state.chartColorActive = item

            const { riseColor, fallColor } = colors.common
            if (parseInt(item) === '1') {
                document.body.style.setProperty('--riseColor', riseColor)
                document.body.style.setProperty('--fallColor', fallColor)
            } else {
                document.body.style.setProperty('--riseColor', fallColor)
                document.body.style.setProperty('--fallColor', riseColor)
            }
            setRootVariable()
            const event = new CustomEvent('Launch_chartColor', { detail: item })
            document.body.dispatchEvent(event)
        }
        // 退出登录
        const logoutHandler = () => {
            MsgSocket.logout()
            MsgSocket.ws && MsgSocket.ws.close()
            removeLoginParams()
            window.location.href = '/login'
            store.dispatch('_user/logout')
        }

        // 路由跳转
        const handRoutTo = (path) => {
            customerMenuPopoverRef.value.hide()
            if (route.path.includes(path)) return
            router.push(route.path + path)
        }

        const goNoticeDetail = (id) => {
            router.push({
                path: '/noticeDetail',
                query: {
                    id: id,
                    type: 'notice',
                },
            })
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
        // checkbox 開關
        const checkboxOpenClose = () => {
            const checkbox = document.querySelector('#nav-check')
            const icon = document.querySelectorAll('.mobileNavBarItem')
            const listener = function (e) {
                if (e.target != checkbox && e.target != icon) {
                    checkbox.checked = false
                    document.removeEventListener('click', listener)
                }
            }
            checkbox.addEventListener('click', function () {
                if (this.checked) {
                    document.addEventListener('click', listener)
                }
            })
        }

        const jumpdownload = (attr) => {
            switch (attr) {
                case 9:
                    window.open('https://t.me/MC900bot')
                    break
                case 10:
                    window.open('https://apps.apple.com/hk/app/mc900-trade-btc-100-forex-gold/id1639509598')
                    break
                case 11:
                    window.open('https://play.google.com/store/apps/details?id=com.mc900.mc900&pli=1')
                    break
            }
        }


        const accountIds = computed(() => {
            if (!customInfo.value) return ''
            const arr = customInfo.value.accountList
            const { assetsId } = arr.find((i) => i.currency === 'USDT') || {}
            return assetsId || ''
        })

        const handleAssets = (type) => {
            if (!customInfo.value) {
                router.push('/login')
            } else {
                const flag = type ? '&t=1' : ''
                router.push(`/assets/recharge`)
            }
        }

        const symbolKey = computed(() => store.state._quote.productActivedID)
        const planMap = computed(() => store.state._quote.planMap) // 每个玩法下配置的产品

        const goToTradeHandle = () => {
            if (bitcoinId.value) {
                const flag = planMap.value[2]?.symbolList.find((item) => item == `${bitcoinId.value}`)
                const [symbolId, tradeType] = symbolKey.value?.split('_') || []
                if (flag) {
                    router.push(`/order?symbolId=${bitcoinId.value}&tradeType=${tradeType}`)
                } else {
                    const href = `/order?symbolId=${symbolId || ''}&tradeType=${tradeType || ''}`
                    router.push(href)
                }
            }
        }

        const confirmOpenBlockAtm = () => {
            window.dataLayer?.push({
                event: 'depositBtn',
                'gtm.elementClasses': 'depositButton',
                eventModel: {
                    account_Number: customerInfo.value?.customerNo,
                },
            })
            firebaseAnalytics('ck_deposit_entrance', {
                key: 'ck_deposit_entrance',
                value: JSON.stringify({
                    email: customerInfo.value?.emailAll || customerInfo.value?.email || '',
                    phone: customerInfo.value?.phoneAll || customerInfo.value?.phone || '',
                    userID: customerInfo.value?.customerNo,
                }),
            })
            const url = route.path + '/' + 'recharge'
            router.push(url)
        }

        const visitHelpCenter = () => {
            window.open(locale.value == 'zh-CN' ? 'https://help.headline.net/zh-cn/' : 'https://help.headline.net/en-us/', '_blank')
        }

        const goToRegister = () => {
            let typeRout
            if (rouType) {
                typeRout = { path: '/register', query: { rouType } }
            } else {
                typeRout = route.path == '/order' ? { path: '/register', query: { rouType: 1 } } : { path: '/register' }
            }

            // console.log('typeRout-==>',typeRout)
            router.push(typeRout)
        }

        const goToLogin = () => {
            let typeRout = rouType ? { path: '/login', query: { rouType } } : { path: '/login' }
            router.push(typeRout)
        }
        return {
            ...toRefs(state),
            downloadIconSvg,
            connectIconSvg,
            headerImg,
            topNavs,
            logoUrl,
            plansList,
            onlineService,
            userAccountType,
            customerInfo,
            handRoutTo,
            customInfo,
            formatTime,
            changePlans,
            plansName,
            ...toRefs(state),
            // 是否显示基金功能
            chartColorAction,
            changeChartColor,
            logoutHandler,
            fundShow: window['fundShow'],
            businessConfig,
            goNoticeDetail,
            linkThirdPartyLogin,
            jumpdownload,
            isRealTran,
            checkboxOpenClose,
            handleAssets,
            newUserInfo,
            goToTradeHandle,
            confirmOpenBlockAtm,
            blockAtmDialogRef,
            visitHelpCenter,
            goToRegister,
            goToLogin,
            thirdIntactMsg,
            copyCustomerNo,
            customerMenuPopoverRef,
        }
    },
}
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    height: 100vh;
    width: 65px;
}

.el-menu {
    border-right: unset;
}

.el-menu-item {
    height: 100px;
    justify-content: center;
    align-content: unset !important;
    text-align: center;
    align-items: flex-start;
    img {
        width: 80%;
    }
}

.settingDrapdown {
    font-size: 14px;
    .itemHide {
        @include ellipsis;
    }
    .item {
        position: relative;
        width: 220px;
        height: 40px;
        padding: 0 0 0 10px;
        color: var(--color);
        line-height: 40px;
        white-space: nowrap;
        text-overflow: ellipsis;
        border-radius: 5px;
        cursor: pointer;
        & > span {
            width: 100%;
            @include ellipsis;
        }

        .arrowIcon {
            display: none;
            float: right;
        }

        &:hover,
        &.active {
            color: var(--primary);

            .arrowIcon,
            .subDrapdown {
                display: block;
            }
        }
    }

    .flexBetween {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .subDrapdown {
        position: absolute;
        top: 0;
        right: 100%;
        display: none;
        width: 110%;
        padding: 8px;
        color: var(--color);
        background: var(--contentColor);
        border-radius: 5px;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    }
}

.nav-box {
    width: 100%;
    z-index: 100 !important;
    position: sticky !important;
    background-color: #fff;
    top: 0;
    background-color: #fff;
    padding: 0 32px;

    .nav-safe-box {
        height: 68px;
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        &.long-box {
            max-width: 100%;
        }
        .nav-logo {
            height: 100%;
            display: flex;
            align-items: center;
            .link-action {
                height: 100%;
                display: flex;
                align-items: center;
                img {
                    max-height: 36px;
                }
            }
        }
        .language-box {
            margin-left: 24px;
            display: flex;
            min-width: 120px;
            align-items: center;
            flex-shrink: 0;
        }
        .help-center {
            margin-left: 24px;
            & > span {
                color: var(--minorColor);
                font-family: 'Inter';
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                cursor: pointer;
            }
        }
        .start-trade-box {
            flex: 1;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .start-trade-btn {
                min-width: 134px;
                height: 40px;
                padding: 6px 16px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
                background: linear-gradient(91deg, #ff2949 0.42%, #e32e49 98.85%);
                color: #fff;
                cursor: pointer;
            }
        }
        .nav-menu-box {
            flex: 1;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;

            .nav-right {
                .line {
                    margin: 20px 0;
                    border-bottom: 1px solid var(--lineColor);
                }
                display: flex;
                justify-content: right;
                align-items: center;
                .notice-number {
                    margin-right: 40px;
                    cursor: pointer;
                }

                .item {
                    text-align: right;
                    display: flex;
                    align-content: center;
                    align-items: center;
                    @include ellipsis;
                }

                .custom-menu {
                    display: flex;
                    align-items: center;
                    position: relative;
                    &:after {
                        content: '';
                        position: absolute;
                        left: 0;
                        width: 1px;
                        height: 20px;
                        background: var(--lineColor);
                    }

                    .custom-menu-item {
                        display: flex;
                        align-items: center;
                        margin-left: 16px;
                        cursor: pointer;
                        .el-dropdown-link {
                            height: 36px;
                        }
                        .connectIcon {
                            width: 36px;
                            height: 36px;
                        }
                        &.bell-icon {
                            position: relative;
                            & > span {
                                position: absolute;
                                width: 4px;
                                height: 4px;
                                border-radius: 2px;
                                background: var(--primary);
                                top: 8px;
                                right: 10px;
                            }
                        }
                    }
                }
            }
        }
    }
}

@media screen and (max-width: 767px) {
    .nav-box {
        display: none;
    }
}
</style>

<style lang="scss">
.customer-info-menu {
    --van-radio-checked-icon-color: var(--color);
    .customer-info {
        padding-bottom: 20px;
        margin-bottom: 20px;
        border-bottom: 1px solid var(--lineColor);
    }
    .line {
        margin: 20px 0;
        border-bottom: 1px solid var(--lineColor);
    }
    .van-badge__wrapper {
        border-radius: 4px;
    }
}
</style>
