<template>
    <list
        ref='listRef'
        v-bind='$attrs'
        :request-api='queryWithdrawPageList'
        :request-params='params'
    >
        <template #default='{ list }'>
            <!-- <div v-for='item in list' :key='item.id' class='li'>
                <div class='block'>
                    <div class='left'>
                        <span class='currency'>
                            {{ item.currency }}
                        </span>
                        <span class='time'>
                            {{ formatTime(item.createTime) }}
                        </span>
                    </div>
                    <div class='right'>
                        <span class='balance'>
                            {{ item.liabilities }}
                        </span>
                    </div>
                </div>
                <div class='block'>
                    <div class='left'>
                        <span class='label'>
                            {{ $t("record.repaymentAmount") }}
                        </span>
                        <span class='num'>
                            {{ item.liabilitiesPrincipal }}
                        </span>
                    </div>
                    <div class='right'>
                        <span class='label'>
                            {{ $t("trade.swap_2") }}
                        </span>
                        <span class='num'>
                            {{ item.interest }}
                        </span>
                    </div>
                </div>
            </div> -->
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
                                    <!-- <img alt='' src='../../../../assets/copy.png' srcset='' /> -->
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
        </template>
    </list>
</template>

<script>
import list from './list'
import { queryWithdrawPageList } from '@/api/user'
import { computed, ref, unref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
    components: { list },
    setup (props) {
        console.log('789')
        const store = useStore()
        const customInfo = computed(() => store.state._user.customerInfo)
        const formatTime = (val) => {
            return window.dayjs(val).format('YYYY/MM/DD HH:mm:ss')
        }
        const requestParams = ref({
            startTime: window.dayjs(window.dayjs().subtract(7, 'day').format('YYYY/MM/DD')).valueOf(),
            endTime: window.dayjs().endOf('day').valueOf()
        })
        const setParams = (params) => {
            requestParams.value = params || {}
        }

        const listRef = ref(null)

        const refresh = () => {
            unref(listRef) && unref(listRef).refresh()
        }

        const params = computed(() => {
            return {
                companyId: customInfo.value.companyId,
                customerNo: customInfo.value.customerNo,
                ...requestParams.value
            }
        })
        return {
            listRef,
            requestParams,
            setParams,
            refresh,
            formatTime,
            params,
            queryWithdrawPageList
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.li {
    width: 100%;
    margin-bottom: rem(20px);
    padding: rem(38px) rem(30px);
    white-space: nowrap;
    background-color: var(--contentColor);
    border-radius: rem(10px);
    .block {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 0 0 rem(30px) 0;
        &:last-child {
            margin: 0;
        }
        .label {
            color: var(--minorColor);
            font-weight: 500;
            font-size: rem(24px);
            line-height: rem(26px);
        }
        .num {
            margin-top: rem(13px);
            color: var(--normalColor);
            font-weight: 400;
            font-size: rem(24px);
        }
        .left {
            display: flex;
            flex-direction: column;
            .currency {
                color: var(--color);
                font-weight: 500;
                font-size: rem(30px);
                line-height: rem(32px);
            }
            .time {
                margin-top: rem(15px);
                color: var(--placeholdColor);
                font-weight: 400;
                font-size: rem(20px);
                line-height: rem(22px);
            }
        }
        .right {
            display: flex;
            flex-direction: column;
            text-align: right;
            .balance {
                color: var(--color);
                font-weight: 400;
                font-size: rem(34px);
                line-height: rem(36px);
            }
        }
    }
}
</style>
