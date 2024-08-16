<template>
    <Loading :show='state.loading' />
    <LayoutTop />
    <div class='withdrawfundPwdPage'>
        <div class='content'>
            <img alt='' src='../../../themes/plans/images/assets/fundPwd.png' />
            <div class='title'>
                {{ $t('withdrawCoin.tips.tips10') }}
            </div>
            <div class='titleBox'>
                <span>*</span>{{ $t('withdrawCoin.fundPassword') }}
            </div>
            <div class='pwd-oper'>
                <InputComp v-model='state.pwd' clear :label="$t('common.inputFundPwd')" :max-length='6' pwd />
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

            <div v-if='h5_withdrawfundInfo' class='formBox'>
                <div class='item'>
                    <div class='itemTitle'>
                        {{ $t('withdrawMoney.moneyName') }}
                    </div>
                    <div class='amount'>
                        {{ h5_withdrawfundInfo?.coinCount }}&nbsp;{{ h5_withdrawfundInfo?.coinKind }}
                    </div>
                </div>
                <div class='item'>
                    <div class='itemTitle'>
                        {{ $t('withdrawCoin.service') }}
                    </div>
                    <div class='amount'>
                        {{ h5_withdrawfundInfo?.serviceCount }}&nbsp;{{ h5_withdrawfundInfo?.coinKind }}
                    </div>
                </div>
                <div class='item'>
                    <div class='itemTitle'>
                        {{ $t('withdrawCoin.predict') }}
                    </div>
                    <div class='coinAmount'>
                        {{ h5_withdrawfundInfo?.arriveCount }}&nbsp;{{ h5_withdrawfundInfo?.coinKind }}
                    </div>
                </div>
            </div>
        </div>
        <div class='footer'>
            <van-button :class="['footer-btn']" :disabled='!state.pwd||(googleCodeVis && !state.googleCode)' @click='submit'>
                <span>{{ $t('withdraw.confirm') }}</span>
            </van-button>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'

import InputComp from '@/components/form/input'
import googleVerifyCode from '@/themeCommon/components/googleVerifyCode.vue'

const googleVerifyCodeComp = ref(null)
const store = useStore()
const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const state = reactive({
    loading: false,
    pwd: '',
    googleCode: '',
    // 提现页面需要展示的数据
    withdraw: {}
})
const customInfo = computed(() => store.state._user.customerInfo)
const h5_withdrawfundInfo = computed(() => store.state._user.h5_withdrawfundInfo)
const googleCodeVis = computed(() => customInfo.value.googleId > 0)

const getGooleVerifyCode = val => {
    state.googleCode = val
}

const submit = () => {
    if (!state.pwd) {
        return Toast(t('common.inputFundPwd'))
    }
    if (googleCodeVis.value && !state.googleCode) {
        return Toast(t('common.inputGoogleCode'))
    }
    store.commit('_user/Update_withdrawfundPwd', { pwd: state.pwd, googleCode: state.googleCode })
    router.go(-1)
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

.withdrawfundPwdPage{
    height: 100vh;
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

</style>
