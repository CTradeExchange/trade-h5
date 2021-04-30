<template>
    <Top :back='true' :menu='false' :right-action='rightAction' title='' :title-vis='false'>
        <template #left>
            <div>
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
    <div class='msg-list'>
        <div v-if='list.length === 0'>
            <van-empty description='暂无数据' image='search' />
        </div>
        <van-pull-refresh v-else v-model='loading' @refresh='onRefresh'>
            <van-list
                v-model:loading='loading'
                :finished='finished'
                finished-text='没有更多了'
                @load='onLoad'
            >
                <div v-for='(item,index) in list' :key='index' class='msg-item'>
                    <p class='msg-title'>
                        {{ item.title === 'null'? '': item.title }}
                    </p>
                    <p class='msg-content'>
                        {{ computeHtml(item.content) }}
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
import Top from '@m/layout/top'
import { onBeforeMount, computed, reactive, toRefs } from 'vue'
import { queryPlatFormMessageLogList } from '@/api/user'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
import { Toast } from 'vant'
export default {
    components: {
        Top
    },
    setup (props) {
        const store = useStore()
        const state = reactive({
            list: [],
            loading: false,
            finished: false,
            current: 1,
            type: '',
            rightAction: { title: 444 },
            options: [
                { text: '全部消息', value: '' },
                { text: '账户消息', value: 'USER_MESSAGE' },
                { text: '资金消息', value: 'CASH_MESSAGE' },
                { text: '交易消息', value: 'TRADE_MESSAGE' },
            ]
        })

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        const changeType = (val) => {
            console.log(val)
            state.type = val
            state.current = 1
            state.list = []
            getMsgList()
        }

        const getMsgList = () => {
            const toast = Toast.loading({
                message: '加载中...',
                forbidClick: true,
            })
            queryPlatFormMessageLogList({
                current: state.current,
                parentType: state.type,
            }).then(res => {
                toast.clear()
                if (res.check()) {
                    if (res.data.records && res.data.records.length > 0) {
                        state.list = state.list.concat(res.data.records)
                    }

                    // 数据全部加载完成
                    if (res.data.size * res.data.current >= res.data.total) {
                        state.finished = true
                    }
                }
            })
        }

        const computeHtmlTime = (content) => {
            try {
                const reg = /<?time[^>]*>[^<]*<\/time>/gi
                const tag = content.match(reg)
                const time = tag.toString().replace(/<\/?time>/g, '')
                return dayjs(Number(time)).format('YYYY-MM-DD HH:mm:ss')
            } catch (error) {
                console.log(error)
            }
        }

        const computeHtml = (content) => {
            const reg = /<?time[^>]*>[^<]*<\/time>。/gi
            return content.replace(reg, '')
        }

        onBeforeMount(() => {
            getMsgList()
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
            customInfo,
            formatTime,
            onRefresh,
            onLoad,
            changeType,
            computeHtmlTime,
            computeHtml,
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
.msg-list {
    flex: 1;
    height: 100%;
    overflow: auto;
    .msg-item {
        padding: rem(30px);
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
</style>

<style lang="scss">
@import '@/sass/mixin.scss';
.van-dropdown-menu__bar {
    background-color: transparent !important;
    .van-dropdown-menu__title {
        color: var(--white);
    }
    .van-ellipsis {
        color: var(--white);
    }
}
</style>
