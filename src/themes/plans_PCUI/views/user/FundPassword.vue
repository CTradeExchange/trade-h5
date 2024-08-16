<template>
    <div class='fp-body'>
        <img alt='' src='../../../../assets/newPCUI/withdraw.png' />
        <h3>{{ $t('withdrawCoin.tips.tips10') }}</h3>
        <p>{{ $t("common.fundPwd") }}</p>
        <div class='fp-input'>
            <input v-model='password' autocomplete='off' :max-length='6' :placeholder="`${$t('common.fundPwd')}${Number(customInfo.assertPassStatus) === 1 ? `(${$t('common.noSet')})` : ''}`" :type='inputType' />
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
                <span>{{ coinCount }} {{ coinKind }}</span>
            </p>
            <p>
                <span>{{ $t("withdrawCoin.service") }}</span>
                <span>{{ serviceCount }} {{ coinKind }}</span>
            </p>
            <p>
                <span>{{ $t("withdrawCoin.predict") }}</span>
                <span class='fp-span'>
                    {{ arriveCount }} {{ coinKind }}
                </span>
            </p>
        </div>
        <div :class="['fp-btn',!password||(googleCodeVis && !googleCode)? 'disabled':'']" @click='handleSubmit'>
            {{ $t("withdraw.confirm") }}
        </div>
    </div>
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
        pwd: {
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
            password: ''
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
            // console.log('验证码---->', val)
            state.googleCode = val
            emit('update:googleCode', val)
        }

        const handleSubmit = () => {
            if (!state.password) {
                return
            }
            if (googleCodeVis.value && !state.googleCode) {
                return
            }
            emit('submit')
        }
        watch(() => state.password, (val) => {
            // console.log('变化了------->', val)
            emit('update:pwd', val)
        })

        return {
            customInfo,
            handleSkip,
            googleCodeVis,
            handleSubmit,
            getGooleVerifyCode,
            ...toRefs(state)
        }
    },
}
</script>

<style lang="scss" scope>

    .fp-input {
        display: flex;
        border-radius: 8px;
        align-items: center;
        margin-top: 8px;
        padding-left: 10px;
        padding-right: 10px;
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
        width: 100%;
        height: auto;
        height: 676px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 auto;
        padding: 30px 24px 8px 16px;
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
</style>
