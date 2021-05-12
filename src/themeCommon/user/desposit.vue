<template>
    <div class='pageWrap'>
        <Top
            back
            left-icon='arrow-left'
            :menu='false'
            :right-action='rightAction'
            :show-center='true'
            @rightClick='toDespositList'
        />
        <Loading :show='loading' />
        <div class='wrap'>
            <p class='header-text'>
                请选择充值金额
            </p>
            <div class='amount-list'>
                <div v-for='(item,index) in amountList' :key='index' class='amount-item' :class='{ active: currIndex === index }' @click='checkAmount(index,item)'>
                    <p class='t1'>
                        {{ item.amount }} {{ checkedType.accountCurrency }}
                    </p>
                <!-- <p class='t2'>
                        赠送${{ item.present }}
                    </p> -->
                </div>
                <div class='amount-item' :class='{ active: currIndex === 99 }' @click='openOtherMoney'>
                    其它金额
                </div>
            </div>
            <div v-show='otherAmountVis' class='other-money'>
                <input v-model='amount' class='input-amount' placeholder='请输入金额' type='number' />
                <span class='label-amount'>
                    {{ checkedType.accountCurrency }}
                </span>
            </div>
            <div class='pay-wrap'>
                <p class='bw-t'>
                    请选择支付方式
                </p>

                <div class='pay-item'>
                    <div v-if='PayTypes.length > 0' class='pay-type' @click='openSheet'>
                        <img alt='' :src='require("../../assets/payment_icon/" + checkedType.paymentType + ".png")' srcset='' />
                        <span class='pay-name'>
                            {{ checkedType.paymentTypeAlias || checkedType.paymentType }}
                        </span>
                        <van-icon name='arrow-down' />
                    </div>
                    <div v-else class='pay-type no-data'>
                        暂无可用的支付通道
                    </div>
                    <div class='notice'>
                        <div class='left-val'>
                            <span class='label'>
                                存款时间 :
                            </span>
                            <div class='left-time'>
                                <p v-for='(item,index) in resultTimeMap[checkedType.id]' :key='index'>
                                    {{ item }}
                                </p>
                            </div>
                        </div>
                        <span class='right-val'>
                            金额限制 : {{ checkedType.singleLowAmount }}-{{ checkedType.singleHighAmount }} {{ checkedType.accountCurrency }}
                        </span>
                    </div>
                </div>
            </div>

            <div class='pay-info'>
                <div class='pi-item'>
                    预计支付 {{ computeExpectedpay || '--' }} {{ checkedType.paymentCurrency }}
                </div>
                <div class='pi-item'>
                    预计到账 {{ amount && checkedType ? parseFloat(amount) - parseFloat(checkedType.fee) : '--' }} {{ amount ? checkedType.accountCurrency : '' }}
                </div>
                <div class='line'></div>
                <!-- <div class='pi-item'>
                    赠送金额 {{ presentAmount || '--' }} {{ checkedType.accountCurrency }}
                </div> -->
                <div class='pi-item'>
                    手续费 {{ computeFee || '--' }} {{ checkedType.accountCurrency }}
                </div>
            </div>
        </div>
    </div>

    <van-button block class='next-btn' :disabled='btnDisabled' type='primary' @click='next'>
        <span>下一步</span>
    </van-button>

    <van-action-sheet v-model:show='typeShow' :round='false' title='选择支付方式'>
        <div class='pay-list'>
            <div v-for='(item,index) in payTypesSortEnable' :key='index' class='pay-type' @click='choosePayType(item)'>
                <img alt='' :src='require("../../assets/payment_icon/" + item.paymentType + ".png")' srcset='' />
                <span class='pay-name'>
                    {{ item.paymentTypeAlias || item.paymentType }}
                </span>
                <van-icon v-if='item.checked' class='icon-success' color='#53C51A' name='success' />
            </div>
            <div v-for='(item,index) in payTypesSortDisable' :key='index' class='pay-type' @click='choosePayType(item)'>
                <img alt='' :src='require("../../assets/payment_icon/" + item.paymentType + ".png")' srcset='' />
                <span class='pay-name'>
                    {{ item.paymentTypeAlias || item.paymentType }}
                </span>
                <van-icon v-if='item.checked' class='icon-success' color='#53C51A' name='success' />
            </div>
        </div>
    </van-action-sheet>

    <van-dialog
        v-model:show='despositVis'
        cancel-button-text='否，关闭'
        class-name='desposit-dialog'
        confirm-button-text='是的，已支付'
        :show-cancel-button='true'
        theme='round-button'
        @cancel='onCancel'
        @confirm='onConfirm'
    >
        <h4>支付确认</h4>
        <p class='title'>
            您是否已完成该笔充值支付?
        </p>
    </van-dialog>
</template>

<script>
import Top from '@/components/top'
import {
    onBeforeMount,
    reactive,
    computed,
    toRefs
} from 'vue'
import {
    useRoute,
    useRouter
} from 'vue-router'
import {
    queryPayType,
    queryDepositExchangeRate,
    handleDesposit,
    checkKycApply
} from '@/api/user'
import {
    useStore
} from 'vuex'
import {
    Toast,
    Dialog
} from 'vant'
import {
    isEmpty
} from '@/utils/util'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import isBetween from 'dayjs/plugin/isBetween'
import {
    mul
} from '@/utils/calculation'
dayjs.extend(isBetween)

dayjs.extend(utc)
export default {
    components: {
        Top
    },
    setup (props) {
        const route = useRoute()
        const router = useRouter()
        const store = useStore()

        const rightAction = {
            title: '存款记录'
        }
        const amountList = [
            {
                amount: 50,
                present: 5
            },
            {
                amount: 100,
                present: 10
            }, {
                amount: 500,
                present: 50
            }, {
                amount: 1000,
                present: 100
            }, {
                amount: 2000,
                present: 200
            }
        ]

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        // 计算存款手续费
        const computeFee = computed(() => {
            // feeType  1：固定金额手续费 2：百分比手续费
            if (Number(state.checkedType.feeType === 1)) {
                return state.checkedType.fee
            } else if (Number(state.checkedType.feeType === 2)) {
                return mul(state.amount, (state.checkedType.fee / 100))
            }
        })

        // 计算预计支付金额
        const computeExpectedpay = computed(() => {
            // 计算方式：存款金额 * 汇率
            return mul(state.amount, state.rateConfig.exchangeRate)
        })

        // 处理支付通道排序
        const payTypesSortEnable = computed(() => {
            if (state.PayTypes.length > 0) {
                const temp = state.PayTypes.filter(item => item.timeRangeFlag)

                return temp
            }
        })

        const payTypesSortDisable = computed(() => {
            if (state.PayTypes.length > 0) {
                return state.PayTypes.filter(item => !item.timeRangeFlag)
            }
        })

        const state = reactive({
            otherAmountVis: false,
            currIndex: 0,
            amount: 50,
            typeShow: false,
            PayTypes: [],
            checkedType: '',
            rateConfig: '',
            presentAmount: 5,
            loading: false,
            despositVis: false,
            btnDisabled: false,
            resultTimeMap: {}

        })

        // 判断sessionStorage 里面有没有保存proposalNo，有则弹窗提醒
        if (sessionStorage.getItem('proposalNo')) {
            state.despositVis = true
        }

        const checkAmount = (index, item) => {
            state.otherAmountVis = false
            state.currIndex = index
            state.amount = item.amount
            state.presentAmount = item.present
        }

        const toDespositList = () => {
            router.push({
                path: '/despositRecord'
            })
        }
        const openSheet = () => {
            state.typeShow = true
        }

        const choosePayType = (item) => {
            state.checkedType = item
            payTypesSortEnable.value && payTypesSortEnable.value.map(item => {
                item.checked = false
            })
            payTypesSortDisable.value && payTypesSortDisable.value.map(item => {
                item.checked = false
            })
            item.checked = true
            state.typeShow = false
            getDepositExchangeRate()
        }

        const openOtherMoney = () => {
            state.otherAmountVis = !state.otherAmountVis
            state.amount = ''
            state.currIndex = 99
            state.presentAmount = ''
        }

        // 获取支付通道
        const getPayTypes = () => {
            const params = {
                customerNo: customInfo.value.customerNo,
                customerGroupId: customInfo.value.customerGroupId,
                clientType: 'mobile',
                accountCurrency: customInfo.value.currency,
            }
            state.loading = true
            queryPayType(params).then(res => {
                if (res.check()) {
                    state.loading = false
                    if (res.data && res.data.length > 0) {
                        state.PayTypes = res.data
                        // 处理时区时间
                        handleShowTime()
                        getDepositExchangeRate()
                    }
                } else {
                    state.loading = false
                    state.btnDisabled = true
                    Toast(res.msg)
                }
            }).catch(err => {
                state.loading = false
            })
        }

        // 获取存款货币对汇率
        const getDepositExchangeRate = () => {
            const param = {
                customerNo: customInfo.value.customerNo,
                accountId: customInfo.value.accountId,
                accountCurrency: customInfo.value.currency,
                paymentCurrency: state.checkedType.paymentCurrency,
            }
            state.loading = true
            queryDepositExchangeRate(param).then(res => {
                state.loading = false
                if (res.check()) {
                    state.rateConfig = res.data
                } else {
                    Toast(res.msg)
                }
            }).catch(err => {
                state.loading = false
            })
        }

        const handleShowTime = () => {
            if (state.PayTypes.length > 0) {
                const todayStr = dayjs().format('YYYY-MM-DD')

                state.PayTypes.forEach(payItem => {
                    const openTime = payItem.openTime
                    let openTimeList
                    if (!isEmpty(openTime)) {
                        openTimeList = openTime.split(',')
                        openTimeList.forEach(item => {
                            state.resultTimeMap[payItem.id] = []
                            const [start, end] = item.split('-')
                            const startLocal = dayjs.utc(`${todayStr} ${start}`).local()
                            const endLocal = dayjs.utc(`${todayStr} ${end}`).local()

                            if (endLocal.isAfter(todayStr, 'day')) {
                                state.resultTimeMap[payItem.id].push(startLocal.format('HH:mm') + '-23:59')
                                state.resultTimeMap[payItem.id].push('00:00-' + endLocal.format('HH:mm'))
                            } else {
                                state.resultTimeMap[payItem.id].push(startLocal.format('HH:mm') + '-' + endLocal.format('HH:mm'))
                            }

                            const nowDate = dayjs()

                            // 判断当前时间是否在设置的存款时间内
                            if (nowDate.isBetween(startLocal, endLocal)) {
                                payItem.timeRangeFlag = true
                                state.checkedType = payItem
                                state.checkedType.checked = true
                            }
                        })
                    }
                })
            }
        }

        const timeList = computed(() => {
            if (!isEmpty(state.checkedType)) {
                return state.checkedType.openTime.split(',')
            }
        })

        // 创建存款提案
        const next = () => {
            if (!state.amount) {
                return Toast('请输入存款金额')
            }
            if (Number(state.amount) < Number(state.checkedType.singleLowAmount)) {
                return Toast(`存款金额不能小于${state.checkedType.singleLowAmount}`)
            }
            if (Number(state.amount > Number(state.checkedType.singleHighAmount))) {
                return Toast(`存款金额不能大于${state.checkedType.singleHighAmount}`)
            }

            const params = {
                customerNo: customInfo.value.customerNo,
                accountId: customInfo.value.accountId,
                customerGroupId: customInfo.value.customerGroupId,
                depositRateSerialNo: state.rateConfig.depositRateSerialNo,
                paymentCurrency: state.checkedType.paymentCurrency,
                accountCurrency: state.rateConfig.accountCurrency,
                exchangeRate: state.rateConfig.exchangeRate,
                paymentChannelCode: state.checkedType.paymentCode,
                paymentChannelType: state.checkedType.paymentType,
                paymentChannelClientType: 'mobile',
                depositAmount: state.amount,
                country: customInfo.value.country,
                channelCode: customInfo.value.utmSource,
                depositFrom: 'H5',
                callbackUrl: window.location.host + '/despositCb'
            }
            state.loading = true
            handleDesposit(params).then(res => {
                state.loading = false
                if (res.check()) {
                    if (res.data.browserOpenUrl) {
                        console.log(res.data)
                        sessionStorage.setItem('proposalNo', res.data.proposalNo)
                        window.location.href = res.data.browserOpenUrl
                    }
                } else {
                    Toast(res.msg)
                }
            }).catch(err => {
                state.loading = false
            })
        }

        // 计算存款时间
        const computeTime = (val) => {
            if (!isEmpty(val)) {
                // 0 点时的时间戳
                const time = (dayjs(new Date(new Date(new Date().toLocaleDateString()).getTime()))).valueOf()
                if (Number(val) === 1440) {
                    return '24:00'
                } else {
                    return dayjs(time + val * 60 * 1000).format('HH:mm')
                }
            }
        }

        const onConfirm = () => {
            sessionStorage.removeItem('proposalNo')
            router.replace('/position')
        }

        const onCancel = () => {
            sessionStorage.removeItem('proposalNo')
            state.despositVis = false
        }

        const checkKyc = () => {
            state.loading = true
            checkKycApply({
                businessCode: 'cashin'
            }).then(res => {
                state.loading = false
                if (Number(res.data) !== 2) {
                    return Dialog.alert({
                        theme: 'round-button',
                        title: '提示',
                        confirmButtonText: Number(res.data) === 1 ? '去查看' : '去认证',
                        message: Number(res.data) === 2 ? 'KYC审核中，请耐心等待' : '当前操作需要KYC认证',
                    }).then(() => {
                        router.replace({
                            name: 'Authentication',
                            query: {
                                businessCode: 'cashin'
                            }
                        })
                    })
                }
                getPayTypes()
            }).catch(err => {
                state.loading = false
                console.log(err)
            })
        }

        onBeforeMount(() => {
            // 检测客户组配置是否可存款
            if (Number(customInfo.value.deposit) === 0) {
                state.btnDisabled = true
                return Dialog.confirm({
                    title: '提示',
                    theme: 'round-button',
                    message: '账户暂不能存款，如有疑问请联系在线客服',
                    confirmButtonText: '联系客服',
                    cancelButtonText: '关闭'
                }).then(() => {
                    // on confirm
                }).catch(() => {
                    // on cancel
                })
            } else {
                // 检测存款是否需要kyc
                checkKyc()
            }
        })

        return {
            rightAction,
            amountList,
            checkAmount,
            toDespositList,
            openSheet,
            ...toRefs(state),
            choosePayType,
            openOtherMoney,
            getDepositExchangeRate,
            next,
            computeTime,
            onCancel,
            onConfirm,
            computeFee,
            timeList,
            handleShowTime,
            computeExpectedpay,
            payTypesSortEnable,
            payTypesSortDisable
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    background-color: #F6F6F6;
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: rem(40px) rem(30px);
    }
    .wrap {
        background-color: var(--bgColor);
        .header-text {
            padding: rem(46px) rem(30px) rem(40px) rem(30px);
            color: var(--color);
            font-size: rem(28px);
        }
        .amount-list {
            display: flex;
            flex-flow: row wrap;
            flex-wrap: wrap;
            align-content: flex-start;
            align-items: center;
            justify-content: space-between;
            padding: 0 rem(30px);
            .amount-item {
                display: flex;
                flex: 1;
                flex-basis: rem(30px);
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 47%;
                min-width: 47%;
                max-width: 47%;
                height: rem(80px);
                margin-bottom: rem(30px);
                text-align: center;
                border: rem(2px) solid var(--bdColor);
                border-radius: rem(10px);
                .t1 {
                    color: var(--color);
                    font-size: rem(28px);
                }
                .t2 {
                    color: var(--btnSelected);
                    font-size: rem(20px);
                }
                &.active {
                    border: rem(2px) solid var(--btnSelected);
                }
            }
        }
        .other-money {
            display: flex;
            margin-top: rem(32px);
            padding: 0 rem(30px) rem(35px) rem(30px);
            border-bottom: solid 1px var(--bdColor);
            .input-amount {
                flex: 1;
            }
            .label-amount {
                color: var(--color);
                font-size: rem(28px);
            }
        }
        .pay-wrap {
            padding: 0 rem(30px);
            border-top: solid rem(20px) var(--btnColor);
            .bw-t {
                color: var(--color);
                font-size: rem(28px);
                line-height: rem(72px);
            }
            .notice {
                display: flex;
                justify-content: space-between;
                line-height: rem(72px);
                .left-val {
                    display: flex;
                    //align-items: center;
                    color: var(--mutedColor);
                    .label{

                    }
                    .left-time {
                        padding: rem(16px) 0;
                        p {
                            line-height: rem(40px);
                        }
                    }
                }
                .right-val {
                    color: var(--mutedColor);
                }
            }
        }
    }
    .pay-info {
        display: flex;
        flex-flow: row wrap;
        align-content: flex-start;
        margin-top: rem(20px);
        padding: 0 rem(30px);
        background-color: #FFF;
        border-top: solid rem(20px) var(--btnColor);
        .pi-item {
            flex: 0 0 50%;
            color: var(--mutedColor);
            font-size: rem(24px);
            line-height: rem(96px);
        }
        .line {
            width: 100%;
            height: 1px;
            background-color: var(--btnLine);
        }
    }
}
.pay-type {
    display: flex;
    align-items: center;
    justify-content: center;
    border: rem(2px) solid #E5E5E5;
    border-radius: rem(4px);
    .pay-name {
        flex: 1;
    }
    img {
        width: rem(55px);
        height: rem(55px);
        margin: rem(20px) rem(30px);
    }
    .van-icon {
        margin-right: rem(20px);
    }
    &.no-data {
        line-height: rem(80px);
    }
}
.pay-list .pay-type {
    border-color: var(--bdColor);
    border-style: solid;
    border-width: 0 0 1px;
}
.next-btn {
    position: fixed;
    bottom: 0;
    background: var(--bdColor);
    border-color: var(--bdColor);
    span {
        color: var(--color);
        font-size: rem(34px);
    }
}
</style>

<style lang="scss">
@import '@/sass/mixin.scss';
.desposit-dialog {
    padding: rem(30px) rem(30px) 0 rem(30px);
    text-align: center;
    .van-icon-info-o {
        font-size: rem(60px);
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
</style>
