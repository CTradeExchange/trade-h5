<template>
    <el-dialog
        v-model='fundPassword'
        align-center
        class='fp-dialog'
        :modal='false'
        :show-close='false'
        :width='520'
    >
        <template #header>
            <LayoutTop :custom-back='true' @back='backHandle' />
        </template>
        <div class='fp-body'>
            <img alt='' src='../../../../assets/newPCUI/withdraw.png' />
            <h3>{{ $t('withdrawCoin.tips.tips10') }}</h3>
            <p>{{ $t("common.fundPwd") }}</p>
            <div class='fp-input'>
                <input v-model='pwd' autocomplete='off' :max-length='6' :placeholder="`${$t('common.fundPwd')}${Number(customInfo.assertPassStatus) === 1 ? `(${$t('common.noSet')})` : ''}`" :type='inputType' />
                <el-icon @click="inputType = inputType === 'password' ? 'text' : 'password'">
                    <Hide v-if="inputType === 'password'" />
                    <View v-else />
                </el-icon>
                <span @click='handleSkip'>
                    {{ Number(customInfo.assertPassStatus) === 1 ? $t("login.goSet") : $t("login.forgotFundPwd") }}
                </span>
            </div>
            <p v-if='googleCodeVis'>
                {{ $t("common.googleCode") }}
            </p>
            <div v-if='googleCodeVis' class='fp-input'>
                <googleVerifyCode
                    v-if='googleCodeVis'
                    @getGooleVerifyCode='getGooleVerifyCode'
                />
            </div>
            <div class='fp-list'>
                <p>
                    <span>{{ $t("withdrawMoney.moneyName") }}</span>
                    <span>{{ coinCount }} {{ inCurrency }}</span>
                </p>
                <p>
                    <span>{{ $t("withdrawCoin.service") }}</span>
                    <span>{{ serviceCount }} {{ inCurrency }}</span>
                </p>
                <p>
                    <span>{{ $t("withdrawCoin.predict") }}</span>
                    <span class='fp-span'>
                        {{ arriveCount }} {{ inCurrency }}
                    </span>
                </p>
            </div>
            <div :class="['fp-btn',!pwd||(googleCodeVis && !googleCode)? 'disabled':'']" @click='handleSubmit'>
                {{ $t("withdraw.confirm") }}
            </div>
        </div>
    </el-dialog>
</template>

<script>
import googleVerifyCode from '@/themeCommon/components/googleVerifyCode.vue'
import { computed, reactive, toRefs, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'

export default {
    components: { googleVerifyCode },
    props: {
        inCurrency: {
            type: String,
            default: ''
        },
        coinKind: {
            type: String,
            default: ''
        },
        coinCount: {
            type: String,
            default: ''
        },
        serviceCount: {
            type: String,
            default: ''
        },
        arriveCount: {
            type: String,
            default: ''
        },
        minusCount: {
            type: String,
            default: ''
        },
        open: {
            type: Boolean,
            default: false
        }
    },
    setup (props, { emit }) {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })

        // 账户信息
        const { value: customInfo } = computed(
            () => store.state._user.customerInfo
        )
        const googleCodeVis = computed(() => customInfo.googleId > 0)
        const state = reactive({
            fundPassword: false,
            inputType: 'password',
            googleCode: '',
            pwd: ''
        })

        watch(() => props.open, (val) => {
            state.fundPassword = val
        })

        const handleSkip = () => {
            if (Number(customInfo.assertPassStatus) === 1) {
                router.push(route.path.replace('withdraw', 'setFundPwd'))
            } else {
                router.push({
                    name: 'Forgot',
                    query: {
                        type: 'fund'
                    }
                })
            }
        }

        const getGooleVerifyCode = (val) => {
            state.googleCode = val
        }

        const handleSubmit = () => {
            if (!state.pwd) {
                // return Toast(t('common.inputFundPwd'))
                return
            }
            if (googleCodeVis.value && !state.googleCode) {
                // return Toast(t('common.inputGoogleCode'))
                return
            }
            // state.fundPassword = false
            emit('submit', { pw: state.pwd, code: state.googleCode })
            state.pwd = ''
            state.googleCode = ''
        }

        const backHandle = () => {
            state.fundPassword = false
            emit('update:pwOpen', false)
        }

        return {
            customInfo,
            handleSkip,
            googleCodeVis,
            handleSubmit,
            getGooleVerifyCode,
            backHandle,
          ...toRefs(state)
        }
    },
}
</script>

<style lang="scss" scope>
.fp-dialog {
  height: 676px;
  display: flex;
  flex-direction: column;
  .el-dialog__header {
      padding: 0;
      padding-bottom: 0;
      margin-right: 0;
  }
  .el-dialog__body {
      width: 100%;
      height: calc(100% - 56px);
      overflow-y: overlay;
      padding: 36px;
      @include scroll-bar-vertical;
  }
  .fp-input {
      display: flex;
      border-radius: 8px;
      align-items: center;
      margin-top: 8px;
      padding: 8px 24px 8px 16px;
      overflow: hidden;
      & > input {
          flex: 1;
          height: 100%;
          font-size: 14px;
      }
      & > i {
          margin-right: 24px;
          font-size: 16px;
          color: #999999;
          cursor: pointer;
          &:hover {
              color: var(--primaryText);
          }
      }
      & > span {
          font-size: 14px;
          color: #4069F2;
          cursor: pointer;
      }
      .form-item {
          margin-bottom: 0 !important;
          border-bottom: none !important;
          .van-cell:after {
              border-bottom: none;
          }
      }
  }
  .fp-body {
      width: 448px;
      height: auto;
      min-height: 482px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 auto;

      & > img {
          width: 64px;
          height: 64px;
      }

      & > h3 {
          font-size: 20px;
          margin: 18px 0 12px;
      }

      & > p {
          width: 100%;
          font-size: 16px;
          color: var(--primaryText);
          text-align: left;
          margin: 24px 0 0;
      }
      .fp-input {
          width: 100%;
          height: 45px;
          border: 1px solid #F0F0F0;
      }
      .fp-list {
          width: 100%;
          display: flex;
          flex-direction: column;
          font-size: 14px;
          margin-top: 32px;
          & > p {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 6px 0;
              & > span:last-of-type {
                  font-size: 16px;
                  font-weight: 500;
              }
          }
          .fp-span {
              font-size: 20px !important;
              font-weight: 600 !important;
              color: var(--primary);
          }
      }
  }
  .fp-btn {
      width: 448px;
      height: 48px;
      background: var(--primary);
      color: var(--contentColor);
      font-size: 17px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      border-radius: 4px;
      position: absolute;
      bottom: 32px;
      &.disabled{
          background: #F7F7F7;
          cursor: not-allowed;
          color:#BDBDBD
      }
      &:active {
          opacity: 0.85;
      }
  }
}
</style>
