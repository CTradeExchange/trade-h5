<template>
    <LayoutTop :back='true' :menu='false' :title='$t("route.noticeTitle")' />
    <Loading :show='pageLoading' />
    <van-tabs v-model:active='activeIndex' class='publicPage' @click-tab='onClickTab'>
        <van-tab name='public' :title='$t("route.notice")'>
            <div class='msg-list'>
                <div v-if='listNotice.length === 0'>
                    <van-empty :description='$t("common.noData")' image='/images/empty.png' />
                </div>
                <van-pull-refresh
                    v-else
                    v-model='loading'
                    :loading-text="$t('compLang.loading')"
                    :loosing-text="$t('compLang.vanPullRefresh.loosing')"
                    :pulling-text="$t('compLang.vanPullRefresh.pulling')"
                    @refresh='onRefreshNotice'
                >
                    <van-list
                        v-model:error='isError'
                        v-model:loading='loading'
                        :error-text='errorTip'
                        :finished='finishedNt'
                        :finished-text='$t("common.noMore")'
                        :loading-text="$t('compLang.loading')"
                        @load='onLoadNotice'
                    >
                        <div v-for='(item,index) in listNotice' :key='index' class='msg-item' @click='goNoticeDetails(item.id)'>
                            <p class='msg-title'>
                                {{ item.title === 'null'? '': item.title }}
                            </p>
                            <p class='msg-time'>
                                {{ formatTime(item.createTime) }}
                            </p>
                        </div>
                    </van-list>
                </van-pull-refresh>
            </div>
        </van-tab>
        <van-tab name='msg' :title='$t("route.msg")'>
            <div class='operate'>
                <van-dropdown-menu :active-color='$style.primary' class='msg-filter'>
                    <van-dropdown-item v-model='type' :options='options' @change='changeType' />
                </van-dropdown-menu>
            </div>

            <div class='msg-list'>
                <div v-if='list.length === 0'>
                    <van-empty :description='$t("common.noData")' image='/images/empty.png' />
                </div>
                <van-pull-refresh
                    v-else
                    v-model='loading'
                    :loading-text="$t('compLang.loading')"
                    :loosing-text="$t('compLang.vanPullRefresh.loosing')"
                    :pulling-text="$t('compLang.vanPullRefresh.pulling')"
                    @refresh='onRefresh'
                >
                    <van-list
                        v-model:error='isError'
                        v-model:loading='loading'
                        :error-text='errorTip'
                        :finished='finished'
                        :finished-text='$t("common.noMore")'
                        :loading-text="$t('compLang.loading')"
                        @load='onLoad'
                    >
                        <div v-for='(item,index) in list' :key='index' class='msg-item'>
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
                    </van-list>
                </van-pull-refresh>
            </div>
        </van-tab>
    </van-tabs>
</template>

<script>

import { onBeforeMount, computed, reactive, toRefs, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import Top from '@/components/top'
import { isEmpty, getCookie } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { Toast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import { queryPlatFormMessageLogList, getNoticeList } from '@/api/user'

export default {
    components: {
        Top,
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            list: [],
            listNotice: [],
            loading: false,
            lang: getCookie('lang') || 'zh-CN',

            finished: false, // 消息列表
            pageLoading: false,
            current: 1,

            finishedNt: false, // 公告列表
            pageLoadingNt: false,
            currentNt: 1,

            type: '',
            errorTip: '',
            rightAction: { title: 444 },
            options: [
                {
                    'text': t('msg.all'),
                    'value': ''
                },
                {
                    'text': t('msg.accountMsg'),
                    'value': 'USER_MESSAGE'
                },
                {
                    'text': t('msg.assetsMsg'),
                    'value': 'CASH_MESSAGE'
                },
                {
                    'text': t('msg.tradeMsg'),
                    'value': 'TRADE_MESSAGE'
                }
            ]
        })
        const isError = computed(() => !!state.isError)

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        const activeIndex = ref(0)
        const onClickTab = ({ title, name }) => {
            console.log(title, name)
            if (name === 'public') {
                getNoticeData()
            } else {
                getMsgList()
            }
        }

        const changeType = (val) => {
            console.log(val)
            state.type = val
            state.current = 1
            state.finished = false
            state.list = []
            getMsgList()
        }

        // 跳转到公告详情页
        const goNoticeDetails = (id) => {
            console.log(id)
            router.push({
                path: '/noticeDetail',
                query: {
                    id: id
                }
            })
        }

        // 获取消息列表
        const getMsgList = () => {
            state.pageLoading = true
            state.errorTip = ''
            queryPlatFormMessageLogList({
                current: state.current,
                parentType: state.type,
            }).then(res => {
                state.loading = false
                state.pageLoading = false
                if (res.check()) {
                    if (res.data.records && res.data.records.length > 0) {
                        state.list = state.list.concat(res.data.records)
                    }

                    // 数据全部加载完成
                    if (res.data.size * res.data.current >= res.data.total) {
                        state.finished = true
                    }
                }
            }).catch(err => {
                state.errorTip = t('c.loadError')
                state.pageLoading = false
            })
        }

        // 获取公告列表
        const getNoticeData = () => {
            // state.pageLoading = true
            state.errorTip = ''
            console.log(customInfo.value)

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
                state.pageLoading = false
                if (res.check()) {
                    if (res.data.records && res.data.records.length > 0) {
                        state.listNotice = state.listNotice.concat(res.data.records)
                    }

                    // 数据全部加载完成
                    if (res.data.size * res.data.current >= res.data.total) {
                        state.finishedNt = true
                    }
                }
            }).catch(err => {
                state.errorTip = t('c.loadError')
                state.pageLoading = false
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

        // 获取到顶部消息通知，同时刷新消息列表
        const gotMsg = () => {
            onRefresh()
        }
        document.body.addEventListener('GotMsg_notice', gotMsg, false)
        onBeforeMount(() => {
            // getMsgList()
            getNoticeData()
        })
        onUnmounted(() => {
            document.body.removeEventListener('GotMsg_notice', gotMsg)
        })

        // msg上拉刷新
        const onRefresh = () => {
            state.current = 1
            state.finished = false
            state.list = []
            getMsgList()
        }
        // msg底部加载更多
        const onLoad = () => {
            state.current++
            getMsgList()
        }

        // notice上拉刷新
        const onRefreshNotice = () => {
            state.currentNt = 1
            state.finishedNt = false
            state.listNotice = []
            getNoticeData()
        }
        // notice底部加载更多
        const onLoadNotice = () => {
            state.currentNt++
            getNoticeData()
        }

        const formatTime = (val) => {
            return window.dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }

        return {
            getMsgList,
            onRefreshNotice,
            onLoadNotice,
            isError,
            getNoticeData,
            customInfo,
            formatTime,
            onRefresh,
            onLoad,
            changeType,
            goNoticeDetails,
            computeHtmlTime,
            activeIndex,
            onClickTab,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.right-ico {
    position: absolute;
    right: rem(30px);
    color: var(--contentColor);
    font-size: rem(48px);
}
.msgTopCenter {
    position: absolute;
    width: 100%;
}
:deep(.van-dropdown-menu__bar) {
    box-shadow: none;

    --van-dropdown-menu-title-font-size: 12px;
}
.publicPage {
    flex: 1;
    height: 100%;
    padding-top: rem(110px);
    overflow: auto;
    background-color: var(--bgColor);
    .operate {
        text-align: left;
        .msg-filter {
            display: inline-block;
        }
    }
}
.msg-list {
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
</style>
