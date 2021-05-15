<template>
    <div class='pageWrap'>
        <Top
            back
            left-icon='arrow-left'
            :menu='false'
            :right-action='rightAction'
            :show-center='true'
            @rightClick='$router.push({ path: "/withdrawRecord" })'
        />
        <Loading :show='loading' />
        <div class='wrap'>
            <p class='header-text'>
                取款金额
            </p>
            <div class='field-wrap'>
                <input v-model='amount' placeholder='请输入取款金额' type='number' />
                <van-button class='get-btn' plain round size='small' @click='getAll'>
                    全部取出
                </van-button>
            </div>
            <div class='notice'>
                <span>最大可取 {{ withdrawAmount || '--' }} {{ accountCurrency }}</span>
                <span>手续费 {{ fee }} {{ accountCurrency }}</span>
            </div>
            <div class='bank-wrap'>
                <p class='bw-t'>
                    收款银行卡
                </p>
                <div v-if='bankList.length > 0' class='bank' @click='openSheet'>
                    <i class='bank-icons-sm' :class="'bk-'+ checkedBank.bankCode"></i>
                    <span class='bank-no'>
                        {{ checkedBank.bankName }} {{ hideMiddle(checkedBank.bankCardNumber) }}
                    </span>
                    <van-icon name='arrow-down' />
                </div>
                <div v-else class='bank no-data'>
                    <span>暂无银行卡</span>
                    <van-button plain round size='mini' type='success' @click='toAddBank'>
                        去添加
                    </van-button>
                </div>
                <p class='bw-t2'>
                    预计到账 {{ computePre }} {{ checkedBank.bankCurrency }}
                </p>
            </div>
        </div>
    </div>

    <van-button block class='confirm-btn' :disabled='btnDisabled' type='primary' @click='confirm'>
        <span>确定</span>
    </van-button>
    <van-action-sheet v-model:show='show' :round='false' title='选择收款银行卡'>
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
                <span> 新增银行卡</span>
                <van-icon class='icon-arrow' name='arrow' size='13' />
            </div>
        </div>
    </van-action-sheet>
    <van-dialog v-model:show='withdrawSuccess' class-name='add-success' confirm-button-text='返回首页' show-cancel-button='false' @confirm='$router.push("/quote")'>
        <i class='icon_success'></i>
        <p class='title'>
            提交成功
        </p>
        <p class='content'>
            提交成功，等待客服审核
        </p>
    </van-dialog>
    <van-dialog v-model:show='timeShow' theme='round-button' title='提示'>
        <div class='time-wrap'>
            <h4>当前时间不可取款 </h4><br />
            <div v-if='timeList.length > 0' class='flex'>
                <p>取款时间：</p>
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
import Top from '@/components/top'
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
    isEmpty,
    priceFormat
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
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
export default {
    components: {
        Top
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        // const route = useRoute()
        const rightAction = {
            title: '取款记录'
        }

        const weekdayMap = {
            1: '周一',
            2: '周二',
            3: '周三',
            4: '周四',
            5: '周五',
            6: '周六',
            7: '周日',

        }

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const accountCurrency = computed(() => {
            if (state.withdrawConfig) {
                return state.withdrawConfig.withdrawAmountConfig.accountCurrency
            }
        })

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

                return tempList
            }
        })

        // 计算取款手续费
        const computePre = computed(() => {
            return mul((state.amount - state.fee), state.withdrawRate.exchangeRate)
        })

        // 计算可取金额
        const withdrawAmount = computed(() => {
            if (!isEmpty(state.withdrawConfig)) {
                return priceFormat(state.withdrawConfig.withdrawAmount, state.withdrawConfig.digit)
            }
        })

        const state = reactive({
            amount: '',
            fee: 0,
            loading: false,
            show: false,
            maxAmount: 5005.55,
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
                state.fee = 0
                return Toast(`取款金额不能小于${state.withdrawConfig.withdrawAmountConfig.singleLowAmount}`)
            }

            if (parseFloat(state.amount) > parseFloat(state.withdrawConfig.withdrawAmountConfig.singleHighAmount)) {
                state.btnDisabled = true
                state.fee = 0
                return Toast(`取款金额不能大于${state.withdrawConfig.withdrawAmountConfig.singleHighAmount}`)
            }

            const params = {
                customerNo: customInfo.value.customerNo, // 客户编号
                accountId: customInfo.value.accountId, // 账户ID
                customerGroupId: customInfo.value.customerGroupId, // 客户组ID
                accountCurrency: customInfo.value.currency, // 账户货币编码
                amount: parseFloat(state.amount)
            }
            state.btnDisabled = true
            // state.fee = '计算中...'
            computeWithdrawFee(params).then(res => {
                if (res.check()) {
                    state.btnDisabled = false
                    state.fee = res.data
                } else {
                    state.btnDisabled = true
                    state.fee = 0
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
            console.log(state.withdrawTimeConfigMap)
        }

        const debounceFn = () => {
            if (parseFloat(state.amount) > 0) {
                return setTimeout(getWithdrawFee, 300)
            }
        }

        /* 防抖 */
        watchEffect((onInvalidate) => {
            const timer = debounceFn() // 再重新生成定时器
            console.log('change', state.amount)
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
                return Toast('请输入正确的金额')
            }

            if (isEmpty(state.checkedBank)) {
                return Toast('请选择取款银行卡')
            }

            if (parseFloat(state.amount) < parseFloat(state.withdrawConfig.withdrawAmountConfig.singleLowAmount)) {
                return Toast(`取款金额不能小于${state.withdrawConfig.withdrawAmountConfig.singleLowAmount}`)
            }

            if (parseFloat(state.amount) > parseFloat(state.withdrawConfig.withdrawAmountConfig.singleHighAmount)) {
                return Toast(`取款金额不能大于${state.withdrawConfig.withdrawAmountConfig.singleHighAmount}`)
            }

            if (parseFloat(state.amount) > parseFloat(state.withdrawConfig.withdrawAmount)) {
                return Toast('余额不足')
            }
            state.loading = true

            const params = {
                customerNo: customInfo.value.customerNo, // 客户编号
                accountId: customInfo.value.accountId, // 账户ID
                customerGroupId: customInfo.value.customerGroupId, // 客户组ID
                accountCurrency: customInfo.value.currency, // 账户货币编码
                withdrawCurrency: state.withdrawRate.withdrawCurrency, // 收款货币
                amount: state.amount, // 提案金额
                rate: state.withdrawRate.exchangeRate, // 发送给平台CATS2使用的取款汇率
                withdrawRateSerialNo: state.withdrawRate.withdrawRateSerialNo, // 取款费率流水号
                bankAccountName: state.checkedBank.bankAccountName, // 银行卡持有者姓名
                bankName: state.checkedBank.bankName, // 银行卡银行名称
                bankCardNo: state.checkedBank.bankCardNumber, // 银行卡号
                country: 'IOS_3166_156' // country
            }

            handleWithdraw(params).then(res => {
                state.loading = false
                if (res.check()) {
                    console.log('res', res)
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
                customerNo: customInfo.value.customerNo,
                accountId: customInfo.value.accountId,
                customerGroupId: customInfo.value.customerGroupId,
                accountCurrency: customInfo.value.currency // 账户货币编码
            }

            queryWithdrawConfig(params).then(res => {
                if (res.check()) {
                    state.withdrawConfig = res.data

                    if (!res.data.customerGroupEnable) {
                        state.btnDisabled = true
                        return Dialog.confirm({
                            title: '提示',
                            theme: 'round-button',
                            message: '账户暂不能取款，如有疑问请联系在线客服',
                            confirmButtonText: '联系客服',
                            cancelButtonText: '关闭'
                        }).then(() => {
                            // on confirm
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
                console.log(res)
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
                        title: '提示',
                        theme: 'round-button',
                        confirmButtonText: Number(res.data) === 1 ? '去查看' : '去认证',
                        message: Number(res.data) === 2 ? 'KYC审核中，请耐心等待' : '当前操作需要KYC认证',
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
                            title: '提示',
                            message: '账户激活后才可取款',
                            confirmButtonText: '去激活'
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
                        return Toast('可取资金不足')
                    }

                    if (!state.withdrawConfig.hourIn24Enable) {
                        state.btnDisabled = true
                        return Toast('24小时内取款次数不超过' + state.withdrawConfig.withdrawBaseConfig.maxCount + '次')
                    }
                }
            }).catch(err => {
                state.loading = false
                console.log(err)
            })
        }

        onBeforeMount(() => {
            // 获取银行卡列表
            getBankList()
            getWithdrawConfig()
        })

        return {
            rightAction,
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
            withdrawAmount
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    position: relative;
    height: 100%;
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
            .get-btn {}
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
    background: var(--bdColor);
    border-color: var(--bdColor);
    span {
        color: var(--color);
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
