<template>
    <div class='depositBody'>
        <LayoutTop bottom-line :custom-back='true' :title="currentTab?$t('wallet.buyEncryption'):$t('wallet.desposit')" @back='onBack' />
        <!-- 页面加载状态 -->
        <Loading :show='loading' />
        <!-- <van-tabs :class="['tabBox', { 'tabHide': tabTitleHide }]" @click-tab='changeTab'>
            <van-tab :title="$t('wallet.desposit')"> -->
        <template v-if='currentTab==0'>
            <div class='leftTop'>
                <div>
                    <p>{{ $t("wallet.currency") }}</p>
                    <div @click='despositCurrencyVisible = true'>
                        <div class='icon-box'>
                            <CurrencyIcon v-if='despositCurrencyList' :currency='despositCurrencyList[despositCurrencyIndex]?.currency' :size='24' />
                            <span> {{ despositCurrencyList ? despositCurrencyList[ despositCurrencyIndex ]?.currency || "---": "---" }}</span>
                        </div>
                        <img src='../../images/assets/arrowdown.svg' />
                    </div>
                </div>
                <div>
                    <p>{{ $t("wallet.net") }}</p>
                    <div @click='netCurrencyVisible = true'>
                        <span> {{ netCurrencyList ? netCurrencyList[netCurrencyIndex] || "---" : "---" }} </span>
                        <img src='../../images/assets/arrowdown.svg' />
                    </div>
                </div>
            </div>
            <div v-if='showWallet' class='despositTypes-wrap'>
                <div class='title'>
                    {{ $t('wallet.payMethod') }}
                </div>
                <div class='despositTypes-con'>
                    <div class='despositTypes-item' @click='despositTypesIndex = 0'>
                        <span :class="despositTypesIndex == 0?'iconCheck':'icon'"></span>
                        <span> {{ $t('wallet.depositAddress') }} </span>
                    </div>
                    <div class='despositTypes-item' @click='despositTypesIndex = 1'>
                        <span :class="despositTypesIndex == 1?'iconCheck':'icon'"></span>
                        <span> {{ $t('wallet.depositWallet') }} </span>
                    </div>
                </div>
            </div>
            <div v-if='despositTypesIndex === 0 && despositCurrencyList && address' class='qrcodeBox'>
                <div class='leftCont' @click='onCopy(address)'>
                    {{ address }}
                </div>
                <div class='copyAddress' @click='onCopy(address)'>
                    {{ $t('withdrawCoin.copyAddress') }}
                </div>
                <div class='leftBot'>
                    <div ref='qrCode' class='qrcode'>
                        <div class='container-header'></div>
                        <div class='container-footer'></div>
                    </div>
                    <ul class='qrCodeTips'>
                        <li v-if='checkedType' v-html="$t('withdrawCoin.tips.tips1',{ currency:`<span>${checkedType.singleLowAmount}&nbsp;${checkedType.accountCurrency}</span>` })"></li>
                        <li v-html="$t('withdrawCoin.tips.tips2', { currency:`<span>${despositCurrencyList[despositCurrencyIndex].currency}-${netCurrencyList[netCurrencyIndex]}</span>` })"></li>
                        <li v-html="$t('withdrawCoin.tips.tips3')"></li>
                    </ul>
                </div>
                <template v-if='despositCurrencyList[despositCurrencyIndex]?.currency && tag'>
                    <p class='leftText'>
                        {{ tagObj[despositCurrencyList[despositCurrencyIndex]?.currency] }}
                    </p>
                    <div class='leftCont' @click='onCopy(tag)'>
                        {{ tag }}
                    </div>
                    <div class='copyAddress' @click='onCopy(address)'>
                        {{ $t('withdrawCoin.copyAddress') }}
                    </div>
                </template>
            </div>
            <div v-else-if='despositTypesIndex === 1 && showWallet'>
                <div class='amount-input-con mt-6'>
                    <div class='currency-con'>
                        <CurrencyIcon :currency='despositCurrencyList[despositCurrencyIndex] ?.currency ' :size='24' />
                        <span> {{ despositCurrencyList[despositCurrencyIndex] ?.currency }} </span>
                    </div>
                    <div class='input-con'>
                        <input v-model='amount' :placeholder=" $t('common.input') + $t('wallet.num') " placeholderClass='placeholderClass' type='number' />
                    </div>
                </div>
                <div v-if='amountList.length > 0' class='amount-item-con mt-6'>
                    <div v-for='(item, index) in amountList' :key='index' :class="[ 'amount-item mb-5', { 'amount-item-check': currIndex === index }, ]" @click='checkAmount(index, item)'>
                        <span> {{ item.amount }} {{ despositCurrencyList[despositCurrencyIndex] ?.currency }} </span>
                        <img v-if='currIndex === index' src='@/assets/newUI/check.png' />
                    </div>
                </div>

                <div v-if='checkedType' class='payBox'>
                    <van-button block class='payBtn' type='primary' @click='confirmDeposit'>
                        {{ $t("compLang.confirm") }}
                    </van-button>
                </div>
            </div>
            <div v-else class='emptyBox'>
                <van-empty :description="$t('common.noData')" image='/images/empty.png' />
            </div>
        </template>
        <!-- </van-tab>
            <van-tab :title="$t('wallet.buyEncryption')"> -->
        <template v-else>
            <div class='cryptoBox'>
                <div class='content'>
                    <div class='rightTop'>
                        <p> {{ $t('withdrawCoin.youPay') }} </p>
                        <div class='inpBox'>
                            <div class='buy-num'>
                                <input v-model='amountPay' :placeholder=" $t('common.input') + $t('wallet.amount') " placeholderClass='placeholderClass' type='number' @focus="inputType ='amountPay'" />
                                <div class='tips'>
                                    ${{ addThousandthSign(amountPay,2) }}
                                </div>
                            </div>

                            <div class='iconBox' @click='payCurrencyVisible = true'>
                                <CurrencyIcon :currency='paymentTypes[payCurrencyIndex]' :size='24' />
                                <span>{{ paymentTypes[payCurrencyIndex] }}</span>
                                <img class='iconImg' src='../../images/assets/arrow.png' />
                            </div>
                        </div>
                    </div>

                    <div v-if='checkedType' class='rightTop rightMargin'>
                        <p>{{ $t('withdrawCoin.willGet') }}</p>
                        <div class='inpBox'>
                            <div class='buy-num'>
                                <input v-model='amount' :placeholder="$t('common.input') + $t('wallet.num')" placeholder-class='placeholderClass' type='number' @focus="inputType = 'amount'" />
                                <div class='tips'>
                                    ${{ addThousandthSign(amount,2) }}
                                </div>
                            </div>
                            <div class='iconBox' @click='despositCurrencyVisible = true'>
                                <CurrencyIcon :currency=' despositCurrencyList[despositCurrencyIndex] ?.currency ' :size='24' />
                                <span> {{ despositCurrencyList[despositCurrencyIndex] ?.currency }} </span>
                                <img class='iconImg' src='../../images/assets/arrow.png' />
                            </div>
                        </div>
                    </div>

                    <div v-if='checkedType' class='tipsBox'>
                        <span>1{{ despositCurrencyList[despositCurrencyIndex]?.currency }} ≈ {{ rateConfig.exchangeRate }}{{ paymentTypes[payCurrencyIndex] }}</span>
                        <div class='textBox'>
                            <div class='title'>
                                {{ $t("wallet.fee") }}：
                            </div>
                            <div>{{ computeFee }} {{ despositCurrencyList[despositCurrencyIndex]?.currency }}</div>
                        </div>
                    </div>

                    <div v-if='checkedType' class='rightTop borderRadius'>
                        <p>{{ $t('withdrawCoin.payWit') }}</p>
                        <div class='playBox'>
                            <img class='iocn' src='../../images/assets/buySelect.svg' />
                            <img src='../../images/assets/backCard.svg' />
                            <div>{{ buyPayType?.paymentTypeAlias || "-" }}</div>
                            <span class='hot'>
                                Hot
                            </span>
                        </div>
                    </div>
                    <ul class='qrCodeTips'>
                        <li v-if='checkedType' v-html="$t('withdrawCoin.tips.tips1',{ currency:`<span>${checkedType.singleLowAmount}&nbsp;${checkedType.accountCurrency}</span>` })"></li>
                    </ul>
                    <div v-if='checkedType' class='payBox'>
                        <van-button class='payBtn' @click='confirmDeposit'>
                            {{ $t('withdraw.confirm') }}
                        </van-button>
                    </div>
                </div>
            </div>
        </template>
        <!-- </van-tab>
        </van-tabs> -->
    </div>

    <!-- 存款币种弹窗 -->
    <van-popup v-model:show='despositCurrencyVisible' class='actionsheetCenter' position='bottom' round>
        <van-picker :columns='despositCurrencyList' :columns-field-names='columnsFields' @cancel='despositCurrencyVisible = false' @confirm='changeDespositCurrency' />
    </van-popup>

    <!-- 币种网络弹窗 -->
    <van-popup v-model:show='netCurrencyVisible' class='actionsheetCenter' position='bottom' round>
        <van-picker :columns='netCurrencyList' @cancel='netCurrencyVisible = false' @confirm='changeNetCurrency' />
    </van-popup>

    <!-- 支付币种弹窗 -->
    <van-popup v-model:show='payCurrencyVisible' class='actionsheetCenter' position='bottom' round>
        <van-picker :columns='paymentTypes' :columns-field-names='columnsFields' @cancel='payCurrencyVisible = false' @confirm='changePayCurrency' />
    </van-popup>

    <!-- 补充资料弹窗 -->
    <van-popup v-model:show='appendVis' class='append-popup' position='right' :style="{ height: '100%', width: '80%' }">
        <div class='append-wrap'>
            <p class='title'>
                {{ $t("deposit.appendFiled") }}
            </p>
            <p class='appendVisDesc'>
                {{ $t("deposit.appendVisDesc") }}
            </p>
            <van-cell-group inset>
                <van-field
                    v-for='(item, key) in checkedType.extend'
                    :key='key'
                    v-model='appendMap[key].value'
                    :data='item'
                    :label='item[currentLang]'
                    label-width='70'
                    :placeholder="$t('common.input') + item[currentLang]"
                    :required='true'
                />
            </van-cell-group>
            <van-button class='btn' size='large' type='primary' @click='handleAppendField'>
                {{ $t("common.sure") }}
            </van-button>
        </div>
    </van-popup>

    <!-- 存款弹窗提示 -->
    <van-dialog
        v-model:show='despositVis'
        :cancel-button-text="$t('deposit.denyText')"
        class-name='desposit-dialog'
        :confirm-button-text="$t('deposit.agreeText')"
        :show-cancel-button='true'
        @cancel='onCancel'
        @confirm='onConfirm'
    >
        <div class='content'>
            <h4>{{ $t("deposit.payConfirm") }}</h4>
            <p class='title'>
                {{ $t("deposit.payConfirmTips") }}
            </p>
        </div>
    </van-dialog>
</template>

<script>
import CurrencyIcon from '@/components/currencyIcon'
import {
    applyRechargeBindAddress, checkKycApply, getCryptoBlockchainInfo, getDepositCoinList, handleDesposit, judgeIsAlreadyDeposit, queryDepositExchangeRate, queryDepositProposal,
    queryPayType
} from '@/api/user'
import { computed, onBeforeUnmount, onMounted, reactive, toRefs, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MsgSocket } from '@/plugins/socket/socket'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { copyText, getCookie, isEmpty, localGet, localRemove, localSet, sessionSet, addThousandthSign, getDepositFrom } from '@/utils/util'
import { divide, minus, mul, toFixed } from '@/utils/calculation'
import { firebaseAnalytics } from '@/utils/firebase'
import { Dialog, Toast } from 'vant'
import QRCode from 'qrcodejs2'

export default {
    components: {
        CurrencyIcon
    },
    props: {
        /* 默认展示的模式 */
        defaultCurrentTab: {
            type: [String, Number],
            default: () => {
                return 0
            }
        }
    },
    setup (props) {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        // 二维码对象
        const qrCode = ref(null)
        const { value: newsSysConfig } = computed(() => store.state._base.newsSysConfig)

        const state = reactive({
            loading: false,
            currentTab: 0, // 菜单下标
            currentLang: getCookie('lang') || 'zh-CN',
            despositCurrencyList: '', // 可存款/购买的币种 （现货支持的币种）
            netCurrencyList: '', // 可存款的币种对应的网络
            despositCurrencyVisible: false, // 存款弹框
            netCurrencyVisible: false, // 网络弹框
            payCurrencyVisible: false, // 支付弹框
            despositCurrencyIndex: 0, // 存款币种下标
            netCurrencyIndex: 0, // 网络下标
            payCurrencyIndex: 0, // 支付币种下标
            amountList: [], // 存款金额列表
            currIndex: '', // 当前选择的存款金额下标
            inputType: 'amount', // 当前输入的位置 amount amountPay
            amount: '', // 当前选择的存款金额数量 (存款和购买共用)
            amountPay: '', // 支付金额
            tradeType: '', // 玩法类型
            currency: '', // 当前选中币种
            accountId: '', // 当前账户id
            payTypes: [], // 全部支付通道
            checkedType: '', // 当前选择的支付通道
            payTypeId: '', // 当前选择的支付通道id
            paymentTypes: [], // 支付通道币种列表
            currencyChecked: '', // 当前选择的支付通道币种
            // 是否显示存款提示弹窗
            despositVis: false,
            rateConfig: '', // 存款配置数据（汇率）
            // 是否显示补充资料弹窗
            appendVis: false,
            // 补充完整的资料数据
            appendMap: {},
            // 需要补充资料的数据
            extend: {},
            paramsExtens: {},
            // 存款方式
            despositTypes: [
                { label: t('wallet.depositWallet') },
                { label: t('wallet.depositAddress') },
            ],
            despositTypesIndex: 0, // 存款方式下标
            tag: '', // 特殊标签
            tagMap: {}, // 特殊标签
            tagObj: {
                EOS: 'Memo',
                XRP: 'TAG'
            },
            address: '', // 充值地址（直充）
            addressMap: {}, // 充值地址缓存集合
            tabTitleHide: true, // 顶部tab栏隐藏
            pageExistTime: Date.now(), // 页面存在时间
            minAddressDeposit: {}// 直充最小充值
        })

        // 获取存款配置数据
        const depositData = computed(() => store.state._base.wpCompanyInfo?.depositData)
        // 获取wp配置的支付通道图标
        const paymentIconList = computed(() => store.state._base.wpCompanyInfo.paymentIconList)
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        // 存款支付渠道
        const despositPayType = computed(() => state.payTypes.find((i) => i.paymentCode === 'micropay' && i.paymentType === 'micropay_web3'))
        // 获取玩法列表
        const accountList = computed(() => store.state._user.customerInfo.accountList.filter((el) => Number(el.tradeType) === Number(state.tradeType)))
        // 购买加密货币支付渠道
        const buyPayType = computed(() =>
            state.payTypes.find((i) => i.paymentCode === 'micropay' && i.paymentType === 'credit_card2')
        )
        // 计算存款手续费
        const computeFee = computed(() => {
            // feeType  1：固定金额手续费 2：百分比手续费
            if (Number(state.checkedType.feeType === 1)) {
                return state.checkedType.fee
            } else if (Number(state.checkedType.feeType === 2)) {
                return mul(state.amount, state.checkedType.fee)
            } else {
                return 0
            }
        })

        // 计算预计到账金额
        const computeAccount = computed(() => {
            if (state.amount && state.checkedType) {
                const value = minus(parseFloat(state.amount), parseFloat(computeFee.value))
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

        // 计算预计支付金额(方向计算可购买的币数量)
        const computeExpectedpayReverse = computed(() => {
            const rateConfig = state.rateConfig
            if (rateConfig.exchangeRate) {
                const value = rateConfig.formulaSymbol === 'multiply' ? divide(state.amountPay, rateConfig.exchangeRate) : mul(state.amountPay, rateConfig.exchangeRate)
                return toFixed(value, rateConfig.sourceDigits)
            }
            return ''
        })

        // 当前网络是否支持连接钱包
        const showWallet = computed(() => {
            const flag = state.netCurrencyList && state.netCurrencyList.length > 0 ? state.netCurrencyList[state.netCurrencyIndex]?.indexOf('Ethereum') !== -1 : !!showWallet?.value
            return despositPayType.value && state.netCurrencyList[state.netCurrencyIndex]?.indexOf('Ethereum') !== -1
        })

        const onCopy = (value) => {
            if (!value) return
            copyText(value)
            Toast(t('common.copySuccess'))
        }

        // 返回页面
        const onBack = () => {
            const { isCallBack } = route.query
            if (isCallBack) {
                router.replace({ path: '/home' })
            } else {
                router.go(-1)
            }
        }

        const columnsFields = { text: 'currency' }

        // 跳转到存款记录页面
        const toDespositList = () => {
            router.push({
                path: '/depositRecord'
            })
        }

        /** 币种顺序排序 */
        const handleScreenList = (arr) => {
            const { Value } = newsSysConfig.find(i => i.Key === 'sortCurrencyList') || {}
            if (!Value) return
            const valArr = Value?.split(',').filter(i => i)
            const result = []
            arr.forEach(i => {
                const index = valArr.indexOf(i.currency)
                if (result.length > index && index !== -1) {
                    result.splice(index, 0, i)
                } else {
                    result.push(i)
                }
            })
            return result
        }

        // 获取客户支持的存款币种列表
        const queryDepositCoinList = () => {
            getDepositCoinList({ clientType: 'mobile' }).then((res) => {
                const data = accountList.value.filter((el) => res.data.includes(el.currency))
                state.despositCurrencyList = handleScreenList(data)
                const idx = data.findIndex(
                    (o) => o.currency === state.currency
                )
                state.minAddressDeposit = store.state._base.appJson.minAddressDeposit.find(v => v.title === state.despositCurrencyList[state.despositCurrencyIndex]?.currency)
                if (idx >= 0) state.despositCurrencyIndex = idx
            })
        }

        const pageInit = () => {
            // 订阅资产数据
            MsgSocket.subscribeAsset(state.tradeType)
            // 查询客户总资产信息
            store.dispatch('_user/queryCustomerAssetsInfo', {
                tradeType: state.tradeType
            })
        }

        // 检查是否需要KYC认证
        const checkKyc = () => {
            state.loading = true
            checkKycApply({ businessCode: 'cashin', openAccountType: customInfo.value.openAccountType }).then((res) => {
                state.loading = false
                if (res?.check()) {
                    // kyc弹窗提示
                    if (Number(res.data) !== 2) {
                        return Dialog.alert({
                            title: t('common.tip'),
                            confirmButtonText: Number(res.data) === 1 ? t('common.goLook') : t('login.goAuthenticate'),
                            message: Number(res.data) === 2 ? t('deposit.KYCReviewing') : t('deposit.needKYC')
                        }).then(() => {
                            // firebase
                            firebaseAnalytics('ck_kyc_popup', {
                                key: 'kyc_popup',
                                value: 'withdraw_popup'
                            })
                            router.replace({
                                name: 'Authentication',
                                query: {
                                    businessCode: 'cashin'
                                }
                            })
                        })
                    }
                }
            })
                .catch((err) => {
                    state.loading = false
                })
        }

        // 获取支付通道
        const getPayTypes = () => {
            const params = {
                companyId: customInfo.value.companyId,
                customerNo: customInfo.value.customerNo,
                customerGroupId: customInfo.value.customerGroupId,
                country: customInfo.value.country,
                clientType: 'mobile',
                accountCurrency: state.currency,
                tradeType: state.tradeType,
                accountId: state.accountId
            }
            state.loading = true
            queryPayType(params).then((res) => {
                state.loading = false
                const result = []
                let tabFlag = true
                res.data.forEach((el) => {
                    const iconKey = el.paymentCode + '_' + el.paymentType + '_' + el.merchantNo
                    if (paymentIconList.value[iconKey]) {
                        el.alias = paymentIconList.value[iconKey][state.currentLang].alias || ''
                        el.imgUrl = paymentIconList.value[iconKey][state.currentLang].imgUrl || require('@/assets/payment_icon/default.png')
                    } else {
                        el.imgUrl = require('@/assets/payment_icon/default.png')
                    }
                    result.push(el)
                    // tab栏隐藏判断
                    if (el.paymentCode === 'micropay' && el.paymentType === 'credit_card2') {
                        tabFlag = false
                    }
                })
                state.tabTitleHide = tabFlag
                state.payTypes = result
            })
                .catch(() => {
                    state.loading = false
                })
        }

        // 获取币对应的链(直充、web3共用coin_micropay)
        const getChainInfo = () => {
            getCryptoBlockchainInfo({
                currency: state.currency,
                paymentCode: 'coin_micropay'
            }).then((res) => {
                state.netCurrencyList = res.data?.blockchainList || []
                if (!state.netCurrencyList.length) {
                    state.netCurrencyIndex = 0
                } else if (typeof state.netCurrencyIndex !== 'number') {
                    state.netCurrencyIndex = 0
                }
            }).catch(() => {
                state.netCurrencyList = []
                state.netCurrencyIndex = null
            })
        }

        // 获取存款货币对汇率
        const getDepositExchangeRate = async () => {
            if (state.currencyChecked) {
                const param = {
                    customerNo: customInfo.value.customerNo,
                    accountId: state.accountId,
                    tradeType: state.tradeType,
                    accountCurrency: state.currency,
                    paymentCurrency: state.currencyChecked
                }
                queryDepositExchangeRate(param)
                    .then((res) => {
                        state.loading = false
                        if (res && res.check()) {
                            state.rateConfig = res.data
                        } else {
                            Toast(res.msg)
                        }
                    })
                    .catch((err) => {
                        state.loading = false
                    })
            }
        }

        // 补充资料是否全部填写完成
        const checkAllComplete = () => {
            let flag = true
            const extend = state.checkedType.extend
            if (!extend) return flag
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

        // 点击下一步
        const confirmDeposit = () => {
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

        // 补充资料确定事件
        const handleAppendField = () => {
            const extend = state.checkedType.extend
            for (const key in extend) {
                if (Object.hasOwnProperty.call(extend, key)) {
                    const element = extend[key]
                    if (!isEmpty(element.regex)) {
                        const valueReg = new RegExp(element.regex)
                        if (!valueReg.test(state.appendMap[key]?.value)) {
                            return Toast(
                                `${extend[key][state.currentLang]}` +
                                    t('register.incorrectlyFormed')
                            )
                        }
                    }
                    if (isEmpty(state.appendMap[key]?.value)) {
                        return Toast(t('deposit.allInputRequire'))
                    }
                    state.paramsExtens[key] = state.appendMap[key]?.value
                }
            }
            state.appendVis = false
            handleDeposit()
        }

        // 获取存款参数
        const getDepositParams = () => {
            const blockchainName = state.currentTab === 1 ? '' : state.netCurrencyList[state.netCurrencyIndex]
            const callbackUrl = `${window.location.protocol}//${window.location.host}/${state.currentLang}/depositCb?accountId=${state.accountId}&currency=${state.currency}&tradeType=${state.tradeType}`
            sessionSet('callbackUrl', JSON.stringify({
                a: state.accountId,
                c: state.currency,
                t: state.tradeType,
            }))
            let params = {
                tradeType: state.tradeType,
                customerNo: customInfo.value.customerNo,
                customerGroupId: customInfo.value.customerGroupId,
                country: customInfo.value.country,
                channelCode: customInfo.value.utmSource,
                accountId: state.accountId,
                depositRateSerialNo: state.rateConfig.depositRateSerialNo,
                paymentCurrency: state.currencyChecked,
                accountCurrency: state.currency,
                exchangeRate: state.rateConfig.exchangeRate,
                paymentChannelCode: state.checkedType.paymentCode,
                paymentChannelType: state.checkedType.paymentType,
                paymentMerchantNo: state.checkedType.merchantNo,
                // paymentChannelClientType: 'mobile',
                paymentChannelClientType: 'pc',
                depositAmount: state.amount,
                depositFrom: getDepositFrom(),
                callbackUrl: encodeURIComponent(callbackUrl),
                blockchainName
            }
            // 连接钱包 -- paymentChannelPayType 1连钱包支付 2钱包转账（二维码）不传两种都支持
            if (state.currentTab === 0 && state.despositTypesIndex === 1) {
                params = Object.assign(params, { paymentChannelPayType: 1 })
            }
            return params
        }

        // 创建存款提案
        const handleDeposit = () => {
            const params = getDepositParams()
            if (!isEmpty(state.paramsExtens)) {
                params.extend = JSON.stringify(state.paramsExtens)
            }
            state.loading = true
            return new Promise((resolve, reject) => {
                handleDesposit(params).then((res) => {
                    state.loading = false
                    state.pin = ''
                    if (res.data && res.ok) {
                        state.despositResult = res.data
                        if (params.paymentChannelCode !== 'payredeem') {
                            despositSuccess()
                        } // payredeem支付成功不需要处理该函数
                        resolve()
                    } else {
                        Toast(res.msg)
                        reject()
                    }
                })
                    .catch(() => {
                        state.pin = ''
                        state.loading = false
                        reject()
                    })
            })
        }

        // 存款提案创建成功
        const despositSuccess = () => {
            const despositResult = state.despositResult
            localSet('proposalNo', despositResult.proposalNo)
            // 提交表单
            if (despositResult.submitType === 'post_data') {
                setTimeout(() => {
                    document.getElementById('payForm').submit()
                }, 200)
            } else {
                // 跳转到新页面
                const newUrl = despositResult.browserOpenUrl
                window.location.href = newUrl.indexOf('lang=') > -1 ? newUrl : `${newUrl}&lang=${getCookie('lang')}`
            }
        }

        // 点击存款提示弹窗确认按钮
        const onConfirm = () => {
            // 请求存款提案
            const proposalNo = localGet('proposalNo')
            if (proposalNo) {
                const params = {
                    customerNo: customInfo.value.customerNo,
                    tradeType: state.tradeType,
                    accountId: state.accountId,
                    proposalNo
                }
                queryDepositProposal(params)
                    .then((res) => {
                        if (res && res.check()) {
                            if (Number(res.data.paymentStatus) === 2) {
                                router.push('/assets')
                            } else {
                                Dialog.alert({
                                    title: t('common.tip'),
                                    message: t('deposit.despositFail'),
                                    confirmButtonText: t('deposit.toRecord')
                                }).then(() => {
                                    router.push('/depositRecord')
                                })
                            }
                            localRemove('proposalNo')
                        }
                    })
                    .catch(() => {
                        state.loading = false
                    })
            }
        }

        // 点击存款提示弹窗取消按钮
        const onCancel = () => {
            localRemove('proposalNo')
            state.despositVis = false
        }

        // 设置存款金额数据
        const setAmountList = () => {
            judgeIsAlreadyDeposit({
                companyId: customInfo.value.companyId,
                customerNo: customInfo.value.customerNo,
                accountId: state.accountId
            }).then((res) => {
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
                    if (item.amount) { arr.push({ amount: item.amount, describe: item[state.currentLang]?.describe }) }
                }
                // 没有存款数据设置默认数据
                const defaultAmountList = [
                    { amount: 50 },
                    { amount: 100 },
                    { amount: 500 },
                    { amount: 1000 }
                ]
                // 数据赋值
                state.amountList = arr.length ? arr : defaultAmountList
                state.currIndex = 0
                state.amount = state.amountList[0].amount
            })
        }

        const changePayCurrency = (_, index) => {
            if (index === state.payCurrencyIndex) return
            state.payCurrencyIndex = index
        }

        const changeDespositCurrency = (obj, index) => {
            state.despositCurrencyVisible = false
            if (index === state.despositCurrencyIndex) return
            state.despositCurrencyIndex = index
            state.currency = obj.currency
            state.accountId = obj.accountId
            // 切换币种要先重置网络
            state.netCurrencyList = []
            state.netCurrencyIndex = 0
            // 重置支付渠道
            if (state.currentTab === 0) {
                state.checkedType = '' // 清空
                // firebase
                firebaseAnalytics('switch_recharge_coin', {
                    key: 'switch_recharge_coin',
                    value: obj.currency
                })
            }
            // 更新支付渠道
            getPayTypes()
            // 更新币对应的链
            getChainInfo()
            // 更新存款金额数据
            setAmountList()
        }

        const changeNetCurrency = (_, index) => {
            state.netCurrencyVisible = false
            if (index === state.netCurrencyIndex) return
            state.netCurrencyIndex = index
        }

        // 支付渠道更新后相关处理
        const updatePayTypes = () => {
            let currentType = ''
            if (state.currentTab === 0) {
                if (state.despositTypesIndex === 0) {
                    // 直充
                    currentType = state.payTypes.find((i) => i.paymentCode === 'coin_micropay' && i.paymentType === 'coin_micropay')
                } else {
                    // web3
                    currentType = state.payTypes.find((i) => i.paymentCode === 'micropay' && i.paymentType === 'micropay_web3')
                }
            } else {
                // 信用卡
                currentType = state.payTypes.find((i) => i.paymentCode === 'micropay' && i.paymentType === 'credit_card2')
            }
            if (currentType) {
                state.checkedType = currentType
                state.appendMap = currentType.extend
                state.extend = currentType.extend
                // 设置支付货币列表
                const arr = currentType.paymentCurrency?.split(',') || []
                state.paymentTypes = arr
                state.currencyChecked = arr.find((e) => e === state.currency) || arr.find((e) => e === 'USDT') || arr[0]
                // 获取存款货币对汇率
                getDepositExchangeRate()
            } else {
                state.checkedType = ''
                state.appendMap = {}
                state.payTypeId = ''
                state.paymentTypes = []
                state.currencyChecked = ''
                state.address = ''
            }
        }

        // const changeTab = (tab) => {
        //     state.currentTab = tab.name
        //     handleFireBase()
        // }

        const handleFireBase = (dest) => {
            // firebase
            const seconds = Math.floor((Date.now() - state.pageExistTime) / 1000)
            const key = (state.currentTab === 0 && dest) || (state.currentTab === 1 && !dest) ? 'recharge_access_time' : 'buy_coin_access_time'
            // 访问时长
            firebaseAnalytics(key, { key, value: seconds })
            if (state.currentTab === 1 && !dest) {
                // 进入页面
                firebaseAnalytics('ck_buy_coin', {
                    key: 'buy_coin_entrance',
                    value: 'buy_crypto'
                })
            }
            if (!dest) {
                state.pageExistTime = Date.now()
            }
        }

        // 切换存款金额
        const checkAmount = (index, item) => {
            state.currIndex = index
            state.amount = item.amount
        }

        // 申请绑定直充支付钱包地址
        const applyBindAddress = () => {
            if (!isEmpty(state.netCurrencyList) && state.checkedType && state.currentTab === 0 && state.despositTypesIndex === 0) {
                state.tag = ''
                const blockchainName = state.netCurrencyList[state.netCurrencyIndex]
                const address = state.addressMap[`${state.currency}_${blockchainName}`]
                if (address || state.address === address) {
                    state.address = address
                    state.tag = state.tagMap[`${state.currency}_${blockchainName}`] || ''
                    return
                }
                const params = {
                    companyId: customInfo.value.companyId,
                    customerNo: customInfo.value.customerNo,
                    customerGroupId: customInfo.value.customerGroupId,
                    country: customInfo.value.country,
                    accountCurrency: state.currency,
                    paymentChannelClientType: 'pc',
                    paymentChannelCode: state.checkedType.paymentCode,
                    paymentChannelType: state.checkedType.paymentType,
                    paymentMerchantNo: state.checkedType.merchantNo,
                    blockchainName
                }
                applyRechargeBindAddress(params)
                    .then((res) => {
                        if (res.check()) {
                            state.address = res.data.address
                            state.addressMap[`${state.currency}_${blockchainName}`] = res.data.address
                            if (Object.keys(state.tagObj).includes(state.currency)) {
                                state.tag = res.data.tag || ''
                                state.tagMap[`${state.currency}_${blockchainName}`] = res.data.tag || ''
                            }
                        } else {
                            state.address = ''
                        }
                    })
                    .catch(() => {
                        state.address = ''
                    })
            }
        }

        const creatQrCode = (size) => {
            qrCode.value.innerHTML = ''
            new QRCode(qrCode.value, {
                text: state.address,
                width: size,
                height: size,
                colorDark: localGet('invertColor') === 'light' ? '#000000' : '#ffffff',
                colorLight: localGet('invertColor') === 'light' ? '#ffffff' : '#000000',
                correctLevel: QRCode.CorrectLevel.H
            })
        }

        const onLoaded = () => {
            const { currency, accountId, tradeType, defaultCurrentTab } = route.query
            state.tradeType = Number(tradeType)
            state.currentTab = Number(defaultCurrentTab || 0)
            state.currency = currency || ''
            state.accountId = accountId || ''
            // 进入页面监听币种
            firebaseAnalytics('switch_recharge_coin', {
                key: 'switch_recharge_coin',
                value: state.currency
            })
            // 页面初始化
            // pageInit()
            // 检查是否需要KYC认证
            checkKyc()
            // 获取可存款币种
            queryDepositCoinList()
            // 获取支付通道
            getPayTypes()
            // 获取币对应的链
            getChainInfo()
            // 设置存款金额数据
            setAmountList()
        }

        onLoaded()

        onMounted(() => {
            // 判断有没有保存proposalNo，有则弹窗提醒
            if (localGet('proposalNo')) {
                state.despositVis = true
            }
        })

        onBeforeUnmount(() => {
            handleFireBase(true)
            localRemove('proposalNo')
        })

        // 监听当前网络是否支持连接钱包
        watch(showWallet, (data) => {
            !data && (state.despositTypesIndex = 0)
        })

        // 监听存款地址
        watch(() => [state.address, qrCode.value], () => {
                  if (state.address && qrCode.value) {
                      const { clientWidth } = qrCode.value
                      creatQrCode(clientWidth)
                  }
              },
              { immediate: true }
        )

        // 监听购买输入
        watch(() => state.amount, () => {
            // 选中金额
            state.currIndex = ''
            state.amountList.forEach((item, index) => {
                if (Number(item.amount) === Number(state.amount)) {
                    state.currIndex = index
                }
            })
        }
        )

        // 监听计算预计支付金额
        watch(computeExpectedpay, (ce_n) => {
            if (Number(ce_n) === Number(state.amountPay)) return
            if (state.inputType && state.inputType === 'amountPay') return
            state.amountPay = ce_n
        })

        // 监听计算预计支付金额(方向计算可购买的币数量)
        watch(computeExpectedpayReverse, (cr_n) => {
            if (Number(cr_n) === Number(state.amount)) return
            if (state.inputType && state.inputType === 'amount') return
            state.amount = cr_n
        })

        watch(() => [state.netCurrencyList, state.checkedType], ([list, type]) => {
            if (!isEmpty(list) && !!type) {
                applyBindAddress()
            }
        })

        // 更新充值地址
        watch(() => state.netCurrencyIndex, () => { applyBindAddress() })

        // 支付渠道更新后相关处理 currentTab despositTypesIndex
        watch(() => [state.despositTypesIndex, state.payTypes, state.currentTab], () => updatePayTypes())

        return {
            onCopy,
            onBack,
            onConfirm,
            onCancel,
            // changeTab,
            toDespositList,
            columnsFields,
            changePayCurrency,
            changeNetCurrency,
            changeDespositCurrency,
            handleAppendField,
            computeFee,
            computeAccount,
            computeExpectedpay,
            computeExpectedpayReverse,
            buyPayType,
            despositPayType,
            confirmDeposit,
            checkAmount,
            qrCode,
            showWallet,
            addThousandthSign,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
.depositBody {
    height: 100%;
    overflow-y: auto;
    background: var(--contentColor);
}
.tabBox {
    :deep(.van-tabs__nav) {
        background: transparent;
    }
    :deep(.van-tabs__wrap) {
        height: rem(107px);
        border-bottom: 1px solid var(--lineColor);
        padding: 0 rem(75px);
        box-sizing: border-box;
    }
    :deep(.van-tab__text) {
        color: var(--primaryText);
        font-weight: bold;
        font-size: rem(32px);
        line-height: 1.5;
    }
}
.tabHide {
    :deep(.van-tabs__wrap) {
        height: 0 !important;
    }
}
.leftTop {
    display: flex;
    justify-content: space-between;
    padding: rem(40px) rem(30px);
    & > div {
        width: rem(336px);
        font-size: rem(28px);
        font-family: Inter;
        font-weight: 500;
        color: var(--mainColor);
        & > p{
          line-height: 1;
          font-family: Inter;
        }
        & > div {
            margin-top: rem(32px);
            width: 100%;
            height: rem(82px);
            border: 1px solid var(--lineColor);
            border-radius: rem(16px);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 rem(20px);
            font-weight: 400;
            font-family: Roboto;

            & > span {
                max-width: calc(100% - rem(30px));
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-family: Roboto;
            }
        }
    }
}
.leftText {
    font-size: rem(28px);
    color: var(--placeholdColor);
    padding: rem(30px) rem(30px);
}
.qrcodeBox{
  margin: rem(84px) 0 rem(24px);
}
.leftCont {
    width: rem(690px);
    height: rem(72px);
    background: var(--cellBg);
    border-radius: rem(4px);
    margin-left: rem(30px);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: rem(26px);
    font-family: Inter;
    padding:rem(20px) rem(30px);
    color: var(--mainColor);
}
.copyAddress{
  width: max-content;
  margin: auto;
  margin-top:rem(30px);
  padding: rem(16px);
  background-color: var(--primary);
  border-radius:rem(8px);
  font-size: rem(24px);
  font-family: Roboto;
  color: var(--contentColor);
}
.amount-label {
    padding: rem(30px);
    font-size: rem(36px);
    color: var(--textColor);
}
.amount-item-con {
    padding: 0 rem(30px);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    .amount-item {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: rem(334px);
        height: rem(98px);
        background: #ffffff;
        border: rem(2px) solid #ebebeb;
        border-radius: rem(10px);
        overflow: hidden;

        span {
            font-size: rem(28px);
            font-family: Roboto;
            color: var(--mainColor);
        }
        img {
            width: rem(30px);
            height: rem(30px);
            position: absolute;
            top: rem(-3px);
            right: rem(-3px);
        }
    }
    .amount-item-check {
        border-color: #f99900;
        background-color: #faede0;
    }
}
.amount-input-con {
    padding: 0 rem(30px);
    display: flex;
    .currency-con {
        display: flex;
        align-items: center;
        padding-left: rem(30px);
        width: rem(260px);
        height: rem(98px);
        background: #ffffff;
        border: rem(2px) solid #ebebeb;
        border-radius: rem(10px);
        span {
            font-size: rem(28px);
            font-family: Roboto;
            color: var(--mainColor);
            margin-left: rem(16px);
        }
    }
    .input-con {
        display: flex;
        padding: 0 rem(30px);
        margin-left: rem(20px);
        flex: 1;
        height: rem(98px);
        background: #ffffff;
        border: rem(2px) solid #ebebeb;
        border-radius: rem(10px);
        font-size: rem(28px);
        font-family: Roboto;
        color: var(--mainColor);
    }
}
.despositTypes-wrap {
    padding: 0 rem(30px);
    .title{
        font-size: rem(28px);
        font-family: Inter;
        font-weight: 500;
        color: var(--mainColor);
        line-height: 1;
    }
    .despositTypes-con {
        margin-top: rem(48px);
        display: flex;
        overflow: hidden;

        .despositTypes-item {
            flex: 1;
            height: 100%;
            display: flex;
            align-items: center;
            font-size: rem(28px);
            font-family: Inter;
            font-weight: 600;
            color: var(--mainColor);
            line-height: 1;
            .icon{
              width: rem(48px);
              height: rem(48px);
              border: 1px solid var(--lineColor);
              border-radius: 50%;
              margin-right: rem(16px);
            }
            .iconCheck{
              width: rem(48px);
              height: rem(48px);
              border: 1px solid var(--lineColor);
              border-radius: 50%;
              margin-right: rem(16px);
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              &::after{
                content: '';
                width: rem(32px);
                height: rem(32px);
                background: var(--primary);
                border-radius: 50%;
              }
            }
        }

        .desposit-check {
            background-color: var(--contentColor);
        }
    }
}
.icon-box {
    display: flex;
    align-items: center;

    & > img {
        margin-right: rem(10px);
    }
}
.leftBot {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Inter;
    font-size: rem(24px);
    color: var(--minorColor);
    padding: 0 rem(30px);
    margin-top: rem(80px);
    text-align: center;
    line-height: 1.5;
    & > div {
        width: rem(320px);
        height: rem(320px);
        margin-bottom: rem(34px);
        position: relative;
        .container-header {
            &::before {
              content: '';
              position: absolute;
              width: rem(20px);
              height: rem(20px);
              top: rem(-16px);
              left: rem(-16px);
              border-top: 2px solid #979797;
              border-left: 2px solid #979797;
            }
            &::after {
              content: '';
              position: absolute;
              width: rem(20px);
              height: rem(20px);
              top: rem(-16px);
              right: rem(-16px);
              border-top: 2px solid #979797;
              border-right: 2px solid #979797;
            }
          }
          .container-footer {
            &::before {
              content: '';
              position: absolute;
              width: rem(20px);
              height: rem(20px);
              bottom: rem(-16px);
              left: rem(-16px);
              border-bottom: 2px solid #979797;
              border-left: 2px solid #979797;
            }
            &::after {
              content: '';
              position: absolute;
              width: rem(20px);
              height: rem(20px);
              bottom: rem(-16px);
              right: rem(-16px);
              border-bottom: 2px solid #979797;
              border-right: 2px solid #979797;
            }
          }
    }

}
.cryptoBox{
    background: var(--bgColor);
    padding-top: rem(18px);
    .content{
         padding: rem(40px) rem(30px);
         background-color: var(--contentColor);
         .rightTop {
            border-radius: rem(4px);
            border: 1px solid #EBE9E9;
            padding: rem(32px);
            font-size: rem(28px);
            font-family: Inter;
            color: var(--mainColor);
            .inpBox{
                margin-top: rem(16px);
                display: flex;
                align-items: center;
                justify-content: space-between;
                .buy-num{
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    font-family: Inter;
                    input{
                        width: 100%;
                        height: rem(40px);
                        font-size:rem(48px);
                        font-style: normal;
                        font-weight: 600;
                        color: var(--mainColor);
                        &::placeholder{
                            font-size: rem(28px);
                        }
                    }

                    .tips{
                        margin-top: rem(20px);
                        color: var(--tipsTextColor);
                        font-size: rem(24px);
                    }
                }
                .iconBox{
                    display: flex;
                    align-items: center;
                    margin-left: rem(20px);
                    font-size: rem(32px);
                    font-family: Inter;
                    font-weight: 600;
                    color: var(--mainColor);
                    span{
                        margin:0 rem(8px);
                    }
                    .iconImg{
                        width: rem(48px);
                        height: rem(48px);
                    }
                }
            }
            .playBox{
                margin-top: rem(48px);
                display: flex;
                align-items: center;
                font-size: rem(32px);
                font-family: Inter;
                font-weight: 600;
                img{
                    margin-right: rem(20px);
                }
                div{
                    margin-right: rem(20px);
                }
                span{
                    border-radius: rem(4px);
                    padding: 0 rem(16px);
                    font-size: rem(24px);
                    font-family: Inter;
                    font-weight: 500;
                    color: var(--contentColor);
                    line-height: normal;
                    background: #FF5844;
                }
            }

        }
        .borderRadius{
            margin-top: rem(48px);
            border-radius: rem(16px);
        }
        .tipsBox{
            margin-top: rem(16px);
            padding: 0 rem(24px);
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: rem(24px);
            font-family: Inter;
            font-style: normal;
            font-weight: 400;
            color: var(--mainColor);
            .textBox{
                display: flex;
                align-items: center;
                .title{
                    color: var(--minorColor);
                }

            }
        }

    }
}
.qrCodeTips{
        margin-top: rem(16px);
        color: var(--minorColor);
        font-size: rem(24px);
        font-family: Inter;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        text-align: left;
        li{
            list-style: disc;
            margin-left: rem(28px);
            padding-left: rem(-10px);
            :deep(span){
                color: var(--mainColor) ;
                margin-left: rem(8px) ;
            }
        }
    }
.rightMargin {
   margin-top: rem(32px);
}

.payBox {
    width: rem(694px);
    height: auto;
    position: fixed;
    bottom: rem(25px);
    left: rem(27px);
}
.payBtn {
    width: 100%;
    height: rem(90px);
    background: var(--primary);
    border-radius: rem(10px);
    font-size: rem(30px);
    color: var(--contentColor);
    margin-top: rem(10px);
}
.emptyBox {
    :deep(.van-empty__description) {
        font-size: rem(28px);
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
        text-align: center;
    }
}
.append-popup {
    background-color: var(--bgColor);
    .append-wrap {
        text-align: center;
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
