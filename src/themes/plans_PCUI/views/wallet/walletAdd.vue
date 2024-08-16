<template>
    <div id='walletAddBox'>
        <centerViewDialog>
            <div class='layout-add'>
                <LayoutTop :custom-back='true' @back='handleBack' />
                <div class='container-add'>
                    <div class='leftTop'>
                        <div class='select-box'>
                            <p class='select-title-p'>
                                {{ $t('walletAdd.coinName') }}
                            </p>
                            <el-select v-model='coinKind' class='icon-box' placeholder='---' @change='selectCoinKind'>
                                <template #prefix>
                                    <CurrencyIcon :currency='coinKind' :size='20' />
                                </template>
                                <el-option
                                    v-for='item in coinKindList'
                                    :key='item.name'
                                    class='currencyOption'
                                    :label='item.name'
                                    :value='item.name'
                                >
                                    <CurrencyIcon :currency='item.name' :size='20' />
                                    <span>{{ item.name }}</span>
                                </el-option>
                            </el-select>
                        </div>

                        <div class='select-box'>
                            <div class='select-title-box'>
                                <p class='select-title-p'>
                                    {{ $t('walletAdd.chainPlaceholder') }}
                                </p>
                                <div class='new-box'>
                                    <span>{{ $t('headLineTrade.new') }}</span>
                                </div>
                            </div>
                            <el-select v-model='chainName' class='icon-box' placeholder='---'>
                                <el-option
                                    v-for='item in chainNameList'
                                    :key='item.name'
                                    class='currencyOption'
                                    :label='item.name'
                                    :value='item.name'
                                >
                                    <span>{{ item.name }}</span>
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div :class="['wa-ipt','custom']">
                        <p>{{ $t('walletAdd.addressPlaceholder') }}</p>
                        <div>
                            <input v-model='address'
                                   :placeholder="$t('walletAdd.addressPlaceholder')"
                                   type='text' @input='checkAddressFormat'
                            />
                            <el-icon @click="address = ''">
                                <Close />
                            </el-icon>
                        </div>
                        <span class='error'>
                            {{ addressResult?'': $t('headLineTrade.address-error') }}
                        </span>
                    </div>
                    <div class='wa-ipt'>
                        <p>{{ $t('walletAdd.namePlaceholder') }}</p>
                        <div>
                            <input v-model='name' :placeholder="$t('walletAdd.namePlaceholder')" type='text' />
                            <el-icon @click="name = ''">
                                <Close />
                            </el-icon>
                        </div>
                    </div>
                    <div class='wa-ipt'>
                        <p>{{ $t('common.sendToYou') }} {{ customInfo?.phone || customInfo?.email }}</p>
                        <div>
                            <input v-model='code' :placeholder="$t('common.inputVerifyCode')" />
                            <el-icon @click="code = ''">
                                <Close />
                            </el-icon>
                            <span v-if='countDown === 0' class='get' style='cursor: pointer' @click='getCode'>
                                {{ $t('walletAdd.codeBtn') }}
                            </span>
                            <span v-else class='time'>
                                {{ countDown }}{{ $t('walletAdd.codeHint') }}
                            </span>
                        </div>
                    </div>
                    <div v-if='googleCodeVis' class='wa-ipt'>
                        <p>{{ $t('common.googleCode') }}</p>
                        <googleVerifyCode @getGooleVerifyCode='getGooleVerifyCode' />
                    </div>
                    <!-- 底部按钮 -->
                    <button class='footer-btn' @click='onConfirm'>
                        <span>{{ $t('walletAdd.confirm') }}</span>
                    </button>
                </div>
            </div>
            <AddNeedInfo />
        </centerViewDialog>
    </div>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import CurrencyIcon from '@/components/currencyIcon'
// vue
import { reactive, toRefs, computed, onMounted } from 'vue'
// vuex
import { useStore } from 'vuex'
// router
import { useRouter, useRoute } from 'vue-router'
// components
import { Toast, Dialog } from 'vant'
// i18n
import { useI18n } from 'vue-i18n'
// api
import { getWithdrawCurrencyList, addWalletAddressV1v1v2 } from '@/api/user'
import googleVerifyCode from '@/themeCommon/components/googleVerifyCode.vue'
import AddNeedInfo from '@/themeCommon/components/addNeedInfo.vue'
import { verifyCodeSend } from '@/api/base'
import { checkAddressResult } from '@/utils/util'
export default {
    components: {
        // Top,
        googleVerifyCode,
        centerViewDialog,
        CurrencyIcon,
        AddNeedInfo,
    },
    setup () {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
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
            // 发送验证码返回的信息
            verifyInfo: {
                code: '',
                token: '',
            },
            googleCode: '',
            addressResult: true
        })
        // 账户信息
        const { value: customInfo } = computed(() => store.state._user.customerInfo)
        const googleCodeVis = computed(() => customInfo.googleId > 0)
        // 初始化数据
        let timer = null

        // 点击选择提币币种
        const selectCoinKind = (item) => {
            state.coinKind = item
            state.chainName = ''
            // 根据提币币种筛选链名称
            filterChainName()
        }
        const getGooleVerifyCode = (val) => {
            state.googleCode = val
        }
        // 点击选项链名称
        const selectChainName = (item) => {
            state.chainName = item
            if (state.address) {
                state.addressResult = checkAddressResult(state.address, state.chainName)
            }
        }

        // 获取客户提币币种和链名称
        const queryWithdrawCurrencyList = () => {
            getWithdrawCurrencyList({
                companyId: customInfo.companyId,
                customerNo: customInfo.customerNo,
                customerGroupId: customInfo.customerGroupId,
                accountId: accountId,
                tradeType: tradeType,
                country: customInfo.country,
                withdrawMethod: withdrawMethod || 'blockatm_webhook',
            }).then((res) => {
                // console.log('!!!!!!!!!!!!!!', res)
                if (res.check()) {
                    const { data } = res
                    const coinKindList = []
                    data.map((elem) => {
                        if (!coinKindList.some((v) => v.name === elem.withdrawCurrency)) {
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
            const arr = state.allList.filter((v) => v.withdrawCurrency === state.coinKind)
            arr.map((elem) => {
                chainNameList.push({ name: elem.blockchainName })
            })
            state.chainNameList = chainNameList
            if (state.chainNameList.length) state.chainName = state.chainNameList[0].name
        }

        // 点击获取验证码
        const getCode = () => {
            // 验证是否绑定手机号
            // if (!customInfo.phone) {
            //     return Dialog.confirm({
            //         title: t('withdraw.hint'),
            //         message: t('withdraw.bindPhoneHint'),
            //         confirmButtonText: t('withdraw.bindBtn'),
            //         cancelButtonText: t('withdraw.close')
            //     }).then(() => {
            //         router.push('/bindMobile')
            //     }).catch(() => {})
            // }

            // 发送验证码
            verifyCodeSend({
                bizType: customInfo?.phone ? 'SMS_LOGINED_VERIFICATION_CODE' : 'EMAIL_LOGINED_VERIFICATION_CODE',
            }).then((res) => {
                state.verifyInfo = res.data
                state.countDown = 59
                timer = setInterval(() => {
                    state.countDown -= 1
                    if (state.countDown === 0) {
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
            if (!state.code) {
                return Toast({ message: t('common.inputVerifyCode') })
            }
            if (!verifyInfo.token) {
                return Toast(t('common.getVerifyCode'))
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
                phoneArea: customInfo.phoneArea,
                sendToken: verifyInfo.token,
                googleCode: state.googleCode,
            }).then((res) => {
                if (res.check()) {
                    Dialog.alert({
                        message: t('withdraw.successHint'),
                        // teleport: '#walletAddBox',
                    }).then(() => {
                        if (withdrawMethod) {
                            // tradeType, accountId, coin, withdrawMethod
                            // router.replace({ name: 'RegKyc', query: { }})
                            router.push(`/order/withdraw?accountIds=${accountId}&currencys=${coin}&tradeTypes=${tradeType}`)
                        } else {
                            router.go(-1)
                        }
                    })
                    // Toast.success(t('withdraw.successHint'))
                } else {
                    Toast(res.msg)
                }
            })
        }

        const handleBack = () => {
            router.go(-1)
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
            handleBack,
            checkAddressFormat,
        }
    },
}
</script>

<style lang="scss">
.icon-box-popper {
    display: none !important;
}
</style>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
:deep(.van-overlay) {
    z-index: 3000 !important;
}

:deep(.van-dialog) {
    z-index: 3000 !important;
}

:deep(.el-dialog__body) {
    // height:720px
}
.leftTop {
    display: flex;
    justify-content: space-between;
    padding: 24px 0;
    .select-box {
        width: remFree(336px);
        font-size: remFree(22px);
        color: var(--textColor);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        & > div {
            width: 100%;
            height: remFree(78px);
            margin-top: remFree(20px);
            font-size: remFree(24px);
        }
        .select-title-box {
            height: auto;
            display: flex;
            align-items: center;
            margin-top: 0;
            .new-box {
                margin-left: 10px;
                padding: 1px 10px;
                background-color: var(--primary);
                border-radius: 4px;
                & > span {
                    font-size: 14px;
                    line-height: 14px;
                    color: #fff;
                }
            }
        }
        .select-title-p {
            font-weight: 600;
            color: var(--textColor);
        }
    }
}
.icon-box {
    :deep(.select-trigger) {
        height: 100%;
    }
    :deep(.el-input) {
        height: 100%;
        font-size: inherit;
        line-height: 100% !important;
    }
    :deep(.el-input__inner) {
        height: 100%;
        border: none !important;
        background: transparent;
    }
    :deep(.el-input__suffix) {
        display: flex;
        align-items: center;
    }
    :deep(.input__wrapper) {
        box-shadow: 0 0 0 1px #f0f0f0;
    }
}
.currencyOption {
    display: flex;
    align-items: center;
    height: 40px;
    line-height: 2;
    & > span {
        font-size: remFree(20px);
        margin-left: 10px;
        color: var(--textColor);
    }
}
.layout-add {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--bgColor);
}
.container-add {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    background: var(--contentColor);
    padding: 0 24px 24px;
    @include scroll-bar-vertical;
}
.wa-ipt {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    margin-bottom: 24px;
    &.custom{
      margin-bottom: 14px;

    }
    & > p > span {
        color: var(--primary);
    }
    &>.error{
      color:var(--primary);
      font-size:12px;
      line-height:12px;
      margin-top:5px;
      min-height:12px;
    }
    & > div {
        flex: initial;
        width: 100%;
        height: 48px;
        border-radius: 8px;
        border: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        padding: 8px 16px;
        margin-top: 12px;
        & > input {
            flex: 1;
            padding-right: 16px;
        }
        & > i {
            font-size: 16px;
            cursor: pointer;
        }
        & > span {
            margin-left: 16px;
            color: #4069f2;
            line-height: 1.5;
        }
    }
    .form-item {
        .van-cell:after {
            border-bottom: none !important;
        }
    }
}
.footer-btn {
    width: 100%;
    height: 48px;
    background: var(--primary);
    color: var(--contentColor);
    font-size: 17px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 4px;
    margin-top: 12px;
    flex-shrink: 0;
    &:active {
        opacity: 0.85;
    }
}
</style>
