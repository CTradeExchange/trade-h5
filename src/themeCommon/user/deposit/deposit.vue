<template>
    <!-- 头部导航 -->
    <Top
        back
        left-icon='arrow-left'
        :menu='false'
        :right-action='rightAction'
        :show-center='true'
        @rightClick='toDespositList'
    />
    <!-- 内容区域 -->
    <div class='page-content'>
        <!-- 页面加载状态 -->
        <Loading :show='loading' />
        <!-- 存款金额筛选 -->
        <div class='amount-filter'>
            <div class='amount-list'>
                <div
                    v-for='(item, index) in amountList'
                    :key='index'
                    :class="{ 'item': true, active: currIndex === index }"
                    @click='checkAmount(index, item)'
                >
                    <p class='t1'>
                        {{ item.amount }} {{ currency }}
                    </p>
                    <p v-if='item.describe' class='t2'>
                        {{ item.describe }}
                    </p>
                </div>
                <div :class="{ 'item': true, active: currIndex === 99 }" @click='openOtherMoney'>
                    <p class='t1'>
                        {{ $t('deposit.otherAmount') }}
                    </p>
                </div>
            </div>
            <div v-show='otherAmountVis' class='other-amount'>
                <input v-model='amount' :placeholder='$t("deposit.inputAmount")' type='number' />
                <van-icon v-if='amount' name='clear' @click="amount = ''" />
            </div>
        </div>
        <!-- 支付方式 -->
        <div class='pay-wrap'>
            <p class='title'>
                {{ $t('deposit.selectPayMethods') }}
            </p>
            <div v-if='payTypesSortEnable.length > 0' class='pay-module'>
                <div v-for='(item, index) in payTypesSortEnable' :key='index' class='pay-case'>
                    <van-radio-group v-model='payTypeId'>
                        <div class='pay-channel' @click='choosePayType(item)'>
                            <img class='icon' :src='item.imgUrl || require("@/assets/payment_icon/" + item.paymentType + ".png")' />
                            <span class='name'>
                                {{ item.alias || item.paymentTypeAlias || item.paymentType }}
                            </span>
                            <van-icon v-if='paymentTypes.length > 1 && item.id === payTypeId' name='arrow-down' />
                            <van-radio v-else :name='item.id' />
                        </div>
                    </van-radio-group>
                    <div :class="['currency-list', (item.id === payTypeId && paymentTypes.length > 1) ? 'show' : 'hide']">
                        <van-radio-group v-model='currencyChecked' @change='changePayCurrency'>
                            <div v-for='currencyItem in paymentTypes' :key='currencyItem' class='item' @click='currencyChecked = currencyItem'>
                                <span class='name'>
                                    {{ currencyItem }}
                                </span>
                                <van-radio :name='currencyItem' />
                            </div>
                        </van-radio-group>
                    </div>
                </div>
            </div>
            <p v-else class='none-channel'>
                {{ $t('deposit.noneChannelTip') }}
            </p>
        </div>
        <!-- 支付信息 -->
        <div class='pay-info'>
            <p class='item'>
                <span>{{ $t('deposit.expectInBank') }}</span>
                <strong>{{ computeAccount }} {{ currency }}</strong>
            </p>
        </div>
    </div>

    <!-- 存款按钮 -->
    <div class='footer-handle'>
        <van-button block class='next-btn' type='primary' @click='next'>
            <span>{{ $t('deposit.confirmPay') }} {{ computeExpectedpay }}{{ currencyChecked }}</span>
        </van-button>
    </div>

    <!-- 存款弹窗提示 -->
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

    <!-- 补充资料弹窗 -->
    <van-popup v-model:show='appendVis' class='append-popup' position='right' :style="{ height: '100%', width: '80%' }">
        <div class='append-wrap'>
            <p class='title'>
                {{ $t('deposit.appendFiled') }}
            </p>
            <van-cell-group inset>
                <van-field
                    v-for='(item, key) in checkedType.extend'
                    :key='key'
                    v-model='appendMap[key].value'
                    :data='item'
                    :label='item[lang]'
                    label-width='70'
                    :placeholder="$t('common.input') + item[lang]"
                    :required='true'
                />
            </van-cell-group>
            <van-button class='confirm-btn' size='large' type='primary' @click='handleAppendField'>
                {{ $t('common.sure') }}
            </van-button>
        </div>
    </van-popup>

    <!-- 支付表单 -->
    <form id='payForm' :action='despositResult.url' class='payForm' method='post'>
        <input
            v-for='(value, key) in JSON.parse(despositResult.data)'
            :key='key'
            :name='key'
            type='text'
            :value='value'
        />
    </form>
</template>

<script>
import Top from '@/components/top'
import { reactive, computed, toRefs, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { Toast, Dialog } from 'vant'
import { useI18n } from 'vue-i18n'
import { isEmpty, sessionGet, getCookie, arrayObjSort } from '@/utils/util'
import { mul, divide, toFixed } from '@/utils/calculation'
import { queryPayType, queryDepositExchangeRate, handleDesposit, checkKycApply, queryDepositProposal, judgeIsAlreadyDeposit } from '@/api/user'
import { getListByParentCode } from '@/api/base'

export default {
    components: {
        Top
    },
    setup (props) {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        // 币种、账户id、玩法类型
        const { currency, accountId, tradeType } = route.query
        // 导航栏右部文字
        const rightAction = {
            title: t('deposit.depositRecord')
        }

        const state = reactive({
            // 页面加载状态
            loading: false,
            // 当前语言
            lang: getCookie('lang') || 'zh-CN',
            // 是否禁用提交按钮
            btnDisabled: false,
            // 存款金额列表
            amountList: [],
            // 当前选择的存款金额下标，其它金额：99
            currIndex: '',
            // 当前选择的存款金额数量
            amount: '',
            // 是否显示其它金额输入框
            otherAmountVis: false,
            // 是否显示支付通道弹窗
            typeShow: false,
            // 全部支付通道
            PayTypes: [],
            // 可用并排序的支付通道
            payTypesSortEnable: [],
            // 当前选择的支付通道
            checkedType: '',
            // 当前选择的支付通道id
            payTypeId: '',
            // 支付通道币种列表
            paymentTypes: [],
            // 当前选择的支付通道币种
            currencyChecked: '',
            // 当前支付通道存款时间
            resultTimeMap: {},
            // 是否显示存款提示弹窗
            despositVis: false,
            // 存款配置数据
            rateConfig: '',
            // 补充资料
            appendVis: false,
            appendMap: {},
            paramsExtens: {},
            // 存款提案创建成功返回的数据
            despositResult: {
                data: '{}'
            }
        })

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        // 联系客服链接
        const onlineServices = computed(() => store.state._base.wpCompanyInfo?.onlineService)
        // 获取存款配置数据
        const depositData = computed(() => store.state._base.wpCompanyInfo?.depositData)
        // 获取wp配置的支付通道图标
        const paymentIconList = computed(() => store.state._base.wpCompanyInfo.paymentIconList)

        // 设置存款数据
        const setAmountList = () => {
            judgeIsAlreadyDeposit({
                companyId: customInfo.value.companyId,
                customerNo: customInfo.value.customerNo,
                accountId
            }).then(res => {
                const arr = []
                const isDeposit = res.data
                let data = {}
                // 已存款
                if (isDeposit) {
                    data = depositData.value.isAlready ? depositData.value['already'] : depositData.value['default']
                } else {
                    // 未存款
                    data = depositData.value.isNot ? depositData.value['not'] : depositData.value['default']
                }
                // 处理存款数据
                for (const key in data) {
                    const item = data[key]
                    if (item.amount) {
                        arr.push({
                            amount: item.amount,
                            describe: item[state.lang]?.describe
                        })
                    }
                }
                // 没有存款数据默认选择其它金额
                if (arr.length === 0) {
                    state.currIndex = 99
                    state.otherAmountVis = true
                } else {
                    state.currIndex = 0
                    state.amount = arr[0].amount
                }
                state.amountList = arr
            })
        }

        // 计算存款手续费
        const computeFee = computed(() => {
            // feeType  1：固定金额手续费 2：百分比手续费
            if (Number(state.checkedType.feeType === 1)) {
                return state.checkedType.fee
            } else if (Number(state.checkedType.feeType === 2)) {
                return mul(state.amount, (state.checkedType.fee))
            } else {
                return 0
            }
        })

        // 计算预计到账金额
        const computeAccount = computed(() => {
            if (state.amount && state.checkedType) {
                const value = parseFloat(state.amount) - parseFloat(computeFee.value)
                return value > 0 ? value : 0
            } else {
                return '--'
            }
        })

        // 计算预计支付金额
        const computeExpectedpay = computed(() => {
            // 计算方式
            const rateConfig = state.rateConfig
            if (rateConfig.exchangeRate) {
                const value = rateConfig.formulaSymbol === 'multiply' ? mul(state.amount, rateConfig.exchangeRate) : divide(state.amount, rateConfig.exchangeRate)
                return toFixed(value, rateConfig.targetDigits)
            }
            return ''
        })

        // 计算存款时间
        const computeTime = (val) => {
            if (!isEmpty(val)) {
                // 0 点时的时间戳
                const time = (window.dayjs(new Date(new Date(new Date().toLocaleDateString()).getTime()))).valueOf()
                if (Number(val) === 1440) {
                    return '24:00'
                } else {
                    return window.dayjs(time + val * 60 * 1000).format('HH:mm')
                }
            }
        }

        // 监听当前存款金额
        watch([() => state.amount, () => state.PayTypes], () => {
            if (state.PayTypes.length > 0 && state.amount) {
                // 筛选在存款时间内的支付通道
                let temp = state.PayTypes.filter(item => item.timeRangeFlag && item.openTime)
                // 筛选在存款金额内的支付通道
                if (state.amount) {
                    temp = temp.filter(v => (parseFloat(state.amount) >= v.singleLowAmount && parseFloat(state.amount) <= v.singleHighAmount))
                }
                // 对支付通道进行排序
                temp.sort(arrayObjSort('sort'))
                if (temp.length > 0) {
                    state.payTypesSortEnable = temp
                    state.checkedType = temp[0]
                    state.payTypeId = temp[0].id
                    state.appendMap = temp[0].extend
                    // 设置支付货币列表
                    setPaymentList(state.checkedType)
                } else {
                    state.payTypesSortEnable = []
                    state.checkedType = ''
                    state.payTypeId = ''
                    state.paymentTypes = []
                    state.currencyChecked = ''
                }
            } else {
                state.payTypesSortEnable = []
            }
        })

        // 监听支付币种
        watch(() => state.currencyChecked, () => {
            if (state.currencyChecked) {
                // 获取存款货币对汇率
                getDepositExchangeRate()
            } else {
                state.rateConfig = {}
            }
        })

        // 跳转到存款记录页面
        const toDespositList = () => {
            router.push({
                path: '/depositRecord'
            })
        }

        // 切换存款金额
        const checkAmount = (index, item) => {
            state.otherAmountVis = false
            state.currIndex = index
            state.amount = item.amount
        }

        // 切换其它存款金额
        const openOtherMoney = () => {
            state.otherAmountVis = true
            state.currIndex = 99
            state.amount = ''
            state.currencyChecked = ''
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
                        if (res.data.length > 0) {
                            res.data.forEach(el => {
                                const iconKey = el.paymentCode + '_' + el.paymentType + '_' + el.merchantNo
                                if (paymentIconList.value[iconKey]) {
                                    el.alias = paymentIconList.value[iconKey][state.lang].alias || ''
                                    el.imgUrl = paymentIconList.value[iconKey][state.lang].imgUrl || require('@/assets/payment_icon/default.png')
                                } else {
                                    el.imgUrl = require('@/assets/payment_icon/default.png')
                                }
                            })
                            state.PayTypes = res.data
                        }

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

        // 打开支付通道弹窗
        const openSheet = () => {
            state.typeShow = true
        }

        // 切换支付通道
        const choosePayType = (item) => {
            state.checkedType = item
            state.payTypeId = item.id
            state.appendMap = state.checkedType.extend
            item.checked = true
            state.typeShow = false
            // 设置支付货币列表
            setPaymentList(state.checkedType)
        }

        // 切换不同支付货币
        const changePayCurrency = (val) => {
            state.currencyChecked = val
        }

        // 设置支付货币列表
        const setPaymentList = (payItem) => {
            // 当前支付通道不需要支付货币列表
            if (payItem.channelConvertRate) {
                state.paymentTypes = []
                state.currencyChecked = ''
                return
            }

            // 支付币种为USDT获取链名称列表
            if (payItem.paymentCurrency === 'USDT') {
                getChainList()
            } else {
                // 设置支付币种列表数据
                state.paymentTypes = state.checkedType.paymentCurrency.split(',')
                state.currencyChecked = state.paymentTypes[0]
            }
        }

        // 获取币种链名称列表数据
        const getChainList = () => {
            const paymentTypes = []
            getListByParentCode({ parentCode: 'USDT' }).then(res => {
                if (res.check() && res.data.length > 0) {
                    res.data.forEach(item => {
                        paymentTypes.push(item.parentCode + '-' + item.code)
                    })
                    state.paymentTypes = paymentTypes
                    state.currencyChecked = paymentTypes[0]
                }
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

        // 处理支付通道存款时间
        const handleShowTime = () => {
            if (state.PayTypes.length > 0) {
                const todayStr = window.dayjs().format('YYYY-MM-DD')
                const tomorrowStr = window.dayjs().add(1, 'day')

                state.PayTypes.forEach(payItem => {
                    const openTime = payItem.openTime
                    // console.log('排序前的时间', payItem.openTime)
                    let openTimeList
                    if (!isEmpty(openTime)) {
                        openTimeList = openTime.split(',')

                        openTimeList.forEach(item => {
                            state.resultTimeMap[payItem.id] = [].concat(state.resultTimeMap[payItem.id])
                            const nowDate = window.dayjs()
                            const [start, end] = item.split('-')
                            const startLocal = window.dayjs.utc(`${todayStr} ${start}`).local()
                            const endLocal = window.dayjs.utc(`${todayStr} ${end}`).local()

                            if ((startLocal.isAfter(todayStr, 'day') && endLocal.isAfter(todayStr, 'day')) || (startLocal.isBefore(tomorrowStr, 'day') && endLocal.isBefore(tomorrowStr, 'day'))) {
                                state.resultTimeMap[payItem.id].push(startLocal.format('HH:mm') + '-' + endLocal.format('HH:mm'))
                            } else if (endLocal.format('HH:mm') === '00:00') {
                                state.resultTimeMap[payItem.id].push(startLocal.format('HH:mm') + '-24:00')
                            } else {
                                state.resultTimeMap[payItem.id].push(startLocal.format('HH:mm') + '-23:59')
                                state.resultTimeMap[payItem.id].push('00:00-' + endLocal.format('HH:mm'))
                            }

                            // 判断当前时间是否在设置的存款时间内
                            if (nowDate.isBetween(startLocal, endLocal)) {
                                payItem.timeRangeFlag = true
                                state.appendMap = state.checkedType.extend
                            }
                        })

                        // console.log('转换时区后的时间', state.resultTimeMap[payItem.id])

                        // 重新排序
                        const newTimeList = [] // 排序并筛选后的时间列表
                        state.resultTimeMap[payItem.id].filter(el => el).forEach(item => {
                            if (item.split('-')[0] === '00:00') {
                                newTimeList.unshift(item)
                            } else {
                                newTimeList.push(item)
                            }
                        })

                        // console.log('排序后的时间', newTimeList)

                        // 处理时间重叠情况,如果第一段的结束时间和第二段开始时间相差一分钟则合并
                        const finalTimeResult = []
                        for (let index = 0; index < newTimeList.length; index++) {
                            const el = newTimeList[index]
                            if (!isEmpty(el)) {
                                const start = el.split('-')[0]
                                const end = el.split('-')[1]
                                const nextStart = newTimeList[index + 1] && newTimeList[index + 1].split('-')[0]
                                const nextEnd = newTimeList[index + 1] && newTimeList[index + 1].split('-')[1]
                                if (window.dayjs(`${todayStr} ${end}`).add(1, 'minute').isSame(window.dayjs(`${todayStr} ${nextStart}`))) {
                                    finalTimeResult.push(start + '-' + nextEnd)
                                    index++
                                } else {
                                    finalTimeResult.push(start + '-' + end)
                                }
                            }
                        }

                        state.resultTimeMap[payItem.id] = finalTimeResult
                    }
                })
            }
        }

        // 点击下一步
        const next = () => {
            if (!state.amount) {
                return Toast(t('deposit.selectAmount'))
            }
            if (!state.checkedType) {
                return Toast(t('deposit.selectPayMethods'))
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

        // 创建存款提案
        const handleDeposit = () => {
            const callbackUrl = `${window.location.protocol}//${window.location.host}/${state.lang}/depositCb?accountId=${accountId}&currency=${currency}&tradeType=${tradeType}`
            const params = {
                tradeType,
                customerNo: customInfo.value.customerNo,
                accountId,
                customerGroupId: customInfo.value.customerGroupId,
                depositRateSerialNo: state.rateConfig.depositRateSerialNo,
                paymentCurrency: state.checkedType.paymentCurrency === 'USDT' ? 'USDT' : state.currencyChecked,
                accountCurrency: currency,
                exchangeRate: state.rateConfig.exchangeRate,
                paymentChannelCode: state.checkedType.paymentCode,
                paymentChannelType: state.checkedType.paymentType,
                paymentMerchantNo: state.checkedType.merchantNo,
                paymentChannelClientType: 'mobile',
                depositAmount: state.amount,
                country: customInfo.value.country,
                channelCode: customInfo.value.utmSource,
                depositFrom: 'H5',
                callbackUrl,
                blockchainName: (state.currencyChecked && state.currencyChecked.split('-').length > 1) ? state.currencyChecked.split('-')[1] : ''
            }

            if (!isEmpty(state.paramsExtens)) {
                params.extend = JSON.stringify(state.paramsExtens)
            }

            state.loading = true
            handleDesposit(params).then(res => {
                state.loading = false
                if (res.check()) {
                    state.despositResult = res.data
                    despositSuccess()
                } else {
                    Toast(res.msg)
                }
            }).catch(err => {
                state.loading = false
            })
        }

        // 存款提案创建成功
        const despositSuccess = () => {
            const despositResult = state.despositResult
            sessionStorage.setItem('proposalNo', despositResult.proposalNo)
            // 提交表单
            if (despositResult.submitType === 'post_data') {
                setTimeout(() => {
                    document.getElementById('payForm').submit()
                }, 200)
            } else {
                // 跳转到新页面
                window.location.href = despositResult.browserOpenUrl
            }
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

        // 点击存款提示弹窗确认按钮
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
                                router.push('/depositRecord')
                            })
                        }
                        sessionStorage.removeItem('proposalNo')
                    }
                }).catch(err => {
                    state.loading = false
                    console.log(err)
                })
            }
        }

        // 点击存款提示弹窗取消按钮
        const onCancel = () => {
            sessionStorage.removeItem('proposalNo')
            state.despositVis = false
        }

        // 检查是否需要KYC认证
        const checkKyc = () => {
            state.loading = true
            checkKycApply({
                businessCode: 'cashin'
            }).then(res => {
                if (res.check()) {
                    state.loading = false
                    // kyc弹窗提示
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
                    // 获取支付通道
                    getPayTypes()
                }
            }).catch(err => {
                state.loading = false
                console.log(err)
            })
        }

        onMounted(() => {
            // 判断sessionStorage 里面有没有保存proposalNo，有则弹窗提醒
            if (sessionStorage.getItem('proposalNo')) {
                state.despositVis = true
            }
            // 设置存款金额数据
            setAmountList()
            // 获取客户信息
            store.dispatch('_user/findCustomerInfo', false).then(res => {
                if (res.check()) {
                    // 是否显示联系客服弹窗
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
                }
            })
        })

        onBeforeUnmount(() => {
            sessionStorage.removeItem('proposalNo')
        })

        return {
            ...toRefs(state),
            currency,
            rightAction,
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
            computeAccount,
            onlineServices,
            changePayCurrency,
            handleAppendField
        }
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';

.page-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 0 rem(30px);
    background: var(--bgColor);
    overflow-y: auto;
}

// 存款金额筛选
.amount-filter {
    padding-top: rem(30px);
    .amount-list {
        display: flex;
        flex-wrap: wrap;
        .item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: rem(216px);
            height: rem(96px);
            margin-right: rem(20px);
            margin-bottom: rem(20px);
            background: var(--contentColor);
            border: 1px solid var(--lineColor);
            border-radius: rem(10px);
            &:nth-of-type(3n) {
                margin-right: 0;
            }
            .t1 {
                font-size: rem(28px);
                color: var(--color);
            }
            .t2 {
                padding: rem(3px) rem(10px);
                font-size: rem(20px);
                color: var(--focusColor);
                background: rgba(242, 161, 27, .1);
                border-radius: rem(30px);
            }
        }
        .active {
            background: rgba(242, 161, 27, .1);
            border: 1px solid var(--focusColor);
            .t1 {
                color: var(--focusColor);
            }
            .t2 {
                color: var(--focusColor);
            }
        }
    }
    .other-amount {
        display: flex;
        height: rem(96px);
        align-items: center;
        padding-left: rem(32px);
        padding-right: rem(25px);
        background: var(--contentColor);
        border: 1px solid var(--lineColor);
        border-radius: rem(10px);
        input {
            flex: 1;
            height: 100%;
            font-size: rem(28px);
        }
        .van-icon-clear {
            font-size: rem(36px);
            color: var(--minorColor);
        }
    }
}

// 支付方式
.pay-wrap {
    .title {
        line-height: 1;
        padding-top: rem(42px);
        padding-bottom: rem(36px);
        font-size: rem(28px);
        font-weight: bold;
        color: var(--color);
    }
    .pay-module {
        padding-left: rem(40px);
        padding-right: rem(32px);
        background: var(--contentColor);
        border-radius: rem(10px);
        overflow: hidden;
        .van-icon {
            line-height: 1;
        }
        .pay-case {
            .pay-channel {
                display: flex;
                align-items: center;
                height: rem(112px);
                border-bottom: 1px solid var(--lineColor);
                .icon {
                    width: rem(60px);
                    height: rem(60px);
                    margin-right: rem(35px);
                }
                .name {
                    flex: 1;
                    font-size: rem(28px);
                    color: var(--color);
                }
            }
            .currency-list {
                overflow: hidden;
                &.show {
                    max-height: rem(1000px);
                    transition: all .3s ease-in-out;
                }
                &.hide {
                    max-height: 0;
                }
                .item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: rem(112px);
                    border-bottom: 1px solid var(--lineColor);
                    .name {
                        font-size: rem(28px);
                        color: var(--color);
                    }
                }
            }
        }
    }
    .none-channel {
        display: flex;
        justify-content: center;
        align-items: center;
        height: rem(150px);
        padding: 0 rem(20px);
        font-size: rem(24px);
        color: var(--color);
        background: var(--contentColor);
        border: 1px solid var(--lineColor);
        border-radius: rem(10px);
    }
}

// 支付信息
.pay-info {
    padding-bottom: rem(60px);
    .item {
        display: flex;
        align-items: center;
        height: rem(70px);
        span {
            margin-right: rem(10px);
            color: var(--minorColor);
            font-size: rem(24px);
        }
        strong {
            font-size: rem(28px);
            color: var(--focusColor);
        }
    }
}

// 底部按钮
.footer-handle {
    display: flex;
    flex-shrink: 0;
    padding: rem(30px);
    .next-btn {
        height: rem(80px);
        background: var(--primary);
        border-radius: rem(10px);
        span {
            color: #fff;
            font-size: rem(30px);
        }
    }
}

// 存款提示弹窗
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

// 补充资料弹窗
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

// 支付表单
.payForm {
    width: 100%;
    padding: 0 rem(30px);
    background: var(--contentColor);
    position: fixed;
    bottom: -100%;
    opacity: 0;
    input {
        width: 100%;
        height: rem(50px);
    }
}
</style>
