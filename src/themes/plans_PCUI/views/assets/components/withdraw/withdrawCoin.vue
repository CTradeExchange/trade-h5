<template>
    <div class='container'>
        <!-- 加载中组件 -->
        <!-- <Loading :show="loading" /> -->
        <div class='empty'></div>
        <div class='module-form'>
            <div class='select'>
                <label>{{ $t("withdrawCoin.coinName") }}</label>
                <div class='option'>
                    <el-select
                        v-model='coinKind'
                        class='currencyBox'
                        placeholder='---'
                        @change='selectCoinKind'
                    >
                        <el-option
                            v-for='item in coinKindList'
                            :key='item.name'
                            class='currencyOption'
                            :label='item.name'
                            :value='item.name'
                        />
                    </el-select>
                </div>
            </div>

            <div class='select'>
                <label>{{ $t("withdrawCoin.chainName") }}</label>
                <div class='option'>
                    <el-select
                        v-model='chainName'
                        class='currencyBox'
                        placeholder='---'
                        @change='selectChainName'
                    >
                        <el-option
                            v-for='item in chainNameList'
                            :key='item.name'
                            class='currencyOption'
                            :label='item.name'
                            :value='item.name'
                        />
                    </el-select>
                </div>
            </div>

            <div class='block'>
                <div class='title'>
                    <span>{{ $t("withdrawCoin.coinCount") }}</span>
                </div>
                <div class='handle'>
                    <input
                        v-model='coinCount'
                        :placeholder="$t('withdrawCoin.coinCountPlaceholder')"
                        type='number'
                        @change='changeAmount'
                        @input='changeAmount'
                    />
                    <button @click='onAllTake'>
                        {{ $t("withdrawCoin.allBtn") }}
                    </button>
                </div>
                <p class='may'>
                    <span>{{ $t("withdrawCoin.can") }} </span>
                    <strong v-if='showCanMoney'>
                        {{ coinTotal }} {{ coinKind }}-{{ chainName }}
                    </strong>
                </p>
            </div>

            <div class='case'>
                <p class='row'>
                    <label class='name'>
                        {{ $t("withdrawCoin.service") }}
                    </label>
                    <span class='value'>
                        {{ serviceCount }} {{ coinKind }}
                        <span v-if='chainName'>
                            -{{ chainName }}
                        </span>
                    </span>
                </p>
                <p class='row'>
                    <label class='name'>
                        {{ $t("withdrawCoin.predict") }}
                    </label>
                    <span class='value'>
                        {{ arriveCount }} {{ coinKind }}
                        <span v-if='chainName'>
                            -{{ chainName }}
                        </span>
                    </span>
                </p>
                <p class='row'>
                    <label class='name'>
                        {{ $t("withdrawCoin.minus") }}
                    </label>
                    <span class='value'>
                        {{ minusCount }} {{ accountCurrency.currency }}
                    </span>
                </p>
            </div>
        </div>
        <div class='empty'></div>
        <div class='module-wallet'>
            <p class='title'>
                {{ $t("withdrawCoin.walletSelect") }}
            </p>
            <p class='hint'>
                {{ $t("withdrawCoin.walletHint") }}
            </p>
            <!-- 有钱包地址 -->
            <div
                v-if='currentWallet'
                class='wallet-address'
                @click='openWalletSelect'
            >
                <div class='info'>
                    <p class='row'>
                        <span class='name'>
                            {{ currentWallet.currency }}-{{
                                currentWallet.chainName
                            }}
                        </span>
                        <span class='tag'>
                            {{ currentWallet.remark }}
                        </span>
                    </p>
                    <p class='code'>
                        {{ currentWallet.address }}
                    </p>
                </div>
                <van-icon color='#333' name='arrow-down' />
            </div>
            <!-- 无钱包地址 -->
            <div v-else class='wallet-not' @click='goWalletAdd'>
                <van-icon :color='$style.color' name='plus' />
                <span>{{ $t("withdrawCoin.walletAdd") }}</span>
            </div>
        </div>
        <div class='fund'>
            <p class='bw-t'>
                {{ $t("common.fundPwd") }}
            </p>
            <div class='fund-input'>
                <InputComp
                    v-model='pwd'
                    class='input-comp'
                    clear
                    :label="$t('common.inputFundPwd')"
                    :max-length='6'
                    pwd
                />
                <router-link
                    v-if='Number(customInfo.assertPassStatus) === 1'
                    class='href'
                    to='/assets/setFundPwd'
                >
                    {{ $t("login.goSet") }}
                </router-link>
                <span v-else class='href' @click='goFundForgot'>
                    {{ $t("login.forgotFundPwd") }}
                </span>
            </div>
            <p v-if='googleCodeVis' class='bw-t'>
                {{ $t("common.googleCode") }}
            </p>
            <div class='pwd-oper field-google'>
                <googleVerifyCode
                    v-if='googleCodeVis'
                    @getGooleVerifyCode='getGooleVerifyCode'
                />
            </div>
        </div>
        <div class='footBtnBox'>
            <button class='footer-btn' @click='onConfirm'>
                <span>{{ $t("withdraw.confirm") }}</span>
            </button>
        </div>

        <!-- 选择钱包地址弹窗 -->
        <van-dialog
            v-model:show='walletSelectVisible'
            class='wallet-select'
            :round='false'
            :title="$t('withdrawCoin.walletSelect')"
            :width='440'
        >
            <van-radio-group
                v-model='walletId'
                class='select-group'
                @change='selectWallet'
            >
                <div class='wallet-list'>
                    <div
                        v-for='item in addressList'
                        :key='item.id'
                        class='item'
                    >
                        <div class='info'>
                            <p class='row'>
                                <span class='name'>
                                    {{ item.currency }}-{{ item.chainName }}
                                </span>
                                <span v-if='item.remark' class='tag'>
                                    {{ item.remark }}
                                </span>
                            </p>
                            <p class='code'>
                                {{ item.address }}
                            </p>
                        </div>
                        <van-radio checked-color='#be1e2d' :name='item.id' />
                    </div>
                </div>
            </van-radio-group>
            <div class='add-handle' @click='goWalletAdd'>
                <van-icon :color='$style.color' name='plus' />
                <span>{{ $t("withdrawCoin.walletAdd") }}</span>
                <van-icon :color='$style.color' name='arrow' />
            </div>
        </van-dialog>
    </div>

    <!-- 取款时间弹窗 -->
    <van-dialog
        v-model:show='timeShow'
        :title="$t('withdraw.hint')"
        :width='360'
    >
        <div class='time-wrap'>
            <h4>
                {{ $t("withdraw.timeHint") }}
            </h4>
            <br />
            <div v-if='timeList.length > 0' class='flex'>
                <p v-if='timeList.length > 0'>
                    {{ $t("withdraw.timeName") }}：
                </p>
                <div class='time-text'>
                    <p v-for='(item, index) in timeList' :key='index'>
                        {{ item.weekDay }}:{{ item.openTimeLocal.toString() }}
                    </p>
                    <br />
                </div>
            </div>
        </div>
    </van-dialog>

    <!-- 提交成功弹窗 -->
    <van-dialog
        v-model:show='withdrawSuccess'
        :confirm-button-text="$t('common.sure')"
        :show-cancel-button='false'
        :width='360'
        @confirm="$router.push('/assets') && $emit('hide')"
    >
        <div class='add-success'>
            <i class='icon_success'></i>
            <p class='title'>
                {{ $t("withdraw.successText") }}
            </p>
            <p class='content'>
                {{ $t("withdraw.coinSuccessMsg") }}
            </p>
        </div>
    </van-dialog>
</template>

<script>
// components
import centerViewDialog from '@planspc/layout/centerViewDialog'
import googleVerifyCode from '@/themeCommon/components/googleVerifyCode.vue'
// vue
import { reactive, toRefs, computed, onMounted, watch } from 'vue'
// router
import { useRoute, useRouter } from 'vue-router'
// vuex
import { useStore } from 'vuex'
// vant
import { Toast, Dialog } from 'vant'
// i18n
import { useI18n } from 'vue-i18n'
// api
import {
    queryWithdrawConfig,
    getWithdrawCurrencyList,
    checkKycApply,
    getWalletAddressList,
    handleWithdraw,
    queryWithdrawRate,
    queryWithdrawLimitInfo,
    computeWithdrawFee
} from '@api/user'
// 工具方法
import { isEmpty, debounce } from '@/utils/util'
import md5 from 'js-md5'
import InputComp from '@/components/form/input'

export default {
    components: {
        centerViewDialog,
        googleVerifyCode,
        InputComp
    },
    props: {
        query: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    setup (props, { emit }) {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { currency, accountId, tradeType, currentTab } = props.query
        const state = reactive({
            // 加载状态
            loading: true,
            // 头部导航栏右侧
            rightAction: {
                title: t('withdraw.moneyRecordText'),
                path: '/assets/withdrawRecord?withdrawType=2'
            },
            // 是否显示可提金额
            showCanMoney: false,
            // 取款限制配置
            withdrawConfig: null,
            // 取款汇率配置
            withdrawRate: null,
            // 最高可提币数量
            singleHighAmount: 0,
            // 最低可提币数量
            singleLowAmount: 0,
            // 提币链名称数据列表
            allList: [],
            // 提币币种选项列表
            coinKindList: [],
            // 链名称列表
            chainNameList: [],
            // 提币币种
            coinKind: '',
            // 链名称
            chainName: '',
            // 全部提币数量
            coinTotal: '',
            // 提币数量
            coinCount: '',
            // 手续费
            serviceCount: '0.00',
            // 预计到账
            arriveCount: '0.00',
            // 账户减扣
            minusCount: '0.00',
            // 是否显示取款时间弹窗
            timeShow: false,
            // 处理后的时区
            withdrawTimeConfigMap: {},
            // 是否显示提交成功弹窗
            withdrawSuccess: false,
            // 是否显示钱包地址选择弹窗
            walletSelectVisible: false,
            // 钱包地址列表
            addressList: [],
            // 当前选择的钱包
            currentWallet: null,
            // 当前选择钱包地址id
            walletId: 0,
            pwd: '',
            googleCode: '',
            historyPath: '',
        })

        // 数据初始化
        const init = () => {
            state.showCanMoney = false
            state.coinTotal = ''
            state.coinCount = ''
            state.googleCode = ''
            state.serviceCount = '0.00'
            state.arriveCount = '0.00'
            state.minusCount = '0.00'
        }

        // 跳转到忘记资金密码页面
        const goFundForgot = () => {
            router.push({
                name: 'Forgot',
                query: {
                    type: 'fund'
                }
            })
            emit('hide')
        }

        // 账户信息
        const { value: customInfo } = computed(
            () => store.state._user.customerInfo
        )
        const googleCodeVis = computed(() => customInfo.googleId > 0)

        // 客服信息
        const onlineServices = computed(
            () => store.state._base.wpCompanyInfo?.onlineService
        )

        // 账户币种
        const { value: accountCurrency } = computed(
            () =>
                store.state._user.customerInfo.accountList.find(
                    (el) => el.accountId === Number(accountId)
                ) || {}
        )

        // 周数据
        const weekdayMap = {
            1: t('weekdayMap.1'),
            2: t('weekdayMap.2'),
            3: t('weekdayMap.3'),
            4: t('weekdayMap.4'),
            5: t('weekdayMap.5'),
            6: t('weekdayMap.6'),
            7: t('weekdayMap.7')
        }

        // 取款时间
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

        // 获取取款手续费
        const getWithdrawFee = debounce(() => {
            const coinTotal = parseFloat(state.coinTotal)
            const coinCount = parseFloat(state.coinCount)
            if (!state.coinKind) {
                return Toast(t('withdrawCoin.coinPlaceholder'))
            }
            if (!state.chainName) {
                return Toast(t('withdrawCoin.chainPlaceholder'))
            }
            if (state.coinCount === '') return
            if (coinCount < state.singleLowAmount) {
                return Toast({
                    message: `${t('withdrawCoin.hint_4')}${
                        state.singleLowAmount
                    }`
                })
            }
            if (coinCount > state.singleHighAmount) {
                return Toast({
                    message: `${t('withdrawCoin.hint_5')}${
                        state.singleHighAmount
                    }`
                })
            }
            if (coinCount > coinTotal) {
                return Toast(t('withdrawCoin.hint_1'))
            }

            const item = {
                ...params,
                amount: state.coinCount.toString(),
                withdrawType: 2,
                withdrawCurrency: state.coinKind,
                blockchainName: state.chainName,
                withdrawRateSerialNo: state.withdrawRate.withdrawRateSerialNo
            }
            computeWithdrawFee(item).then((res) => {
                if (res.check()) {
                    const { data } = res
                    state.serviceCount = data.coinFee
                    state.arriveCount = data.coinFinalAmount
                    state.minusCount = data.amount
                }
            })
        }, 1000)

        watch(
            () => state.coinCount,
            (newval) => {
                getWithdrawFee()
            },
            { immediate: true }
        )

        // 改变提币数量
        const changeAmount = () => {
            // 获取取款手续费
            // getWithdrawFee()
        }

        // 时区转换
        const transferUtc = () => {
            const todayStr = window.dayjs().format('YYYY-MM-DD')
            state.withdrawConfig.withdrawTimeConfigList.forEach((el) => {
                el.openTimeLocal = []
                state.withdrawTimeConfigMap[el.weekDay] = {
                    weekDay: el.weekDay,
                    openTime: el.openTime,
                    openTimeLocal: []
                }
            })

            // 处理跨天逻辑
            for (const key in state.withdrawTimeConfigMap) {
                if (
                    Object.hasOwnProperty.call(state.withdrawTimeConfigMap, key)
                ) {
                    const el = state.withdrawTimeConfigMap[key]
                    if (!isEmpty(el.openTime)) {
                        const timeRange = el.openTime.split(',')
                        if (timeRange.length > 0) {
                            timeRange.forEach((timeRangeItem) => {
                                const [start, end] = timeRangeItem.split('-')
                                const startLocal = window.dayjs
                                    .utc(`${todayStr} ${start}`)
                                    .local()
                                const endLocal = window.dayjs
                                    .utc(`${todayStr} ${end}`)
                                    .local()

                                // 第二天
                                const weekDay = key < 7 ? Number(key) + 1 : 1
                                let elNext =
                                    state.withdrawTimeConfigMap[weekDay]

                                if (!elNext) {
                                    elNext = {
                                        openTimeLocal: [],
                                        weekDay
                                    }
                                    state.withdrawTimeConfigMap[weekDay] =
                                        elNext
                                }

                                if (startLocal.isAfter(todayStr, 'day')) {
                                    elNext.openTimeLocal.push(
                                        startLocal.format('HH:mm') +
                                            '-' +
                                            endLocal.format('HH:mm')
                                    )
                                } else if (
                                    endLocal.format('HH:mm') === '00:00'
                                ) {
                                    el.openTimeLocal.push(
                                        startLocal.format('HH:mm') + '-24:00'
                                    )
                                } else if (endLocal.isAfter(todayStr, 'day')) {
                                    elNext.openTimeLocal.unshift(
                                        '00:00-' + endLocal.format('HH:mm')
                                    )
                                    el.openTimeLocal.push(
                                        startLocal.format('HH:mm') + '-23:59'
                                    )
                                } else if (
                                    el.openTime !== '00:00-00:00' ||
                                    el.openTime !== ''
                                ) {
                                    el.openTimeLocal.push(
                                        startLocal.format('HH:mm') +
                                            '-' +
                                            endLocal.format('HH:mm')
                                    )
                                }
                            })
                        }
                    }
                }
            }

            // 处理时间合并
            for (const key in state.withdrawTimeConfigMap) {
                if (
                    Object.hasOwnProperty.call(state.withdrawTimeConfigMap, key)
                ) {
                    const el = state.withdrawTimeConfigMap[key]
                    if (Array.isArray(el.openTimeLocal)) {
                        el.openTimeLocal.forEach((time, index) => {
                            const start = el.openTimeLocal[0].split('-')[0]

                            const end = time.split('-')[1]
                            const nextStart =
                                el.openTimeLocal[index + 1] &&
                                el.openTimeLocal[index + 1].split('-')[0]
                            const nextEnd =
                                el.openTimeLocal[index + 1] &&
                                el.openTimeLocal[index + 1].split('-')[1]

                            if (
                                window
                                    .dayjs(`${todayStr} ${end}`)
                                    .add(1, 'minute')
                                    .isSame(
                                        window.dayjs(`${todayStr} ${nextStart}`)
                                    ) ||
                                end === nextStart
                            ) {
                                el.openTimeLocal = start + '-' + nextEnd
                            }
                        })
                    }
                }
            }
        }

        const getGooleVerifyCode = (val) => {
            state.googleCode = val
        }

        // 请求参数
        const params = {
            customerNo: customInfo.customerNo,
            accountId,
            tradeType,
            withdrawType: 2,
            accountCurrency: accountCurrency.currency,
            customerGroupId: customInfo.customerGroupId,
            country: customInfo.country,
            withdrawMethod: currentTab
        }

        // 获取取款限制配置
        const getWithdrawConfig = () => {
            queryWithdrawConfig({
                ...params,
                withdrawCurrency: state.coinKind,
                blockchainName: state.chainName,
                tradeType
            }).then((res) => {
                if (res.check()) {
                    const { data } = res
                    state.withdrawConfig = data
                    if (!data.customerGroupEnable) {
                        state.loading = false
                        return Dialog.confirm({
                            title: t('withdraw.hint'),
                            message: t('withdraw.withdrawLimitHint'),
                            confirmButtonText: t('withdraw.contact'),
                            cancelButtonText: t('withdraw.close')
                        })
                            .then(() => {
                                if (onlineServices.value) {
                                    window.open(onlineServices.value)
                                }
                            })
                            .catch(() => {})
                    } else {
                        // 检测取款是否需要kyc
                        checkKyc()
                    }

                    // 时区转换
                    transferUtc()
                } else {
                    state.loading = false
                }
            })
        }

        // 检测取款是否需要kyc
        const checkKyc = () => {
            checkKycApply({
                businessCode: 'withdraw',
                openAccountType: customInfo.openAccountType
            }).then((res) => {
                state.loading = false
                const withdrawConfig = state.withdrawConfig
                if (Number(res.data) !== 2) {
                    return Dialog.alert({
                        title: t('withdraw.hint'),

                        confirmButtonText:
                            Number(res.data) === 1
                                ? t('withdraw.kycBtn_1')
                                : t('withdraw.kycBtn_2'),
                        message:
                            Number(res.data) === 2
                                ? t('withdraw.kycMsg_1')
                                : t('withdraw.kycMsg_2')
                    }).then(() => {
                        if (customInfo.openAccountType === 0) {
                            router.replace({
                                path: '/assets/authentication',
                                query: { businessCode: 'withdraw' }
                            })
                            emit('hide')
                        } else {
                            router.replace({
                                path: '/businessKYC'
                            })
                            emit('hide')
                        }
                    })
                } else {
                    if (!withdrawConfig.accountActiveEnable) {
                        return Dialog.confirm({
                            title: t('withdraw.hint'),
                            message: t('withdraw.activateMsg'),
                            confirmButtonText: t('withdraw.activateBtn')
                        })
                            .then(() => {
                                router.replace({
                                    path: '/assets/depositChoose',
                                    query: {
                                        tradeType,
                                        accountId,
                                        currency: accountCurrency.currency
                                    }
                                })
                                emit('hide')
                            })
                            .catch(() => {})
                    }
                    if (!withdrawConfig.timeEnable) {
                        state.timeShow = true
                        return
                    }
                    if (!withdrawConfig.amountEnable) {
                        return Toast(t('withdrawCoin.hint_1'))
                    }
                    if (!withdrawConfig.hourIn24Enable) {
                        return Toast(
                            t('withdrawCoin.hint_2') +
                                withdrawConfig.withdrawBaseConfig.maxCount +
                                t('withdrawCoin.unit')
                        )
                    }
                }
            })
        }

        // 获取客户提币币种和链名称
        const queryWithdrawCurrencyList = (resolve) => {
            getWithdrawCurrencyList({
                companyId: customInfo.companyId,
                customerNo: customInfo.customerNo,
                customerGroupId: customInfo.customerGroupId,
                accountId,
                tradeType,
                accountCurrency: accountCurrency.currency,
                country: customInfo.country,
                withdrawMethod: currentTab
            }).then((res) => {
                if (res.check()) {
                    const { data } = res
                    const coinKindList = []

                    if (data.length > 0) {
                        data.map((elem) => {
                            if (
                                !coinKindList.some(
                                    (v) => v.name === elem.withdrawCurrency
                                ) &&
                                elem.withdrawCurrency === currency
                            ) {
                                coinKindList.push({
                                    name: elem.withdrawCurrency
                                })
                            }
                        })

                        state.allList = data
                        state.coinKind = coinKindList[0].name
                        state.coinKindList = coinKindList
                        // 根据提币币种获取筛选链名称
                        filterChainName()
                    }
                    resolve(res)
                }
            })
        }

        // 根据提币币种获取筛选链名称
        const filterChainName = () => {
            const chainNameList = []
            const arr = state.allList.filter(
                (v) =>
                    v.withdrawCurrency === state.coinKind &&
                    v.withdrawCurrency === currency
            )
            arr.map((elem) => {
                chainNameList.push({ name: elem.blockchainName })
            })
            state.chainName = chainNameList[0].name
            state.chainNameList = chainNameList

            // 获取钱包地址列表
            getWalletAddress()
        }

        // 点击选择提币币种
        const selectCoinKind = (item) => {
            state.coinKind = item
            state.chainName = ''
            // 初据初始化
            init()
            // 根据提币币种获取筛选链名称
            filterChainName()
        }

        // 点击选择链名称
        const selectChainName = (item) => {
            state.chainName = item
            getWalletAddress()
            getWithdrawRate()
            getWithdrawConfig()
            getWithdrawFee()
        }

        // 获取取款汇率
        const getWithdrawRate = () => {
            queryWithdrawRate({
                // companyId: customInfo.companyId,
                // customerNo: customInfo.customerNo,
                accountId,
                tradeType,
                accountCurrency: accountCurrency.currency,
                withdrawCurrency: state.coinKind,
                withdrawType: 2
            }).then((res) => {
                if (res.check()) {
                    state.withdrawRate = res.data
                    // 获取取款、提币额度限制配置
                    getWithdrawLimitInfo()
                }
            })
        }

        // 获取取款、提币额度限制配置
        const getWithdrawLimitInfo = () => {
            queryWithdrawLimitInfo({
                ...params,
                withdrawRateSerialNo: state.withdrawRate.withdrawRateSerialNo,
                withdrawCurrency: state.coinKind,
                blockchainName: state.chainName
            }).then((res) => {
                if (res.check()) {
                    const { data } = res
                    state.coinTotal = data.withdrawAmount
                    state.singleHighAmount = data.singleHighAmount
                    state.singleLowAmount = data.singleLowAmount
                    state.showCanMoney = true
                }
            })
        }

        // 点击全部取出
        const onAllTake = () => {
            state.coinCount = state.coinTotal
            getWithdrawFee()
        }

        // 获取钱包地址列表
        const getWalletAddress = () => {
            if (!state.coinKind || !state.chainName) {
                state.addressList = []
                state.currentWallet = null
                state.walletId = 0
                return
            }
            getWalletAddressList({
                currency: state.coinKind,
                chainName: state.chainName
            }).then((res) => {
                const { data } = res
                state.loading = false
                state.addressList = data
                // 设置当前地址
                const item = data[0]
                state.currentWallet = item || null
                state.walletId = item ? item.id : 0
            })
        }

        // 跳转到新增钱包地址页面
        const goWalletAdd = () => {
            state.walletSelectVisible = false
            router.push({
                path: '/assets/walletAddress',
                query: { tradeType, accountId }
            })
        }

        // 钱包地址弹窗
        const openWalletSelect = () => {
            state.walletSelectVisible = true
        }

        // 选择钱包
        const selectWallet = (value) => {
            state.walletId = value
            state.currentWallet = state.addressList.find((v) => v.id === value)
            state.walletSelectVisible = false
        }

        // 点击确定
        const onConfirm = () => {
            const coinCount = parseFloat(state.coinCount)
            const amountDigitsLength = coinCount.toString().split('.')[1]
                ? coinCount.toString().split('.')[1].length
                : 0
            if (!state.coinKind) {
                return Toast({ message: t('withdrawCoin.coinPlaceholder') })
            }

            if (!state.chainName) {
                return Toast({ message: t('withdrawCoin.chainPlaceholder') })
            }
            if (!state.coinCount) {
                return Toast({
                    message: t('withdrawCoin.coinCountPlaceholder')
                })
            }
            if (amountDigitsLength > accountCurrency.digits) {
                return Toast(t('withdraw.withdrawDigitsTip'))
            }
            if (coinCount < state.singleLowAmount) {
                return Toast({
                    message: `${t('withdrawCoin.hint_4')}${
                        state.singleLowAmount
                    }`
                })
            }
            if (coinCount > state.singleHighAmount) {
                return Toast({
                    message: `${t('withdrawCoin.hint_5')}${
                        state.singleHighAmount
                    }`
                })
            }
            if (!state.currentWallet) {
                return Toast({ message: t('withdrawCoin.walletSelect') })
            }
            if (!state.pwd) {
                return Toast(t('common.inputFundPwd'))
            }
            if (googleCodeVis.value && !state.googleCode) {
                return Toast(t('common.inputGoogleCode'))
            }

            // 发起提现
            launchHandleWithdraw()
        }

        // 发起提现
        const launchHandleWithdraw = () => {
            state.loading = true
            const item = {
                ...params,
                amount: state.coinCount,
                withdrawCoinAmount: state.coinCount,
                rate: state.withdrawRate.exchangeRate,
                withdrawRateSerialNo: state.withdrawRate.withdrawRateSerialNo,
                bankAccountName: customInfo.customerNo,
                // bankAccountName: '', NEWUI_SHOW
                bankName: '数字钱包',
                bankCardNo: state.currentWallet.address,
                withdrawType: 2,
                withdrawCurrency: state.coinKind,
                blockchainName: state.chainName,
                fundPwd: md5(state.pwd),
                googleCode: state.googleCode
            }
            handleWithdraw(item).then((res) => {
                state.loading = false
                if (res.check()) {
                    state.withdrawSuccess = true
                } else {
                    state.serviceCount = ''
                    state.arriveCount = ''
                    state.minusCount = ''
                }
            })
        }

        onMounted(() => {
            new Promise((resolve, reject) => {
                // 获取客户提币币种和链名称
                queryWithdrawCurrencyList(resolve)
            }).then((res) => {
                // 获取配置信息
                getWithdrawRate()
                // 获取取款限制配置
                getWithdrawConfig()
            })
            store.commit('_user/Update_account', accountId)
        })

        // 刷新地址列表
        watch(() => route.path, (newVal) => {
            const arr = newVal.split('/').filter(i => i)
            if (state.historyPath === '/assets/walletAddress' && arr.length === 1) {
                getWalletAddress()
            }
            state.historyPath = route.path
        })

        return {
            ...toRefs(state),
            goFundForgot,
            customInfo,
            selectCoinKind,
            selectChainName,
            timeList,
            changeAmount,
            onAllTake,
            goWalletAdd,
            openWalletSelect,
            selectWallet,
            onConfirm,
            googleCodeVis,
            getGooleVerifyCode,
            accountCurrency
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.container {
    height: 100%;
    overflow-y: overlay;
    display: flex;
    flex-direction: column;
    @include scroll-bar-vertical;
    .empty {
        // height: remFree(20px);
        background-color: var(--bgColor);
    }
}
.module-form {
    background-color: var(--contentColor);
    .select {
        display: flex;
        align-items: center;
        height: remFree(90px);
        margin: 0 remFree(30px);
        color: var(--color);
        font-size: remFree(24px);
        border-bottom: 1px solid var(--lineColor);
        :deep(.el-select) {
            width: 100%;
            .el-input__inner {
                background: #fff;
            }
        }
        :deep(.el-input__inner) {
            text-align: right;
            border: none;
        }
        .option {
            display: inline-flex;
            flex: 1;
            align-items: center;
            justify-content: flex-end;
            height: 100%;
            input {
                flex: 1;
                height: 100%;
                margin: 0 remFree(20px);
                text-align: right;
            }
        }
    }
    .block {
        padding: 0 remFree(30px);
        .title {
            display: flex;
            align-items: center;
            height: remFree(84px);
            color: var(--color);
            font-size: remFree(24px);
        }
        .handle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: remFree(100px);
            color: var(--color);
            border-bottom: 1px solid var(--lineColor);
            input {
                width: remFree(500px);
                height: 100%;
                font-size: remFree(44px);
            }
            ::placeholder {
                font-size: remFree(24px);
            }
            button {
                @include hover();
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: remFree(168px);
                height: remFree(60px);
                font-size: remFree(20px);
                line-height: remFree(60px);
                background: none;
                border: 1px solid var(--lineColor);
                border-radius: remFree(30px);
                cursor: pointer;
            }
        }
        .may {
            display: flex;
            margin-top: remFree(16px);
            font-size: remFree(20px);
            span {
                display: inline-flex;
                align-items: center;
                margin-right: remFree(8px);
                color: var(--color);
            }
            strong {
                display: inline-flex;
                align-items: center;
                // color: var(--focusColor);
                color: var(--primary);
            }
        }
    }
    .case {
        padding: remFree(15px) remFree(30px);
        color: var(--minorColor);
        font-size: remFree(20px);
        .row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: remFree(50px);
            .name {
                display: inline-flex;
                align-items: center;
                span {
                    margin-right: remFree(3px);
                }
            }
            .value {
                display: inline-flex;
            }
        }
    }
    .fund {
        .bw-t {
            color: var(--color);
            font-size: remFree(24px);
            line-height: remFree(72px);
        }
        .fund-input {
            display: flex;
            align-items: center;
            .input-comp {
                flex: 1;
            }
            .href {
                color: var(--primary);
                vertical-align: middle;
                cursor: pointer;
            }
        }
    }
}
.field-google :deep() {
    .van-cell {
        // padding-left: 20px;
        background: none;
    }
    .form-item {
        margin-bottom: 0;
    }
    .paste {
        display: none;
    }
}
.module-wallet {
    padding: remFree(30px);
    background-color: var(--contentColor);
    .title {
        color: var(--color);
        font-size: remFree(24px);
    }
    .hint {
        margin-top: remFree(14px);
        // color: var(--focusColor);
        color: var(--primary);
        font-size: remFree(20px);
    }
    // 无钱包地址
    .wallet-not {
        // @include hover();
        display: flex;
        align-items: center;
        height: remFree(120px);
        margin-top: remFree(28px);
        padding: 0 remFree(30px);
        border: 1px solid var(--lineColor);
        border-radius: remFree(4px);
        cursor: pointer;
        :deep(.van-icon-plus) {
            margin-right: remFree(26px);
            font-weight: bold;
        }
        span {
            color: var(--color);
            font-size: remFree(24px);
        }
    }
    // 有钱包地址
    .wallet-address {
        // @include hover();
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: remFree(120px);
        margin-top: remFree(28px);
        padding: 0 remFree(30px);
        border: 1px solid var(--lineColor);
        border-radius: remFree(4px);
        cursor: pointer;
        .info {
            flex: 1;
            .row {
                display: flex;
                align-items: center;
                .name {
                    margin-right: remFree(15px);
                    color: var(--color);
                    font-size: remFree(28px);
                }
                .tag {
                    padding: remFree(9px) remFree(7px);
                    color: #3894ff;
                    font-size: remFree(20px);
                    background-color: #eef6fe;
                    border-radius: remFree(4px);
                }
            }
            .code {
                margin-top: remFree(10px);
                color: var(--color);
                font-size: remFree(20px);
            }
        }
        :deep(.van-icon-arrow-down) {
            margin-right: remFree(-2px);
            font-weight: bold;
        }
    }
}
.fund {
    padding: 0 remFree(30px) remFree(30px) remFree(30px);
    background-color: var(--contentColor);
    .bw-t {
        color: var(--color);
        font-size: remFree(24px);
        line-height: remFree(72px);
    }
    .fund-input {
        display: flex;
        align-items: center;
        .input-comp {
            flex: 1;
        }
        .href {
            color: var(--primary);
            vertical-align: middle;
            cursor: pointer;
        }
    }
}
.select-group {
    padding-top: 26px;
}
.wallet-select {
    .wallet-list {
        padding: 0 remFree(30px);
        .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: remFree(116px);
            border-bottom: 1px solid var(--lineColor);
            &:nth-of-type(1) {
                border-top: 1px solid var(--lineColor);
            }
            .info {
                flex: 1;
                .row {
                    display: flex;
                    align-items: center;
                    .name {
                        margin-right: remFree(15px);
                        color: var(--color);
                        font-size: remFree(28px);
                    }
                    .tag {
                        padding: remFree(9px) remFree(7px);
                        color: #3894ff;
                        font-size: remFree(20px);
                        background-color: #eef6fe;
                        border-radius: remFree(4px);
                    }
                }
                .code {
                    margin-top: remFree(10px);
                    color: var(--color);
                    font-size: remFree(20px);
                }
            }
        }
    }
    .add-handle {
        display: flex;
        align-items: center;
        height: remFree(78px);
        padding: 0 remFree(30px);
        cursor: pointer;
        :deep(.van-icon-plus) {
            margin-right: remFree(10px);
            font-weight: bold;
        }
        span {
            flex: 1;
            color: var(--color);
            font-size: remFree(24px);
        }
    }
}
.footBtnBox {
    flex: 1;
    min-height: remFree(160px);
    position: relative;
    background: var(--contentColor);
}
.footer-btn {
    width: remFree(690px);
    height: remFree(78px);
    background: var(--primary);
    border-radius: remFree(10px);
    font-size: remFree(26px);
    color: var(--contentColor);
    position: absolute;
    bottom: remFree(30px);
    left: remFree(30px);
}
.add-success {
    padding: remFree(30px) remFree(30px) 0 remFree(30px);
    text-align: center;
    .icon_success {
        color: var(--success);
        font-size: remFree(96px);
    }
    .title {
        line-height: remFree(80px);
    }
    .content {
        margin: remFree(20px) 0;
        color: var(--minorColor);
        font-size: remFree(24px);
    }
}
.time-wrap {
    padding: remFree(30px);
    font-size: remFree(24px);
    .flex {
        display: flex;
        .time-text {
            flex: 1;
        }
    }
}
.currencyBox {
    height: 100%;
    :deep(.select-trigger) {
        height: 100%;
    }
    :deep(.el-input) {
        height: 100%;
        font-size: inherit;
        line-height: 100% !important;
    }
    :deep(.el-input__inner) {
        border: none !important;
        font-size: remFree(24px);
    }
    :deep(.el-input__wrapper) {
        --el-select-input-focus-border-color: transparent;
        box-shadow: none !important;
    }
}
.currencyOption {
    display: flex;
    align-items: center;
    height: 40px;
    line-height: 2;
    font-size: remFree(24px);
}
</style>
