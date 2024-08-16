<template>
    <centerViewDialog class='dialog-body'>
        <Loading :show='loading' />
        <!-- <LayoutTop /> -->
        <LayoutTop :custom-back='true' @back='handleBack' />

        <div v-if="showType == 'withdraw'" class='container-w'>
            <!-- 加载中组件 -->

            <div class='new-tips-box'>
                <svg fill='none' height='24' viewBox='0 0 25 24' width='25' xmlns='http://www.w3.org/2000/svg'>
                    <path
                        d='M13.3952 13.4069C10.9143 11.52 9.81438 8.12833 10.0952 3.23161C10.0244 2.34121 8.9991 3.26521 7.01958 6.00385L4.44678 3.09481C4.38679 3.02697 4.307 2.9797 4.21868 2.95967C4.13036 2.93965 4.03798 2.94789 3.95459 2.98323C3.87121 3.01857 3.80104 3.07921 3.754 3.1566C3.70697 3.23399 3.68544 3.3242 3.69246 3.41449C4.24878 10.5624 7.1475 14.9093 12.3886 16.4551C17.9295 18.0895 18.265 17.0734 13.3949 13.4071L13.3952 13.4069Z'
                        fill='#FECD34'
                    />
                    <path
                        d='M14.2148 18.2943L11.9271 18.0027C11.7938 17.9857 11.6679 17.9318 11.5636 17.847C11.4594 17.7622 11.381 17.6499 11.3372 17.5228C11.2935 17.3958 11.2861 17.259 11.3161 17.128C11.346 16.997 11.412 16.877 11.5066 16.7815L13.1297 15.1433C13.2119 15.0604 13.2727 14.9587 13.3069 14.8471C13.341 14.7355 13.3475 14.6172 13.3258 14.5025L12.8962 12.2364C12.8712 12.1044 12.8836 11.9681 12.9321 11.8427C12.9805 11.7174 13.063 11.6082 13.1703 11.5273C13.2776 11.4465 13.4054 11.3972 13.5392 11.3852C13.673 11.3732 13.8075 11.3989 13.9275 11.4593L15.9874 12.4966C16.0917 12.5491 16.2071 12.5755 16.3238 12.5735C16.4405 12.5715 16.5549 12.5411 16.6573 12.4851L18.6797 11.3763C18.7975 11.3117 18.9311 11.2814 19.0652 11.2887C19.1993 11.2961 19.3287 11.3408 19.4388 11.4179C19.5488 11.4949 19.6351 11.6012 19.6879 11.7248C19.7406 11.8483 19.7578 11.9841 19.7374 12.1169L19.3873 14.3967C19.3696 14.5121 19.3802 14.63 19.4183 14.7404C19.4563 14.8508 19.5206 14.9503 19.6057 15.0303L21.2849 16.6109C21.3828 16.703 21.453 16.8206 21.4875 16.9505C21.522 17.0803 21.5194 17.2173 21.4802 17.3458C21.4409 17.4743 21.3664 17.5892 21.2652 17.6776C21.164 17.766 21.0401 17.8243 20.9074 17.8459L18.631 18.2172C18.5158 18.236 18.4069 18.2825 18.3137 18.3528C18.2204 18.423 18.1457 18.5149 18.0958 18.6204L17.1116 20.706C17.0543 20.8275 16.9641 20.9306 16.8513 21.0036C16.7384 21.0765 16.6074 21.1164 16.4731 21.1188C16.3387 21.1212 16.2064 21.0859 16.0911 21.017C15.9757 20.9481 15.882 20.8482 15.8204 20.7288L14.7637 18.6787C14.7102 18.5749 14.6323 18.4857 14.5367 18.4187C14.4411 18.3518 14.3306 18.309 14.2148 18.2943Z'
                        fill='#FC9A24'
                    />
                    <path
                        d='M19.4999 10.1465C19.4999 10.3056 19.5631 10.4582 19.6756 10.5707C19.7881 10.6833 19.9407 10.7465 20.0999 10.7465C20.259 10.7465 20.4116 10.6833 20.5241 10.5707C20.6367 10.4582 20.6999 10.3056 20.6999 10.1465C20.6999 9.98735 20.6367 9.83474 20.5241 9.72221C20.4116 9.60969 20.259 9.54648 20.0999 9.54648C19.9407 9.54648 19.7881 9.60969 19.6756 9.72221C19.5631 9.83474 19.4999 9.98735 19.4999 10.1465Z'
                        fill='#FC9A24'
                    />
                    <path
                        d='M17.3398 5.82647C17.3398 5.9856 17.4031 6.13821 17.5156 6.25074C17.6281 6.36326 17.7807 6.42647 17.9398 6.42647C18.099 6.42647 18.2516 6.36326 18.3641 6.25074C18.4766 6.13821 18.5398 5.9856 18.5398 5.82647C18.5398 5.66734 18.4766 5.51473 18.3641 5.40221C18.2516 5.28969 18.099 5.22647 17.9398 5.22647C17.7807 5.22647 17.6281 5.28969 17.5156 5.40221C17.4031 5.51473 17.3398 5.66734 17.3398 5.82647Z'
                        fill='#FC9A24'
                    />
                    <path
                        d='M15.8999 7.38647C16.0272 7.38647 16.1493 7.43705 16.2393 7.52706C16.3293 7.61708 16.3799 7.73917 16.3799 7.86647V8.58647H17.0999C17.2272 8.58647 17.3493 8.63705 17.4393 8.72706C17.5293 8.81708 17.5799 8.93917 17.5799 9.06647C17.5799 9.19378 17.5293 9.31587 17.4393 9.40589C17.3493 9.4959 17.2272 9.54647 17.0999 9.54647H16.3799V10.2665C16.3799 10.3295 16.3675 10.3919 16.3434 10.4502C16.3192 10.5084 16.2839 10.5613 16.2393 10.6059C16.1947 10.6505 16.1418 10.6858 16.0836 10.7099C16.0254 10.7341 15.9629 10.7465 15.8999 10.7465C15.8369 10.7465 15.7744 10.7341 15.7162 10.7099C15.658 10.6858 15.6051 10.6505 15.5605 10.6059C15.5159 10.5613 15.4806 10.5084 15.4564 10.4502C15.4323 10.3919 15.4199 10.3295 15.4199 10.2665V9.54647H14.6999C14.6369 9.54647 14.5744 9.53406 14.5162 9.50994C14.458 9.48581 14.4051 9.45046 14.3605 9.40589C14.3159 9.36131 14.2806 9.3084 14.2564 9.25016C14.2323 9.19193 14.2199 9.12951 14.2199 9.06647C14.2199 9.00344 14.2323 8.94102 14.2564 8.88279C14.2806 8.82455 14.3159 8.77163 14.3605 8.72706C14.4051 8.68249 14.458 8.64713 14.5162 8.62301C14.5744 8.59889 14.6369 8.58647 14.6999 8.58647H15.4199V7.86647C15.4199 7.73917 15.4705 7.61708 15.5605 7.52706C15.6505 7.43705 15.7726 7.38647 15.8999 7.38647ZM8.6999 16.7465C8.8272 16.7465 8.94929 16.797 9.03931 16.8871C9.12933 16.9771 9.1799 17.0992 9.1799 17.2265V17.9465H9.8999C10.0272 17.9465 10.1493 17.997 10.2393 18.0871C10.3293 18.1771 10.3799 18.2992 10.3799 18.4265C10.3799 18.5538 10.3293 18.6759 10.2393 18.7659C10.1493 18.8559 10.0272 18.9065 9.8999 18.9065H9.1799V19.6265C9.1799 19.7538 9.12933 19.8759 9.03931 19.9659C8.94929 20.0559 8.8272 20.1065 8.6999 20.1065C8.57259 20.1065 8.4505 20.0559 8.36049 19.9659C8.27047 19.8759 8.2199 19.7538 8.2199 19.6265V18.9065H7.4999C7.37259 18.9065 7.2505 18.8559 7.16049 18.7659C7.07047 18.6759 7.0199 18.5538 7.0199 18.4265C7.0199 18.2992 7.07047 18.1771 7.16049 18.0871C7.2505 17.997 7.37259 17.9465 7.4999 17.9465H8.2199V17.2265C8.2199 17.0992 8.27047 16.9771 8.36049 16.8871C8.4505 16.797 8.57259 16.7465 8.6999 16.7465Z'
                        fill='#FC9A24'
                    />
                </svg>
                <span>{{ $t('headLineTrade.chain-network-tips') }}</span>
            </div>

            <div class='withdraw-content-box'>
                <inputCard
                    :amount='coinCount'
                    :amount-rate-zero='true'
                    :class="['card-top', 'no-top']"
                    :currency='coinKind'
                    :currency-list='coinKindList'
                    :currency-rate='withdrawRate?.exchangeRate'
                    :digits-num='accountCurrency?.digits'
                    :more-zero='true'
                    :rate-price-zero='true'
                    :title="$t('withdrawMoney.moneyName')"
                    @onAmount='handleAmount'
                    @onCurrency='handleCurrency'
                >
                    <span class='withdraw-text'>
                        {{ $t('withdrawCoin.can') }}
                    </span>
                    {{ gt(coinTotal, 0) ? coinTotal : 0 }}
                    <span class='withdraw-max' @click='onAllTake'>
                        {{ $t('withdrawCoin.max') }}
                    </span>
                </inputCard>
                <inputCard
                    :amount='arriveCount'
                    :amount-rate-zero='true'
                    class='card-top'
                    :currency='inCurrency'
                    :currency-rate='1'
                    disabled
                    :more-zero='true'
                    :rate-price-zero='true'
                    :title="$t('withdrawCoin.willGet')"
                />
                <div class='service-tips'>
                    <!-- <p>
                        <span>1{{ coinKind }} ≈ {{ withdrawRate?.exchangeRate }}USDT</span>
                    </p> -->
                    <p>{{ $t('withdrawCoin.service') }}： {{ serviceCount }} {{ inCurrency }}</p>
                </div>
                <div class='address-box'>
                    <p class='address-box-tip-text'>
                        {{ $t('withdrawCoin.walletSelect') }}
                    </p>
                    <div class='address-box-info'>
                        <img alt='' src='../../../../assets/newPCUI/wallet.png' />

                        <div class='address-info-detail'>
                            <span v-if='currentWallet' class='current-address-info'>
                                {{ currentWallet?.currency }}-{{ currentWallet?.chainName }}|{{ currentWallet?.address }}
                            </span>
                            <span v-else class='current-address-info'>
                                {{ $t('withdrawCoin.cryptoWallet') }}
                            </span>
                        </div>

                        <span class='change-wallet' @click='openWalletSelect'>
                            {{ currentWallet ? $t('withdrawCoin.changeAddress') : $t('withdrawCoin.walletAdd') }}
                        </span>
                    </div>
                </div>
                <div class='qrText'>
                    <div>
                        <span>·</span>
                        <div v-html="$t('withdrawCoin.walletHint')"></div>
                    </div>
                    <div>
                        <span>·</span>
                        <div v-html="$t('withdrawCoin.tips.tips5')"></div>
                        <span :style="{ color: '#333', marginLeft: '4px' }">
                            {{ singleLowAmount || 0 }} {{ coinKind }}
                        </span>
                    </div>
                    <div>
                        <span>·</span>
                        <div v-html="$t('withdrawCoin.tips.tips6')"></div>
                    </div>
                    <div>
                        <span>·</span>
                        <div v-html="$t('withdrawCoin.tips.tips7')"></div>
                    </div>
                </div>
            </div>

            <div class='footer-btn-btn-box'>
                <button
                    :class="['footer-btn', resetBtnPrompt(false) ? 'disabled' : '']"
                    :disabled='resetBtnPrompt(false)'
                    @click='onPenPassword'
                >
                    <span>{{ resetBtnPrompt(true) }}</span>
                </button>
            </div>
        </div>

        <FundPassword
            v-if="showType == 'password'"
            v-model:googleCode='googleCode'
            v-model:pwd='pwd'
            :arrive-count='arriveCount'
            :coin-count='coinCount'
            :coin-kind='coinKind'
            :minus-count='minusCount'
            :service-count='serviceCount'
            @submit='confirmWithdraw'
        />

        <ManageAddress
            v-if="showType == 'address'"
            :account-id='accountId'
            :address-list='addressList'
            :chain='chainName'
            :chain-name-list='chainNameList'
            :coin='coinKind'
            :trade-type='tradeType'
            :wallet-id='walletId'
            :withdraw-method='currentTab'
            @change='addressList = $event'
            @submit='addressSubmit'
        />

        <div v-if="showType == 'success'" class='success-box'>
            <img class='success-img' src='../../../../assets/newPCUI/withdraw.png' />
            <p>{{ $t('withdrawCoin.tips.tips8') }}</p>
            <div>
                <p>
                    <span>{{ $t('wallet.currency') }}</span>
                    <span>{{ finished.currency }}</span>
                </p>
                <p>
                    <span>{{ $t('cRoute.walletAddress') }}</span>
                    <span>{{ finished.address }}</span>
                </p>
                <p>
                    <span>{{ $t('withdrawCoin.service') }}</span>
                    <span>{{ finished.fee }}</span>
                </p>
                <!-- <p>
                <span>{{ $t("wallet.amount") }}</span>
                <span>{{ finished.amount }}</span>
            </p> -->
                <p>
                    <span>{{ $t('fundInfo.fundArrive') }}</span>
                    <span>{{ finished.arriveCount }}</span>
                </p>
                <p>
                    <span>{{ $t('common.time') }}</span>
                    <span>{{ finished.time }}</span>
                </p>
            </div>
        </div>

        <!-- 取款时间弹窗 -->
        <van-dialog v-model:show='timeShow' :title="$t('withdraw.hint')" :width='360'>
            <div class='time-wrap'>
                <h4>
                    {{ $t('withdraw.timeHint') }}
                </h4>
                <br />
                <div v-if='timeList.length > 0' class='flex'>
                    <p v-if='timeList.length > 0'>
                        {{ $t('withdraw.timeName') }}：
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
    </centerViewDialog>
</template>

<script>
import inputCard from '@planspc/components/inputCard.vue'
import centerViewDialog from '@planspc/layout/centerViewDialog'
import ManageAddress from './components/ManageAddress.vue'
import FundPassword from './FundPassword.vue'
import { reactive, toRefs, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Toast, Dialog } from 'vant'
import { useI18n } from 'vue-i18n'
import {
    queryWithdrawConfig,
    getWithdrawCurrencyList,
    checkKycApply,
    getWalletAddressList,
    handleWithdraw,
    queryWithdrawRate,
    queryWithdrawLimitInfo,
    computeWithdrawFee,
    withdrawCurrencyList,
} from '@api/user'
// 工具方法
import md5 from 'js-md5'
import { divide, mul, plus, toFixed, gt, lt } from '@/utils/calculation'
import { isEmpty, debounce, getCookie, hideWalletMiddleInfo } from '@/utils/util'
export default {
    components: {
        centerViewDialog,
        FundPassword,
        inputCard,
        ManageAddress,
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const { currencys, tradeTypes, accountIds } = route.query
        const state = reactive({
            // 加载状态
            loading: true,
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
            coinKind: currencys || '',
            // 链名称
            chainName: '',
            // 全部提币数量
            coinTotal: '',
            // 提币数量
            coinCount: '',
            // 手续费
            serviceCount: '0',
            // 预计到账
            arriveCount: '',
            // 账户减扣
            minusCount: '0',
            // 是否显示取款时间弹窗
            timeShow: false,
            // 处理后的时区
            withdrawTimeConfigMap: {},

            // 是否显示钱包地址选择弹窗
            walletSelectVisible: false,
            // 钱包地址列表
            addressList: [],
            // 当前选择的钱包
            currentWallet: null,
            // 当前选择钱包地址id
            walletId: 0,
            // 输入的密码
            pwd: '',
            // 输入的google验证码，如果有
            googleCode: '',
            tradeType: Number(tradeTypes) || '', // 玩法类型
            accountId: '', // 当前账户id
            currentTab: '', // 当前能提币的平台
            inCurrency: currencys || '', // 提现到账的币种
            inCurrencyList: [],
            withdrawMethod: '',
            lang: getCookie('lang'),
            methodPickerShow: false,
            methodList: [],
            withdrawMethodText: '',
            disabled: true,
            accountCurrency: {},
            pwOpen: false,
            finished: {}, // 完成提现后的弹窗信息
            limitResult: true, // 提现的限制检查结果
            withdrawFeeStatus: true, // 取款手续费的接口状态
            // showType为显示当前弹窗操作模式，分别为
            // withdraw（输入提现）,password(输入密码)，success（提现成功），address(选择地址)
            showType: 'withdraw',
        })

        const accountList = computed(() => store.state._user.customerInfo.accountList)

        // 当前下拉选择币种列表
        const columns = computed(() =>
            accountList.value
                .filter((item) => item.tradeType == state.tradeType)
                .map((el) => {
                    return {
                        currency: el.currency,
                        accountId: el.accountId,
                    }
                }),
        )

        // 数据初始化
        const init = () => {
            state.coinTotal = ''
            state.coinCount = ''
            state.googleCode = ''
            state.serviceCount = '0'
            state.arriveCount = ''
            state.minusCount = '0'
        }

        // 跳转到忘记资金密码页面
        const goFundForgot = () => {
            router.push({
                name: 'Forgot',
                query: {
                    type: 'fund',
                },
            })
        }

        // 账户信息
        const { value: customInfo } = computed(() => store.state._user.customerInfo)
        // console.log('🚀 个人信息:', customInfo)

        // 客服信息
        const onlineServices = computed(() => store.state._base.wpCompanyInfo?.onlineService)

        const symbolKey = computed(() => store.state._quote.productActivedID)

        // 周数据
        const weekdayMap = {
            1: t('weekdayMap.1'),
            2: t('weekdayMap.2'),
            3: t('weekdayMap.3'),
            4: t('weekdayMap.4'),
            5: t('weekdayMap.5'),
            6: t('weekdayMap.6'),
            7: t('weekdayMap.7'),
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
                                openTimeLocal: item.openTimeLocal,
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

            if (state.disabled) {
                return
            }
            if (!state.coinKind) {
                return Toast(t('withdrawCoin.coinPlaceholder'))
            }
            if (!state.chainName) {
                return Toast(t('withdrawCoin.chainPlaceholder'))
            }

            if (state.coinCount === '') return
            if (coinCount < state.singleLowAmount) {
                return Toast({
                    message: `${t('withdrawCoin.hint_4')}${state.singleLowAmount}`,
                })
            }
            if (coinCount > state.singleHighAmount) {
                return Toast({
                    message: `${t('withdrawCoin.hint_5')}${state.singleHighAmount}`,
                })
            }
            if (coinCount > coinTotal) {
                return Toast(t('withdrawCoin.hint_1'))
            }
            const { withdrawRateSerialNo, exchangeRate } = state.withdrawRate || {}
            const item = {
                ...getParams(),
                withdrawType: 2,
                withdrawRateSerialNo,
                blockchainName: state.chainName,
                withdrawCurrency: state.inCurrency,
                amount: mul(state.coinCount, exchangeRate),
            }
            computeWithdrawFee(item).then((res) => {
                // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!', res, res.check())
                if (res.check()) {
                    const { data } = res
                    state.withdrawFeeStatus = true
                    state.serviceCount = data.coinFee
                    state.arriveCount = data.coinFinalAmount
                    state.minusCount = data.amount
                } else {
                    state.withdrawFeeStatus = false
                }
            })
        }, 1000)

        watch(
            () => state.coinCount,
            (newVal) => {
                // console.log('newVal------>', newVal)
                if (newVal?.length) {
                    getWithdrawFee()
                } else {
                    state.arriveCount = ''
                    state.serviceCount = '0'
                }
                // if (typeof newVal === 'number') {
                //     getWithdrawFee()
                // }
                // if (!newVal) {
                //     state.arriveCount = ''
                //     state.serviceCount = '0'
                // }
            },
            { immediate: true },
        )

        // 判断文案设置
        const resetBtnPrompt = (bool = true) => {
            const coinTotal = parseFloat(state.coinTotal)
            const coinCount = parseFloat(state.coinCount)

            if (!state.limitResult) {
                return bool ? t('withdraw.confirm') : true
            }
            if (state.disabled) {
                return bool ? t('withdraw.confirm') : true
            }
            if (!state.withdrawFeeStatus) {
                return bool ? t('withdraw.confirm') : true
            }

            if (!state.coinCount) {
                return bool ? t('withdrawCoin.coinCountPlaceholder') : true
            }
            if (!state.currentWallet) {
                return bool ? t('withdrawCoin.walletAdd') : true
            }

            if (lt(coinCount, state.singleLowAmount)) {
                return bool ? t('withdraw.confirm') : true
            }
            if (gt(coinCount, state.singleHighAmount)) {
                return bool ? t('withdraw.confirm') : true
            }
            if (gt(coinCount, coinTotal)) {
                return bool ? t('withdraw.confirm') : true
            }
            return bool ? t('withdraw.confirm') : false
        }

        // 时区转换
        const transferUtc = () => {
            const todayStr = window.dayjs().format('YYYY-MM-DD')
            state.withdrawConfig.withdrawTimeConfigList.forEach((el) => {
                el.openTimeLocal = []
                state.withdrawTimeConfigMap[el.weekDay] = {
                    weekDay: el.weekDay,
                    openTime: el.openTime,
                    openTimeLocal: [],
                }
            })

            // 处理跨天逻辑
            for (const key in state.withdrawTimeConfigMap) {
                if (Object.hasOwnProperty.call(state.withdrawTimeConfigMap, key)) {
                    const el = state.withdrawTimeConfigMap[key]
                    if (!isEmpty(el.openTime)) {
                        const timeRange = el.openTime.split(',')
                        if (timeRange.length > 0) {
                            timeRange.forEach((timeRangeItem) => {
                                const [start, end] = timeRangeItem.split('-')
                                const startLocal = window.dayjs.utc(`${todayStr} ${start}`).local()
                                const endLocal = window.dayjs.utc(`${todayStr} ${end}`).local()

                                // 第二天
                                const weekDay = key < 7 ? Number(key) + 1 : 1
                                let elNext = state.withdrawTimeConfigMap[weekDay]

                                if (!elNext) {
                                    elNext = {
                                        openTimeLocal: [],
                                        weekDay,
                                    }
                                    state.withdrawTimeConfigMap[weekDay] = elNext
                                }

                                if (startLocal.isAfter(todayStr, 'day')) {
                                    elNext.openTimeLocal.push(startLocal.format('HH:mm') + '-' + endLocal.format('HH:mm'))
                                } else if (endLocal.format('HH:mm') === '00:00') {
                                    el.openTimeLocal.push(startLocal.format('HH:mm') + '-24:00')
                                } else if (endLocal.isAfter(todayStr, 'day')) {
                                    elNext.openTimeLocal.unshift('00:00-' + endLocal.format('HH:mm'))
                                    el.openTimeLocal.push(startLocal.format('HH:mm') + '-23:59')
                                } else if (el.openTime !== '00:00-00:00' || el.openTime !== '') {
                                    el.openTimeLocal.push(startLocal.format('HH:mm') + '-' + endLocal.format('HH:mm'))
                                }
                            })
                        }
                    }
                }
            }

            // 处理时间合并
            for (const key in state.withdrawTimeConfigMap) {
                if (Object.hasOwnProperty.call(state.withdrawTimeConfigMap, key)) {
                    const el = state.withdrawTimeConfigMap[key]
                    if (Array.isArray(el.openTimeLocal)) {
                        el.openTimeLocal.forEach((time, index) => {
                            const start = el.openTimeLocal[0].split('-')[0]

                            const end = time.split('-')[1]
                            const nextStart = el.openTimeLocal[index + 1] && el.openTimeLocal[index + 1].split('-')[0]
                            const nextEnd = el.openTimeLocal[index + 1] && el.openTimeLocal[index + 1].split('-')[1]

                            if (
                                window
                                    .dayjs(`${todayStr} ${end}`)
                                    .add(1, 'minute')
                                    .isSame(window.dayjs(`${todayStr} ${nextStart}`)) ||
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
        const getParams = () => ({
            withdrawType: 2,
            accountId: state.accountId,
            tradeType: state.tradeType,
            customerNo: customInfo.customerNo,
            accountCurrency: state.coinKind,
            customerGroupId: customInfo.customerGroupId,
            country: customInfo.country,
            withdrawMethod: state.currentTab,
        })

        // 获取取款限制配置
        const getWithdrawConfig = () => {
            const params = {
                ...getParams(),
                withdrawCurrency: state.inCurrency,
                blockchainName: state.chainName,
                tradeType: state.tradeType,
            }
            // console.log('取款限制请求参数----->', getParams(), params)

            queryWithdrawConfig(params).then((res) => {
                // console.log('取款的限制接口----->', res, res.check())
                if (res.check()) {
                    const { data } = res
                    state.withdrawConfig = data
                    let result = true

                    if (!data.customerGroupEnable) {
                        state.loading = false
                        result = false
                        // console.log('提醒了')
                        Dialog.confirm({
                            title: t('withdraw.hint'),
                            message: t('withdraw.withdrawLimitHint'),
                            confirmButtonText: t('withdraw.contact'),
                            cancelButtonText: t('withdraw.close'),
                        })
                            .then(() => {
                                if (onlineServices.value) {
                                    window.open(onlineServices.value)
                                }
                            })
                            .catch(() => {})
                    }
                    // console.log(console.log('result---------->', result))
                    if (result) {
                        state.limitResult = true
                        // state.limitResult = checkWithdrawLimit(false)
                    } else {
                        // console.log('接口提醒了我不能取款')
                        state.limitResult = false
                    }
                    // 检测取款是否需要kyc
                    checkKyc()
                    // 时区转换

                    transferUtc()
                } else {
                    state.loading = false
                }
            })
        }

        const checkWithdrawLimit = () => {
            const withdrawConfig = state.withdrawConfig

            // 账户未激活
            if (!withdrawConfig.accountActiveEnable) {
                Dialog.alert({
                    title: t('withdraw.hint'),
                    message: t('withdraw.activateMsg'),
                    confirmButtonText: t('common.sure'),
                })
                return false
            }
            // 不在取款时间内
            if (!withdrawConfig.timeEnable) {
                state.timeShow = true
                return false
            }
            // 不可取款
            if (!withdrawConfig.customerGroupEnable) {
                Dialog.confirm({
                    title: t('withdraw.hint'),
                    message: t('withdraw.withdrawLimitHint'),
                    confirmButtonText: t('withdraw.contact'),
                    cancelButtonText: t('withdraw.close'),
                })
                    .then(() => {
                        if (onlineServices.value) {
                            window.open(onlineServices.value)
                        }
                    })
                    .catch(() => {})
                return false
            }
            // 可取资金不足
            if (!withdrawConfig.amountEnable) {
                Toast(t('withdrawCoin.hint_1'))
                return false
            }
            // 24内取款超过最大次数
            if (!withdrawConfig.hourIn24Enable) {
                Toast(t('withdrawCoin.hint_2') + withdrawConfig.withdrawBaseConfig.maxCount + t('withdrawCoin.unit'))
                return false
            }
            return true
        }

        // 检测取款是否需要kyc
        const checkKyc = () => {
            checkKycApply({
                businessCode: 'withdraw',
                openAccountType: customInfo.openAccountType,
            }).then((res) => {
                state.loading = false
                if (Number(res.data) !== 2) {
                    return Dialog.alert({
                        title: t('withdraw.hint'),
                        confirmButtonText: Number(res.data) === 1 ? t('withdraw.kycBtn_1') : t('withdraw.kycBtn_2'),
                        message: Number(res.data) === 2 ? t('withdraw.kycMsg_1') : t('withdraw.kycMsg_2'),
                    }).then(() => {
                        if (customInfo.openAccountType === 0) {
                            router.replace({
                                path: route.path.replace('withdraw', 'authentication'),
                                query: { businessCode: 'withdraw' },
                            })
                        } else {
                            router.replace({
                                path: '/businessKYC',
                            })
                        }
                    })
                }
            })
        }

        // 根据提币币种获取筛选链名称
        const filterChainName = (bool = false) => {
            const chainNameList = []
            const arr = state.allList.filter((v) => v.withdrawCurrency === state.coinKind)
            arr.map((elem) => {
                chainNameList.push({ name: elem.blockchainName })
            })
            state.chainName = chainNameList[0]?.name
            // console.log('chainNameList=======>', chainNameList)
            state.chainNameList = chainNameList
            // bool ? getWalletAddress() : setConfigAddress()
            getWalletAddress()
        }

        // 因为地址在第一次已经请求了全部，所以不需要再请求地址数据

        const setConfigAddress = () => {
            // console.log('我没有请求，走缓存的数据', state.addressList, state.chainName, state.coinKind)
            if (state.addressList.length > 0) {
                // 设置当前地址,按照改版需求
                const flagItem = state.addressList.find((item) => state.chainName == item.chainName && state.coinKind == item.currency)
                state.currentWallet = flagItem || null
                state.walletId = flagItem?.id || 0
            } else {
                // state.chainName = list[0]
                state.currentWallet = null
                state.walletId = 0
            }
            // 获取配置信息
            getWithdrawRate()
            // 获取取款限制配置
            getWithdrawConfig()
        }

        // 点击选择提币币种
        const selectCoinKind = (item) => {
            state.coinKind = item
            state.inCurrency = item
            const current = accountList.value.find((el) => el.currency === item && el.tradeType == state.tradeType) || {}
            state.accountId = current?.accountId
            state.accountCurrency = current
            // state.chainName,
            // 初据初始化
            init()
            filterChainName()
        }

        // 点击选择链名称
        const selectChainName = (item) => {
            state.chainName = item
            getWithdrawRate()
            getWithdrawConfig()
            getWithdrawFee()
        }

        // 获取取款汇率
        const getWithdrawRate = () => {
            const config = {
                accountId: state.accountId,
                tradeType: state.tradeType,
                accountCurrency: state.coinKind,
                withdrawCurrency: state.inCurrency,
                withdrawType: 2,
            }
            // console.log('取款汇率请求配置----->', config)

            queryWithdrawRate(config).then((res) => {
                // console.log('取款的汇率--->', res)
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
                ...getParams(),
                withdrawRateSerialNo: state.withdrawRate.withdrawRateSerialNo,
                withdrawCurrency: state.inCurrency,
                blockchainName: state.chainName,
            }).then((res) => {
                // console.log('获取取款、提币额度限制配置', res)
                if (res.check()) {
                    const { data } = res
                    const { digits = 2 } = state.accountCurrency || {}
                    const { exchangeRate = 1 } = state.withdrawRate || {}
                    state.coinTotal = toFixed(divide(data.withdrawAmount, exchangeRate), digits)
                    state.singleHighAmount = toFixed(divide(data.singleHighAmount, exchangeRate), digits)
                    state.singleLowAmount = toFixed(divide(data.singleLowAmount, exchangeRate), digits)
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
            // 接口本身返回当前记录的币种地址
            getWalletAddressList({
                currency: state.coinKind,
                // chainName: state.chainName
            }).then((res) => {
                // console.log('钱包的数据:', res, state.coinKind, state.chainName)
                const { data } = res
                state.loading = false
                state.addressList = data
                if (data.length > 0) {
                    // 设置当前地址,按照改版需求
                    // const flagItem = data.find((item) => state.chainName == item.chainName && state.coinKind == item.currency)
                    // // console.log('🚀 ~ getWalletAddress ~ flagItem:', flagItem)
                    // state.currentWallet = flagItem || null
                    // state.walletId = flagItem?.id || 0
                    state.currentWallet = data[0]
                    state.chainName = data[0]?.chainName
                    state.walletId = data[0]?.id
                } else {
                    // state.chainName = ''
                    state.currentWallet = null
                    state.walletId = 0
                }
                // 获取配置信息
                getWithdrawRate()
                // 获取取款限制配置
                getWithdrawConfig()
            })
        }

        // 跳转到新增钱包地址页面
        const goWalletAdd = () => {
            state.walletSelectVisible = false
            router.replace({
                path: route.path.replace('withdraw', 'walletAdd'),
                query: {
                    chainName: state.chainName,
                    coin: state.coinKind,
                    tradeType: state.tradeType,
                    accountId: state.accountId,
                    withdrawMethod: state.currentTab,
                },
            })
        }

        // 钱包地址弹窗
        const openWalletSelect = () => {
            if (state.currentWallet) {
                state.showType = 'address'
                // state.walletSelectVisible = true
            } else {
                goWalletAdd()
            }
        }

        // 点击确定
        const onPenPassword = () => {
            const coinCount = parseFloat(state.coinCount)
            const amountDigitsLength = coinCount.toString().split('.')[1] ? coinCount.toString().split('.')[1].length : 0
            // 检查账号是否异常
            if (!checkWithdrawLimit()) {
                return
            }
            if (state.disabled) {
                return
            }
            if (!state.inCurrency) {
                return Toast({ message: t('withdrawCoin.coinPlaceholder') })
            }
            if (!state.chainName) {
                return Toast({ message: t('withdrawCoin.chainPlaceholder') })
            }
            if (!state.coinCount) {
                return Toast({
                    message: t('withdrawCoin.coinCountPlaceholder'),
                })
            }
            if (gt(amountDigitsLength, state.accountCurrency?.digits)) {
                return Toast(t('withdraw.withdrawDigitsTip'))
            }
            if (lt(coinCount, state.singleLowAmount)) {
                return Toast({
                    message: `${t('withdrawCoin.hint_4')}${state.singleLowAmount}`,
                })
            }
            if (gt(coinCount, state.singleHighAmount)) {
                return Toast({
                    message: `${t('withdrawCoin.hint_5')}${state.singleHighAmount}`,
                })
            }
            if (!state.currentWallet) {
                return Toast({ message: t('withdrawCoin.walletSelect') })
            }

            state.showType = 'password'

            // 没有密码，所以要打开输入密码
            // if (!pw) {
            //     state.pwOpen = true
            //     state.pwd = ''
            //     state.googleCode = ''
            //     return
            // } else if (state.pwOpen) {
            //     state.pwOpen = false
            // }
            // if (pw) state.pwd = pw
            // if (code) state.googleCode = code
            // 发起提现
            // launchHandleWithdraw()
        }

        // 发起提现
        const confirmWithdraw = () => {
            state.loading = true
            const { withdrawRateSerialNo, exchangeRate } = state.withdrawRate || {}
            const amount = plus(state.arriveCount, state.serviceCount)
            const params = {
                ...getParams(),
                amount: amount,
                withdrawCoinAmount: amount,
                rate: exchangeRate,
                withdrawRateSerialNo,
                bankAccountName: customInfo.customerNo,
                bankName: '数字钱包',
                bankCardNo: state.currentWallet.address,
                withdrawType: 2,
                withdrawCurrency: state.inCurrency,
                blockchainName: state.chainName,
                fundPwd: md5(state.pwd),
                googleCode: state.googleCode,
            }
            // console.log('params=====>', params)
            handleWithdraw(params).then((res) => {
                state.loading = false
                // console.log('提现接口返回的结果--->', res, res.check())
                if (res.check() || res.code == '51046' || res.code == '51035') {
                    withdrawSuccessHandle()
                }
            })
        }

        const withdrawSuccessHandle = () => {
            state.finished = {
                currency: state.inCurrency,
                address: `${state.chainName} | ${hideWalletMiddleInfo(state.currentWallet.address, '...')}`,
                amount: state.minusCount,
                arriveCount: state.arriveCount,
                fee: state.serviceCount,
                time: window.dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
            }
            state.showType = 'success'
            // 提现成功后要置空之前的数据
            state.serviceCount = ''
            state.arriveCount = ''
            state.minusCount = ''
            state.coinCount = ''
            state.googleCode = ''
            state.pwd = ''
        }

        // 获取客户提币币种和链名称
        const queryWithdrawCurrencyList = async (resolve) => {
            // 查询取款货币的限制条件列表
            const res = await withdrawCurrencyList({
                customerGroupId: customInfo.customerGroupId,
                customerNo: customInfo.customerNo,
                tradeType: state.tradeType,
                accountId: state.accountId,
            })
            // 设置默认提币的选择
            // console.log('🚀 当前支持提币平台与币种----->', res)

            const { list } = res.data
            if (res.check() && list?.length > 0) {
                const withdrawMethodArr = new Set()
                list.forEach((item) => {
                    // 数据里的withdrawMethod字符串有可能传来多个通道，用逗号隔开的数据格式
                    const methodArr = item.withdrawMethod.split(',')
                    methodArr.forEach((k) => {
                        withdrawMethodArr.add(k)
                    })
                })
                const withdrawMethodArrFormat = [...withdrawMethodArr]
                // 如果有这个默认取这个blockatm_webhook
                if (withdrawMethodArrFormat.includes('blockatm_webhook')) {
                    state.currentTab = 'blockatm_webhook'
                } else {
                    // 没有就默认取第一个
                    state.currentTab = withdrawMethodArrFormat[0]
                }

                state.disabled = false
            } else {
                if (columns.value.length === 0 || list?.length == 0) {
                    state.disabled = true
                    state.loading = false
                    Toast(t('withdraw.tips1'))
                    return
                }
            }

            const config = {
                companyId: customInfo.companyId,
                customerNo: customInfo.customerNo,
                customerGroupId: customInfo.customerGroupId,
                accountId: state.accountId,
                tradeType: state.tradeType,
                country: customInfo.country,
                withdrawMethod: state.currentTab,
            }
            // console.log('请求i配置------->', config)

            // 获取到系统可以给提币的区块链通道以及允许对应能提币的币种
            await getWithdrawCurrencyList(config).then((res) => {
                if (res.check()) {
                    const { data } = res
                    // console.log('当前平台的区块链协议配置以及提币币种---->', data)
                    if (data.length > 0) {
                        const filterToken = new Set()
                        const coinKindList = []

                        data.map((item) => {
                            filterToken.add(item.withdrawCurrency)
                        })
                        const format = [...filterToken]

                        // console.log('🚀 支持提现的代币列表----->:', format)
                        format.forEach((item) => {
                            coinKindList.push({ currency: item })
                        })
                        // 检查一下配置是否含有进来页面时的币种
                        if (coinKindList.length) {
                            if (!coinKindList.find((item) => item.name == currencys)) {
                                // selectCoinKind( coinKindList[0].currency)
                                state.coinKind = coinKindList[0].currency
                                state.inCurrency = coinKindList[0].currency
                                const current =
                                    accountList.value.find(
                                        (el) => el.currency === coinKindList[0].currency && el.tradeType == state.tradeType,
                                    ) || {}
                                state.accountId = current?.accountId
                                state.accountCurrency = current
                            }
                        }
                        state.allList = data
                        state.coinKindList = coinKindList
                        // 根据提币币种获取筛选链名称
                        filterChainName(true)
                    } else {
                        state.loading = false
                    }
                    if (resolve) resolve(res)
                }
            })
        }

        onMounted(() => {
            state.accountId = accountIds || columns.value[0]?.accountId
            state.accountCurrency = accountList.value.find((el) => el.accountId === Number(state.accountId))

            new Promise((resolve) => {
                // 获取客户提币币种和链名称
                queryWithdrawCurrencyList(resolve, true)
            }).then(() => {
                // // 获取配置信息
                getWithdrawRate()
                // // 获取取款限制配置
                getWithdrawConfig()
            })
            store.commit('_user/Update_account', state.accountId)
        })

        const handleAmount = (val) => {
            state.coinCount = val
            // console.log(val, '??????????')
        }

        // 输入划出金额
        // const outAmountInput = (val) => {
        //     const RegExp
        // }
        // 切换币种
        const handleCurrency = ({ value }) => {
            selectCoinKind(value)
        }

        const addressSubmit = (val) => {
            // console.log('我选择了钱包---->', val)
            const { walletId, currentWallet } = val || {}
            if (walletId) {
                state.walletId = walletId
                state.currentWallet = currentWallet
                const { chainName } = state.addressList.find((i) => i.id === walletId) || {}
                if (chainName) selectChainName(chainName)
            }
            state.showType = 'withdraw'
        }

        // withdraw（输入提现）,password(输入密码)，success（提现成功），address(选择地址)
        const handleBack = () => {
            const keyArr = symbolKey.value.split('_')
            switch (state.showType) {
                case 'withdraw':
                    router.replace(`/order?symbolId=${keyArr[0]}&tradeType=${keyArr[1]}`)
                    break
                case 'password':
                    state.pwd = ''
                    state.googleCode = ''
                    state.showType = 'withdraw'
                    break
                case 'success':
                    state.showType = 'withdraw'
                    break
                case 'address':
                    state.showType = 'withdraw'
                    break
                default:
                    break
            }
        }
        return {
            ...toRefs(state),
            goFundForgot,
            selectCoinKind,
            selectChainName,
            timeList,
            onAllTake,
            goWalletAdd,
            openWalletSelect,
            onPenPassword,
            getGooleVerifyCode,
            handleAmount,
            handleCurrency,
            columns,
            addressSubmit,
            resetBtnPrompt,
            gt,
            handleBack,
            confirmWithdraw,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.success-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    & > img {
        width: 52px;
        height: 52px;
        margin-top: 44px;
    }

    & > p {
        font-size: 16px;
        font-weight: 700;
        color: var(--primaryText);
        margin: 20px 0 32px;
    }

    & > div {
        width: 448px;
        height: auto;
        border-radius: 8px;
        background: #faf9f9;
        padding: 12px 24px;
        display: flex;
        flex-direction: column;
        & > p {
            line-height: 2.5;
            font-size: 14px;
            color: var(--primaryText);
            display: flex;
            justify-content: space-between;
            & > span:first-of-type {
                color: #999999;
            }
        }
    }
}
.qrText {
    width: 100%;
    min-height: 114px;
    text-align: left;
    font-size: 12px;
    color: #999999;
    & > div {
        display: flex;
        align-items: flex-start;
        & > span:first-of-type {
            font-size: 32px;
            line-height: 20px;
        }
        & > div {
            text-align: left;
            word-break: keep-all;
        }
    }
}

.container-w {
    width: 100%;
    height: calc(100% - 56px);
    // overflow-y: overlay;
    display: flex;
    flex-direction: column;
    .new-tips-box {
        background: linear-gradient(110.77deg, #fbfeff 12.4%, #e4eeff 48.4%, #fdecea 82.21%);
        min-width: 250px;
        height: 38px;
        padding: 0 16px;
        margin: 16px auto;
        display: flex;
        align-items: center;
        justify-content: center;
        & > span {
            color: var(--mainColor);
            font-family: 'Inter';
            font-size: 14px;
            font-weight: 600;
        }
    }
    .withdraw-content-box {
        max-height: calc(100% - 88px);
        overflow: auto;
        width: 100%;
        padding: 0 36px;
        @include scroll-bar-vertical;
        .empty {
            background-color: var(--bgColor);
        }
        .withdraw-text {
        }
        .withdraw-max {
            color: #4069f2;
            cursor: pointer;
        }
    }
}
.service-tips {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 12px;
    color: var(--primaryText);
    margin: 8px 0 0;
    span {
        color: #999;
    }
}
.card-top {
    margin-top: 24px;
    &.no-top {
        margin-top: 0px;
    }
}
.address-box {
    width: 100%;
    min-height: 98px;
    flex-shrink: 0;
    border-radius: 8px;
    border: 1px solid #ebe9e9;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px;
    margin: 20px 0 12px;

    .address-box-tip-text {
        font-size: 14px;
        color: var(--primaryText);
    }
    .address-box-info {
        display: flex;
        align-items: center;
        font-weight: 600;
        margin-top: 16px;
        min-height: 50px;

        & > img {
            width: 24px;
            height: 24px;
            margin-right: 8px;
        }
        .address-info-detail {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-right: 8px;
            font-size: 16px;
        }
        .change-wallet {
            color: #4069f2;
            cursor: pointer;
            white-space: nowrap;
            font-size: 16px;
        }
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
.footer-btn-btn-box {
    padding-bottom: 20px;
    padding-top: 20px;
    display: flex;
    align-items: center;
    background-color: #fff;
    justify-content: center;
    .footer-btn {
        width: 448px;
        height: 48px;
        flex-shrink: 0;
        background: var(--primary);
        color: var(--contentColor);
        font-size: 17px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-radius: 4px;
        // position: absolute;
        // bottom: 32px;
        &.disabled {
            background: #f7f7f7;
            color: #bdbdbd;
            cursor: not-allowed;
        }
        &:active {
            opacity: 0.85;
        }
    }
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

<style lang="scss">
.dialog-body {
    .el-dialog__body {
        height: 676px;
    }
}
</style>
