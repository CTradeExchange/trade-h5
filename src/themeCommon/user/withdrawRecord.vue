<template>
    <Top back left-icon='arrow-left' :menu='false' :right-action='false' show-center='true'>
        <template #right>
        </template>
    </Top>
    <Loading :show='loadingPage' />
    <div class='page-wrap'>
        <div class='record-list'>
            <van-pull-refresh v-model='loading' @refresh='onRefresh'>
                <div v-if='list.length === 0'>
                    <van-empty description='暂无数据' image='search' />
                </div>
                <van-list
                    v-model:loading='loading'
                    :finished='finished'
                    :finished-text='finishedText'
                    :immediate-check='false'
                    @load='onLoad'
                >
                    <van-collapse
                        v-for='(item, index) in list'
                        :key='index'
                        v-model='activeIndex'
                        accordion
                        class='aaa'
                        @change='handleFold(index)'
                    >
                        <van-collapse-item :name='index+1'>
                            <template #title>
                                <p class='amount'>
                                    {{ item.amount }} {{ item.accountCurrency }}
                                </p>
                                <p class='time'>
                                    {{ formatTime(item.createTime) }}
                                </p>
                            </template>
                            <template #right-icon>
                                <div>
                                    <span class='state'>
                                        {{ handleState(item.checkStatus,item.transferStatus) }}
                                        <!-- {{ states[item.checkStatus] }} -->
                                    </span>
                                    <van-icon :name='activeIndex === index+1 ? "arrow-up" : "arrow-down"' />
                                </div>
                            </template>
                            <div class='withdraw-desc'>
                                <div class='w-item'>
                                    <span class='left-label'>
                                        取款金额
                                    </span>
                                    <span class='right-val'>
                                        {{ item.amount }}
                                    </span>
                                </div>
                                <div class='w-item'>
                                    <span class='left-label'>
                                        币种
                                    </span>
                                    <span class='right-val'>
                                        {{ item.withdrawCurrency }}
                                    </span>
                                </div>
                                <div class='w-item'>
                                    <span class='left-label'>
                                        状态
                                    </span>
                                    <span class='right-val state'>
                                        {{ handleState(item.checkStatus,item.transferStatus) }}
                                        <!-- {{ transferStatus[item.transferStatus] }} -->
                                    </span>
                                </div>

                                <div class='w-item'>
                                    <span class='left-label'>
                                        手续费
                                    </span>
                                    <span class='right-val'>
                                        {{ item.withdrawFee }}
                                    </span>
                                </div>
                                <div class='w-item'>
                                    <span class='left-label'>
                                        入账金额
                                    </span>
                                    <span class='right-val'>
                                        {{ item.finalAmount }}{{ item.withdrawCurrency }}
                                    </span>
                                </div>
                                <div class='w-item'>
                                    <span class='left-label'>
                                        提案编号
                                    </span>
                                    <span class='right-val'>
                                        {{ item.proposalNo }}
                                    </span>
                                </div>
                                <div class='w-item'>
                                    <span class='left-label'>
                                        提交时间
                                    </span>
                                    <span class='right-val'>
                                        {{ formatTime(item.createTime) }}
                                    </span>
                                </div>
                                <div class='w-item'>
                                    <span class='left-label'>
                                        备注
                                    </span>
                                    <span class='right-val'>
                                        {{ item.remark || '--' }}
                                    </span>
                                </div>
                            </div>
                        </van-collapse-item>
                    </van-collapse>
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Top from '@/components/top'
import { useStore } from 'vuex'
import { queryWithdrawPageList } from '@/api/user'
import dayjs from 'dayjs'
import { isEmpty } from '@/utils/util'
import { Toast } from 'vant'
export default {
    components: {
        Top,
        Toast
    },
    setup (props) {
        const router = useRouter()
        const store = useStore()
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        // 审核状态 取款状态：审核中、已取消、成功
        const states = {
            1: '审核中',
            2: '已取消',
            3: '成功'
        }

        const transferStatus = {
            1: '待转账',
            2: '转账失败',
            3: '转账成功'
        }

        const handleState = (checkStatus, transferStatus) => {
            // 存款成功 待支付 已取消
            if (Number(transferStatus) === 1) {
                return '审核中'
            } else if (Number(transferStatus) === 2) {
                return '成功'
            } else {
                return '已取消'
            }
        }

        const activeIndex = ref(['0'])
        const state = reactive({
            loading: false,
            size: 20,
            current: 1,
            list: [],
            finishedText: '没有更多了',
            finished: false,
            loadingPage: false
        })
        const handleFold = (val) => {
            activeIndex.value = val
        }

        const onRefresh = () => {
            state.current = 1
            state.finished = false
            state.list = []
            getWithdrawList()
        }

        const getWithdrawList = () => {
            const params = {
                customerNo: customInfo.value.customerNo,
                accountId: customInfo.value.accountId,
                size: state.size,
                current: state.current,
            }
            state.loadingPage = true
            queryWithdrawPageList(params).then(res => {
                state.loading = false
                state.loadingPage = false
                if (res.check()) {
                    const resdata = res.data
                    if (resdata.records && resdata.records.length > 0) {
                        state.loading = false
                        state.list = state.list.concat(resdata.records)
                        // 数据全部加载完成
                        if (resdata.current * resdata.size >= resdata.total) {
                            state.finished = true
                        }

                        if (isEmpty(res.data.records)) {
                            state.finishedText = ''
                        }
                    }
                }
            }).catch(err => {
                state.loadingPage = false
            })
        }

        const formatTime = (val) => {
            return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }

        // 底部加载更多
        const onLoad = () => {
            getWithdrawList()
            state.current++
        }

        onMounted(() => {
            getWithdrawList()
        })

        return {
            activeIndex,
            handleFold,
            customInfo,
            onRefresh,
            formatTime,
            states,
            onLoad,
            handleState,
            transferStatus,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    flex: 1;
    height: 100%;
    overflow: auto;
    background-color: var(--bgColor);
    .withdraw-desc {
        .w-item {
            display: flex;
            line-height: rem(60px);
            span {
                flex: 1;
                font-size: rem(24px);
            }
            .right-val {
                color: var(--color);
                font-weight: bold;
                text-align: right;
                &.state {
                    color: var(--primary);
                }
            }
            .left-label {
                color: var(--mutedColor);
            }
        }
    }
    .record-list {
        .van-collapse-item {
            border-top: solid rem(20px) var(--btnColor);
        }
        .amount {
            color: var(--color);
            font-weight: bold;
            font-size: rem(28px);
        }
        .time {
            color: var(--mutedColor);
            font-size: rem(20px);
        }
        .state {
            color: var(--primary);
            vertical-align: middle;
        }
        .van-icon {
            vertical-align: middle;
        }
    }
}
.van-pull-refresh {
    height: 100%;
}
</style>
