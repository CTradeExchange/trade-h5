<template>
    <Top back='true' :menu='false' title='' />
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
                        {{ item.content }}
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
            current: 1
        })
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const getMsgList = () => {
            const toast = Toast.loading({
                message: '加载中...',
                forbidClick: true,
            })
            queryPlatFormMessageLogList({
                current: state.current
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
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.msg-list {
    flex: 1;
    overflow-y: auto;
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
