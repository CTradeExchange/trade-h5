<template>
    <div class='layout'>
        <LayoutTop :back='true' bottom-line :menu='false' />
        <div class='container'>
            <div class='empty'></div>
            <div class='module-form'>
                <div class='select' @click='coinKindVisible = true'>
                    <label>{{ $t('walletAdd.coinName') }}</label>
                    <div class='option'>
                        <CurrencyIcon :currency='coinKind' :size='24' />
                        <span class='text'>
                            {{ coinKind }}
                        </span>
                        <img class='iconImg' src='../../themes/plans/images/assets/arrow.png' />
                    </div>
                </div>
                <div class='select' @click='chainNameVisible = true'>
                    <div class='select-title-box'>
                        <label>{{ $t('walletAdd.chainPlaceholder') }}</label>
                        <div class='new-box'>
                            <span>{{ $t('headLineTrade.new') }}</span>
                        </div>
                    </div>
                    <div class='option'>
                        <div class='chainNameText'>
                            {{ chainName }}
                        </div>
                        <img class='iconImg' src='../../themes/plans/images/assets/arrow.png' />
                    </div>
                </div>
            </div>
            <div class='module-import'>
                <div :class="['box','custom']">
                    <div class='titleBox'>
                        <span>*</span>{{ $t('withdraw.walletAddress') }}
                    </div>
                    <input v-model='address' :placeholder="$t('walletAdd.addressPlaceholder')" type='text' @input='checkAddressFormat' />
                    <span class='error'>
                        {{ addressResult?'': $t('headLineTrade.address-error') }}
                    </span>
                </div>
                <div class='box'>
                    <div class='titleBox'>
                        {{ $t('withdraw.walletName') }}
                    </div>
                    <input v-model='name' :placeholder="$t('walletAdd.namePlaceholder')" type='text' />
                </div>
                <div class='box'>
                    <div class='titleBox'>
                        <span>*</span> {{ $t('common.sendToYou') }} {{ customInfo?.phone || customInfo?.email }}
                    </div>
                    <div class='inpBox'>
                        <input v-model='code' :placeholder="$t('common.inputVerifyCode')" />
                        <span v-if='countDown <= 0' class='get' @click='getCode'>
                            {{ $t('walletAdd.codeBtn') }}
                        </span>
                        <span v-else class='time'>
                            {{ countDown }}{{ $t('walletAdd.codeHint') }}
                        </span>
                    </div>
                </div>
                <div v-if='googleCodeVis' class='box'>
                    <div class='titleBox'>
                        <span>*</span>{{ $t('withdrawCoin.googleVerification') }}
                    </div>
                    <div class='pwd-oper'>
                        <googleVerifyCode @getGooleVerifyCode='getGooleVerifyCode' />
                    </div>
                </div>
            </div>
        </div>
        <!-- 底部按钮 -->
        <button class='footer-btn' :disabled='btnCheck' @click='onConfirm'>
            <span>{{ $t('walletAdd.confirm') }}</span>
        </button>

        <!-- 提币币种弹窗 -->
        <van-action-sheet v-model:show='coinKindVisible' :actions='coinKindList' class='action-sheet-coin' @select='selectCoinKind' />
        <!-- 链名称弹窗 -->
        <van-action-sheet v-model:show='chainNameVisible' :actions='chainNameList' class='action-sheet-chain' @select='selectChainName' />
        <AddNeedInfo />
    </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { Toast, Dialog } from 'vant'
import { useI18n } from 'vue-i18n'
import { verifyCodeSend } from '@/api/base'
import { addWalletAddressV1v1v2, getWithdrawCurrencyList } from '@/api/user'
import { reactive, toRefs, computed, onMounted } from 'vue'
import CurrencyIcon from '@/components/currencyIcon'
import googleVerifyCode from '@/themeCommon/components/googleVerifyCode.vue'
import AddNeedInfo from '@/themeCommon/components/addNeedInfo.vue'
import { checkAddressResult } from '@/utils/util'

export default {
    components: {
        googleVerifyCode,
        CurrencyIcon,
        AddNeedInfo,
    },
    setup () {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { tradeType, accountId, coin, withdrawMethod } = route.query
        const state = reactive({
            // 提币链名称数据列表
            allList: [],
            // 提币币种选项列表
            coinKindList: [],
            // 链名称列表
            chainNameList: [],
            // 提币币种
            coinKind: coin || '',
            // 链名称
            chainName: '',
            // 钱包地址
            address: '',
            // 钱包名称
            name: '',
            // 验证码
            code: '',
            // 当前验证码倒计时时间
            countDown: 0,
            // 是否显示提币币种选项弹窗
            coinKindVisible: false,
            // 是否显示链名称选项弹窗
            chainNameVisible: false,
            // 发送验证码返回的信息
            verifyInfo: {
                code: '',
                token: ''
            },
            googleCode: '',
            addressResult: true
        })
        // 账户信息
        const { value: customInfo } = computed(() => store.state._user.customerInfo)

        const googleCodeVis = computed(() => customInfo.googleId > 0)
        const btnCheck = computed(() => {
            if (!state.coinKind || !state.chainName || !state.addressResult || !state.address || !state.code || (googleCodeVis.value && !state.googleCode)) {
                return true
            } else {
                return false
            }
        })

        // 初始化数据
        let timer = null

        // 点击选择提币币种
        const selectCoinKind = (item) => {
            state.coinKind = item.name
            state.chainName = ''
            state.coinKindVisible = false
            // 根据提币币种筛选链名称,筛选链后，默认设置第一个
            filterChainName()
        }
        // 点击选项链名称
        const selectChainName = (item) => {
            state.chainName = item.name

            if (state.address) {
                state.addressResult = checkAddressResult(state.address, state.chainName)
            }
            state.chainNameVisible = false
        }
        const getGooleVerifyCode = val => {
            state.googleCode = val
        }
        // 获取客户提币币种和链名称
        const queryWithdrawCurrencyList = () => {
            getWithdrawCurrencyList({
                companyId: customInfo.companyId,
                customerNo: customInfo.customerNo,
                customerGroupId: customInfo.customerGroupId,
                accountId: accountId,
                tradeType: tradeType,
                // accountCurrency: accountCurrency.currency,
                country: customInfo.country,
                withdrawMethod: withdrawMethod || 'blockatm_webhook'
            }).then(res => {
                // console.log('!!!!!!!!!!!!!!', res)
                if (res.check()) {
                    const { data } = res
                    const coinKindList = []
                    data.map(elem => {
                        if (!coinKindList.some(v => v.name === elem.withdrawCurrency)) {
                            coinKindList.push({ name: elem.withdrawCurrency })
                        }
                    })
                    // 判断链接有没有传参，没有就设默认值
                    if (coinKindList.length) {
                        if (!coin) {
                            state.coinKind = coinKindList[0].name
                        }
                    }
                    state.allList = data

                    state.coinKindList = coinKindList

                    filterChainName()
                }
            })
        }
        // 根据提币币种筛选链名称
        const filterChainName = () => {
            const chainNameList = []
            const arr = state.allList.filter(v => v.withdrawCurrency === state.coinKind)
            arr.map(elem => {
                chainNameList.push({ name: elem.blockchainName })
            })
            state.chainNameList = chainNameList
            if (state.chainNameList.length)state.chainName = state.chainNameList[0].name
        }
        // 点击获取验证码
        const getCode = () => {
            // 发送验证码
            verifyCodeSend({
                bizType: customInfo?.phone ? 'SMS_LOGINED_VERIFICATION_CODE' : 'EMAIL_LOGINED_VERIFICATION_CODE'
            }).then(res => {
                state.verifyInfo = res.data
                state.countDown = 59
                timer = setInterval(() => {
                    state.countDown -= 1
                    if (state.countDown <= 0) {
                        clearInterval(timer)
                    }
                }, 1000)
            })
        }
        // 点击确定
        const onConfirm = () => {
            const verifyInfo = state.verifyInfo
            if (!state.coinKind) {
                return Toast({ message: t('walletAdd.coinPlaceholder') })
            }
            if (!state.chainName) {
                return Toast({ message: t('walletAdd.chainPlaceholder') })
            }
            if (!state.address) {
                return Toast({ message: t('walletAdd.addressPlaceholder') })
            }
            if (!state.addressResult) {
                return Toast({ message: t('headLineTrade.address-error') })
            }
            if (!verifyInfo.token) {
                return Toast(t('common.getVerifyCode'))
            }
            if (!state.code) {
                return Toast({ message: t('common.inputVerifyCode') })
            }
            if (googleCodeVis.value && !state.googleCode) {
                return Toast(t('common.inputGoogleCode'))
            }

            // 发起api请示
            addWalletAddressV1v1v2({
                currency: state.coinKind,
                chainName: state.chainName,
                address: state.address,
                remark: state.name,
                type: customInfo?.phone ? 2 : 1,
                verifyCode: state.code,
                phoneArea: customInfo?.phoneArea,
                sendToken: verifyInfo.token,
                googleCode: state.googleCode,

            }).then(res => {
                if (res.check()) {
                    Dialog.alert({
                        message: t('withdraw.successHint'),
                    }).then(() => {
                        router.go(-1)
                    })
                } else {
                    Toast(res.msg)
                }
            })
        }

        onMounted(() => {
            // 获取客户提币币种和链名称
            queryWithdrawCurrencyList()
        })
        const checkAddressFormat = (e) => {
            state.addressResult = checkAddressResult(e.target.value, state.chainName)
        }

        return {
            ...toRefs(state),
            selectCoinKind,
            selectChainName,
            getCode,
            onConfirm,
            customInfo,
            googleCodeVis,
            getGooleVerifyCode,
            btnCheck,
            checkAddressFormat
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bgColor);
}
.container {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-y: auto;
    background: var(--contentColor);
    .empty {
        height: rem(16px);
        background-color: var(--bgColor);
    }
    .module-form {
        padding: rem(30px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: var(--contentColor);
        font-size: rem(28px);
        font-family: Inter;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        color: var(--mainColor);
        .select {
            display: flex;
            flex-direction: column;
            .select-title-box{
          height: auto;
          display:flex;
          align-items:center;
          margin-top:0;
          .new-box{
            margin-left:10px;
            padding:1px 10px;
            background-color:var(--primary);
            border-radius:4px;
            &>span{
              font-size:14px;
              line-height:14px;
              color:#fff;
            }
          }
        }
            .option {
                width: rem(328px);
                height:rem(88px);
                display: flex;
                align-items: center;
                margin-top:rem(32px);
                padding: rem(20px) rem(16px);
                border-radius: rem(16px);
                border: 1px solid var(--lineColor);
                .text{
                    font-family: Roboto;
                    font-weight: 400;
                    margin-left: rem(16px);
                }
                .chainNameText{
                    width: rem(228px);
                    overflow:hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .iconImg{
                    margin-left: rem(20px);
                    width: rem(48px);
                    height: rem(48px);
                }
            }
        }
    }
    .module-import {
        padding:0 rem(30px) rem(30px) rem(30px);
        margin-top: rem(56px);
        overflow-y: auto;
        height: calc(100vh - rem(266px) - rem(110px) - rem(196px) - rem(60px));
        .box {
            display: flex;
            flex-direction: column;
            margin-bottom: rem(50px);
            &.custom{
              margin-bottom: rem(40px);
            }
            .titleBox{
                display: flex;
                color: var(--mainColor);
                font-size: rem(28px);
                font-family: Inter;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                span{
                    color: var(--primary);
                }

            }
            .inpBox{
                margin-top: rem(32px);
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-radius: rem(16px);
                border: 1px solid var(--lineColor);
                padding-right: rem(16px);
                input{
                    flex:1;
                    margin-top: 0;
                    border: none;
                }
                span{
                    height: rem(74px);
                    line-height: rem(74px);
                    color:var(--allColor) ;
                }
                .time{
                  white-space:nowrap;
                }
            }

            :deep(.van-cell){
                padding-left: 0;
                padding-right: 0;
                &::after{
                    border: none;
                }
            }
            input {
                margin-top: rem(32px);
                height: rem(74px);
                border-radius: rem(16px);
                border: 1px solid var(--lineColor);
                padding: rem(20px) rem(16px);
                font-weight: 500;
                font-size: rem(28px);
                font-family: Inter;
                font-style: normal;
                line-height: normal;
                color: var(--mainColor);
                &::placeholder{
                    color: var(--minorColor);
                    font-weight: 400;
                }
            }
            .error{
      color:var(--primary);
      font-size:12px;
      line-height:12px;
      margin-top:8px;
      min-height:12px;
    }
        }

        .pwd-oper{
            margin-top: rem(32px);
            width: 100%;
            display: flex;
            align-items: center;
            padding: rem(28px) rem(22px);
            height: rem(74px);
            border-radius: rem(16px);
            border: 1px solid var(--lineColor);

            :deep(.form-item){
                margin-bottom: 0;
                border-bottom: none;
            }
            :deep(.van-cell){
                padding: 0 !important;
                line-height: rem(71px);
            }
        }
    }
}

.footer-btn {
    position: fixed;
    width: rem(694px);
    height: rem(90px);
    border-radius: rem(10px);
    background: var(--primary);
    border: none;
    bottom: rem(100px);
    left: rem(30px);
    &:disabled{
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

</style>
