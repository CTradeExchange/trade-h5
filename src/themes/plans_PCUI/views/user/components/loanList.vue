<template>
    <list
        ref='listRef'
        v-bind='$attrs'
        :request-api='queryDepositPageList'
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
            </div> -->
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
                                <span v-if='item.txid' class='copy-btn' :data-clipboard-text='item.txid' @click='copyTXID($event)'>
                                    <img alt='' src='@/assets/copy.png' srcset='' />
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
        </template>
    </list>
</template>

<script>
import list from './list'
import { queryDepositPageList } from '@/api/user'
import { computed, ref, unref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
    components: { list },
    setup (props) {
        console.log('456')
        const route = useRoute()
        const store = useStore()
        const { accountId } = route.query
        const customInfo = computed(() => store.state._user.customerInfo)
        const formatTime = (val) => {
            return window.dayjs(val).format('YYYY/MM/DD HH:mm:ss')
        }
        const requestParams = ref({
            startTime: window.dayjs(window.dayjs().subtract(7, 'day').format('YYYY/MM/DD')).valueOf(),
            endTime: window.dayjs().endOf('day').valueOf()
        })

        const params = computed(() => {
            return {
                customerNo: customInfo.value.customerNo,
                ...requestParams.value
            }
        })

        const setParams = (params) => {
            requestParams.value = params || {}
        }

        const listRef = ref(null)

        const refresh = () => {
            unref(listRef) && unref(listRef).refresh()
        }
        return {
            listRef,
            requestParams,
            setParams,
            refresh,
            formatTime,
            params,
            queryDepositPageList
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
