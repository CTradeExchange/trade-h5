<template>
    <Top
        back
        left-icon='arrow-left'
        :menu='false'
        :right-action='rightAction'
        :show-center='true'
        @rightClick='toDespositList'
    />
    <div class='pageWrap'>
        <Loading :show='loading' />
        <div class='wrap'>
            <p class='header-text'>
                {{ $t('deposit.selectAmount') }}
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
                    {{ $t('deposit.otherAmount') }}
                </div>
            </div>
            <div v-show='otherAmountVis' class='other-money'>
                <input v-model='amount' class='input-amount' :placeholder='$t("deposit.inputAmount")' type='number' />
                <span class='label-amount'>
                    {{ checkedType.accountCurrency }}
                </span>
            </div>
            <div class='pay-wrap'>
                <p class='bw-t'>
                    {{ $t('deposit.selectPayMethods') }}
                </p>

                <div v-if='checkedType' class='pay-item'>
                    <div v-if='PayTypes.length > 0' class='pay-type' @click='openSheet'>
                        <img alt='' :src='require("../../../assets/payment_icon/" + checkedType.paymentType + ".png")' srcset='' />
                        <span class='pay-name'>
                            {{ checkedType.paymentTypeAlias || checkedType.paymentType }}
                        </span>
                        <van-icon name='arrow-down' />
                    </div>
                    <div v-else class='pay-type no-data'>
                        {{ $t('deposit.noPayPassway') }}
                    </div>
                    <div v-if='paymentTypes.length > 1' class='currency-wrap'>
                        <van-radio-group v-model='currencyChecked' @change='changePayCurrency'>
                            <van-radio v-for='(item,index) in paymentTypes' :key='index' class='currency-radio' icon-size='20px' :name='item'>
                                {{ item }}
                            </van-radio>
                        </van-radio-group>
                    </div>

                    <div class='notice'>
                        <div class='left-val'>
                            <span class='label'>
                                {{ $t('deposit.depositTime') + $t('common.colon') }}
                            </span>
                            <div class='left-time'>
                                <p v-for='(item,index) in resultTimeMap[checkedType.id]' :key='index'>
                                    {{ item }}
                                </p>
                            </div>
                        </div>
                        <span class='right-val'>
                            {{ $t('deposit.amountLimit') + $t('common.colon') }}  {{ checkedType.singleLowAmount }}-{{ checkedType.singleHighAmount }} {{ checkedType.accountCurrency }}
                        </span>
                    </div>
                </div>
            </div>

            <div class='pay-info'>
                <div class='pi-item'>
                    {{ $t('deposit.expectPay') }} {{ computeExpectedpay || '--' }} {{ currencyChecked }}
                </div>
                <div class='pi-item'>
                    {{ $t('deposit.expectInBank') }} {{ amount && checkedType ? parseFloat(amount) - parseFloat(computeFee) : '--' }} {{ amount ? checkedType.accountCurrency : '' }}
                </div>
                <div class='line'></div>
                <!-- <div class='pi-item'>
                    赠送金额 {{ presentAmount || '--' }} {{ checkedType.accountCurrency }}
                </div> -->
                <div class='pi-item'>
                    {{ $t('common.fee') }} {{ computeFee }} {{ checkedType.accountCurrency }}
                </div>
            </div>
        </div>
    </div>

    <van-button block class='next-btn' :disabled='btnDisabled' type='primary' @click='next'>
        <span>{{ $t('common.nextStep') }}</span>
    </van-button>
    <van-action-sheet v-model:show='typeShow' class='pay-warpper' :round='false' :title='$t("deposit.selectPayMethods")'>
        <div class='pay-list'>
            <div v-for='(item,index) in payTypesSortEnable' :key='index' class='pay-type' @click='choosePayType(item)'>
                <img alt='' :src='require("../../../assets/payment_icon/" + item.paymentType + ".png")' srcset='' />
                <span class='pay-name'>
                    {{ item.paymentTypeAlias || item.paymentType }}
                </span>
                <van-icon v-if='item.checked' class='icon-success' color='#53C51A' name='success' />
            </div>
            <div v-for='(item,index) in payTypesSortDisable' :key='index' class='pay-type' @click='choosePayType(item)'>
                <img alt='' :src='require("../../../assets/payment_icon/" + item.paymentType + ".png")' srcset='' />
                <span class='pay-name'>
                    {{ item.paymentTypeAlias || item.paymentType }}
                </span>
                <van-icon v-if='item.checked' class='icon-success' color='#53C51A' name='success' />
            </div>
        </div>
    </van-action-sheet>

    <van-dialog
        v-model:show='despositVis'
        :cancel-button-text='$t("deposit.denyText")'
        class-name='desposit-dialog'
        :confirm-button-text='$t("deposit.agreeText")'
        :show-cancel-button='true'
        @cancel='onCancel'
        @confirm='onConfirm'
    >
        <h4>{{ $t('deposit.payConfirm') }}</h4>
        <p class='title'>
            {{ $t('deposit.payConfirmTips') }}
        </p>
    </van-dialog>

    <van-popup v-model:show='appendVis' class='append-popup' position='right' :style="{ height: '100%',width: '80%' }">
        <div class='append-wrap'>
            <p class='title'>
                {{ $t('deposit.appendFiled') }}
            </p>
            <van-cell-group inset>
                <van-field
                    v-for='(item,key) in checkedType.extend'
                    :key='key'
                    v-model='appendMap[key].value'
                    :data='item'
                    :label='item[lang]'
                    label-width='70'
                    :placeholder='$t("common.input")+ item[lang]'
                    required='true'
                />
            </van-cell-group>
            <van-button class='confirm-btn' size='large' type='primary' @click='handleAppendField'>
                {{ $t('common.sure') }}
            </van-button>
        </div>
    </van-popup>
</template>

<script>
import Top from '@/components/top'
import { onBeforeMount, reactive, computed, toRefs, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { queryPayType, queryDepositExchangeRate, handleDesposit, checkKycApply, queryDepositProposal } from '@/api/user'
import { getListByParentCode } from '@/api/base'
import { useStore } from 'vuex'
import { Toast, Dialog } from 'vant'
import { isEmpty, sessionGet, localGet } from '@/utils/util'
import dayjs from 'dayjs'
import { mul } from '@/utils/calculation'
import { useI18n } from 'vue-i18n'

export default {
    components: {
        Top
    },
    setup (props) {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const { currency, accountId, tradeType } = route.query

        const rightAction = {
            title: t('deposit.depositRecord')
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

        const state = reactive({
            currencyChecked: '',
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
            resultTimeMap: {},
            paymentTypes: [],
            appendVis: false,
            lang: localGet('lang'),
            appendMap: {},
            paramsExtens: {}
        })

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const onlineServices = computed(() => store.state._base.wpCompanyInfo?.onlineService)

        // 计算存款手续费
        const computeFee = computed(() => {
            if (state.amount >= state.checkedType.singleLowAmount && state.amount <= state.checkedType.singleHighAmount) {
                // feeType  1：固定金额手续费 2：百分比手续费
                if (Number(state.checkedType.feeType === 1)) {
                    return state.checkedType.fee
                } else if (Number(state.checkedType.feeType === 2)) {
                    return mul(state.amount, (state.checkedType.fee))
                }
            }
            return 0
        })

        // 计算预计支付金额
        const computeExpectedpay = computed(() => {
            // 计算方式：存款金额 * 汇率

            return state.rateConfig.exchangeRate ? mul(state.amount, state.rateConfig.exchangeRate) : '--'
        })

        // 处理支付通道排序
        const payTypesSortEnable = computed(() => {
            if (state.PayTypes.length > 0) {
                const temp = state.PayTypes.filter(item => item.timeRangeFlag && item.openTime)
                temp.forEach(item => {
                    if (state.checkedType.paymentTypeAlias === item.paymentTypeAlias) {
                        item.checked = true
                    }
                })
                return temp
            }
            return []
        })

        // 不在当前时间的支付通道
        const payTypesSortDisable = computed(() => {
            if (state.PayTypes.length > 0) {
                const temp = state.PayTypes.filter(item => !item.timeRangeFlag && item.openTime)
                temp.forEach(item => {
                    if (state.checkedType.paymentTypeAlias === item.paymentTypeAlias) {
                        item.checked = true
                    }
                })
                return temp
            }
            return []
        })

        // 判断sessionStorage 里面有没有保存proposalNo，有则弹窗提醒
        if (sessionStorage.getItem('proposalNo')) {
            state.despositVis = true
        }

        const onConfirm = () => {
            // 请求存款提案
            const proposalNo = sessionGet('proposalNo')
            if (proposalNo) {
                const params = {
                    customerNo: customInfo.value.customerNo,
                    proposalNo,
                    tradeType,
                    accountId
                }
                queryDepositProposal(params).then(res => {
                    if (res.check()) {
                        if (Number(res.data.paymentStatus) === 2) {
                            router.push('/assets')
                        } else {
                            Dialog.alert({
                                title: t('common.tip'),
                                message: t('deposit.despositFail'),
                                confirmButtonText: t('deposit.toRecord'),
                            }).then(() => {
                                router.push('/despositRecord')
                            })
                        }
                        sessionStorage.removeItem('proposalNo')
                    }
                }).catch(err => {
                    state.loading = false
                    console.log(err)
                })
            }

            // router.replace('/position')
        }

        const onCancel = () => {
            sessionStorage.removeItem('proposalNo')
            state.despositVis = false
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

        // 切换不同链支付通道
        const changePayCurrency = (val) => {
            state.currencyChecked = val
            getDepositExchangeRate()
        }

        // 切换支付方式
        const choosePayType = (item) => {
            state.checkedType = item
            state.appendMap = state.checkedType.extend
            setPaymentList(state.checkedType)
            payTypesSortEnable.value && payTypesSortEnable.value.map(item => {
                item.checked = false
            })
            payTypesSortDisable.value && payTypesSortDisable.value.map(item => {
                item.checked = false
            })
            item.checked = true
            state.typeShow = false
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
                accountId,
                tradeType,
                accountCurrency: currency,
            }
            state.loading = true
            queryPayType(params).then(res => {
                if (res.check()) {
                    state.loading = false
                    if (res.data && res.data.length > 0) {
                        state.PayTypes = res.data
                        // 处理时区时间
                        handleShowTime()
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
        const getDepositExchangeRate = async () => {
            if (state.currencyChecked) {
                const param = {
                    customerNo: customInfo.value.customerNo,
                    accountId,
                    tradeType,
                    accountCurrency: currency,
                    paymentCurrency: state.currencyChecked.split('-').length > 1 ? state.currencyChecked.split('-')[0] : state.currencyChecked
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
                            state.resultTimeMap[payItem.id] = [].concat(state.resultTimeMap[payItem.id])
                            const nowDate = dayjs()
                            const [start, end] = item.split('-')
                            const startLocal = dayjs.utc(`${todayStr} ${start}`).local()
                            const endLocal = dayjs.utc(`${todayStr} ${end}`).local()

                            if (endLocal.isAfter(todayStr, 'day')) {
                                state.resultTimeMap[payItem.id].push(startLocal.format('HH:mm') + '-23:59')
                                state.resultTimeMap[payItem.id].push('00:00-' + endLocal.format('HH:mm'))
                            } else {
                                state.resultTimeMap[payItem.id].push(startLocal.format('HH:mm') + '-' + endLocal.format('HH:mm'))
                            }

                            // 判断当前时间是否在设置的存款时间内
                            if (nowDate.isBetween(startLocal, endLocal)) {
                                payItem.timeRangeFlag = true
                                state.checkedType = payItem
                                state.appendMap = state.checkedType.extend
                            }
                        })
                    }
                })

                if (isEmpty(state.checkedType)) {
                    state.checkedType = state.PayTypes[0]
                    state.appendMap = state.checkedType.extend
                    state.PayTypes[0].checked = true
                }
                setPaymentList(state.checkedType)
            }
        }

        const setPaymentList = (payItem) => {
            if (payItem.channelConvertRate) {
                state.rateConfig = {}
                state.currencyChecked = ''
                return
            }

            state.paymentTypes = []
            if (payItem.paymentCurrency === 'USDT') {
                getChainList()
            } else {
                const splitCurrency = state.checkedType.paymentCurrency.split(',')
                if (splitCurrency.length >= 1) {
                    state.paymentTypes = splitCurrency
                }
            }

            state.currencyChecked = state.paymentTypes[0]
            getDepositExchangeRate()
        }

        const next = () => {
            if (!state.amount) {
                return Toast(t('deposit.selectAmount'))
            }
            if (Number(state.amount) < Number(state.checkedType.singleLowAmount)) {
                return Toast(t('deposit.amountMinTips') + `${state.checkedType.singleLowAmount}`)
            }
            if (Number(state.amount > Number(state.checkedType.singleHighAmount))) {
                return Toast(t('deposit.amountMaxTips') + `${state.checkedType.singleHighAmount}`)
            }

            // 判断是否需要填写补充资料
            if (!checkAllComplete()) {
                state.appendVis = true
                return
            }

            handleDeposit()
        }

        // 补充资料是否全部填写完成
        const checkAllComplete = () => {
            let flag = true
            const extend = state.checkedType.extend
            for (const key in extend) {
                if (Object.hasOwnProperty.call(extend, key)) {
                    const element = extend[key]
                    if (isEmpty(element.value)) {
                        flag = false
                    }
                }
            }
            return flag
        }

        // 创建存款提案
        const handleDeposit = () => {
            const params = {
                tradeType,
                customerNo: customInfo.value.customerNo,
                accountId,
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
                callbackUrl: window.location.protocol + '//' + window.location.host + '/despositCb',
                blockchainName: (state.currencyChecked && state.currencyChecked.split('-').length > 1) ? state.currencyChecked.split('-')[1] : '',

            }

            if (!isEmpty(state.paramsExtens)) {
                params.extend = JSON.stringify(state.paramsExtens)
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

        // 检查是否需要KYC认证
        const checkKyc = () => {
            state.loading = true
            checkKycApply({
                businessCode: 'cashin'
            }).then(res => {
                if (res.check()) {
                    state.loading = false
                    if (Number(res.data) !== 2) {
                        return Dialog.alert({
                            title: t('common.tip'),
                            confirmButtonText: Number(res.data) === 1 ? t('common.goLook') : t('login.goAuthenticate'),
                            message: Number(res.data) === 2 ? t('deposit.KYCReviewing') : t('deposit.needKYC'),
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
                }
            }).catch(err => {
                state.loading = false
                console.log(err)
            })
        }

        // 重置币种为虚拟币的时候 获取链列表
        const getChainList = () => {
            state.paymentTypes = []
            getListByParentCode({ parentCode: 'USDT' }).then(res => {
                if (res.check() && res.data.length > 0) {
                    res.data.forEach(item => {
                        state.paymentTypes.push(item.parentCode + '-' + item.code)
                    })
                    state.currencyChecked = state.paymentTypes[0]
                    getDepositExchangeRate()
                }
            })
        }

        // 补充资料确定事件
        const handleAppendField = () => {
            const extend = state.checkedType.extend
            for (const key in extend) {
                if (Object.hasOwnProperty.call(extend, key)) {
                    const element = extend[key]
                    if (!isEmpty(element.regex)) {
                        const valueReg = new RegExp(element.regex)
                        if (!valueReg.test(state.appendMap[key]?.value)) {
                            return Toast(`${extend[key][state.lang]}` + t('register.incorrectlyFormed'))
                        }
                    }
                    if (isEmpty(state.appendMap[key]?.value)) {
                        return Toast(t('deposit.allInputRequire'))
                    }
                    state.paramsExtens[key] = state.appendMap[key]?.value
                }
            }

            handleDeposit()
        }

        onBeforeMount(() => {
            // 检测客户组配置是否可存款
            if (Number(customInfo.value.deposit) === 0) {
                state.btnDisabled = true
                return Dialog.confirm({
                    title: t('common.tip'),
                    message: t('deposit.serviceTips1'),
                    confirmButtonText: t('common.serivce'),
                    cancelButtonText: t('common.close')
                }).then(() => {
                    if (onlineServices.value) { location.href = onlineServices.value }
                }).catch(() => {
                    // on cancel
                })
            } else {
                // 检测存款是否需要kyc
                checkKyc()
            }
        })

        onBeforeUnmount(() => {
            sessionStorage.removeItem('proposalNo')
        })

        return {
            ...toRefs(state),
            rightAction,
            amountList,
            checkAmount,
            toDespositList,
            openSheet,
            choosePayType,
            openOtherMoney,
            getDepositExchangeRate,
            next,
            computeTime,
            onCancel,
            onConfirm,
            computeFee,
            handleShowTime,
            computeExpectedpay,
            payTypesSortEnable,
            payTypesSortDisable,
            onlineServices,
            changePayCurrency,
            handleAppendField

        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    //background-color: var(--conntentColor);
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: rem(40px) rem(30px);
    }
    .wrap {
        background-color: var(--contentColor);
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
                color: var(--color);
                text-align: center;
                border: rem(2px) solid var(--placeholdColor);
                border-radius: rem(10px);
                .t1 {
                    color: var(--color);
                    font-size: rem(28px);
                }
                .t2 {
                    color: var(--focusColor);
                    font-size: rem(20px);
                }
                &.active {
                    border: rem(2px) solid var(--focusColor);
                    .t1 {
                        color: var(--focusColor);
                    }
                }
            }
        }
        .other-money {
            display: flex;
            margin-top: rem(32px);
            padding: 0 rem(30px) rem(35px) rem(30px);
            border-bottom: solid 1px var(--lineColor);
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
            border-top: solid rem(20px) var(--bgColor);
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
                    color: var(--normalColor);
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
                    color: var(--normalColor);
                }
            }
        }
    }
    .pay-info {
        margin-top: rem(20px);
        padding: 0 rem(30px);
        background-color: var(--contentColor);
        border-top: solid rem(20px) var(--bgColor);
        .pi-item {
            flex: 0 0 50%;
            margin: rem(10px) 0;
            color: var(--normalColor);
            font-size: rem(24px);
            line-height: rem(60px);
        }
        .line {
            width: 100%;
            height: 1px;
            background-color: var(--lineColor);
        }
    }
}
.pay-type {
    display: flex;
    align-items: center;
    justify-content: center;
    border: rem(2px) solid var(--lineColor);
    border-radius: rem(4px);
    .pay-name {
        flex: 1;
        color: var(--color);
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
.currency-wrap {
    padding: rem(30px) 0 0 rem(30px);
    border: solid 1px var(--lineColor);
    border-top: none;
    .currency-radio {
        margin-bottom: rem(20px);
        :deep(.van-radio__label) {
            color: var(--color);
        }
    }
}
.pay-list .pay-type {
    border-color: var(--lineColor);
    border-style: solid;
    border-width: 0 0 1px;
}
.next-btn {
    position: fixed;
    bottom: 0;
    background: var(--bgColor);
    border-color: var(--lineColor);
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
        color: var(--minorColor);
        font-size: rem(28px);
    }
}
.pay-warpper {
    background-color: var(--bgColor);
    .van-action-sheet__header {
        color: var(--color);
    }
}
.append-popup {
    background-color: var(--bgColor);
    .append-wrap {
        text-align: center;
        //padding: 0 rem(30px);
        background-color: var(--contentColor);
        .title {
            padding: rem(60px) 0;
            color: var(--color);
            font-size: rem(32px);
            text-align: center;
        }
        .confirm-btn {
            width: 80%;
            margin: rem(50px) auto;
        }
    }
}

</style>
