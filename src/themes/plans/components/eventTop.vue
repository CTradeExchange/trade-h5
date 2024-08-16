<template>
    <div class='homeTop'>
        <div style='background: #fff'>
            <img alt='Headline' src='../../../assets/newUI/headlineLogo.png' @click='jumpPage(1)' />
            <el-button class='register registerContainer' target='_blank' @click='jumpPage(2)'>
                Register
            </el-button>
        </div>
        <template v-if='show'>
            <van-notice-bar
                :color='$style.noticeTextColor'
                left-icon='volume-o'
                mode='closeable'
                :scrollable='true'
                :text='notice.title'
                @click='goNoticeDetail(notice.id)'
                @close.stop='show = false'
            />
        </template>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import {
    computed,
    onMounted,
    reactive,
    toRefs,
} from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
    getCookie,
    localGet,
    localSet,
    isEmpty,
    isDemoAccount
} from '@/utils/util'
import { getNoticeList } from '@/api/user'

export default {
    setup () {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const plans = computed(() => store.state._base.plans)
        const tradeType = computed(
            () => store.state._quote.curTradeType || 2 // 默认逐仓 plans.value[0].id
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
            )
        })

        const getHomeNoticeList = () => {
            const { companyId, customerNo } = customInfo.value || {}
            const params = { current: state.currentNt, size: 3 }
            if (companyId) {
                params.companyId = companyId
            }
            if (customerNo) {
                params.customerNo = customerNo
            }

            getNoticeList(params)
                .then((res) => {
                    const { data } = res || {}
                    const { records } = data || {}

                    if (!isEmpty(records)) {
                        state.notice = records[0]

                        state.isShowIcon = !isEmpty(state.notice)
                        localSet('noticeCache', JSON.stringify(records[0]))
                        state.show = true
                    } else {
                        state.show = false
                    }
                    state.noticeList = records
                })
                .catch((err) => {})
        }

        const goService = () => {
            router.push({
                name: 'service',
                params: { type: 'page' },
                // query: {
                //     title: t('route.onlineService'),
                //     url: encodeURIComponent(
                //         store.state._base.wpCompanyInfo?.onlineService
                //     )
                // }
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
                path: '/deposit',
            })
        }

        onMounted(() => {
            const noticeCache = localGet('noticeCache')
            if (!isEmpty(noticeCache)) {
                state.notice = JSON.parse(noticeCache)
                const { title } = state.notice || {}
                state.isShowIcon = !isEmpty(title)
            }
            getHomeNoticeList() // 顶部通知栏
        })

        const jumpPage = (attr) => {
            switch (attr) {
                case 1 :
                    window.open('https://www.headline.net/en-US/home')
                    break
                case 2 :
                    window.open('https://www.headline.net/en-US/register')
                    break
            }
        }

        return {
            isRealTran,
            goToPage,
            goService,
            goNoticeDetail,
            jumpPage,
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
.homeTop {
    position: sticky;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 9999;
    & > div:first-of-type {
        display: flex;
        align-items: center;
        padding: 0 rem(22px);
        box-sizing: border-box;
        background-color: var(--primary);
        justify-content: space-between;
        height: rem(110px);
        .rightBtnGroup {
            display: flex;
            & > div {
                padding: 0 rem(25px);
                display: flex;
                align-items: center;
            }
            .topRechargeIcon {
                width: rem(41px);
                height: rem(47px);
            }
            .msgIcon {
                width: rem(42px);
                height: rem(44px);
            }
        }
        & > img {
            width: rem(44px);
            height: rem(44px);
            margin: 0 rem(22px);
            &:first-of-type {
                width: auto;
                height: rem(31px);
                margin-right: auto;
            }
        }
        .icons {
            font-size: rem(44px);
            color: var(--contentColor);
            margin: 0 rem(22px) rem(14px);
        }
    }
}
.registerContainer{
              background-color: #BE1E2D !important;
              color: #fff;
              border: unset !important;
            }
            .registerContainer:hover{
              background-color: #be1e2e9d !important;
            }
</style>
