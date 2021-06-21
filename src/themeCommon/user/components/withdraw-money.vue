<template>
    <div class='pageWrap'>
        <Loading :show='loading' />
        <div class='empty'></div>
        <div class='wrap'>
            <p class='header-text'>
                {{ $t('withdrawMoney.moneyName') }}
            </p>
            <div class='field-wrap'>
                <input v-model='amount' :placeholder="$t('withdrawMoney.moneyPlaceholder')" type='number' />
                <button class='get-btn' plain round size='small' @click='getAll'>
                    {{ $t('withdrawMoney.allBtn') }}
                </button>
            </div>
            <div class='notice'>
                <span>{{ $t('withdrawMoney.canName') }} {{ withdrawAmount || '--' }} {{ accountCurrency }}</span>
                <span>{{ $t('withdrawMoney.serviceName') }} {{ fee }} {{ accountCurrency }}</span>
            </div>
            <div class='bank-wrap'>
                <p class='bw-t'>
                    {{ $t('withdrawMoney.bankName') }}
                </p>
                <div v-if='bankList.length > 0' class='bank' @click='openSheet'>
                    <i class='bank-icons-sm' :class="'bk-'+ checkedBank.bankCode"></i>
                    <span class='bank-no'>
                        {{ checkedBank.bankName }} {{ hideMiddle(checkedBank.bankCardNumber) }}
                    </span>
                    <van-icon name='arrow-down' />
                </div>
                <div v-else class='bank no-data'>
                    <span>{{ $t('withdrawMoney.bankNone') }}</span>
                    <van-button plain round size='mini' type='success' @click='toAddBank'>
                        {{ $t('withdrawMoney.addBtn') }}
                    </van-button>
                </div>
                <p class='bw-t2'>
                    {{ $t('withdrawMoney.predictName') }} {{ computePre }} {{ checkedBank.bankCurrency }}
                </p>
            </div>
        </div>
    </div>

    <van-button block class='confirm-btn' :disabled='btnDisabled' type='primary' @click='confirm'>
        <span>{{ $t('withdraw.confirm') }}</span>
    </van-button>
    <van-action-sheet v-model:show='show' :round='false' :title="$t('withdrawMoney.bankPopupTitle')">
        <div class='bank-list'>
            <div v-for='(item, index) in bankList' :key='index' class='bank' @click='chooseBank(item)'>
                <i class='bank-icons-sm' :class="'bk-'+ item.bankCode"></i>
                <span class='bank-no'>
                    {{ item.bankName }} {{ hideMiddle(item.bankCardNumber) }}
                </span>
                <van-icon v-if='item.checked' class='icon-success' color='#53C51A' name='success' />
            </div>
            <div class='add-bank' @click='toAddBank'>
                <van-icon class='icon-plus' name='plus' size='13' />
                <span>{{ $t('withdrawMoney.bankPopupBtn') }}</span>
                <van-icon class='icon-arrow' name='arrow' size='13' />
            </div>
        </div>
    </van-action-sheet>
    <van-dialog v-model:show='withdrawSuccess' class-name='add-success' :confirm-button-text="$t('withdraw.backHome')" :show-cancel-button='false' @confirm='$router.push("/quote")'>
        <i class='icon_success'></i>
        <p class='title'>
            {{ $t('withdraw.successText') }}
        </p>
        <p class='content'>
            {{ $t('withdraw.successMsg') }}
        </p>
    </van-dialog>
    <van-dialog v-model:show='timeShow' theme='round-button' :title="$t('withdraw.hint')">
        <div class='time-wrap'>
            <h4>{{ $t('withdraw.timeHint') }} </h4><br />
            <div v-if='timeList.length > 0' class='flex'>
                <p>{{ $t('withdraw.timeName') }}：</p>
                <div class='time-text'>
                    <p v-for='(item,index) in timeList' :key='index'>
                        {{ item.weekDay }}：{{ item.openTimeLocal.toString() }}
                    </p><br />
                </div>
            </div>
        </div>
    </van-dialog>
</template>

<script>
import {
    reactive,
    computed,
    toRefs,
    onBeforeMount,
    watchEffect
} from 'vue'
import {
    useRouter
} from 'vue-router'
import {
    Toast,
    Dialog
} from 'vant'
import {
    isEmpty
} from '@/utils/util'
import {
    useStore
} from 'vuex'
import { mul } from '@/utils/calculation'
import {
    handleWithdraw,
    queryWithdrawConfig,
    queryWithdrawRate,
    queryBankList,
    computeWithdrawFee,
    checkKycApply
} from '@/api/user'
import dayjs from 'dayjs'
// import utc from 'dayjs/plugin/utc'
// dayjs.extend(utc)
// i18n
import { useI18n } from 'vue-i18n'

export default {
    setup (props) {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const router = useRouter()

        const weekdayMap = {
            1: t('weekdayMap.1'),
            2: t('weekdayMap.2'),
            3: t('weekdayMap.3'),
            4: t('weekdayMap.4'),
            5: t('weekdayMap.5'),
            6: t('weekdayMap.6'),
            7: t('weekdayMap.7')
        }

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const accountCurrency = computed(() => {
            return state.withdrawConfig ? state.withdrawConfig.withdrawAmountConfig.accountCurrency : ''
        })
        const onlineServices = computed(() => store.state._base.wpCompanyInfo?.onlineService)

        const timeList = computed(() => {
            const timeConfigList = state.withdrawTimeConfigMap
            const tempList = []

            if (!isEmpty(timeConfigList)) {
                for (const key in timeConfigList) {
                    if (Object.hasOwnProperty.call(timeConfigList, key)) {
                        const item = timeConfigList[key]
                        if (!isEmpty(item.openTimeLocal)) {
                            tempList.push({
                                weekDay: weekdayMap[item.weekDay],
                                openTimeLocal: item.openTimeLocal
                            })
                        }
                    }
                }
            }
            return tempList
        })

        // 计算取款手续费
        const computePre = computed(() => {
            return mul((state.amount - state.fee), state.withdrawRate.exchangeRate)
        })

        // 计算可取金额
        const withdrawAmount = computed(() => {
            if (!isEmpty(state.withdrawConfig)) {
                return state.withdrawConfig.withdrawAmount
            } else {
                return 0
            }
        })

        const state = reactive({
            amount: '',
            fee: '0.00',
            loading: false,
            show: false,
            checkedBank: {},
            withdrawRate: '',
            withdrawConfig: '',
            bankList: [],
            fun: null,
            withdrawSuccess: false,
            btnDisabled: false,
            withdrawCurrency: '',
            timeShow: false,
            withdrawTimeConfigMap: {} // 处理后的时区
        })

        const getWithdrawFee = (amount) => {
            if (parseFloat(state.amount) < parseFloat(state.withdrawConfig.withdrawAmountConfig.singleLowAmount)) {
                state.btnDisabled = true
                state.fee = '0.00'
                return Toast(`${t('withdrawMoney.hint_3')}${state.withdrawConfig.withdrawAmountConfig.singleLowAmount}`)
            }

            if (parseFloat(state.amount) > parseFloat(state.withdrawConfig.withdrawAmountConfig.singleHighAmount)) {
                state.btnDisabled = true
                state.fee = '0.00'
                return Toast(`${t('withdrawMoney.hint_4')}${state.withdrawConfig.withdrawAmountConfig.singleHighAmount}`)
            }

            const params = {
                accountId: customInfo.value.accountId,
                accountCurrency: customInfo.value.currency,
                amount: parseFloat(state.amount),
                companyId: customInfo.value.companyId,
                customerNo: customInfo.value.customerNo,
                customerGroupId: customInfo.value.customerGroupId,
                country: customInfo.value.country,
                withdrawCurrency: customInfo.value.currency,
                withdrawType: 1,
                withdrawMethod: 'bank'
            }
            state.btnDisabled = true
            // state.fee = '计算中...'
            computeWithdrawFee(params).then(res => {
                if (res.check()) {
                    state.btnDisabled = false
                    state.fee = res.data
                } else {
                    state.btnDisabled = true
                    state.fee = '0.00'
                }
            })
        }

        const transferUtc = () => {
            const todayStr = dayjs().format('YYYY-MM-DD')
            state.withdrawConfig.withdrawTimeConfigList.forEach(el => {
                el.openTimeLocal = []
                state.withdrawTimeConfigMap[el.weekDay] = el
            })
            for (const key in state.withdrawTimeConfigMap) {
                if (Object.hasOwnProperty.call(state.withdrawTimeConfigMap, key)) {
                    const el = state.withdrawTimeConfigMap[key]
                    if (!isEmpty(el.openTime)) {
                        const timeRange = el.openTime.split(',')
                        if (timeRange.length > 0) {
                            timeRange.forEach(timeRangeItem => {
                                const [start, end] = timeRangeItem.split('-')
                                const startLocal = dayjs.utc(`${todayStr} ${start}`).local()
                                const endLocal = dayjs.utc(`${todayStr} ${end}`).local()

                                // 第二天
                                const weekDay = key < 7 ? Number(key) + 1 : 1
                                let elNext = state.withdrawTimeConfigMap[weekDay]

                                if (!elNext) {
                                    elNext = {
                                        openTimeLocal: [],
                                        weekDay
                                    }
                                    state.withdrawTimeConfigMap[weekDay] = elNext
                                }
                                if (startLocal.isAfter(todayStr, 'day')) {
                                    elNext.openTimeLocal.push(startLocal.format('HH:mm') + '-' + endLocal.format('HH:mm'))
                                } else if (endLocal.isAfter(todayStr, 'day')) {
                                    elNext.openTimeLocal.push('00:00-' + endLocal.format('HH:mm'))
                                    el.openTimeLocal.push(startLocal.format('HH:mm') + '-23:59')
                                } else if (el.openTime !== '00:00-00:00' || el.openTime !== '') {
                                    el.openTimeLocal.push(startLocal.format('HH:mm') + '-' + endLocal.format('HH:mm'))
                                }
                            })
                        }
                    }
                }
            }
        }

        const debounceFn = () => {
            if (parseFloat(state.amount) > 0) {
                return setTimeout(getWithdrawFee, 300)
            }
        }

        /* 防抖 */
        watchEffect((onInvalidate) => {
            const timer = debounceFn() // 再重新生成定时器
            onInvalidate(() => { // watchEffect里面先执行这个函数，即是清除掉之前的定时器
                clearTimeout(timer)
            })
        })

        const openSheet = () => {
            state.show = true
        }

        // 选择银行卡
        const chooseBank = (item) => {
            // 获取取款汇率
            getWithdrawRate()
            state.withdrawCurrency = item.bankCurrency
            state.checkedBank = item
            state.bankList.map(item => {
                item.checked = false
            })
            item.checked = true
            state.show = false
        }

        const toAddBank = () => {
            router.push('/addBank')
        }

        // 全部取出
        const getAll = () => {
            state.amount = state.withdrawConfig.withdrawAmount
        }

        const confirm = () => {
            if (state.amount <= 0) {
                state.amount = 0
                return Toast(t('withdrawMoney.hint_1'))
            }

            if (isEmpty(state.checkedBank)) {
                return Toast(t('withdrawMoney.hint_2'))
            }

            if (parseFloat(state.amount) < parseFloat(state.withdrawConfig.withdrawAmountConfig.singleLowAmount)) {
                return Toast(`${t('withdrawMoney.hint_3')}${state.withdrawConfig.withdrawAmountConfig.singleLowAmount}`)
            }

            if (parseFloat(state.amount) > parseFloat(state.withdrawConfig.withdrawAmountConfig.singleHighAmount)) {
                return Toast(`${t('withdrawMoney.hint_4')}${state.withdrawConfig.withdrawAmountConfig.singleHighAmount}`)
            }

            if (parseFloat(state.amount) > parseFloat(state.withdrawConfig.withdrawAmount)) {
                return Toast(t('withdrawMoney.hint_5'))
            }
            state.loading = true

            const params = {
                customerNo: customInfo.value.customerNo, // 客户编号
                accountId: customInfo.value.accountId, // 账户ID
                customerGroupId: customInfo.value.customerGroupId, // 客户组ID
                accountCurrency: customInfo.value.currency, // 账户货币编码
                country: customInfo.value.country,
                withdrawCurrency: state.withdrawRate.withdrawCurrency, // 收款货币
                amount: state.amount, // 提案金额
                rate: state.withdrawRate.exchangeRate, // 发送给平台CATS2使用的取款汇率
                withdrawRateSerialNo: state.withdrawRate.withdrawRateSerialNo, // 取款费率流水号
                bankAccountName: state.checkedBank.bankAccountName, // 银行卡持有者姓名
                bankName: state.checkedBank.bankName, // 银行卡银行名称
                bankCardNo: state.checkedBank.bankCardNumber, // 银行卡号
                withdrawType: 1, // 取款类型
                withdrawMethod: 'bank' // 取款方式
            }

            handleWithdraw(params).then(res => {
                state.loading = false
                if (res.check()) {
                    state.amount = 0
                    state.withdrawSuccess = true
                }
            }).catch(err => {
                state.loading = false
            })
        }

        // 获取取款汇率
        const getWithdrawRate = () => {
            const params = {
                companyId: customInfo.value.companyId,
                customerNo: customInfo.value.customerNo,
                accountId: customInfo.value.accountId,
                accountCurrency: customInfo.value.currency,
                withdrawCurrency: state.withdrawCurrency, // 暂时只支持CNY
            }
            queryWithdrawRate(params).then(res => {
                if (res.check()) {
                    state.withdrawRate = res.data
                } else {
                    state.btnDisabled = true
                    Toast(res.msg)
                }
            })
        }

        // 获取取款限制配置
        const getWithdrawConfig = () => {
            const params = {
                companyId: customInfo.value.companyId,
                customerNo: customInfo.value.customerNo,
                accountId: customInfo.value.accountId,
                customerGroupId: customInfo.value.customerGroupId,
                accountCurrency: customInfo.value.currency,
                country: customInfo.value.country,
                withdrawMethod: 'bank'
            }

            queryWithdrawConfig(params).then(res => {
                if (res.check()) {
                    state.withdrawConfig = res.data

                    if (!res.data.customerGroupEnable) {
                        state.btnDisabled = true
                        return Dialog.confirm({
                            title: t('withdraw.hint'),
                            theme: 'round-button',
                            message: t('withdraw.withdrawLimitHint'),
                            confirmButtonText: t('withdraw.contact'),
                            cancelButtonText: t('withdraw.close')
                        }).then(() => {
                            if (onlineServices.value) { location.href = onlineServices.value }
                        }).catch(() => {
                            // on cancel
                        })
                    } else {
                        // 检测取款是否需要kyc
                        checkKyc()
                    }

                    // 时区转换
                    transferUtc()
                } else {
                    Toast(res.msg)
                }
            })
        }

        const getBankList = () => {
            state.loading = true
            queryBankList().then(res => {
                state.loading = false
                if (res.check()) {
                    if (res.data && res.data.length > 0) {
                        state.bankList = res.data
                        state.checkedBank = res.data[0]
                        state.checkedBank.checked = true
                        state.withdrawCurrency = state.checkedBank.bankCurrency
                        getWithdrawRate()
                    }
                }
            }).catch(err => {
                state.loading = false
            })
        }

        // 处理银行卡号显示
        const hideMiddle = (value) => {
            return `${value.substring(0, 4)} ${'*'.repeat(value.length - 8).replace(/(.{4})/g, '$1 ')}${value.length % 4 ? ' ' : ''}${value.slice(-4)}`
        }

        const checkKyc = () => {
            state.loading = true
            checkKycApply({
                businessCode: 'withdraw'
            }).then(res => {
                state.loading = false
                if (Number(res.data) !== 2) {
                    return Dialog.alert({
                        title: t('withdraw.hint'),
                        theme: 'round-button',
                        confirmButtonText: Number(res.data) === 1 ? t('withdraw.kycBtn_1') : t('withdraw.kycBtn_2'),
                        message: Number(res.data) === 2 ? t('withdraw.kycMsg_1') : t('withdraw.kycMsg_2'),
                    }).then(() => {
                        router.replace({
                            name: 'Authentication',
                            query: {
                                businessCode: 'withdraw'
                            }
                        })
                    })
                } else {
                    if (!state.withdrawConfig.accountActiveEnable) {
                        state.btnDisabled = true
                        return Dialog.confirm({
                            theme: 'round-button',
                            title: t('withdraw.hint'),
                            message: t('withdraw.activateMsg'),
                            confirmButtonText: t('withdraw.activateBtn')
                        }).then(() => {
                            // on confirm
                            router.push('/desposit')
                        }).catch(() => {
                            // on cancel
                        })
                    }

                    if (!state.withdrawConfig.timeEnable) {
                        state.btnDisabled = true
                        state.timeShow = true
                        return
                    }

                    if (!state.withdrawConfig.amountEnable) {
                        state.btnDisabled = true
                        return Toast(t('withdrawMoney.hint_6'))
                    }

                    if (!state.withdrawConfig.hourIn24Enable) {
                        state.btnDisabled = true
                        return Toast(t('withdrawMoney.hint_7') + state.withdrawConfig.withdrawBaseConfig.maxCount + t('withdrawMoney.unit'))
                    }
                }
            }).catch(err => {
                state.loading = false
            })
        }

        onBeforeMount(() => {
            // 获取银行卡列表
            getBankList()
            getWithdrawConfig()
        })

        return {
            ...toRefs(state),
            openSheet,
            chooseBank,
            getAll,
            toAddBank,
            confirm,
            customInfo,
            hideMiddle,
            getWithdrawFee,
            accountCurrency,
            timeList,
            computePre,
            onlineServices,
            withdrawAmount
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    .empty {
        height: rem(20px);
        background-color: #F9F9F9;
    }
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: rem(40px) rem(30px);
    }
    .pageTitle {
        margin-bottom: rem(10px);
        font-weight: normal;
        font-size: rem(50px);
    }
    .wrap {
        padding: 0 rem(30px);
        .header-text {
            margin-top: rem(46px);
            margin-bottom: rem(73px);
            color: var(--color);
            font-size: rem(28px);
        }
        .field-wrap {
            display: flex;
            padding-bottom: rem(18px);
            border-bottom: solid 1px var(--bdColor);
            input {
                flex: 1;
            }
            .get-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: rem(168px);
                height: rem(60px);
                font-size: rem(24px);
                background-color: var(--bgColor);
                border: 1px solid var(--bdColor);
                border-radius: rem(30px);
            }
        }
        .notice {
            display: flex;
            margin-top: rem(30px);
            margin-bottom: rem(40px);
            span {
                flex: 1;
                color: var(--assistColor);
                font-size: rem(24px);
            }
        }
        .bank-wrap {
            margin-top: rem(20px);
            .bw-t {
                color: var(--color);
                font-size: rem(28px);
                line-height: rem(72px);
            }
            .bw-t2 {
                color: var(--assistColor);
                font-size: rem(24px);
                line-height: rem(60px);
            }
        }
    }
}
.confirm-btn {
    position: absolute;
    bottom: 0;
    height: rem(104px);
    background: var(--bdColor);
    border-color: var(--bdColor);
    span {
        color: var(--color);
        font-weight: bold;
        font-size: rem(34px);
    }
}
.bank {
    display: flex;
    align-items: center;
    border: rem(2px) solid #E5E5E5;
    border-radius: rem(4px);
    .bank-no {
        flex: 1;
    }
    .bank-icons-sm {
        margin: rem(30px);
    }
    .van-icon {
        margin-right: rem(20px);
    }
    &.no-data {
        justify-content: center;
        line-height: rem(90px);
        span {
            margin-right: rem(20px);
            vertical-align: middle;
        }
        .van-button {
            padding: 0 rem(20px);
            vertical-align: middle;
        }
    }
}
.bank-list .bank {
    border-color: var(--bdColor);
    border-style: solid;
    border-width: 0 0 1px;
}
.add-bank {
    display: flex;
    align-items: center;
    height: rem(96px);
    .icon-plus {
        margin: rem(20px) rem(45px);
        vertical-align: middle;
    }
    span {
        flex: 1;
        vertical-align: middle;
    }
    .icon-arrow {
        margin-right: rem(30px);
    }
}
</style>

<style lang="scss">
@import '@/sass/mixin.scss';
.add-success {
    padding: rem(30px) rem(30px) 0 rem(30px);
    text-align: center;
    .icon_success {
        color: var(--success);
        font-size: rem(96px);
    }
    .title {
        line-height: rem(80px);
    }
    .content {
        margin: rem(20px) 0;
        color: var(--mutedColor);
        font-size: rem(28px);
    }
}
.time-wrap {
    padding: 0 rem(30px);
    font-size: rem(28px);
    .flex {
        display: flex;
        .time-text {
            flex: 1;
        }
    }
}
</style>
