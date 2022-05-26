<template>
    <router-view />

    <div class='wrapper'>
        <div class='page-title'>
            {{ $t('route.noticeTitle') }}
        </div>

        <van-tabs v-model:active='activeIndex' class='noticePage' @click-tab='onClickTab'>
            <van-tab name='notice' :title="$t('route.notice')">
                <div class='list'>
                    <!-- <Loading :show='loading' /> -->
                    <van-loading v-if='loading' />
                    <div class='msg-list'>
                        <div v-for='(item,index) in listNotice' :key='index' class='msg-item' @click="goNoticeDetails(item.id,'notice')">
                            <p class='msg-title'>
                                {{ item.title === 'null'? '': item.title }}
                            </p>
                            <p class='msg-time'>
                                {{ formatTime(item.pubTime) }}
                            </p>
                        </div>
                        <div class='list-page-box'>
                            <van-pagination
                                v-if='listNotice.length > 0'
                                v-model='currentNt'
                                class='list-page'
                                force-ellipses
                                :items-per-page='10'
                                :total-items='totalNt'
                                @change='changePageNt'
                            >
                                <template #prev-text>
                                    <van-icon name='arrow-left' />
                                </template>
                                <template #next-text>
                                    <van-icon name='arrow' />
                                </template>
                                <template #page='{ text }'>
                                    {{ text }}
                                </template>
                            </van-pagination>
                        </div>
                    </div>
                    <van-empty
                        v-if='listNotice.length === 0'
                        :description="$t('api.listnone')"
                        image='/images/empty.png'
                    />
                </div>
            </van-tab>
            <van-tab v-show='isUser' name='msg' :title="$t('route.msg')">
                <div class='list'>
                    <!-- <Loading :show='loading' /> -->
                    <van-loading v-if='loading' />
                    <div class='msg-list'>
                        <div v-for='(item,index) in msgList' :key='index' class='msg-item'>
                            <p class='msg-title'>
                                {{ item.title === 'null'? '': item.title }}
                            </p>
                            <p class='msg-content'>
                                {{ computeHtmlTime(item.content) }}
                            </p>
                            <p class='msg-time'>
                                {{ formatTime(item.createTime) }}
                            </p>
                        </div>
                    </div>
                    <div class='list-page-box'>
                        <van-pagination
                            v-if='msgList.length > 0'
                            v-model='current'
                            class='list-page'
                            force-ellipses
                            :items-per-page='10'
                            :total-items='total'
                            @change='changePage'
                        >
                            <template #prev-text>
                                <van-icon name='arrow-left' />
                            </template>
                            <template #next-text>
                                <van-icon name='arrow' />
                            </template>
                            <template #page='{ text }'>
                                {{ text }}
                            </template>
                        </van-pagination>
                    </div>
                    <van-empty
                        v-if='msgList.length === 0'
                        :description="$t('api.listnone')"
                        image='/images/empty.png'
                    />
                </div>
            </van-tab>
            <van-tab v-show='isUser' name='msgps' :title="$t('route.msgCustomer')">
                <div class='list'>
                    <!-- <Loading :show='loading' /> -->
                    <van-loading v-if='loading' />
                    <div class='msg-list'>
                        <div v-for='(item,index) in listCustomer' :key='index' class='msg-item' @click="goNoticeDetails(item.id,'msgcustomer')">
                            <p class='msg-title'>
                                {{ item.title === 'null'? '': item.title }}
                            </p>
                            <p class='msg-time'>
                                {{ formatTime(item.createTime) }}
                            </p>
                        </div>
                        <div class='list-page-box'>
                            <van-pagination
                                v-if='listCustomer.length > 0'
                                v-model='currentPs'
                                class='list-page'
                                force-ellipses
                                :items-per-page='10'
                                :total-items='totalPs'
                                @change='changePagePs'
                            >
                                <template #prev-text>
                                    <van-icon name='arrow-left' />
                                </template>
                                <template #next-text>
                                    <van-icon name='arrow' />
                                </template>
                                <template #page='{ text }'>
                                    {{ text }}
                                </template>
                            </van-pagination>
                        </div>
                    </div>
                    <van-empty
                        v-if='listNotice.length === 0'
                        :description="$t('api.listnone')"
                        image='/images/empty.png'
                    />
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import { computed, toRefs, reactive, onMounted, ref, beforeRouteEnter } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Toast, Dialog, Pagination } from 'vant'
import { queryPlatFormMessageLogList, getNoticeList, getCustomerMsgList } from '@/api/user'
import { isEmpty, getCookie, localSet, localGet } from '@/utils/util'

export default {
    name: 'Notice',
    components: {

    },
    // beforeRouteEnter (to, from, next) {
    //     // balabala
    //     next(vm => {
    //         // console.log(to)
    //         console.log(from)
    //         vm.pathUrl = from.fullPath
    //         let active = ''
    //         if (from.query.type === 'msgcustomer') {
    //             active = 'msgps'
    //         }

    //         if (from.query.type === 'notice') {
    //             active = 'notice'
    //         }
    //         console.log(active)
    //         localSet('noticeActive', active)
    //     })
    // },

    setup () {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const { type } = route.query
        const state = reactive({
            loading: false,
            active: 2,
            showApiHelp: false,
            query: {
                tag: ''
            },
            listCustomer: [],
            listNotice: [],
            msgList: [],
            lang: getCookie('lang') || 'zh-CN',

            finished: false, // 消息列表
            pageLoading: false,
            current: 1,
            total: 0,

            finishedNt: false, // 公告列表
            pageLoadingNt: false,
            currentNt: 1,
            totalNt: 0,

            finishedPs: false, // 个人消息列表
            pageLoadingPs: false,
            currentPs: 1,
            totalPs: 0,

            isUser: false,
            activeIndex: ''
        })

        const accountList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(state.tradeType)))

        // console.log(store.state)
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const companyId = computed(() => customInfo.value.companyId)
        const inviteVis = computed(() => {
            return (location.href.includes('uat') && companyId.value === 1) || (location.href.includes('pre') && companyId.value === 360) || (companyId.value === 11)
        })

        // 获取消息列表
        const getMsgList = () => {
            state.loading = true
            state.errorTip = ''
            queryPlatFormMessageLogList({
                current: state.current,
                lang: state.lang,
                size: 10,
                parentType: state.type,
            }).then(res => {
                state.loading = false
                if (res.check()) {
                    // if (res.data.records && res.data.records.length > 0) {
                    //     state.msgList = state.msgList.concat(res.data.records)
                    // }
                    state.msgList = res.data.records
                    state.total = res.data.total
                    // 数据全部加载完成
                    if (res.data.size * res.data.current >= res.data.total) {
                        state.finished = true
                    }
                }
            }).catch(err => {
                state.errorTip = t('c.loadError')
                state.loading = false
            })
        }

        const changePage = (val) => {
            state.current = val
            getMsgList()
        }

        const changePageNt = (val) => {
            state.currentNt = val
            getNoticeData()
        }

        const changePagePs = (val) => {
            state.currentPs = val
            getCustomerMsgListData()
        }

        // 获取公告列表
        const getNoticeData = () => {
            state.loading = true
            state.errorTip = ''
            // console.log(customInfo.value)
            getNoticeList({
                current: state.currentNt,
                // pubTimeFrom: '',
                // pubTimeTo: '',
                lang: state.lang,
                size: 10,
                companyId: customInfo.value.companyId,
                customerNo: customInfo.value.customerNo
            }).then(res => {
                state.loading = false
                if (res.check()) {
                    state.listNotice = []
                    if (res.data.records && res.data.records.length > 0) {
                        state.listNotice = res.data.records
                    }
                    state.totalNt = res.data.total
                    // 数据全部加载完成
                    if (res.data.size * res.data.current >= res.data.total) {
                        state.finishedNt = true
                    }
                }
            }).catch(err => {
                state.errorTip = t('c.loadError')
                state.loading = false
            })
        }

        // 获取个人消息列表
        const getCustomerMsgListData = () => {
            state.pageLoading = true
            state.errorTip = ''
            console.log(customInfo.value)

            getCustomerMsgList({
                current: state.currentPs,
                // pubTimeFrom: '',
                // pubTimeTo: '',
                lang: state.lang,
                size: 10,
                companyId: customInfo.value.companyId,
                customerNo: customInfo.value.customerNo
            }).then(res => {
                state.loading = false
                state.pageLoading = false
                if (res.check()) {
                    if (res.data.records && res.data.records.length > 0) {
                        state.listCustomer = res.data.records
                    }
                    state.totalPs = res.data.total

                    // 数据全部加载完成
                    if (res.data.size * res.data.current >= res.data.total) {
                        state.finishedPs = true
                    }
                }
            }).catch(err => {
                state.errorTip = t('c.loadError')
                state.pageLoading = false
            })
        }

        const onClickTab = (item) => {
            console.log(item)
            if (item.name === 'notice') {
                state.currentNt = 1
                state.finishedNt = false
                state.listNotice = []
                getNoticeData()
            }
            if (item.name === 'msgps') {
                state.currentPs = 1
                state.finishedPs = false
                state.listCustomer = []
                getCustomerMsgListData()
            }
            if (item.name === 'msg') {
                state.current = 1
                state.finished = false
                state.list = []
                getMsgList()
            }
        }

        // 跳转到公告详情页
        const goNoticeDetails = (id, type) => {
            console.log(id)
            router.push({
                path: '/noticeDetail',
                query: {
                    id: id,
                    type: type
                }
            })
        }

        const computeHtmlTime = (content) => {
            try {
                const reg = /<?time[^>]*>[^<]*<\/time>/gi
                const tag = content.match(reg)
                let returnVal
                if (!isEmpty(tag) && tag.length > 0) {
                    tag.forEach(item => {
                        returnVal = content.replace(reg, function (matchStr) {
                            const time = matchStr.toString().replace(/<\/?time>/g, '')
                            return window.dayjs(Number(time)).format('YYYY-MM-DD HH:mm:ss')
                        })
                    })
                    return returnVal
                } else {
                    return content
                }
            } catch (error) {
                console.log(error)
            }
        }

        const handRoutTo = (path, tag) => router.push({
            path: route.path + path,
            query: {
                tag: tag || '',
                originPage: 'apiList'
            }
        })

        onMounted(() => {
            getNoticeData()
            if (customInfo.value) {
                state.isUser = true
            } else {
                state.isUser = false
            }
            // const index = localGet('noticeActive')
            console.log(route.query.from)
            if (route.query.from === 'notice') {
                // activeIndex.value = ref('notice')
                state.activeIndex = ref('notice')
                state.currentNt = 1
                state.finishedNt = false
                state.listNotice = []
                getNoticeData()
            }
            if (route.query.from === 'msgcustomer') {
                // activeIndex.value = ref('msgps')
                state.activeIndex = ref('msgps')
                state.currentPs = 1
                state.finishedPs = false
                state.listCustomer = []
                getCustomerMsgListData()
            }
        })

        return {
            handRoutTo,
            computeHtmlTime,
            goNoticeDetails,
            changePage,
            changePagePs,
            changePageNt,
            getNoticeData,
            getMsgList,
            getCustomerMsgListData,
            inviteVis,
            onClickTab,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.wrapper {
    width: 1200px;
    margin: 20px auto;
    .page-title {
        font-weight: bold;
        font-size: 32px;
    }
    :deep(.noticePage) {
        display: flex;
        margin-top: 30px;
        overflow: hidden;
        .van-tabs__nav {
            display: block;
            background: none;
        }
        .van-tabs__wrap {
            width: 160px;
            height: auto;
            margin-right: 20px;
        }
        .van-tabs__content {
            flex: 1;
            min-height: 600px;
        }
        .van-tab {
            display: block;
            flex: inherit;
            width: 100%;
            margin-bottom: 15px;
            padding: 10px 0;
            font-size: 16px;
            line-height: 32px;
            text-align: center;
            background: var(--lineColor);
            border-radius: 10px;
            &.van-tab--active {
                background: var(--primary);
                .van-tab__text {
                    color: var(--assistColor);
                }
            }
        }
        .van-tabs__line {
            display: none;
        }
    }
    .col_black {
        color: var(--normalColor);
    }
    .msg-list {
        background: var(--contentColor);
        .header {
            padding-bottom: rem(30px);
            padding-left: rem(30px);
            font-size: rem(48px);
            background: var(--contentColor);
        }
        .msg-item {
            margin: rem(2px) 0 rem(10px) 0;
            padding: rem(30px);
            background-color: var(--contentColor);
            border-bottom: 1px solid var(--lineColor);
            transition: ease-in 0.2s;
            &:hover {
                background: var(--primaryAssistColor);
            }
            //border-top: solid rem(10px) var(--bgColor);
            .msg-title {
                color: var(--color);
                font-weight: bold;
                font-size: rem(28px);
                line-height: rem(60px);
            }
            .msg-content {
                color: var(--color);
                font-weight: 500;
                font-size: rem(24px);
                line-height: rem(40px);
            }
            .msg-time {
                color: var(--minorColor);
                font-weight: 400;
                font-size: rem(20px);
                line-height: rem(60px);
            }
        }
    }
    .list-page-box {
        text-align: center;
        .list-page {
            display: inline-block;
            width: auto;
            max-width: 400px;
            margin: 30px 0;
            button {
                cursor: pointer;
            }
        }
    }
}

@media screen and (max-width: 1200px) {
    .wrapper {
        width: 980px;
    }
}

@media screen and (max-width: 980px) {
    .wrapper {
        width: 720px;
    }
}
</style>
