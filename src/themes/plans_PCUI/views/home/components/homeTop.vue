<template>
    <div class='homeTop'>
        <div>
            <img alt='' src='../../../../plans/views/assets/' />
            <img alt='' src='../../../assets/newUI/home_left.png' />
            <div class='rightBtnGroup'>
                <div v-if='isRealTran' @click='goToPage'>
                    <img
                        class='topRechargeIcon'
                        src='@/assets/newUI/topRechargeIcon.png'
                    />
                </div>
                <div v-if='onlineService' @click='goService'>
                    <img
                        class='topRechargeIcon'
                        src='@/assets/newUI/service.png'
                    />
                </div>
                <div @click="$router.push('/msg')">
                    <img
                        class='msgIcon'
                        src='@/assets/newUI/msgIcon.png'
                    />
                </div>
            </div>
        </div>
        <template v-if='show'>
            <van-notice-bar
                :background='$style.noticeColor'
                :color='$style.contentColor'
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
import { computed, onMounted, reactive, toRefs } from 'vue'
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
            () => store.state._quote.curTradeType || plans.value[0].id
        )
        const accountList = computed(() =>
            store.state._user.customerInfo.accountList.filter(
                (el) => Number(el.tradeType) === Number(tradeType.value)
            )
        )

        // 模拟交易
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
                name: 'Otherpage',
                params: { type: 'page' },
                query: {
                    title: t('route.onlineService'),
                    url: encodeURIComponent(
                        store.state._base.wpCompanyInfo?.onlineService
                    )
                }
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
            // router.push({
            //     path: '/deposit',
            //     query: {
            //         tradeType: tradeType.value,
            //         accountId,
            //         currency: 'USDT'
            //     }
            // })
            router.push({
                path: '/assets'
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

        return {
            goToPage,
            goService,
            isRealTran,
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
.homeTop {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
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
</style>
