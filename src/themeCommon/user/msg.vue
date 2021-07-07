<template>
    <Top class='msgTopBar'>
        <template #center>
            <div class='msgTopCenter'>
                <van-dropdown-menu active-color='#007AFF'>
                    <van-dropdown-item v-model='type' :options='options' @change='changeType' />
                </van-dropdown-menu>
            </div>
        </template>
        <template #right>
            <div class='right-ico'>
                <i class='icon icon_quanbuyidu'></i>
            </div>
        </template>
    </Top>
    <Loading :show='pageLoading' />
    <div class='msg-list'>
        <div v-if='list.length === 0'>
            <van-empty :description='$t("common.noData")' image='search' />
        </div>
        <van-pull-refresh v-else v-model='loading' @refresh='onRefresh'>
            <van-list
                v-model:error='isError'
                v-model:loading='loading'
                :error-text='errorTip'
                :finished='finished'
                :finished-text='$t("common.noMore")'
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
</template>

<script>

import { onBeforeMount, computed, reactive, toRefs, onUnmounted } from 'vue'
import { queryPlatFormMessageLogList } from '@/api/user'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
import Top from '@/components/top'
import { isEmpty } from '@/utils/util'
import { useI18n } from 'vue-i18n'
export default {
    components: {
        Top,
    },
    setup (props) {
        const store = useStore()
        const { t, tm } = useI18n({ useScope: 'global' })
        const state = reactive({
            list: [],
            loading: false,
            finished: false,
            pageLoading: false,
            current: 1,
            type: '',
            errorTip: '',
            rightAction: { title: 444 },
            options: tm('msg.typesOptions')
        })
        const isError = computed(() => !!state.isError)

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        const changeType = (val) => {
            console.log(val)
            state.type = val
            state.current = 1
            state.finished = false
            state.list = []
            getMsgList()
        }

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

        const computeHtmlTime = (content) => {
            try {
                const reg = /<?time[^>]*>[^<]*<\/time>/gi
                const tag = content.match(reg)
                let returnVal
                if (!isEmpty(tag) && tag.length > 0) {
                    tag.forEach(item => {
                        returnVal = content.replace(reg, function (matchStr) {
                            const time = matchStr.toString().replace(/<\/?time>/g, '')
                            const timeStr = dayjs(Number(time)).format('YYYY-MM-DD HH:mm:ss')
                            return timeStr
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
            getMsgList()
        })
        onUnmounted(() => {
            document.body.removeEventListener('GotMsg_notice', gotMsg)
        })

        // 上拉刷新
        const onRefresh = () => {
            state.current = 1
            state.finished = false
            state.list = []
            getMsgList()
        }
        // 底部加载更多
        const onLoad = () => {
            state.current++
            getMsgList()
        }

        const formatTime = (val) => {
            return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }

        return {
            getMsgList,
            isError,
            customInfo,
            formatTime,
            onRefresh,
            onLoad,
            changeType,
            computeHtmlTime,
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
    color: var(--white);
    font-size: rem(48px);
}
.msgTopCenter {
    flex: 1;
}
.msg-list {
    flex: 1;
    height: 100%;
    overflow: auto;
    background-color: var(--bgColor);
    .msg-item {
        margin: rem(15px);
        padding: rem(20px);
        background-color: var(--contentColor);
        border-top: solid rem(20px) var(--btnColor);
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
            color: var(--mutedColor);
            font-weight: 400;
            font-size: rem(20px);
            line-height: rem(60px);
        }
    }
}
.msgTopBar {
    position: relative !important;
    background-color: var(--contentColor);
    :deep(.van-dropdown-menu__bar) {
        background-color: var(--contentColor);
        .van-dropdown-menu__title {
            color: var(--color);
        }
    }
    :deep(.van-dropdown-item__content) {
        .van-cell {
            background-color: var(--contentColor);
            .van-cell__title {
                color: var(--color);
            }
        }
    }
}
</style>
