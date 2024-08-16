<template>
    <list
        ref='listRef'
        v-bind='$attrs'
        :request-api='queryDepositPageList'
        :request-params='params'
    >
        <template #default='{ list }'>
            <van-collapse
                v-for='(item, index) in list'
                :key='index'
                v-model='activeIndex'
                accordion
                @change='handleFold(index)'
            >
                <van-collapse-item :name='index+1'>
                    <template #title>
                        <div class='li'>
                            <p>{{ formatTime(item.createTime) }}</p>
                            <p class='title'>
                                <span>{{ item.depositCurrency }}</span>
                                <span>{{ item.intendAmount }}</span>
                            </p>
                            <p>
                                <span>{{ item.blockchainName }}</span>
                                <span :class='stateClasas(item.checkStatus, item.depositStatus)'>
                                    {{ handleState(item.checkStatus, item.depositStatus) }}
                                </span>
                            </p>
                        </div>
                    </template>
                    <template #right-icon>
                        <van-icon :name='activeIndex === index+1 ? "arrow-up" : "arrow-down"' :style="{ marginTop: '8px' }" />
                    </template>
                    <div class='withdraw-desc'>
                        <div class='w-item'>
                            <span>
                                {{ $t('deposit.cashAmount') }}
                            </span>
                            <span>
                                {{ item.intendAmount }} {{ item.depositCurrency }}
                            </span>
                        </div>
                        <div class='w-item'>
                            <span>
                                {{ $t('common.fee') }}
                            </span>
                            <span v-if='item.depositFee'>
                                {{ item.depositFee }} {{ item.depositCurrency }}
                            </span>
                            <span v-else>
                                --
                            </span>
                        </div>
                        <div class='w-item'>
                            <span>
                                {{ $t('common.enterAccount') }}
                            </span>
                            <span v-if='item.finalAmount'>
                                {{ item.finalAmount }} {{ item.depositCurrency }}
                            </span>
                            <span v-else>
                                --
                            </span>
                        </div>
                        <div class='w-item'>
                            <span>
                                {{ $t('common.status') }}
                            </span>
                            <span class='right-val' :class='stateClasas(item.checkStatus, item.depositStatus)'>
                                {{ handleState(item.checkStatus, item.depositStatus) }}
                            </span>
                        </div>
                        <div class='w-item'>
                            <div class='w-20'>
                                TXID
                            </div>
                            <span class='right-val'>
                                <span class='val'>
                                    {{ item.txid || '--' }}
                                </span>
                            </span>
                        </div>
                        <div class='w-item'>
                            <span>
                                {{ $t('deposit.submitTime') }}
                            </span>
                            <span>
                                {{ formatTime(item.createTime) }}
                            </span>
                        </div>
                        <div class='w-item'>
                            <span>
                                {{ $t('deposit.arriveTime') }}
                            </span>
                            <span>
                                {{ item.depositStatus === 2 ? formatTime(item.updateTime) : '--' }}
                            </span>
                        </div>
                        <div class='w-item'>
                            <span>
                                {{ $t('common.remark') }}
                            </span>
                            <span>
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
import { queryDepositPageList } from '@/api/user'
import { computed, ref, unref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import list from './list'
export default {
    components: { list },
    setup (props) {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
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
        const activeIndex = ref(0)

        const setParams = (params) => {
            requestParams.value = params || {}
        }

        const listRef = ref(null)

        const refresh = () => {
            unref(listRef) && unref(listRef).refresh()
        }
        const handleFold = (val) => {
            activeIndex.value = val
        }
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

        const stateClasas = (checkStatus, depositStatus) => {
            // 存款成功 待支付 已取消
            if (Number(depositStatus) === 2) {
                return 'text-success'
            } else if (Number(checkStatus) === 3) {
                return 'text-warn'
            } else {
                return 'text-minorColor'
            }
        }
        return {
            listRef,
            requestParams,
            setParams,
            refresh,
            formatTime,
            params,
            handleFold,
            handleState,
            stateClasas,
            activeIndex,
            queryDepositPageList
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.li {
    width: 100%;
    height: 96px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 8px 12px 8px 10px;
    font-size: 12px;
    color: #999999;
    background-color: var(--contentColor);
    & > p {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        white-space: nowrap;
        line-height: 1.5;
    }
    .title {
        font-size: 16px;
        color: var(--primaryText);
    }
}
.withdraw-desc {
    width: calc(100% + 24px);
    height: calc(100% + 32px);
    padding: 8px 18px;
    background: #FAF9F9;
    margin: -16px 0 0 -12px;
    .w-item {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: #999999;
        padding: 8px 0;
        & > span:last-of-type {
            color: var(--primaryText);
        }
        & > .text-success {
          color: var(--success) !important;
        }
        & > .text-warn {
          color: var(--warn) !important;
        }
        & > .text-minorColor {
          color: var(--minorColor) !important;
        }
    }
}
</style>
