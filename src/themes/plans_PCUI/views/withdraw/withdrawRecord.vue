<template>
    <centerViewDialog>
        <Top back left-icon='arrow-left' :menu='false' :right-action='false' :show-center='true'>
            <template #right>
            </template>
        </Top>
        <Loading :show='loadingPage' />
        <div class='page-wrap'>
            <div class='record-list'>
                <van-pull-refresh v-model='loading' @refresh='onRefresh'>
                    <div v-if='list.length === 0'>
                        <van-empty :description="$t('withdrawRecord.noneHint')" image='/images/empty.png' />
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
                            class='aaa'
                            @change='handleFold(index)'
                        >
                            <van-collapse-item :name='index+1'>
                                <template #title>
                                    <p class='amount'>
                                        {{ item.amount }}
                                        <template v-if='item.withdrawType === 1'>
                                            {{ item.accountCurrency }}
                                        </template>
                                        <template v-if='item.withdrawType === 2'>
                                            {{ item.withdrawCurrency }}-{{ item.blockchainName }}
                                        </template>
                                    </p>
                                    <p class='time'>
                                        {{ formatTime(item.createTime) }}
                                    </p>
                                </template>
                                <template #right-icon>
                                    <div class='right-lump'>
                                        <span class='state'>
                                            {{ handleState(item.checkStatus,item.transferStatus) }}
                                        </span>
                                        <van-icon :name='activeIndex === index+1 ? "arrow-up" : "arrow-down"' />
                                    </div>
                                </template>
                                <div class='withdraw-desc'>
                                    <div class='w-item'>
                                        <span class='left-label'>
                                            {{ $t('withdrawRecord.moneyName') }}
                                        </span>
                                        <span class='right-val'>
                                            {{ item.amount }}
                                            <template v-if='item.withdrawType === 1'>
                                                {{ item.accountCurrency }}
                                            </template>
                                            <template v-if='item.withdrawType === 2'>
                                                {{ item.withdrawCurrency }}-{{ item.blockchainName }}
                                            </template>
                                        </span>
                                    </div>
                                    <div class='w-item'>
                                        <span class='left-label'>
                                            {{ $t('withdrawRecord.serviceName') }}
                                        </span>
                                        <span class='right-val'>
                                            {{ item.withdrawFee }}
                                            <template v-if='item.withdrawType === 1'>
                                                {{ item.accountCurrency }}
                                            </template>
                                            <template v-if='item.withdrawType === 2'>
                                                {{ item.withdrawCurrency }}-{{ item.blockchainName }}
                                            </template>
                                        </span>
                                    </div>
                                    <div class='w-item'>
                                        <span class='left-label'>
                                            {{ $t('withdrawRecord.predictName') }}
                                        </span>
                                        <span class='right-val'>
                                            {{ item.finalAmount }}
                                            <template v-if='item.withdrawType === 1'>
                                                {{ item.withdrawCurrency }}
                                            </template>
                                            <template v-if='item.withdrawType === 2'>
                                                {{ item.withdrawCurrency }}-{{ item.blockchainName }}
                                            </template>
                                        </span>
                                    </div>
                                    <div class='w-item'>
                                        <span class='left-label'>
                                            {{ $t('withdrawRecord.accountDeduction') }}
                                        </span>
                                        <span class='right-val'>
                                            {{ item.accountDeductAmount }} {{ item.accountCurrency }}
                                        </span>
                                    </div>
                                    <div class='w-item'>
                                        <span class='left-label'>
                                            {{ $t('withdrawRecord.statusName') }}
                                        </span>
                                        <span class='right-val state'>
                                            {{ handleState(item.checkStatus,item.transferStatus) }}
                                            <!-- {{ transferStatus[item.transferStatus] }} -->
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
                                            <span v-if='item.txid' class='copy-btn' :data-clipboard-text='item.txid' @click='copyTXID($event)'>
                                                <img alt='' src='../../../../assets/copy.png' srcset='' />
                                            </span>
                                        </span>
                                    </div>

                                    <!-- <div class='w-item'>
                                        <span class='left-label'>
                                            {{ $t('withdrawRecord.noName') }}
                                        </span>
                                        <span class='right-val'>
                                            {{ item.proposalNo }}
                                        </span>
                                    </div> -->
                                    <div class='w-item'>
                                        <span class='left-label'>
                                            {{ $t('withdrawRecord.timeName') }}
                                        </span>
                                        <span class='right-val'>
                                            {{ formatTime(item.createTime) }}
                                        </span>
                                    </div>
                                    <div class='w-item'>
                                        <span class='left-label'>
                                            {{ $t('withdrawRecord.remarkName') }}
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
    </centerViewDialog>
</template>

<script>
import { reactive, toRefs, ref, computed, onMounted } from 'vue'
import Top from '@/components/top'
import { useStore } from 'vuex'
import { queryWithdrawPageList } from '@/api/user'
import { Toast } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import Clipboard from 'clipboard'
import { isEmpty } from '@/utils/util'
import centerViewDialog from '@planspc/layout/centerViewDialog'

// i18n
import { useI18n } from 'vue-i18n'
export default {
    components: {
        Top,
        centerViewDialog
    },
    setup (props) {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const route = useRoute()
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        const { withdrawType } = route.query

        // 审核状态 取款状态：审核中、已取消、成功
        const states = {
            1: t('withdrawRecord.auditStatus.1'),
            2: t('withdrawRecord.auditStatus.2'),
            3: t('withdrawRecord.auditStatus.3')
        }

        const transferStatus = {
            1: t('withdrawRecord.transferStatus.1'),
            2: t('withdrawRecord.transferStatus.2'),
            3: t('withdrawRecord.transferStatus.3')
        }

        const handleState = (checkStatus, transferStatus) => {
            // 存款成功 待支付 已取消
            if (Number(checkStatus) === 3 || Number(transferStatus) === 3) {
                return t('withdrawRecord.auditStatus.2')
            } else if (Number(transferStatus) === 2) {
                return t('withdrawRecord.auditStatus.3')
            } else {
                return t('withdrawRecord.auditStatus.1')
            }
        }

        const activeIndex = ref('0')
        const state = reactive({
            loading: false,
            size: 20,
            current: 1,
            list: [],
            finishedText: t('withdrawRecord.noMore'),
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
                companyId: customInfo.value.companyId,
                customerNo: customInfo.value.customerNo,
                accountId: customInfo.value.accountId,
                withdrawType,
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
            return window.dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }

        // 底部加载更多
        const onLoad = () => {
            getWithdrawList()
            state.current++
        }

        // 复制txid
        const copyTXID = ($event) => {
            var clipboard = new Clipboard('.copy-btn')
            clipboard.on('success', e => {
                Toast(t('common.copySuccess'))
                // 释放内存
                clipboard.destroy()
            })
            clipboard.on('error', e => {
                // 释放内存
                clipboard.destroy()
            })
            clipboard.onClick($event)
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
                color: var(--color);
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
        .right-lump {
            display: flex;
            align-items: center;
            .state {
                margin-right: rem(10px);
                color: var(--primary);
            }
            .van-icon {
                top: -2px;
            }
        }
    }
}
.van-pull-refresh {
    height: 100%;
}
</style>
