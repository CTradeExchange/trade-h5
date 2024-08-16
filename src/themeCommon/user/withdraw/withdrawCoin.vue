<template>
    <div class='withdrawCoinPage'>
        <Loading :show='loading' />
        <LayoutTop :custom-back='true' @back='goBack' />
        <div v-if="showType=='withdraw'" class='withdraw-box'>
            <div class='container'>
                <!-- 加载中组件 -->

                <div class='empty'></div>
                <div class='module-form'>
                    <div class='new-tips-box'>
                        <svg fill='none' height='24' viewBox='0 0 25 24' width='25' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M13.3952 13.4069C10.9143 11.52 9.81438 8.12833 10.0952 3.23161C10.0244 2.34121 8.9991 3.26521 7.01958 6.00385L4.44678 3.09481C4.38679 3.02697 4.307 2.9797 4.21868 2.95967C4.13036 2.93965 4.03798 2.94789 3.95459 2.98323C3.87121 3.01857 3.80104 3.07921 3.754 3.1566C3.70697 3.23399 3.68544 3.3242 3.69246 3.41449C4.24878 10.5624 7.1475 14.9093 12.3886 16.4551C17.9295 18.0895 18.265 17.0734 13.3949 13.4071L13.3952 13.4069Z' fill='#FECD34' />
                            <path d='M14.2148 18.2943L11.9271 18.0027C11.7938 17.9857 11.6679 17.9318 11.5636 17.847C11.4594 17.7622 11.381 17.6499 11.3372 17.5228C11.2935 17.3958 11.2861 17.259 11.3161 17.128C11.346 16.997 11.412 16.877 11.5066 16.7815L13.1297 15.1433C13.2119 15.0604 13.2727 14.9587 13.3069 14.8471C13.341 14.7355 13.3475 14.6172 13.3258 14.5025L12.8962 12.2364C12.8712 12.1044 12.8836 11.9681 12.9321 11.8427C12.9805 11.7174 13.063 11.6082 13.1703 11.5273C13.2776 11.4465 13.4054 11.3972 13.5392 11.3852C13.673 11.3732 13.8075 11.3989 13.9275 11.4593L15.9874 12.4966C16.0917 12.5491 16.2071 12.5755 16.3238 12.5735C16.4405 12.5715 16.5549 12.5411 16.6573 12.4851L18.6797 11.3763C18.7975 11.3117 18.9311 11.2814 19.0652 11.2887C19.1993 11.2961 19.3287 11.3408 19.4388 11.4179C19.5488 11.4949 19.6351 11.6012 19.6879 11.7248C19.7406 11.8483 19.7578 11.9841 19.7374 12.1169L19.3873 14.3967C19.3696 14.5121 19.3802 14.63 19.4183 14.7404C19.4563 14.8508 19.5206 14.9503 19.6057 15.0303L21.2849 16.6109C21.3828 16.703 21.453 16.8206 21.4875 16.9505C21.522 17.0803 21.5194 17.2173 21.4802 17.3458C21.4409 17.4743 21.3664 17.5892 21.2652 17.6776C21.164 17.766 21.0401 17.8243 20.9074 17.8459L18.631 18.2172C18.5158 18.236 18.4069 18.2825 18.3137 18.3528C18.2204 18.423 18.1457 18.5149 18.0958 18.6204L17.1116 20.706C17.0543 20.8275 16.9641 20.9306 16.8513 21.0036C16.7384 21.0765 16.6074 21.1164 16.4731 21.1188C16.3387 21.1212 16.2064 21.0859 16.0911 21.017C15.9757 20.9481 15.882 20.8482 15.8204 20.7288L14.7637 18.6787C14.7102 18.5749 14.6323 18.4857 14.5367 18.4187C14.4411 18.3518 14.3306 18.309 14.2148 18.2943Z' fill='#FC9A24' />
                            <path d='M19.4999 10.1465C19.4999 10.3056 19.5631 10.4582 19.6756 10.5707C19.7881 10.6833 19.9407 10.7465 20.0999 10.7465C20.259 10.7465 20.4116 10.6833 20.5241 10.5707C20.6367 10.4582 20.6999 10.3056 20.6999 10.1465C20.6999 9.98735 20.6367 9.83474 20.5241 9.72221C20.4116 9.60969 20.259 9.54648 20.0999 9.54648C19.9407 9.54648 19.7881 9.60969 19.6756 9.72221C19.5631 9.83474 19.4999 9.98735 19.4999 10.1465Z' fill='#FC9A24' />
                            <path d='M17.3398 5.82647C17.3398 5.9856 17.4031 6.13821 17.5156 6.25074C17.6281 6.36326 17.7807 6.42647 17.9398 6.42647C18.099 6.42647 18.2516 6.36326 18.3641 6.25074C18.4766 6.13821 18.5398 5.9856 18.5398 5.82647C18.5398 5.66734 18.4766 5.51473 18.3641 5.40221C18.2516 5.28969 18.099 5.22647 17.9398 5.22647C17.7807 5.22647 17.6281 5.28969 17.5156 5.40221C17.4031 5.51473 17.3398 5.66734 17.3398 5.82647Z' fill='#FC9A24' />
                            <path d='M15.8999 7.38647C16.0272 7.38647 16.1493 7.43705 16.2393 7.52706C16.3293 7.61708 16.3799 7.73917 16.3799 7.86647V8.58647H17.0999C17.2272 8.58647 17.3493 8.63705 17.4393 8.72706C17.5293 8.81708 17.5799 8.93917 17.5799 9.06647C17.5799 9.19378 17.5293 9.31587 17.4393 9.40589C17.3493 9.4959 17.2272 9.54647 17.0999 9.54647H16.3799V10.2665C16.3799 10.3295 16.3675 10.3919 16.3434 10.4502C16.3192 10.5084 16.2839 10.5613 16.2393 10.6059C16.1947 10.6505 16.1418 10.6858 16.0836 10.7099C16.0254 10.7341 15.9629 10.7465 15.8999 10.7465C15.8369 10.7465 15.7744 10.7341 15.7162 10.7099C15.658 10.6858 15.6051 10.6505 15.5605 10.6059C15.5159 10.5613 15.4806 10.5084 15.4564 10.4502C15.4323 10.3919 15.4199 10.3295 15.4199 10.2665V9.54647H14.6999C14.6369 9.54647 14.5744 9.53406 14.5162 9.50994C14.458 9.48581 14.4051 9.45046 14.3605 9.40589C14.3159 9.36131 14.2806 9.3084 14.2564 9.25016C14.2323 9.19193 14.2199 9.12951 14.2199 9.06647C14.2199 9.00344 14.2323 8.94102 14.2564 8.88279C14.2806 8.82455 14.3159 8.77163 14.3605 8.72706C14.4051 8.68249 14.458 8.64713 14.5162 8.62301C14.5744 8.59889 14.6369 8.58647 14.6999 8.58647H15.4199V7.86647C15.4199 7.73917 15.4705 7.61708 15.5605 7.52706C15.6505 7.43705 15.7726 7.38647 15.8999 7.38647ZM8.6999 16.7465C8.8272 16.7465 8.94929 16.797 9.03931 16.8871C9.12933 16.9771 9.1799 17.0992 9.1799 17.2265V17.9465H9.8999C10.0272 17.9465 10.1493 17.997 10.2393 18.0871C10.3293 18.1771 10.3799 18.2992 10.3799 18.4265C10.3799 18.5538 10.3293 18.6759 10.2393 18.7659C10.1493 18.8559 10.0272 18.9065 9.8999 18.9065H9.1799V19.6265C9.1799 19.7538 9.12933 19.8759 9.03931 19.9659C8.94929 20.0559 8.8272 20.1065 8.6999 20.1065C8.57259 20.1065 8.4505 20.0559 8.36049 19.9659C8.27047 19.8759 8.2199 19.7538 8.2199 19.6265V18.9065H7.4999C7.37259 18.9065 7.2505 18.8559 7.16049 18.7659C7.07047 18.6759 7.0199 18.5538 7.0199 18.4265C7.0199 18.2992 7.07047 18.1771 7.16049 18.0871C7.2505 17.997 7.37259 17.9465 7.4999 17.9465H8.2199V17.2265C8.2199 17.0992 8.27047 16.9771 8.36049 16.8871C8.4505 16.797 8.57259 16.7465 8.6999 16.7465Z' fill='#FC9A24' />
                        </svg>
                        <span>{{ $t('headLineTrade.chain-network-tips') }}</span>
                    </div>

                    <div class='card'>
                        <span>{{ $t('withdrawCoin.withdrawAmount') }}</span>
                        <div class='inpBox'>
                            <van-stepper
                                v-model='coinCount'
                                allow-empty
                                :decimal-length='accountList?.[0]?.digits'
                                :max='9999999999'
                                :min='0'
                                placeholder='0.00'
                                :show-minus='false'
                                :show-plus='false'
                            />
                            <div class='iconBox' @click='outPickerShow = true'>
                                <CurrencyIcon :currency='coinKind' :size='24' />
                                <span>{{ coinKind || '--' }}</span>
                                <img class='iconImg' src='@/themes/plans/images/assets/arrow.png' />
                            </div>
                        </div>
                        <div class='tipsBox'>
                            <span>{{ coinCount ? `$${addThousandthSign(mul(coinCount, withdrawRate.exchangeRate), 2,true)}` : '$0' }}</span>
                            <div class='amountBox'>
                                <span>
                                    {{ $t('common.balance') }}: {{ addThousandthSign(balanceMax, getCurrencydigits(coinKind)) }} {{ coinKind }}
                                </span>

                                <span class='max' @click='onAllTake'>
                                    {{ $t('withdrawCoin.max') }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class='card disabledBg'>
                        <span>{{ $t('withdrawCoin.willGet') }}</span>
                        <div class='inpBox'>
                            <div :class="['inp', gt(arriveCount, 0) ? '' : 'zero']">
                                {{ gt(arriveCount, 0) ? `${addThousandthSign(arriveCount, getCurrencydigits(coinKind))}` : '0.00' }}
                            </div>
                            <div class='iconBox'>
                                <CurrencyIcon :currency='coinKind' :size='24' />
                                <span>{{ coinKind || '--' }}</span>
                            </div>
                        </div>
                        <div class='tipsBox'>
                            <span>{{ gt(arriveCount, 0) ? `$${addThousandthSign(arriveCount, 2,true)}` : '$0' }}</span>
                        </div>
                    </div>
                    <div class='tipsContionBox'>
                        <!-- <span>1{{ curAccount?.currency }} = {{addThousandthSign(withdrawRate?.exchangeRate),getCurrencydigits(coinKind)}}{{ coinKind }}</span> -->
                        <div class='textBox'>
                            <span class='title'>
                                {{ `${$t('withdrawCoin.service')}: ` }}
                            </span>
                            <span class='number'>
                                {{ serviceCount }} {{ coinKind }}
                            </span>
                        </div>
                    </div>
                    <div class='addressCard'>
                        <span>{{ $t('withdrawCoin.withdrawTo') }}</span>
                        <div class='selectBox'>
                            <div class='selectBox-icon'>
                                <img alt='' src='../../../themes/plans/images/assets/addressWallet.svg' />
                            </div>
                            <div v-if='currentWallet' class='addressBox'>
                                <span>{{ currentWallet.currency }}-{{ currentWallet.chainName }}</span>
                                <span class='line'>
                                    {{ ` | ` }}
                                </span>
                                <span class='address'>
                                    {{ hideWalletMiddleInfo(currentWallet.address, '....') }}
                                </span>
                            </div>
                            <div v-if='!currentWallet' class='tipsTitle'>
                                {{ $t('withdrawCoin.cryptoWallet') }}
                            </div>
                            <div class='btn' @click='onWallet'>
                                <span>{{ currentWallet ? $t('withdrawCoin.changeAddress') : $t('withdrawCoin.walletAdd') }}</span>
                                <img alt='' src='../../../themes/plans/images/assets/addressArrowright.svg' />
                            </div>
                        </div>
                    </div>
                    <ul class='tipsText'>
                        <li>{{ $t('withdrawCoin.walletHint') }}</li>
                        <li>
                            {{ $t('withdrawCoin.tips.tips5') }}
                            <span class='tipsBlock'>
                                {{ minWithdrawAmount }}&nbsp;{{ coinKind }}
                            </span>
                        </li>
                        <li>{{ $t('withdrawCoin.tips.tips6') }}</li>
                        <li>{{ $t('withdrawCoin.tips.tips7') }}</li>
                    </ul>
                </div>
                <div class='footer'>
                    <button class='footer-btn' :disabled='resetBtnPrompt(false)' @click='onConfirm'>
                        <span>
                            {{ resetBtnPrompt() }}
                        </span>
                    </button>
                </div>
            </div>
        </div>
        <div v-if="showType=='password'" class='password-box'>
            <div class='content'>
                <img alt='' src='../../../themes/plans/images/assets/fundPwd.png' />
                <div class='title'>
                    {{ $t('withdrawCoin.tips.tips10') }}
                </div>
                <div class='titleBox'>
                    <span>*</span>{{ $t('withdrawCoin.fundPassword') }}
                </div>
                <div class='pwd-oper'>
                    <InputComp v-model='fundPwd' clear :label="$t('common.inputFundPwd')" :max-length='6' pwd />
                </div>
                <div class='fprgetPwd'>
                    <router-link v-if='Number(customInfo.assertPassStatus) === 1' to='/setFundPwd'>
                        {{ $t('login.goSet') }}
                    </router-link>
                    <router-link v-else :to="{ name: 'Forgot', query: { type: 'fund' } }">
                        {{ $t('login.forgotFundPwd') }}
                    </router-link>
                </div>
                <div v-if='googleCodeVis' class='titleBox mt'>
                    <span>*</span>{{ $t('withdrawCoin.googleVerification') }}
                </div>
                <div v-if='googleCodeVis' class='pwd-oper'>
                    <googleVerifyCode ref='googleVerifyCodeComp' @clear='clear' @getGooleVerifyCode='getGooleVerifyCode' />
                </div>

                <div class='formBox'>
                    <div class='item'>
                        <div class='itemTitle'>
                            {{ $t('withdrawMoney.moneyName') }}
                        </div>
                        <div class='amount'>
                            {{ coinCount }}&nbsp;{{ coinKind }}
                        </div>
                    </div>
                    <div class='item'>
                        <div class='itemTitle'>
                            {{ $t('withdrawCoin.service') }}
                        </div>
                        <div class='amount'>
                            {{ serviceCount }}&nbsp;{{ coinKind }}
                        </div>
                    </div>
                    <div class='item'>
                        <div class='itemTitle'>
                            {{ $t('withdrawCoin.predict') }}
                        </div>
                        <div class='coinAmount'>
                            {{ arriveCount }}&nbsp;{{ coinKind }}
                        </div>
                    </div>
                </div>
            </div>
            <div class='footer'>
                <van-button :class="['footer-btn']" :disabled='!fundPwd||(googleCodeVis && !googleCode)' @click='launchHandleWithdraw'>
                    <span>{{ $t('withdraw.confirm') }}</span>
                </van-button>
            </div>
        </div>
    </div>

    <!-- 选择的提现账户币种 -->
    <van-popup v-model:show='outPickerShow' class='assetsPicker' position='bottom'>
        <!-- <van-picker
            :cancel-button-text="$t('common.cancel')"
            :columns='columns'
            :columns-field-names='customFieldName'
            :confirm-button-text="$t('common.sure')"
            :default-index='0'
            @cancel='outPickerShow = false'
            @confirm='onPickerConfirm'
        /> -->
        <van-picker
            :cancel-button-text="$t('common.cancel')"
            :columns='coinKindList'
            :columns-field-names='customFieldName'
            :confirm-button-text="$t('common.sure')"
            :default-index='0'
            @cancel='outPickerShow = false'
            @confirm='onPickerConfirm'
        />
    </van-popup>
    <!-- 取款时间弹窗 -->
    <van-dialog v-model:show='timeShow' :confirm-button-text="$t('common.sure')" :title="$t('withdraw.hint')">
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
                        {{ item.weekDay }}：{{ item.openTimeLocal.toString() }}
                    </p>
                    <br />
                </div>
            </div>
        </div>
    </van-dialog>

    <!-- 提交成功弹窗 -->
    <van-popup v-model:show='withdrawSuccess' :duration='0.2' position='center' round :style="{ width: '93%' }" @close='onCancel'>
        <div class='successBox'>
            <div class='imgBox'>
                <img src='../../../themes/plans/images/assets/close.svg' @click='onCancel' />
            </div>
            <div class='content'>
                <img class='successImg' src='../../../themes/plans/images/assets/withdraw.png' />
                <div class='title'>
                    {{ $t('withdrawCoin.tips.tips8') }}
                </div>
                <div class='textContent'>
                    <div class='item'>
                        <div class='left'>
                            {{ $t('withdrawCoin.coin') }}
                        </div>
                        <div class='right'>
                            USDT
                        </div>
                    </div>
                    <div class='item'>
                        <div class='left'>
                            {{ $t('withdrawNew.address') }}
                        </div>
                        <div class='right'>
                            {{ currentWallet.chainName }} | {{ hideWalletMiddleInfo(currentWallet.address, '...') }}
                        </div>
                    </div>
                    <div class='item'>
                        <div class='left'>
                            {{ $t('wallet.amount') }}
                        </div>
                        <div class='right'>
                            {{ arriveCount }}
                        </div>
                    </div>
                    <div class='item'>
                        <div class='left'>
                            {{ $t('withdrawCoin.service') }}
                        </div>
                        <div class='right'>
                            {{ serviceCount }} {{ coinKind }}
                        </div>
                    </div>
                    <div class='item'>
                        <div class='left'>
                            {{ $t('common.time') }}
                        </div>
                        <div class='right'>
                            {{ formatTime(new Date().getTime()) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </van-popup>
</template>

<script>
// vue
import { reactive, toRefs, computed, onMounted, watch } from 'vue'
// router
import { useRouter, useRoute } from 'vue-router'
// vuex
import { useStore } from 'vuex'
// vant
import { Toast, Dialog } from 'vant'
// i18n
import { useI18n } from 'vue-i18n'
// api
import {
    getWithdrawCurrencyList,
    queryWithdrawConfig,
    checkKycApply,
    getWalletAddressList,
    handleWithdraw,
    queryWithdrawRate,
    queryWithdrawLimitInfo,
    computeWithdrawFee,
} from '@api/user'
// 工具方法
import { isEmpty, debounce, localGetJSON, localRemove, addThousandthSign, hideWalletMiddleInfo } from '@/utils/util'
import { cloneDeep } from 'lodash'
import { div, mul, divide, toFixed, plus, gt, lt } from '@/utils/calculation'
import md5 from 'js-md5'
// import Template from '@/themes/plans/modules/template/template.vue'
import CurrencyIcon from '@/components/currencyIcon'
// import Unsupported from './unsupported.vue'
import InputComp from '@/components/form/input'

import googleVerifyCode from '@/themeCommon/components/googleVerifyCode.vue'

export default {
    components: {
        // Template,
        CurrencyIcon,
        InputComp,
        googleVerifyCode,
        // Unsupported
    },
    setup (props) {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { currency, accountId, tradeType, withdrawMethod } = route.query
        const state = reactive({
            accountId,
            tradeType,
            withdrawMethod,
            outPickerShow: false,
            // 加载状态
            loading: true,
            // 是否显示可提金额
            showCanMoney: true,
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
            coinKind: currency || '',
            // 链名称
            chainName: '',
            // 全部提币数量
            coinTotal: '',
            // 提币数量
            coinCount: '',
            // 手续费
            serviceCount: '0',
            // 预计到账
            arriveCount: '0',
            // 账户减扣
            minusCount: '0',
            // 是否显示取款时间弹窗
            timeShow: false,
            // 处理后的时区
            withdrawTimeConfigMap: {},
            // 是否显示提交成功弹窗
            withdrawSuccess: false,
            // 钱包地址列表
            addressList: [],
            // 当前选择的钱包
            currentWallet: null,
            // 当前选择钱包地址id
            walletId: 0,
            // 输入的密码
            fundPwd: '',
            // 验证码
            googleCode: '',
            limitResult: true, // 提现的限制检查结果
            withdrawFeeStatus: true, // 取现手续费的接口
            // withdraw（输入提现）,password(输入密码)，success（提现成功），address(选择地址)
            showType: 'withdraw',
        })
        // 自定义picker字段
        const customFieldName = {
            text: 'currency',
            children: 'cities',
        }
        // 数据初始化
        const init = () => {
            state.showCanMoney = false
            state.coinTotal = ''
            state.coinCount = ''
            state.serviceCount = '0'
            state.arriveCount = '0'
            state.minusCount = '0'
        }
        const rateConfigList = computed(() => store.state._base.rateConfigList)

        // 提现密码数据
        const h5_withdrawfundPwd = computed(() => store.state._user.h5_withdrawfundPwd)
        // 用于数据回显
        const h5_withdrawfundInfo = computed(() => store.state._user.h5_withdrawfundInfo)

        const accountList = computed(() => {
            const filterResult = store.state._user.customerInfo.accountList.filter((el) => Number(el.tradeType) === Number(state.tradeType))
            return filterResult.map((item) => {
                if (rateConfigList?.value) {
                    const rateItem = rateConfigList.value.find((o) => o?.sourceCurrency === item?.currency)
                    return { ...item, usdRate: rateItem.rate }
                }
            })
        })
        const getGooleVerifyCode = val => {
            state.googleCode = val
        }

        // 最低提款额度
        const minWithdrawAmount = computed(() => {
            let min = 0
            if (state.withdrawRate && state.withdrawRate.exchangeRate) {
                min = divide(state.singleLowAmount, state.withdrawRate.exchangeRate)
            }
            return addThousandthSign(min, getCurrencydigits(state.coinKind))
        })
        // 最高提款额度
        const maxWithdrawAmount = computed(() => {
            let max = 0
            if (state.coinCount && state.withdrawRate.exchangeRate) {
                max = divide(state.singleHighAmount, state.withdrawRate.exchangeRate)
            }
            return addThousandthSign(max, getCurrencydigits(state.coinKind))
        })
        // 经过汇率换算除以了USDT得到的相对应币种的余额
        const balanceMax = computed(() => {
            return div(state.coinTotal, state.withdrawRate?.exchangeRate)
        })
        // 经过汇率换算得到的USDT数量
        const coinCountUSDT = computed(() => {
            return mul(state.coinCount, state.withdrawRate?.exchangeRate)
        })

        // 当前账户币种列表
        const columns = computed(() =>
            accountList.value
                .filter((item) => item.tradeType === Number(state.tradeType))
                .map((el) => {
                    return { currency: el?.currency, accountId: el?.accountId }
                }),
        )
        // 账户信息
        const { value: customInfo } = computed(() => store.state._user.customerInfo)

        const googleCodeVis = computed(() => customInfo.googleId > 0)

        // 客服信息
        const onlineServices = computed(() => store.state._base.wpCompanyInfo?.onlineService)

        // 账户币种
        const { value: accountCurrency } = computed(() =>
            store.state._user.customerInfo.accountList.find((el) => el.accountId === Number(state.accountId)),
        )
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
            // console.log('minWithdrawAmount.value', minWithdrawAmount.value)
            // console.log('maxWithdrawAmount.value', maxWithdrawAmount.value)
            const coinTotal = parseFloat(state.coinTotal)
            const coinCount = parseFloat(coinCountUSDT.value)

            if (!coinCount) state.arriveCount = ''
            if (!state.coinKind) {
                Toast(t('withdrawCoin.coinPlaceholder'))
                return
            }
            if (!state.chainName) {
                Toast(t('withdrawCoin.chainPlaceholder'))
                return
            }
            if (!state.coinCount) {
                return
            }
            if (lt(coinCount, state.singleLowAmount)) {
                Toast({ message: `${t('withdrawCoin.hint_4')} ${minWithdrawAmount.value} ${state.coinKind}` })
                return
            }
            if (gt(coinCount, state.singleHighAmount)) {
                Toast({ message: `${t('withdrawCoin.hint_5')} ${maxWithdrawAmount.value} ${state.coinKind}` })
                return
            }
            if (gt(coinCount, coinTotal)) {
                Toast(t('withdrawCoin.hint_1'))
                return
            }

            const item = {
                customerNo: customInfo.customerNo,
                accountId: state.accountId,
                tradeType: state.tradeType,
                withdrawType: 2,
                accountCurrency: state.coinKind,
                customerGroupId: customInfo.customerGroupId,
                country: customInfo.country,
                withdrawMethod: state.withdrawMethod,
                amount: coinCount,
                withdrawCurrency: state.coinKind,
                blockchainName: state.chainName,
                withdrawRateSerialNo: state.withdrawRate.withdrawRateSerialNo,
            }
            computeWithdrawFee(item).then((res) => {
                // console.log('汇率查询返回来的数据----->', res)
                if (res.check()) {
                    state.withdrawFeeStatus = true
                    const { data } = res
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
                if (newVal?.length) {
                    getWithdrawFee()
                } else {
                    // state.arriveCount = ''
                    state.arriveCount = 0
                    state.serviceCount = 0
                }
            },
            { immediate: true },
        )
        // 获取不同货币对应小数点后几位个数
        const getCurrencydigits = (currency) => {
            let dig = 2
            if (!isEmpty(accountList.value)) {
                const currencyInfo = accountList.value.find((o) => o?.currency === currency)
                if (currencyInfo) {
                    dig = currencyInfo.digits
                }
            }
            return dig
        }

        const goBack = () => {
            switch (state.showType) {
                case 'withdraw':
                    localRemove('currentWallet')
                    router.go(-1)
                    break
                case 'password':
                    state.fundPwd = ''
                    state.googleCode = ''
                    state.showType = 'withdraw'
                    break
            }
        }

        // 判断文案设置
        const resetBtnPrompt = (bool = true) => {
            const coinTotal = parseFloat(state.coinTotal)
            const coinCount = parseFloat(coinCountUSDT.value)

            if (!state.limitResult) {
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

        const onCancel = () => {
            state.coinCount = ''
            state.serviceCount = '0'
            state.arriveCount = '0'
            state.minusCount = '0'
            state.withdrawSuccess = false
            state.showType = 'withdraw'
            getWithdrawLimitInfo()
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

        // 获取取款限制配置
        const getWithdrawConfig = () => {
            queryWithdrawConfig({
                customerNo: customInfo.customerNo,
                accountId: state.accountId,
                tradeType: state.tradeType,
                withdrawType: 2,
                accountCurrency: state.coinKind,
                customerGroupId: customInfo.customerGroupId,
                country: customInfo.country,
                withdrawMethod: state.withdrawMethod,
                withdrawCurrency: state.coinKind,
                blockchainName: state.chainName,
            }).then((res) => {
                if (res.check()) {
                    const { data } = res
                    state.withdrawConfig = data
                    state.loading = false

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

                    // state.limitResult = checkWithdrawLimit()
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
                        router.replace({
                            name: 'Authentication',
                            query: { businessCode: 'withdraw' },
                        })
                    })
                }
            })
        }

        // 获取客户提币币种和链名称
        const queryWithdrawCurrencyList = (resolve) => {
            getWithdrawCurrencyList({
                companyId: customInfo.companyId,
                customerNo: customInfo.customerNo,
                customerGroupId: customInfo.customerGroupId,
                accountId: state.accountId,
                tradeType: state.tradeType,
                country: customInfo.country,
                withdrawMethod: state.withdrawMethod,
            }).then((res) => {
                if (res.check()) {
                    const { data } = res
                    if (data.length > 0) {
                        const filterToken = new Set()
                        const coinKindList = []

                        data.map((item) => {
                            filterToken.add(item.withdrawCurrency)
                        })
                        const format = [...filterToken]

                        format.forEach((item) => {
                            coinKindList.push({ currency: item })
                        })

                        // 检查一下配置是否含有进来页面时的币种
                        if (coinKindList.length) {
                            if (!coinKindList.find((item) => item.currency == currency)) {
                                state.coinKind = coinKindList[0].currency
                                const current =
                                    accountList.value.find(
                                        (el) => el.currency === coinKindList[0].currency && el.tradeType == state.tradeType,
                                    ) || {}
                                state.accountId = current?.accountId
                                state.accountCurrency = current
                            }
                        }
                        // console.log('🚀 支持提现的代币列表----->:', coinKindList, state.coinKind)

                        state.allList = data
                        state.coinKindList = coinKindList
                        filterChainName(true)
                    }
                    resolve(res)
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
            state.chainNameList = chainNameList
            // console.log('经过处理后支持提币的网络', state.chainNameList)
            // bool ? getWalletAddress() : setConfigAddress()
            getWalletAddress(bool)
        }

        // 提币币种弹窗
        const openCoinKind = () => {
            state.outPickerShow = true
        }

        const onWallet = () => {
            if (state.currentWallet) {
                router.push({
                    path: '/walletAddress',
                    query: {
                        chainName: state.currentWallet.chainName,
                        id: state.currentWallet.id,
                        coin: state.coinKind,
                        tradeType: state.tradeType,
                        accountId: state.accountId,
                        withdrawMethod: state.withdrawMethod,
                        chainList: JSON.stringify(state.chainNameList)
                    },
                })
            } else {
                goWalletAdd()
            }
        }

        // 切换提现的账户币种
        const onPickerConfirm = (item) => {
            const flagItem = accountList.value.find((v) => v.currency == item.currency && v.tradeType == state.tradeType)
            if (flagItem) {
                state.accountId = flagItem.accountId
                state.tradeType = flagItem.tradeType
                state.coinKind = flagItem.currency
                init()
                filterChainName()
            }
        }
        // 获取取款汇率
        const getWithdrawRate = () => {
            queryWithdrawRate({
                // companyId: customInfo.companyId,
                // customerNo: customInfo.customerNo,
                accountId: state.accountId,
                tradeType: state.tradeType,
                accountCurrency: state.coinKind,
                withdrawCurrency: state.coinKind,
                withdrawType: 2,
            }).then((res) => {
                // console.log('取款汇率---->', res)
                if (res.check()) {
                    state.withdrawRate = res.data
                    // 获取取款、提币额度限制配置
                    getWithdrawLimitInfo()
                }
            })
        }

        // 获取取款、提币额度限制配置
        const getWithdrawLimitInfo = () => {
            return new Promise((resolve, reject) => {
                queryWithdrawLimitInfo({
                    customerNo: customInfo.customerNo,
                    accountId: state.accountId,
                    tradeType: state.tradeType,
                    withdrawType: 2,
                    accountCurrency: state.coinKind,
                    customerGroupId: customInfo.customerGroupId,
                    country: customInfo.country,
                    withdrawMethod: state.withdrawMethod,
                    withdrawRateSerialNo: state.withdrawRate.withdrawRateSerialNo,
                    withdrawCurrency: state.coinKind,
                    blockchainName: state.chainName,
                }).then((res) => {
                    if (res.check()) {
                        const { data } = res
                        state.coinTotal = data.withdrawAmount
                        state.singleHighAmount = data.singleHighAmount
                        state.singleLowAmount = data.singleLowAmount
                        state.showCanMoney = true
                        state.outPickerShow = false
                        resolve(res)
                    }
                })
            })
        }

        // 点击最大提现
        const onAllTake = () => {
            // if(Number(state.coinTotal)>Number(state.singleHighAmount)){
            //     state.coinCount=div(state.singleHighAmount,state.withdrawRate?.exchangeRate)
            // }else{
            //     state.coinCount = div(state.coinTotal,state.withdrawRate?.exchangeRate)
            // }
            if (gt(state.coinTotal, 0)) {
                state.coinCount = toFixed(div(state.coinTotal, state.withdrawRate?.exchangeRate), getCurrencydigits(state.coinKind))
                getWithdrawFee()
            }
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

        // 获取钱包地址列表
        const getWalletAddress = (bool = false) => {
            if (!state.coinKind || !state.chainName) {
                state.addressList = []
                state.currentWallet = null
                state.walletId = 0
                return
            }
            getWalletAddressList({
                currency: state.coinKind,
                // chainName: state.chainName
            }).then((res) => {
                const { data } = res
                state.loading = false
                state.addressList = data
                if (data.length > 0) {
                    state.chainName = data[0]?.chainName
                    state.currentWallet = data[0]
                    state.walletId = data[0]?.id
                } else {
                    // state.chainName = list[0]
                    state.currentWallet = null
                    state.walletId = 0
                }
                // 读取缓存的地址数据,仅在页面加载的时候
                if (bool) {
                    selectWallet()
                }
                // 获取配置信息
                getWithdrawRate()
                // 获取取款限制配置
                getWithdrawConfig()
            })
        }

        // 跳转到新增钱包地址页面
        const goWalletAdd = () => {
            router.push({
                path: '/walletAdd',
                query: {
                    chainName: state.chainName,
                    coin: state.coinKind,
                    tradeType: state.tradeType,
                    accountId: state.accountId,
                    withdrawMethod: state.withdrawMethod,
                },
            })
        }

        // 选择钱包(改为了又上个页面切换过来的形式)
        const selectWallet = () => {
            const item = localGetJSON('currentWallet')
            // console.log(item, '我再次设定钱包???')
            if (isEmpty(item)) return
            // 这里的item有可能出现删除了这个钱包后,但是本地缓存了这个钱包的数据,但页面再次加载了读取这个数据,所以要区分处理\
            // 检查接口数据返回来的地址数据列表
            const flagItem = state.addressList.find((v) => v.id === item.id)
            if (flagItem) {
                state.chainName = flagItem.chainName
                state.walletId = flagItem.id
                state.currentWallet = flagItem
            }

            // 网络列表的网络匹配到了提现地址的名称
            // const result = state.chainNameList.find((v) => v.name == state.currentWallet?.chainName)
            // if (result) {
            //     state.chainName = result.name
            // }
            // if (value) selectChainName(value)
        }

        // 点击确定
        const onConfirm = () => {
            // 取款限制验证
            if (!state.limitResult) return
            const coinCount = parseFloat(coinCountUSDT.value)
            // console.log('🚀 ~汇率转换的:', coinCountUSDT.value)
            // console.log('🚀 ~state-=----=-->:', state)
            const amountDigitsLength = coinCount.toString().split('.')[1] ? coinCount.toString().split('.')[1].length : 0

            if (!checkWithdrawLimit()) {
                return
            }

            if (!state.coinKind) {
                return Toast({ message: t('withdrawCoin.coinPlaceholder') })
            }

            if (!state.chainName) {
                return Toast({ message: t('withdrawCoin.chainPlaceholder') })
            }
            if (!state.coinCount) {
                return Toast({ message: t('withdrawCoin.coinCountPlaceholder') })
            }
            if (gt(amountDigitsLength, accountCurrency.digits)) {
                return Toast(t('withdraw.withdrawDigitsTip'))
            }

            if (lt(coinCountUSDT.value, state.singleLowAmount)) {
                return Toast({ message: `${t('withdrawCoin.hint_4')} ${minWithdrawAmount.value} ${state.coinKind}` })
            }
            if (gt(coinCountUSDT.value, state.singleHighAmount)) {
                return Toast({ message: `${t('withdrawCoin.hint_5')} ${maxWithdrawAmount.value} ${state.coinKind}` })
            }
            if (!state.currentWallet) {
                return Toast({ message: t('withdrawCoin.walletSelect') })
            }

            state.showType = 'password'
            // goWithdrawfundPwd()
        }
        // 跳转到输入资金密码且存储数据到本本地用于资金密码页面展示
        const goWithdrawfundPwd = () => {
            store.commit('_user/Update_withdrawfundInfo', state)
            router.push({ path: '/withdrawfundPwd' })
        }

        // 发起提现
        const launchHandleWithdraw = () => {
            state.loading = true
            const coinAmount = plus(state.serviceCount, state.arriveCount)
            const item = {
                customerNo: customInfo.customerNo,
                accountId: state.accountId,
                tradeType: state.tradeType,
                withdrawType: 2,
                accountCurrency: state.coinKind,
                customerGroupId: customInfo.customerGroupId,
                country: customInfo.country,
                withdrawMethod: state.withdrawMethod,
                amount: coinAmount,
                withdrawCoinAmount: coinAmount,
                rate: state.withdrawRate.exchangeRate,
                withdrawRateSerialNo: state.withdrawRate.withdrawRateSerialNo,
                bankAccountName: customInfo.customerNo,
                // bankAccountName: '', NEWUI_SHOW
                bankName: '数字钱包',
                bankCardNo: state.currentWallet.address,
                withdrawCurrency: state.coinKind, // 选择什么币种就提什么币种
                // withdrawCurrency: state.coinKind,
                blockchainName: state.chainName,
                fundPwd: md5(state.fundPwd),
                googleCode: state.googleCode,
            }
            handleWithdraw(item).then((res) => {
                state.loading = false
                if (res.check() || res.code == '51046' || res.code == '51035') {
                    state.withdrawSuccess = true
                    // store.commit('_user/Update_withdrawfundPwd', '')
                    // store.commit('_user/Update_withdrawfundInfo', '')
                }
            })
        }
        // 获取资金密码
        const confirmWithdraw = (val) => {
            const { pwd, googleCode } = h5_withdrawfundPwd.value
            state.fundPwd = pwd
            state.googleCode = googleCode || ''
            // 发起提现
            launchHandleWithdraw()
        }
        /* 重新快速赋值给state回显且发起提现 */
        const resetStateOrConfirmWithdraw = () => {
            const newState = cloneDeep(h5_withdrawfundInfo.value)
            for (const key in state) {
                for (const newKey in newState) {
                    if (key == newKey) {
                        state[key] = newState[newKey]
                    }
                }
            }
            confirmWithdraw()
        }

        onMounted(() => {
            // if (!isEmpty(h5_withdrawfundPwd.value)) {
            //     /* 重新快速赋值给state回显且发起提现 */
            //     resetStateOrConfirmWithdraw()
            //     return
            // }
            // 获取客户提币币种和链名称
            new Promise((resolve, reject) => {
                // 获取客户提币币种和链名称
                queryWithdrawCurrencyList(resolve)
            }).then((res) => {
                // // 获取配置信息
                // getWithdrawRate()
                // // 获取取款限制配置
                // getWithdrawConfig()
            })
            store.commit('_user/Update_account', state.accountId)
        })
        // 只允许输入数字
        const numberFormatter = (value) => {
            // return value.replace(/[^\d]/g, '')
            let copy = value
            // 使用正则表达式检查输入是否为正数数字
            // copy = copy.replace(/[^0-9.]/g, '') // 只允许数字和小数点
            // copy = copy.replace(/^\.+/g, '') // 移除开头的多余小数点
            // copy = copy.replace(/\.+$/g, '') // 移除末尾的多余小数点
            copy = copy.replace(/[+-]/g, '') // 移除加号和减号
            // // 使用正则表达式验证输入是否为正数小数
            // copy = copy.replace(/[^0-9.]/g, ''); // 只允许数字和小数点
            return copy
        }

        return {
            ...toRefs(state),
            customInfo,
            openCoinKind,
            onPickerConfirm,
            timeList,
            onAllTake,
            goWalletAdd,
            onConfirm,
            accountCurrency,
            customFieldName,
            columns,
            onWallet,
            onCancel,
            div,
            mul,
            accountList,
            checkWithdrawLimit,
            addThousandthSign,
            balanceMax,
            getCurrencydigits,
            minWithdrawAmount,
            maxWithdrawAmount,
            goBack,
            hideWalletMiddleInfo,
            resetBtnPrompt,
            gt,
            numberFormatter,
            googleCodeVis,
            getGooleVerifyCode,
            launchHandleWithdraw,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.withdrawCoinPage {
    height: 100%;
    display: flex;
    flex-direction: column;
    .withdraw-box{
      background-color: #fff;
      flex: 1;

      .container {
    height: 100%;
    max-height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    .empty {
        height: rem(16px);
        background-color: var(--bgColor);
    }
}
.module-form {
    background-color: var(--contentColor);
    padding: rem(40px) rem(30px);
    flex:1;
    .new-tips-box{
      background: linear-gradient(110.77deg, #FBFEFF 12.4%, #E4EEFF 48.4%, #FDECEA 82.21%);
      min-width:200px;
      max-width:80%;
      height:38px;
      padding:0 16px;
      margin:16px auto;
      margin-top:0;
      display:flex;
      align-items:center;
      justify-content:center;
      &>span{
        color: var(--mainColor);
      font-family: "Inter";
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
      }
    }
    .card {
        padding: rem(32px);
        border-radius: rem(4px);
        border: 1px solid #ebe9e9;
        font-size: rem(28px);
        font-family: Inter;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        color: var(--mainColor);
        .inpBox {
            margin-top: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            :deep {
              .van-stepper {
                  flex: 1
              }
              .van-stepper__input {
                  padding: 0;
                  flex: 1;
                  font-size: 24px;
                  font-weight: 600;
                  line-height: 1.2;
                  box-sizing: border-box;
                  color: var(--primaryText);
                  background: transparent;
                  width: 100%;
                  text-align: left;
                  margin: 0;
              }
            }
            :deep(.van-cell:after) {
                border: 0;
            }
            // input{
            //     width: 100%;
            //     height: 36px;
            //     font-size:24px;
            //     font-style: normal;
            //     font-family: Inter;
            //     font-weight: 600;
            //     color: var(--mainColor);
            //     &::placeholder{
            //         font-size: 24px;
            //     }
            // }
            .inp {
                font-size: 24px;
                font-style: normal;
                font-family: Inter;
                font-weight: 600;
                color: var(--mainColor);
                &.zero {
                    color: #9f9f9f;
                }
            }
            .iconBox {
                display: flex;
                align-items: center;
                margin-left: rem(20px);
                font-size: rem(32px);
                font-family: Inter;
                font-weight: 600;
                color: var(--mainColor);
                span {
                    margin: 0 rem(8px);
                }
                .iconImg {
                    width: rem(48px);
                    height: rem(48px);
                }
            }
        }
        .tipsBox {
            margin-top: rem(32px);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            color: #666;
            font-size: rem(24px);
            font-family: Inter;
            font-style: normal;
            line-height: normal;
            .amountBox {
                display: flex;
                align-items: center;
                color: var(--mainColor);
                & > .max {
                    margin-left: 2px;
                    color: var(--allColor);
                }
            }
        }
    }
    .disabledBg {
        margin-top: rem(32px);
        background: var(--disabledBgColor);
    }
    .tipsContionBox {
        margin-top: rem(16px);
        padding: 0 rem(24px);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size: rem(24px);
        font-family: Inter;
        font-style: normal;
        font-weight: 400;
        color: var(--mainColor);
        .textBox {
            display: flex;
            align-items: center;
            .title {
                color: var(--minorColor);
            }
            .number {
                margin-left: 2px;
            }
        }
    }
    .addressCard {
        margin-top: rem(64px);
        border-radius: rem(16px);
        border: 1px solid #ebe9e9;
        padding: rem(32px);
        font-size: rem(28px);
        font-family: Inter;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        color: var(--mainColor);
        .selectBox {
            margin-top: rem(48px);
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            font-family: Inter;
            font-style: normal;
            line-height: normal;
            font-weight: 600;
            .selectBox-icon {
                display: flex;
                align-items: center;
                & > img {
                    margin-right: 5px;
                }
            }
            .addressBox {
                min-width: rem(626px);
                padding: 8px 0;
                display: flex;
                align-items: center;
                // flex-wrap: wrap;
                overflow: hidden;
                white-space: nowrap;
                font-size: 16px;
                .line {
                    padding: 0 4px;
                }
                .address {
                    font-weight: 400;
                    word-wrap: break-word;
                    width: 100%;
                }
            }
            .tipsTitle {
                margin: 0 rem(16px);
            }
            .btn {
                display: flex;
                align-items: center;
                font-size: rem(28px);
                color: var(--allColor);
                img {
                    margin-left: rem(4px);
                }
            }
        }
    }
    .tipsText {
        margin-top: rem(16px);
        color: var(--minorColor);
        font-size: rem(24px);
        font-family: Inter;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        .tipsBlock {
            color: var(--mainColor);
            margin-left: rem(8px);
        }
        li {
            list-style: disc;
            margin-left: rem(28px);
            padding-left: rem(-10px);
        }
    }
}

.footer {
    width: 100%;
    flex-shrink: 0;
    height: 76px;
    padding: 0 rem(30px);
    margin-bottom: 12px;
    background: var(--contentColor);
    .footer-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: rem(104px);
        width: 100%;
        background-color: var(--primary);
        border-radius: rem(16px);
        &:disabled {
            background: var(--btnDisabledColor);
            span {
                color: var(--btnTextDisabledColor);
            }
        }
        span {
            color: var(--contentColor);
            font-size: rem(30px);
        }
    }
}
    }
    .password-box{
      height: 100%;
    display: flex;
    flex-direction: column;
    background-color:#fff;
    padding-top: rem(16px);
    .content{
        padding:rem(40px) rem(30px) 0 rem(30px);
        height: calc(100vh - rem(196px) - rem(126px) );
        background: var(--contentColor);
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: Inter;
        font-style: normal;
        line-height: normal;
        img{
            width: rem(128px);
            height: rem(128px);
        }
        .title{
            margin-top: rem(32px);
            color: var(--mainColor);
            font-size: rem(32px);
            font-weight: 600;
        }
        .titleBox{
            margin-top: rem(96px);
            width: 100%;
            text-align: left;
            display: flex;
            font-family: Inter;
            font-size: rem(28px);
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            color: var(--mainColor);
            span{
                color: var(--primary);
            }
        }
        .mt{
            margin-top: rem(48px) !important;
        }
        .pwd-oper{
            margin-top: rem(32px);
            width: 100%;
            display: flex;
            align-items: center;
            padding: rem(28px) rem(22px);
            height: rem(88px);
            border-radius: rem(16px);
            border: 1px solid var(--lineColor);
            :deep(.van-hairline--bottom:after){
                border-bottom: none;
            }
            :deep(.form-item){
                margin-bottom: 0;
                border-bottom: none;
            }
            :deep(.van-cell){
                padding: 0 !important;
                line-height: rem(84px);
            }
        }
        .fprgetPwd{
            width: 100%;
            padding-right: rem(18px);
            margin-top: rem(20px);
            color: var(--allColor);
            text-align: right;
            font-size: rem(24px);
        }
        .googleCode{
            width: 100%;
        }
        .formBox{
            width: 100%;
            margin-top: rem(240px);
            .item{
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: rem(32px);
                .itemTitle{
                    color: var(--mainColor);
                    font-size: rem(24px);
                }
                .amount{
                    color: var(--mainColor);
                    font-size: rem(28px);
                    font-weight: 500;
                }
                .coinAmount{
                    color: var(--primary);
                    font-size: rem(40px);
                    font-weight: 500;
                }
            }
        }

    }
    .footer{
        // height: rem(196px);

         padding: 20px;
        background: var(--contentColor);
          .footer-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            height: rem(104px);
            width: 100%;
            background-color: var(--primary);
            border-radius: rem(16px);
            &:disabled{
              opacity: 1;
              background: var(--btnDisabledColor);
                span{
                  color: var(--btnTextDisabledColor);
                }
            }
            span {
                color: var(--contentColor);
                font-size: rem(30px);
            }
        }
    }
}
}

.successBox {
    padding: rem(30px);
    .imgBox {
        display: flex;
        justify-content: flex-end;
    }
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: rem(48px);
        .successImg {
            width: rem(104px);
            height: rem(104px);
        }
        .title {
            margin-top: rem(32px);
            font-size: rem(32px);
            font-family: Inter;
            font-weight: 700;
            line-height: normal;
        }
        .textContent {
            width: 100%;
            margin-top: rem(72px);
            padding: rem(32px) rem(30px) 0 rem(30px);
            background: var(--transferSuccessBg);
            .item {
                margin-bottom: rem(32px);
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-family: Inter;
                font-style: normal;
                line-height: normal;
                font-size: rem(28px);
                font-weight: 400;
                .left {
                    color: var(--minorColor);
                }
                .right {
                    color: var(--mainColor);
                    max-width: 60%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    text-align: right;
                }
            }
        }
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
