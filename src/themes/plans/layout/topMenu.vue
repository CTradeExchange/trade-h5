<template>
    <div class='top-menu'>
        <div class='menu-content'>
            <router-link to='/home'>
                <img alt='' class='logo' src='../../../assets/newPCUI/logo.png' />
            </router-link>

            <div ref='dropdownRef' v-click-outside:[dropdownRef]='handleClickOutside' class='rightBtnGroup' @click='show=!show'>
                <span v-if='unReadNoticesNumber>0'></span>
                <img class='menu-icon' :src='topMenuIcon' />
                <Transition name='fade'>
                    <ul v-if='show' class='dropdown-ul'>
                        <li v-if="userAccountType==='G'">
                            <div class='dropdown-link' @click="onClickNav('/login')">
                                <span>{{ $t('cRoute.login') }}</span>
                                <van-icon color='#777777' name='arrow' :size='14' />
                            </div>
                        </li>
                        <li v-if='customInfo'></li>
                        <li>
                            <div class='dropdown-link' @click="onClickNav('/home')">
                                <span>{{ $t('route.home') }}</span>
                                <van-icon color='#777777' name='arrow' :size='14' />
                            </div>
                        </li>
                        <li>
                            <div class='dropdown-link' @click="onClickNav('/quote')">
                                <span>{{ $t('route.quote') }}</span>
                                <van-icon color='#777777' name='arrow' :size='14' />
                            </div>
                        </li>
                        <li>
                            <div class='dropdown-link' @click='onClickNav(`/order?symbolId=${symbolId}&tradeType=${tradeTypeId}`)'>
                                <span>{{ $t('route.trade') }}</span>
                                <van-icon color='#777777' name='arrow' :size='14' />
                            </div>
                        </li>
                        <li>
                            <div class='dropdown-link' @click="onClickNav('/download')">
                                <span>{{ $t('route.platforms') }}</span>
                                <van-icon color='#777777' name='arrow' :size='14' />
                            </div>
                        </li>
                        <li>
                            <div class='dropdown-link' @click="onClickNav('/deposit')">
                                <span>{{ $t('trade.deposit') }}</span>
                                <van-icon color='#777777' name='arrow' :size='14' />
                            </div>
                        </li>
                        <li>
                            <div class='dropdown-link'>
                                <span>{{ $t('c.onlineService') }}</span>
                                <van-icon color='#777777' name='arrow' :size='14' />
                            </div>
                        </li>
                        <li>
                            <div class='dropdown-link'>
                                <span>{{ $t('cRoute.msg') }}</span>
                                <div v-if='unReadNoticesNumber>0' class='notice-badge'>
                                    <span>{{ unReadNoticesNumber >99?'99+':unReadNoticesNumber }}</span>
                                </div>

                                <van-icon v-else color='#777777' name='arrow' :size='14' />
                            </div>
                        </li>
                        <li>
                            <div class='dropdown-link'>
                                <span>{{ $t('common.lang') }}</span>
                                <van-icon color='#777777' name='arrow' :size='14' />
                            </div>
                        </li>
                        <li v-if='customInfo'>
                            <div class='dropdown-link'>
                                <span>{{ $t('common.quitLogin') }}</span>
                                <van-icon color='#777777' name='arrow' :size='14' />
                            </div>
                        </li>
                    </ul>
                </Transition>
            </div>
        </div>
        <div class='real-height'>
        </div>
    </div>
    <van-popup v-model:show='showLanguage' position='top' :style="{ height: '30%' }" />
</template>

<script>
import { useStore } from 'vuex'
import {
    computed,
    onMounted,
    reactive,
    toRefs,
    ref
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
    getCookie,
    localGet,
    localSet,
    isEmpty,
    isDemoAccount
} from '@/utils/util'
import { getNoticeList } from '@/api/user'
import topMenuIcon from '@plans/images/menu.png'

export default {
    setup () {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })

        const dropdownRef = ref(null)

        // 获取账户信息
        const userAccountType = computed(() => store.getters['_user/userAccountType'])
        const customInfo = computed(() => store.state._user.customerInfo)
        const plans = computed(() => store.state._base.plans)
        const tradeType = computed(
            () => store.state._quote.curTradeType || plans.value[0].id // 默认全仓 plans.value[0].id
        )
        const accountList = computed(() =>
            store.state._user.customerInfo.accountList.filter(
                (el) => Number(el.tradeType) === Number(tradeType.value)
            )
        )

        const isRealTran = computed(() => !isDemoAccount())

        const state = reactive({
            publicShow: false,
            lang: getCookie('lang') || 'zh-CN',
            noticePubTime: getCookie('pubTimeUpdate'),
            currentNt: 1,
            noticeData: [],
            notice: {},
            show: false,
            isShowIcon: false,
            noticeList: [],
            onlineService: computed(
                () => !!store.state._base.wpCompanyInfo?.onlineService
            ),
            unReadNoticesNumber: 0,
            showLanguage: false
        })
        const symbolKey = computed(() => store.state._quote.productActivedID)

        const [symbolId, tradeTypeId] = symbolKey.value.split('_')

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

        const goService = () => {
            router.push({
                name: 'service',
                params: { type: 'page' }
            })
        }

        const goNoticeDetail = (id) => {
            router.push({
                path: '/noticeDetail',
                query: {
                    id: id,
                    type: 'notice',
                    from: 'home'
                }
            })
        }

        const goToPage = () => {
            const { customerNo } = customInfo.value || {}
            if (!customerNo) {
                router.push('/login')
                return
            }
            const { accountId } =
                (accountList.value &&
                    accountList.value.find((e) => e.currency === 'USDT')) ||
                {}
            router.push({
                path: '/deposit'
            })
        }

        const handleClickOutside = () => {
            state.show = false
        }

        const onClickNav = (path, type = 1) => {
            if (type === 1) {
                router.push(path)
            }
        }

        onMounted(() => {
            getHomeNoticeList() // 顶部通知栏
        })

        return {
            symbolId,
            tradeTypeId,
            onClickNav,
            dropdownRef,
            handleClickOutside,
            userAccountType,
            customInfo,
            topMenuIcon,
            isRealTran,
            goToPage,
            goService,
            goNoticeDetail,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@/sass/mixin.scss";
:deep(.van-popup--center) {
    --van-dialog-border-radius: 20px;
    border-radius: rem(20px);
}
.public-pop {
    padding-bottom: rem(20px);
    border-radius: rem(20px);

    --van-dialog-border-radius: 20px;
    .pop-top {
        padding-left: rem(30px);
        font-size: rem(36px);
        line-height: rem(120px);
        text-align: center;
    }
    .van-popup__close-icon {
        top: rem(20px);
        right: rem(20px);
    }
    .pop-content {
        min-height: rem(550px);
        max-height: rem(650px);
        margin-bottom: rem(20px);
        padding: 0 rem(30px) rem(20px) rem(30px);
        overflow: auto;
        background: var(--bgColor);
    }
    .public-list {
        margin: 0;
        .item {
            margin: rem(15px) 0 rem(25px) 0;
            &:hover {
                background-color: var(--contentColor);
            }
            .item-tit {
                margin-bottom: rem(10px);
                color: var(--color);
                font-size: rem(28px);
            }
            .item-time {
                color: var(--minorColor);
                font-size: rem(24px);
            }
        }
    }
}
.top-menu {
    position: relative;
    background: var(--contentColor);
    height: rem(110px);
    width: 100%;
    .real-height{
        height: rem(110px);
    }
    & > .menu-content {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        z-index:1;
        display: flex;
        align-items: center;
        padding: 0 rem(40px);
        box-sizing: border-box;
        background: var(--contentColor);
        justify-content: space-between;
        height: rem(110px);
        .logo{
            width: rem(316px);
            height: rem(56px);
        }
        .rightBtnGroup {
            position: relative;
            .menu-icon {
                width: rem(40px);
                height: rem(48px);
            }
            &>span{
                position: absolute;
                width:rem(20px);
                height: rem(20px);
                border-radius: 50%;
                background: var(--primary);
                border:rem(2px) solid var(--contentColor);
                right:rem(-10px);
                top:0;
            }
            .dropdown-ul{
                z-index: 999999;
                position: absolute;
                right:0;
                width:rem(400px);
                box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
                background: var(--contentColor);
                border-radius: rem(8px);
                overflow: hidden;
                &>li{
                    position: relative;
                    border-top:1px solid var(--cardBg);
                    height: rem(116px);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: var(--contentColor);
                    color:#23262F;
                    font-size:rem(36px);
                    padding: 0 rem(30px);
                    &:first-of-type{
                        border-top:none;
                    }
                    &>.dropdown-link{
                        width: 100%;
                        display: flex;
                        justify-content: space-between;

                    }
                    .notice-badge{
                        font-size: rem(28px);
                        color:var(--contentColor);
                        height: rem(40px);
                        min-width: rem(40px);
                        border-radius: rem(20px);
                        padding: 0 rem(8px);
                        background: var(--primary);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }
        }
    }
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
