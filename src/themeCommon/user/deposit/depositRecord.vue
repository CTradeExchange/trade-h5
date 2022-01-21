<template>
    <Top back left-icon='arrow-left' :menu='false' :right-action='false' :show-center='true'>
        <template #right>
        </template>
    </Top>
    <Loading :show='pageLoading' />
    <div class='page-wrap'>
        <div class='record-list'>
            <van-pull-refresh
                v-model='loading'
                :loading-text="$t('compLang.loading')"
                :loosing-text="$t('compLang.vanPullRefresh.loosing')"
                :pulling-text="$t('compLang.vanPullRefresh.pulling')"
                @refresh='onRefresh'
            >
                <div v-if='list.length === 0'>
                    <van-empty :description='$t("common.noData")' image='/images/empty.png' />
                </div>
                <van-list
                    v-model:loading='loading'
                    :finished='finished'
                    :finished-text='finishedText'
                    :immediate-check='false'
                    :loading-text="$t('compLang.loading')"
                    @load='onLoad'
                >
                    <van-collapse
                        v-for='(item, index) in list'
                        :key='index'
                        v-model='activeIndex'
                        accordion
                        :border='false'
                        @change='handleFold(index)'
                    >
                        <van-collapse-item :name='index+1'>
                            <template #title>
                                <p class='amount'>
                                    {{ item.intendAmount }} {{ item.depositCurrency }}
                                </p>
                                <p class='time'>
                                    {{ formatTime(item.createTime) }}
                                </p>
                            </template>
                            <template #right-icon>
                                <div>
                                    <span class='state'>
                                        {{ handleState(item.checkStatus, item.depositStatus) }}
                                        <!-- {{ checkStatus[item.checkStatus] }} -->
                                    </span>
                                    <van-icon :name='activeIndex === index+1 ? "arrow-up" : "arrow-down"' />
                                </div>
                            </template>
                            <div class='withdraw-desc'>
                                <div class='w-item'>
                                    <span class='left-label'>
                                        {{ $t('deposit.cashAmount') }}
                                    </span>
                                    <span class='right-val'>
                                        {{ item.intendAmount }} {{ item.depositCurrency }}
                                    </span>
                                </div>
                                <div class='w-item'>
                                    <span class='left-label'>
                                        {{ $t('common.fee') }}
                                    </span>
                                    <span v-if='item.depositFee' class='right-val'>
                                        {{ item.depositFee }} {{ item.depositCurrency }}
                                    </span>
                                    <span v-else class='right-val'>
                                        --
                                    </span>
                                </div>
                                <div class='w-item'>
                                    <span class='left-label'>
                                        {{ $t('common.enterAccount') }}
                                    </span>
                                    <span v-if='item.finalAmount' class='right-val'>
                                        {{ item.finalAmount }} {{ item.depositCurrency }}
                                    </span>
                                    <span v-else class='right-val'>
                                        --
                                    </span>
                                </div>
                                <div class='w-item'>
                                    <span class='left-label'>
                                        {{ $t('common.status') }}
                                    </span>
                                    <span class='right-val state'>
                                        {{ handleState(item.checkStatus, item.depositStatus) }}
                                        <!-- {{ Number(item.depositStatus) ===2 ? '存款成功' : '待支付' }} -->
                                    </span>
                                </div>

                                <div class='w-item'>
                                    <span class='left-label'>
                                        TXID
                                    </span>
                                    <span class='right-val w250'>
                                        <span class='val'>
                                            {{ item.txid || '--' }}
                                        </span>
                                        <span v-if='item.txid' class='copy-btn' :data-clipboard-text='item.txid' @click='copyTXID'>
                                            <img alt='' src='../../../assets/copy.png' srcset='' />
                                        </span>
                                    </span>
                                </div>

                                <div class='w-item'>
                                    <span class='left-label'>
                                        {{ $t('deposit.submitTime') }}
                                    </span>
                                    <span class='right-val'>
                                        {{ formatTime(item.createTime) }}
                                    </span>
                                </div>
                                <div class='w-item'>
                                    <span class='left-label'>
                                        {{ $t('deposit.arriveTime') }}
                                    </span>
                                    <span class='right-val'>
                                        {{ item.depositStatus === 2 ? formatTime(item.updateTime) : '--' }}
                                    </span>
                                </div>
                                <div class='w-item'>
                                    <span class='left-label'>
                                        {{ $t('common.remark') }}
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
import { queryDepositPageList } from '@/api/user'
import { isEmpty } from '@/utils/util'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import Clipboard from 'clipboard'
export default {
    components: {
        Top
    },
    setup (props) {
        const router = useRouter()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        // 提案状态,待审批:1、审批成功:2、审批失败:3
        // const checkStatus = {
        //     1: '待审批',
        //     2: '审批成功',
        //     3: '已取消'
        // }

        // 存款状态,待存款:1、存款成功:2、存款失败:3
        // const depositStatus = {
        //     1: '待支付',
        //     2: '存款成功',
        //     3: '存款失败'
        // }

        const handleState = (checkStatus, depositStatus) => {
            // 存款成功 待支付 已取消
            if (Number(depositStatus) === 2) {
                return t('deposit.depositSuccess')
            } else if (Number(checkStatus) === 3) {
                return t('common.canceled')
            } else {
                return t('deposit.tobePay')
            }
        }

        const activeIndex = ref(0)
        const state = reactive({
            loading: false,
            size: 20,
            current: 1,
            list: [],
            finishedText: t('common.noMore'),
            finished: false,
            pageLoading: false,
            txid: ''
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
            state.pageLoading = true
            queryDepositPageList(params).then(res => {
                state.loading = false
                state.pageLoading = false
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
                state.pageLoading = false
            })
        }

        const formatTime = (val) => {
            return window.dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }

        // 底部加载更多
        const onLoad = () => {
            state.current++
            getWithdrawList()
        }

        // 复制txid
        const copyTXID = () => {
            var clipboard = new Clipboard('.copy-btn')
            clipboard.on('success', e => {
                Toast(t('common.copySuccess'))
                // 释放内存
                clipboard.destroy()
            })
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
            onLoad,
            handleState,
            copyTXID,
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
                display: flex;
                justify-content: flex-end;
                color: var(--color);
                font-weight: bold;
                text-align: right;
                &.w250 {
                    width: rem(600px);
                }
                &.state {
                    color: var(--primary);
                }
                .val {
                    display: inline-block;
                    width: rem(300px);
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    vertical-align: middle;
                }
                .copy-btn {
                    display: inline-block;
                    margin-left: rem(5px);
                    flex: none;
                    img {
                        width: rem(40px);
                        vertical-align: middle;
                    }
                }
            }
            .left-label {
                color: var(--minorColor);
            }
        }
    }
    .record-list {
        height: 100%;
        .van-collapse-item {
            border-top: solid rem(20px) var(--bgColor);
        }
        .amount {
            color: var(--color);
            font-weight: bold;
            font-size: rem(28px);
        }
        .time {
            color: var(--minorColor);
            font-size: rem(20px);
        }
        .state {
            margin-right: rem(5px);
            color: var(--primary);
        }
    }
}
</style>
