<template>
    <div class='page-wrap'>
        <LayoutTop :back='true'>
            <p>{{ customerInfo.googleId>0 ? $t('cRoute.MFA_close'):$t('cRoute.MFA_bind') }}</p>
        </LayoutTop>
        <div class='formBox'>
            <div v-if='customerInfo.phone' class='cell'>
                <p class='label'>
                    将发送验证码到您的{{ customerInfo.phone }}
                </p>
                <van-field
                    v-model='verifyCodeSMS'
                    center
                    clearable
                >
                    <template #button>
                        <van-button size='small' type='primary' @click='verifyCodeSendHanlder'>
                            发送验证码
                        </van-button>
                    </template>
                </van-field>
            </div>

            <div v-if='customerInfo.email' class='cell'>
                <p class='label'>
                    将发送验证码到您的{{ customerInfo.email }}
                </p>
                <van-field
                    v-model='verifyCodeEmail'
                    center
                    clearable
                >
                    <template #button>
                        <van-button size='small' type='primary'>
                            发送验证码
                        </van-button>
                    </template>
                </van-field>
            </div>

            <div class='cell'>
                <p class='label'>
                    请输入谷歌验证码
                </p>
                <van-field
                    ref='googleVerifyCodeRef'
                    v-model='googleCode'
                    center
                    clearable
                >
                    <template #button>
                        <a class='copyBtn' href='javascript:;' @click='pasteHanlder'>
                            粘贴
                        </a>
                    </template>
                </van-field>
            </div>
        </div>

        <div class='footerBox'>
            <van-button block type='primary' @click='bindHanlder'>
                {{ customerInfo.googleId>0 ? $t('cRoute.MFA_close'):$t('cRoute.MFA_bind') }}
            </van-button>
        </div>
    </div>
</template>

<script >
import { computed, reactive, ref, toRefs } from 'vue'
import { Dialog, Toast } from 'vant'
import { useStore } from 'vuex'
import Schema from 'async-validator'
import BindDataRules from './bindDataRules'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { verifyCodeSend } from '@/api/base'
import { enableOrForbidMFA } from '@/api/user'

export default {
    setup () {
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const { id } = route.query
        const state = reactive({
            googleCode: '', // 谷歌验证码
            verifyCodeSMS: '', // 手机验证码
            sendTokenSMS: '', // 手机验证码发送票据
            verifyCodeEmail: '', // 邮箱验证码
            sendTokenEmail: '', // 邮箱验证码发送票据
        })

        const googleVerifyCodeRef = ref(null)
        const customerInfo = computed(() => store.state._user.customerInfo)
        const descriptorRules = BindDataRules(t, customerInfo)
        const validator = new Schema(descriptorRules)
        console.log(customerInfo.value)

        // 发送短信验证码
        const verifyCodeSendHanlder = () => {
            const pramas = {
                bizType: 'SMS_LOGINED_VERIFICATION_CODE'
            }
            verifyCodeSend(pramas).then(res => {
                console.log(res)
                if (res.check()) {
                    state.sendTokenSMS = res.data.token
                }
            })
        }

        // 效验绑定参数
        const validatPramas = (pramas) => {
            return new Promise((resolve, reject) => {
                validator.validate(pramas, (errors, fields) => {
                    if (errors) {
                        console.log(errors, fields)
                        Toast(errors[0].message)
                        return resolve(false)
                    }
                    resolve(true)
                })
            })
        }

        // 绑定谷歌验证码
        const bindHanlder = () => {
            const googleId = customerInfo.value.googleId > 0 ? customerInfo.value.googleId : parseInt(id)
            const pramas = {
                type: customerInfo.value.googleId > 0 ? 2 : 1, // 1开启，2关闭
                googleCode: state.googleCode, // String 必填 谷歌验证码
                googleId: googleId, // Long 必填 谷歌Id
                verifyCodeSMS: state.verifyCodeSMS, // String 非必填 手机验证码
                sendTokenSMS: state.sendTokenSMS, // String 非必填 手机验证码发送票据
                verifyCodeEmail: state.verifyCodeEmail, // String 非必填 邮箱验证码
                sendTokenEmail: state.sendTokenEmail, // String 非必填 邮箱验证码发送票据
            }
            validatPramas(pramas).then(res => {
                if (!res) return false
                enableOrForbidMFA(pramas).then(res => {
                    console.log(res)
                    if (res.check()) {
                        Dialog.alert({
                            message: customerInfo.value.googleId > 0 ? '关闭成功' : '绑定成功',
                        })
                        store.dispatch('_user/findCustomerInfo', false)
                        state.googleCode = ''
                        state.verifyCodeSMS = ''
                        state.sendTokenSMS = ''
                        state.verifyCodeEmail = ''
                        state.sendTokenEmail = ''
                    }
                })
            })
            console.log('bindHanlder')
        }

        // 自动粘贴谷歌验证码
        const pasteHanlder = async () => {
            if (!navigator.clipboard) Toast('您的浏览器不支持使用该功能')
            googleVerifyCodeRef.value.focus()
            const text = await navigator.clipboard.readText()
            console.log(text)
            state.googleCode = text
        }

        return {
            ...toRefs(state),
            verifyCodeSendHanlder,
            customerInfo,
            googleVerifyCodeRef,
            pasteHanlder,
            bindHanlder,
        }
    }
}

</script>

<style lang="scss" scoped>
.page-wrap {
    width: 100%;
    height: 100%;
    margin-top: rem(110px);
    overflow: auto;
    // background: var(--contentColor);

    .formBox{
        margin: rem(30px);
        .cell{
            margin-bottom: rem(30px);
        }
        .van-cell{
            padding: 0 0 0 rem(20px);
        }
        .label{
            padding-bottom: rem(20px);
        }
        .copyBtn{
            display: block;
            height: rem(66px);
            line-height: rem(66px);
            width: rem(150px);
            color: var(--primary);
            text-align: center;
        }
    }
    .footerBox{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
    }
}
</style>
