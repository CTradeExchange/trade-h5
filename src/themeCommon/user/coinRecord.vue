<template>
    <div class='layout'>
        <!-- 加载中组件 -->
        <Loading :show='isShow' />

        <!-- 头部导航 -->
        <Top
            back
            left-icon='arrow-left'
            title='提币记录'
        />
        <div class='container'>
            <van-list
                v-if='recordList.length > 0'
                v-model='loading'
                class='record-list'
                :finished='finished'
                finished-text='没有更多了'
                @load='getWithdrawList'
            >
                <div v-for='(item, index) in recordList' :key='index' :class="['item', item.isShow ? 'item-show' : 'item-hide']">
                    <div class='item-header' @click='onItem(index)'>
                        <div class='inner'>
                            <p class='vital'>
                                <span class='name'>
                                    {{ item.finalAmount }} {{ item.withdrawCurrency }}-{{ item.blockchainName }}
                                </span>
                                <span :class="[item.withdrawCoinStatus === 1 ? 'state-1' : 'state-2']">
                                    {{ states[item.withdrawCoinStatus] }}
                                </span>
                            </p>
                            <p class='row'>
                                <span>{{ $t('coinRecord.time') }}</span>
                                <span>{{ $t('coinRecord.service') }}</span>
                                <span>提币</span>
                            </p>
                            <p class='row'>
                                <span>{{ formatTime(item.createTime) }}</span>
                                <span>{{ item.withdrawFee }} {{ item.withdrawCurrency }}-{{ item.blockchainName }}</span>
                                <span>{{ item.amount }} {{ item.withdrawCurrency }}-{{ item.blockchainName }}</span>
                            </p>
                        </div>
                        <div class='arrow'>
                            <van-icon color='#333' name='arrow-down' />
                        </div>
                    </div>
                    <div class='item-content'>
                        <div class='row'>
                            <span class='name'>
                                {{ $t('coinRecord.takeCount') }}
                            </span>
                            <span class='value'>
                                {{ item.amount }}
                            </span>
                        </div>
                        <div class='row'>
                            <span class='name'>
                                {{ $t('coinRecord.coin') }}
                            </span>
                            <span class='value'>
                                {{ item.withdrawCurrency }}
                            </span>
                        </div>
                        <div class='row'>
                            <span class='name'>
                                {{ $t('coinRecord.chain') }}
                            </span>
                            <span class='value'>
                                {{ item.blockchainName }}
                            </span>
                        </div>
                        <div class='row'>
                            <span class='name'>
                                {{ $t('coinRecord.status') }}
                            </span>
                            <span :class="['value', item.withdrawCoinStatus === 1 ? 'state-1' : 'state-2']">
                                {{ states[item.withdrawCoinStatus] }}
                            </span>
                        </div>
                        <div class='row'>
                            <span class='name'>
                                {{ $t('coinRecord.service') }}
                            </span>
                            <span class='value'>
                                {{ item.withdrawFee }}
                            </span>
                        </div>
                        <div class='row'>
                            <span class='name'>
                                {{ $t('coinRecord.arriveCount') }}
                            </span>
                            <span class='value'>
                                {{ item.finalAmount }}
                            </span>
                        </div>
                        <div class='row'>
                            <span class='name'>
                                {{ $t('coinRecord.takeNo') }}
                            </span>
                            <span class='value'>
                                {{ item.proposalNo }}
                            </span>
                        </div>
                        <div class='row'>
                            <span class='name'>
                                {{ $t('coinRecord.submitTime') }}
                            </span>
                            <span class='value'>
                                {{ formatTime(item.createTime) }}
                            </span>
                        </div>
                        <div class='row'>
                            <span class='name'>
                                {{ $t('coinRecord.remark') }}
                            </span>
                            <span class='value'>
                                {{ item.remark || '--' }}
                            </span>
                        </div>
                    </div>
                </div>
            </van-list>
            <van-empty
                v-else
                description='暂无提币记录'
                image='https://img01.yzcdn.cn/vant/empty-image-default.png'
            />
        </div>
    </div>
</template>

<script>
// vue
import { reactive, toRefs, computed, onMounted } from 'vue'
// vuex
import { useStore } from 'vuex'
// components
import Top from '@/components/top'
// api
import { queryWithdrawPageList } from '@/api/user'
// plugin
import dayjs from 'dayjs'
// i18n
import { useI18n } from 'vue-i18n'

export default {
    components: {
        Top
    },
    setup () {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const state = reactive({
            // 页面加载组件状态
            isShow: true,
            // 加载状态
            loading: false,
            // 当前页数
            current: 1,
            // 每页加载数量
            size: 20,
            // 是否加载完全部数据
            finished: false,
            // 提币记录数据列表
            recordList: []
        })
        // 审核状态 取款状态：审核中、已成功、已失败
        const states = {
            1: t('coinRecord.auditStatus.1'),
            2: t('coinRecord.auditStatus.2'),
            3: t('coinRecord.auditStatus.3')
        }

        // 获取账户信息
        const { value: customInfo } = computed(() => store.state._user.customerInfo)

        // 格式化时间
        const formatTime = (val) => {
            return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }

        // 点击展开或收缩
        const onItem = (index) => {
            state.recordList[index].isShow = !state.recordList[index].isShow
        }

        // 获取提币记录
        const getWithdrawList = () => {
            if (state.loading || state.finished) return
            state.loading = true
            const params = {
                companyId: customInfo.companyId,
                customerNo: customInfo.customerNo,
                accountId: customInfo.accountId,
                current: state.current,
                size: state.size,
                withdrawType: 2
            }
            queryWithdrawPageList(params).then(res => {
                state.isShow = false
                state.loading = false
                state.current++
                if (res.check()) {
                    const { data } = res
                    data.records.map(elem => {
                        elem.isShow = false
                    })
                    state.recordList = state.recordList.concat(data.records)
                    state.finished = state.recordList.length === data.total
                }
            })
        }

        onMounted(() => {
            // 获取提币记录
            getWithdrawList()
        })

        return {
            ...toRefs(state),
            onItem,
            getWithdrawList,
            states,
            formatTime
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #F9F9F9;
}
.container {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-y: auto;
}
.record-list {
    .item {
        margin-top: rem(20px);
        padding: 0 rem(30px);
        background-color: var(--white);
        .arrow {
            transition: all 0.2s;
        }
    }
    .item-show {
        .item-content {
            height: auto;
            padding: rem(20px) 0;
            border-top: 1px solid var(--bdColor);
        }
        .arrow {
            transform: rotate(180deg);
        }
    }
    .item-hide {
        .item-content {
            height: 0;
            overflow: hidden;
        }
    }
    .item-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: rem(20px) 0;
        .inner {
            flex: 1;
            margin-right: rem(20px);
            .vital {
                display: flex;
                justify-content: space-between;
                margin-bottom: rem(6px);
                font-size: rem(28px);
                .name {
                    color: var(--color);
                }
                .state-1 {
                    color: #3894FF;
                }
                .state-2 {
                    color: var(--color);
                }
            }
            .row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: rem(5px);
                color: var(--mutedColor);
                font-size: rem(20px);
                span {
                    &:nth-of-type(1) {
                        width: rem(250px);
                    }
                    &:nth-of-type(2) {
                        flex: 1;
                        margin: 0 rem(10px);
                    }
                    &:nth-of-type(3) {
                        flex: 1;
                        text-align: right;
                    }
                }
            }
        }
    }
    .item-content {
        .row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: rem(20px);
            font-size: rem(24px);
            .name {
                color: var(--mutedColor);
            }
            .value {
                color: var(--color);
                &.state-1 {
                    color: #3894FF;
                }
                &.state-2 {
                    color: var(--color);
                }
            }
        }
    }
}
</style>
