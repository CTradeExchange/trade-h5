<template>
    <div class='header-nav'>
        <!--mobileNavBar-->
        <div class='nav'>
            <input
                id='nav-check'
                type='checkbox'
            />
            <div class='nav-header'>
                <div class='nav-title'>
                    <router-link
                        class='logoButton'
                        to='/home'
                    >
                        <img
                            alt=''
                            class='logo'
                            height='50'
                            :src='logoUrl'
                        />
                    </router-link>
                </div>
            </div>
            <div
                v-if="userAccountType === 'G'"
                class='handle-not'
            ></div>
            <div
                v-else-if='customerInfo'
                class='handle-have'
            >
                <div class='user' @click="$router.push('/mine')">
                    <i class='head'>
                    </i>
                    <span class='no'>
                        {{ customerInfo.customerNo }}
                    </span>
                </div>
            </div>
            <div class='nav-btn' @click='checkboxOpenClose'>
                <label for='nav-check'>
                    <span></span>
                    <span></span>
                    <span></span>
                </label>
            </div>
            <div class='nav-links'>
                <div
                    v-if="userAccountType === 'G'"
                    class='handle-not'
                >
                    <router-link
                        class='register'
                        to='/register'
                    >
                        {{ $t('register.registerBtn') }}
                    </router-link>
                    <router-link
                        class='login'
                        to='/login'
                    >
                        {{ $t('login.loginBtn') }}
                    </router-link><br />
                </div>
                <div
                    v-else-if='customerInfo'
                    class='handle-have'
                >
                    <router-link
                        class='login'
                        to='/myassets'
                    >
                        <p>Assets</p>
                    </router-link>
                </div>
                <div id='nav-links' class='demo-collapse'>
                    <el-collapse
                        accordion
                    >
                        <el-collapse-item name='1'>
                            <template #title>
                                {{ $t('informationTable.row1') }}
                            </template>
                            <router-link to='/myorder?symbolId=99&tradeType=2'>
                                <div class='mobileNavBarItem'>
                                    {{ $t('informationTable.row12') }}
                                </div>
                            </router-link>
                            <router-link to='/myorder?symbolId=131&tradeType=2'>
                                <div class='mobileNavBarItem'>
                                    {{ $t('informationTable.row13') }}
                                </div>
                            </router-link>
                            <router-link to='/myorder?symbolId=147&tradeType=2'>
                                <div class='mobileNavBarItem'>
                                    {{ $t('informationTable.row14') }}
                                </div>
                            </router-link>
                        </el-collapse-item>
                        <el-collapse-item
                            name='2'
                        >
                            <template #title>
                                {{ $t('informationTable.row2') }}
                            </template>
                            <div class='mobileNavBarItem' @click='jumpdownload(9)'>
                                {{ $t('informationTable.row21') }}
                            </div>
                            <router-link to='/order?name=COPPER&symbolId=1459&tradeType=2'>
                                <div class='mobileNavBarItem'>
                                    {{ $t('informationTable.row22') }}
                                </div>
                            </router-link>
                            <div class='mobileNavBarItem' @click='linkThirdPartyLogin'>
                                {{ $t('informationTable.row23') }}
                            </div>
                        </el-collapse-item>
                        <el-collapse-item
                            name='3'
                        >
                            <template #title>
                                {{ $t('informationTable.row3') }}
                            </template>
                            <div class='mobileNavBarItem' @click="$router.push('/aboutus')">
                                {{ $t('informationTable.row31') }}
                            </div>
                        </el-collapse-item>
                        <el-divider style='margin-left:15px;width: 93%;' />
                        <el-collapse-item
                            name='5'
                            style='margin-bottom: 10px;'
                        >
                            <template #title>
                                <img
                                    alt=''
                                    src='../../../../themes/plans_PCUI/images/craigIndexImg/world-wide-web.png'
                                />{{ $t('navbarLanguage.Language') }}<p>{{ $t('navbarLanguage.navLanguage') }}</p>
                            </template>
                            <div class='mobileNavBarItem'>
                                <Language />
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </div>
        </div>
        <div style='text-align: -webkit-center'>
            <div class='navbar-w'>
                <div class='nav-left'>
                    <router-link to='/home'>
                        <img
                            alt=''
                            class='logo'
                            height='30'
                            :src='logoUrl'
                        />
                    </router-link>
                </div>
                <div class='nav-right'>
                    <!-- 未登录 -->
                    <div
                        v-if="userAccountType === 'G'"
                        class='handle-not'
                    >
                        <div class='item'>
                            <LangIcon />
                        </div>
                        <router-link
                            class='login'
                            to='/login'
                        >
                            <span>{{ $t('login.loginBtn') }}</span>
                        </router-link>
                        <router-link
                            class='register'
                            to='/register'
                        >
                            {{ $t('register.registerBtn') }}
                        </router-link>
                    </div>
                    <!-- 已登录 -->
                    <div
                        v-else-if='customerInfo'
                        class='handle-have'
                    >
                        <div class='lang-have'>
                            <LangIcon />
                        </div>
                        <div class='item'>
                            <el-popover
                                v-model:visible='popoverRef'
                                placement='bottom'
                                trigger='hover'
                                :width='250'
                            >
                                <template #reference>
                                    <div class='user'>
                                        <img height='40' :src='newUserInfo?.HeadImg || headerImg' width='40' />
                                        <span ref='customerEmailSpan' class='no'>
                                            {{ customerInfo.email || customerInfo.phone || '--' }}
                                        </span>
                                    </div>
                                </template>
                                <div class='settingDrapdown'>
                                    <ul v-if='isRealTran' class='list'>
                                        <li
                                            class='item itemHide'
                                            @click="handRoutTo('/personalInformation')"
                                        >
                                            {{ $t('cRoute.personal') }}
                                        </li>
                                        <!-- <li

                                        class='item itemHide'
                                        @click="$router.push('/myRace')"
                                    >
                                        {{ $t('competition.myRace') }}
                                    </li> -->
                                        <li
                                            v-if='Number(customerInfo.openAccountType) === 1'
                                            class='item itemHide'
                                            @click="$router.push('/businessKYC')"
                                        >
                                            {{ $t('businessKYC.enterpriseKYC') }}
                                        </li>
                                        <li
                                            v-if='Number(customerInfo.openAccountType) === 0'
                                            class='item itemHide'
                                            @click="handRoutTo('/authentication')"
                                        >
                                            {{ $t('cRoute.regKyc') }}
                                        </li>
                                        <li
                                            v-if='customInfo'
                                            class='item itemHide'
                                            @click='handRoutTo("/bindMobile")'
                                        >
                                            {{ customInfo.phone ? $t("setting.replacePhone") : $t('setting.bindPhone') }}
                                        </li>
                                        <!-- <li
                                        v-if='customInfo'
                                        class='item'
                                        @click='handRoutTo("/bindEmail")'
                                    >
                                        {{ customInfo.email ? $t("setting.replaceEmail") : $t('setting.bindEmail') }}
                                    </li> -->
                                        <li
                                            class='item itemHide'
                                            @click="handRoutTo('/googleMFA/status')"
                                        >
                                            {{ $t('mfa.routeTitile') }}
                                        </li>
                                        <li
                                            class='item itemHide'
                                            @click="handRoutTo('/walletAddress')"
                                        >
                                            {{ $t('withdraw.withdrawLink') }}
                                        </li>
                                        <li class='item itemHide' @click="handRoutTo('/bankList')">
                                            {{ $t('cRoute.bankList') }}
                                        </li>
                                        <li
                                            v-if='customInfo'
                                            class='item itemHide'
                                            @click='handRoutTo("/setLoginPwd")'
                                        >
                                            {{ Number(customInfo.loginPassStatus) === 1 ? $t("forgot.setPwd") : $t('login.modifyLoginPwd') }}
                                        </li>
                                        <li
                                            v-if='customInfo'
                                            class='item itemHide'
                                            @click='handRoutTo("/setFundPwd")'
                                        >
                                            {{ Number(customInfo.assertPassStatus) === 1 ? $t("forgot.setFundPwd") : $t('forgot.resetFundPwd') }}
                                        </li>
                                        <li class='item flexBetween'>
                                            <span>{{ $t('setting.chartColor') }}</span>
                                            <van-icon
                                                class='arrowIcon'
                                                name='arrow'
                                            />
                                            <div class='subDrapdown'>
                                                <ul class='list'>
                                                    <li
                                                        v-for='(item, i) in chartColorAction'
                                                        :key='i'
                                                        class='item flexBetween'
                                                        :class='{ active: Number(item.val) === Number(chartColorActive) }'
                                                        @click='changeChartColor(item)'
                                                    >
                                                        <span>{{ item.name }}</span>
                                                        <van-icon
                                                            v-show='Number(item.val) === Number(chartColorActive)'
                                                            name='success'
                                                        />
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li
                                            class='item itemHide'
                                            @click="$router.push('/api')"
                                        >
                                            {{ $t('api.title') }}
                                        </li>
                                        <li
                                            class='item itemHide'
                                            @click='logoutHandler'
                                        >
                                            {{ $t('common.quitLogin') }}
                                        </li>
                                    </ul>
                                    <ul v-else class='list'>
                                        <li
                                            class='item itemHide'
                                            @click='logoutHandler'
                                        >
                                            {{ $t('common.quitLogin') }}
                                        </li>
                                    </ul>
                                </div>
                            </el-popover>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import WalletList from '@planspc/components/walletList.vue'
import { isEmpty, localGet, localSet, isDemoAccount, getCookie } from '@/utils/util'
import { ArrowDown } from '@element-plus/icons-vue'
import { computed, reactive, toRefs, onMounted, Mounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import ThemeIcon from '../../../../themes/plans_PCUI/layout/components/themeIcon'
import LangIcon from './langIcon.vue'
import Language from '../../../../themes/plans_PCUI/layout/components/language(web).vue'
import Msg from '../../../../themes/plans_PCUI/layout/components/msg'
import DownloadIcon from '../../../../themes/plans_PCUI/layout/components/downloadIcon'
import { colors, setRootVariable } from '@planspc/colorVariables'
import { MsgSocket } from '@/plugins/socket/socket'
import useMethods from '@planspc/hooks/useMethods'
import { getNoticeList } from '@/api/user'
import msgIcon from '../../../../themes/plans_PCUI/images/topNav/top-msg.png'
import authIcon from '../../../../themes/plans_PCUI/images/topNav/top-auth.png'
import safeIcon from '../../../../themes/plans_PCUI/images/topNav/top-safe.png'
import settingIcon from '../../../../themes/plans_PCUI/images/topNav/top-setting.png'
import serviceIcon from '../../../../themes/plans_PCUI/images/topNav/top-service.png'
import logoutIcon from '../../../../themes/plans_PCUI/images/topNav/top-logout.png'
import bellIcon from '../../../../themes/plans_PCUI/images/topNav/bell.png'
import headerImg from '../../../../themes/plans_PCUI/images/topNav/top-avatar.png'

const logoImg = require('@planspc/images/craigIndexImg/headline_horizontal_logo.png')

export default {
    components: {
        ThemeIcon,
        LangIcon,
        Msg,
        DownloadIcon,
        ArrowDown,
        Language,
        WalletList
    },
    mounted () {
        window.dataLayer = window.dataLayer || []
        dataLayer.push({
            'event': 'detect_user',
            'customer_Email': this.customerInfo.email,
            'account_Number': this.customerInfo.customerNo,
            'account_Phone': this.customInfo.phone
        })

        // add data-dlp attribute to span tag
        if (this.$refs.customerEmailSpan) {
            this.$refs.customerEmailSpan.setAttribute('data-dlp', JSON.stringify({
                'customer_Email': this.customerInfo.email,
                'account_Number': this.customerInfo.customerNo,
                'account_Phone': this.customerInfo.phone
            }))
        }
    },
    setup () {
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const { toOrderPriority } = useMethods()
        const businessConfig = computed(() => store.state.businessConfig)
        const state = reactive({
            chartColorActive: JSON.parse(localGet('CHART_CONFIG'))?.chartColorType || 1,
            unReadNoticesNumber: 0,
            popoverRef: false
        })

        const newUserInfo = computed(() => store.state._user.newUserInfo || {})

        const topNavs = [
            {
                title: t('cRoute.msg'),
                icon: msgIcon,
                click: () => handRoutTo('/message'),
                rightIcon: true,
                show: true
            },
            {
                title: t('cRoute.regKyc'),
                icon: authIcon,
                click: () => handRoutTo('/Authentication'),
                rightIcon: true,
                show: true
            },
            {
                title: t('cRoute.securitySetting'),
                icon: safeIcon,
                click: () => handRoutTo('/SecuritySetting'),
                rightIcon: true,
                show: true
            },
            {
                title: t('cRoute.commonSetting'),
                icon: settingIcon,
                click: () => handRoutTo('/CommonSetting'),
                rightIcon: true,
                show: true
            },
            {
                title: t('cRoute.customerService'),
                icon: serviceIcon,
                click: () => window.open(store.state._base.wpCompanyInfo?.onlineService),
                rightIcon: true,
                show: !!store.state._base.wpCompanyInfo?.onlineService
            },
            {
                title: t('common.quitLogin'),
                icon: logoutIcon,
                click: () => logoutHandler(),
                rightIcon: false
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

        const formatTime = (val) => {
            return window.dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }

        // 玩法列表
        // const isWallet = store.state._base.wpCompanyInfo.isWallet
        // const plansList = computed(() =>
        //     store.state._base.plans.filter(e => !(e.tradeType === '5' && isWallet))
        //         .map(el => {
        //             el.name = t('Crypto')
        //             return el
        //         })
        // )
        const plansList = computed(() => {
            const userProductCategory = store.getters.userProductCategory
            const resultPlans = store.state._base.plans.filter(e => {
                return userProductCategory[e.tradeType]?.find(o => o.listByUser?.length)
            })
                .map(el => {
                    el.name = t('Crypto.' + el.tradeType)
                    return el
                })
            return resultPlans
        })

        const userAccountType = computed(() => store.getters['_user/userAccountType'])
        const customerInfo = computed(() => store.state._user.customerInfo)

        const changePlans = (item) => {
            // 跳转到下单页面并优先显示指定产品
            toOrderPriority(item.tradeType)
        }

        // 设置涨跌颜色
        const changeChartColor = item => {
            const locChartConfig = JSON.parse(localGet('CHART_CONFIG'))
            if (isEmpty(locChartConfig)) {
                localSet('CHART_CONFIG', JSON.stringify({
                    'chartColorType': item.val
                }))
            } else {
                locChartConfig['chartColorType'] = item.val
                localSet('CHART_CONFIG', JSON.stringify(locChartConfig))
            }

            state.chartColorActive = item.val

            const { riseColor, fallColor } = colors.common
            if (parseInt(item.val) === 1) {
                document.body.style.setProperty('--riseColor', riseColor)
                document.body.style.setProperty('--fallColor', fallColor)
            } else {
                document.body.style.setProperty('--riseColor', fallColor)
                document.body.style.setProperty('--fallColor', riseColor)
            }
            setRootVariable()
            const event = new CustomEvent('Launch_chartColor', { detail: item.val })
            document.body.dispatchEvent(event)
        }
        // 退出登录
        const logoutHandler = () => {
            MsgSocket.logout()
            MsgSocket.ws && MsgSocket.ws.close()
            Promise.resolve().then(() => {
                return store.dispatch('_user/logout')
            }).then(() => {
                return router.push({ name: 'Login' })
            }).then(() => {
                location.reload()
            })
        }

        // 路由跳转
        const handRoutTo = (path) => {
            if (route.path.includes(path)) return
            state.popoverRef = false
            router.push(route.path + path)
        }

        const goNoticeDetail = (id) => {
            router.push({
                path: '/noticeDetail',
                query: {
                    id: id,
                    type: 'notice'
                }
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
                case 9 :
                    window.open('https://t.me/MC900bot')
                    break
                case 10 :
                    window.open('https://apps.apple.com/hk/app/mc900-trade-btc-100-forex-gold/id1639509598')
                    break
                case 11 :
                    window.open('https://play.google.com/store/apps/details?id=com.mc900.mc900&pli=1')
                    break
            }
        }

        const getHomeNoticeList = () => {
            const { companyId, customerNo } = customInfo.value || {}
            const params = { current: state.currentNt, lang: getCookie('lang') || 'en-US' }
            if (companyId) {
                params.companyId = companyId
            }
            if (customerNo) {
                params.customerNo = customerNo
            }

            getNoticeList(params)
                .then((res) => {
                    if (res.check()) {
                        let list = []
                        if (res.data.records && res.data.records.length > 0) {
                            list = res.data.records
                            state.unReadNoticesNumber = list.filter(i => !i.readStatus).length
                        }
                    }
                })
                .catch((err) => {})
        }

        onMounted(() => {
            getHomeNoticeList()
        })

        const accountIds = computed(() => {
            if (!customInfo.value) return ''
            const arr = customInfo.value.accountList
            const { assetsId } = arr.find(i => i.currency === 'USDT') || {}
            return assetsId || ''
        })

        const handleAssets = (type) => {
            if (!customInfo.value) {
                router.push('/login')
            } else {
                const flag = type ? '&t=1' : ''
                router.push('/assets/recharge')
            }
        }

        return {
            bellIcon,
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
            newUserInfo
        }
    }
}
</script>

<style lang="scss" scoped>
.nav {
    display: none;
}
.mobileApp:hover{
    cursor: pointer;
    color: #0062FF;
}
.el-menu-vertical-demo:not(.el-menu--collapse){
    height: 100vh;
    width: 65px;
}

.el-menu{
    border-right: unset;
}

.el-menu-item{
    height: 100px;
    justify-content: center;
    align-content: unset !important;
    text-align: center;
    align-items: flex-start;
    img{
        width: 80%;
    }
}

.header-nav {
    z-index: 999 !important;
    position: sticky !important;
    display: flex;
    flex-direction: column;
    background-color:#fff;
    top: 0;
    justify-content: center;

    &.Home {
        width: 100%;
    }
    .navbar-w{
        display: flex;
        height: 83px;
        justify-content: space-between;
        align-items: center;
        position: relative;
        -webkit-box-pack:justify;
        border-bottom:1px solid var(--lineColor);
        max-width: 1350px;
    }

    .nav-left {
        display: flex;
        align-items: center;
        height: 100%;

        .logoButton {
            text-align: left;

        }

        .logo {
            width: 226px;
            height: auto;
            padding-top: 5px;
        }

        .menus {
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: right;
            .item {
                position: relative;
                margin-right: 40px;
                cursor: pointer;

                &:last-of-type {
                    margin-right: 0;
                }

                .link {
                    color: #787E95;
                    font-size: 16px;
                    cursor: pointer;
                    line-height: normal;
                    vertical-align: text-bottom;
                }

                &:hover .el-icon--right {
                    transform: rotate(180deg);
                }

                &:hover .link {
                    color: #0062FF;
                    text-decoration: underline;
                }
            }

            .active {
                .link {
                    color: var(--primary);
                }
            }

            .symbolUp {
                display: inline-block;
                width: 14px;
                height: 14px;
                margin-top: -2px;
                margin-left: 4px;
                vertical-align: middle;
                background: url('/images/arrowUp.png') no-repeat;
                background-size: cover;
            }
    }
}
.nav-wallet {
    display: flex;
    align-items: center;
    user-select: none;
    .wallet-btn {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: var(--primary);
        border: 1px solid var(--primary);
        border-radius: 6px;
        height: 38px;
        padding: 0 12px;
        margin-left: 12px;
        cursor: pointer;
    }
}

.nav-right {
    display: flex;
    justify-content: right;
    .notice-number{
        margin-right: 40px;
        cursor: pointer;
    }
    .bell-icon{
        position: relative;
        width: 20px;
        height: 25px;
        margin-right: 50px;
        cursor: pointer;
        img{
            width: 100%;
        }
        span{
            position: absolute;
            border:1px solid var(--contentColor);
            height: 18px;
            border-radius: 18px;
            background: #ec1c24;
            font-size: 12px;
            line-height: 16px;
            color:var(--contentColor);
            padding:0 3.5px;
            top:-3px;
            left:11px;
        }
    }
    .item {
        text-align: right;
        display: flex;
        padding-right: 36px;
        align-content: center;
        align-items: center;
        @include ellipsis;
    }

    .handle-not {
        display: flex;
        align-items: center;
        font-size: 14px;
        white-space: normal;

        .login {
            margin-right: 10px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: var(--contentColor);
            min-width: 80px;
            height: 37px;
            width: auto;
            padding: 0 10px;
            border-radius: 6px;
            background: #231815;
        }

        .register {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: var(--contentColor);
            width: 80px;
            height: 37px;
            background: #C80F0F;;
            border-radius: 6px;
        }
    }

    .handle-have {
        display: flex;
        align-items: center;
        height: 100%;
        position: relative;

        .lang-have {
            position: relative;
            margin-right: 30px;
            cursor: pointer;
            text-align: end !important;
            display: flex;
        }

        .item {
            text-align: unset;
            white-space: nowrap;
            @include ellipsis;
            .avatar{
                cursor: pointer;
            }
            &:nth-last-child(2) {
                margin-right: 0;
            }

            .link {
                color: #787E95;
                font-size: 16px;
                cursor: pointer;

                &:hover {
                    color: var(--primary);
                }
            }

            .user {
                display: inline-flex;
                align-items: center;
                color:var(--mainColor);
                cursor: pointer;
                padding-top: 2px;
                img {
                    border-radius: 40px;
                    object-fit: cover;
                }
                .head {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 28px;
                    height: 28px;
                    margin-right: 8px;
                    overflow: hidden;
                    background: url('/images/arrowUp.png') center center no-repeat;
                    border-radius: 50%;

                    i {
                        margin-top: 10px;
                        color: #FFF;
                        font-size: 24px;
                        @include hover1();
                    }
                }
                .no {
                    font-size: 16px;
                    line-height: 1.2;
                    margin-left: 8px;
                }
            }

            .icon {
                color: #D6DAE1;
                font-size: 16px;
                cursor: pointer;
            }
        }

    .line {
        width: 1px;
        height: 18px;
        margin: 0 10px;
        background: #787E95;
    }
}

.handle-feature {
    display: flex;
    align-items: center;
    height: 100%;

    .item {
        line-height: 1;

        &:last-of-type {
            margin-right: 0;
        }

        .icon {
            color: #D6DAE1;
            font-size: 16px;
            cursor: pointer;
        }

        &:deep(.icon_yuyan) {
            display: inline-flex;
        }
    }
}
}
}

.information_box {
    width: 400px;
    height: 600px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    .information_head {
        width: 100%;
        height: 48px;
        text-align: center;
        background-color: #FFF;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);

        .current_type {
            font-size: 16px;
            line-height: 48px;
            cursor: pointer;

            i {
                margin-left: 4px;
                color: #DCDFE6;
                cursor: pointer;
            }
    }
}

.type_list {
ul {
    width: 100%;

    li {
        width: 100%;
        height: 40px;
        font-size: 14px;
        line-height: 44px;
        text-align: center;
        background-color: #FFF;
        cursor: pointer;
    }
}

.activeLi {
    color: #EE0A24;
}
}

.msg-list {
flex: 1;
height: 552px;
overflow: auto;
background-color: var(--bgColor);

.msg-item {
    margin: 7px;
    padding: 10px;
    background-color: var(--contentColor);
    border-top: solid 10px var(--bgColor);

    .msg-title {
        color: var(--color);
        font-weight: bold;
        font-size: 14px;
        line-height: 30px;
    }

    .msg-content {
        color: var(--color);
        font-weight: 500;
        font-size: 12px;
        line-height: 20px;
    }

    .msg-time {
        color: var(--minorColor);
        font-weight: 400;
        font-size: 12px;
        line-height: 30px;
    }
}
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

@media (max-width:1250px) {
.nav-right {

a.login {
    width: auto !important;
    min-width: 80px !important;
    padding: 0 10px;
}

a.register {
    width: auto !important;
    min-width: 80px !important;
    padding: 0 10px;
}
}
.logo{
    padding-left: 14px !important;
}
}
@media (max-width:1380px) {
  .navbar-w{
    padding: 0 20px !important;
  }
}
@media (max-width:1370px) {
.header-nav {
.nav-right {
    width: unset !important;
}
}
}

@media (max-width:1100px) {
.tac {
  display: none !important;
}
}
.dropdown-item{
    width:257px;
    display: flex;
    align-items: center;
    height: 40px;
    padding-left: 7px;
    font-size: 14px;

    .dropdown-item-right{
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex:1;
        height: 40px;
        border-top:1px solid var(--lineColor);
        padding: 0 10px 0 3px;
        &.first{
            border-top:none
        }
    }
}
.customerInfo{
    font-size: 16px;
    color:var(mainColor);
    padding-left:10px;
}
:deep{
    .el-dropdown-menu__item{
        padding:0;
        height: 40px;
    }
}
@media (max-width:768px) {
  .navbar-w{
    .nav-right {
      .handle-not {
        .item {
          padding: unset !important;
        }

          .login {
            display: none;
          }

          .register {
            display: none;
          }
      }
      .handle-have {
        display: flex;
        align-items: center;
        height: 100%;
        position: relative;

        .lang-have {
            margin-right: unset !important;
        }

        .item {
            text-align: unset;
            white-space: nowrap;
            @include ellipsis;
            .avatar{
                cursor: pointer;
            }
            &:nth-last-child(2) {
                margin-right: 0;
            }

            .user {
              display: none !important;;
            }
        }
     }
    }
  }
  .header-nav{
    .nav-left{
      .logo{
        max-width: 150px;
      }
    }
  }
  .header-nav .nav-right{
    width: 51px !important;
  }
}
</style>
