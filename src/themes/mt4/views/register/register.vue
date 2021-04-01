<template>
    <div class='register'>
        <Top back :menu='false' />
        <a class='loginBtn' href='javascript:;' @click="$router.replace('/login')">
            已有账号
        </a>
        <div class='banner'>
            <img alt='' src='https://www.blazaintl.com/platformimages/mainpage_banner11a.png' srcset='' />
        </div>
        <form class='form'>
            <div class='cell of-1px-bottom'>
                <VueSelect v-model='currency' :actions='currencyList' value='value' />
            </div>
            <!-- <div class='cell openType'>
                <div :class="{ 'openTypeAcitve':openType==='mobile' }"><a href='javascript:;' @click="openType='mobile'">手机号</a></div>
                <div :class="{ 'openTypeAcitve':openType==='email' }"><a href='javascript:;' @click="openType='email'">邮箱</a></div>
            </div> -->
            <div v-if="openType === 'mobile'" class='cell'>
                <MobileInput v-model.trim='mobile' v-model:zone='zone' placeholder='手机号' @blur='onMobileBlur' />
            </div>
            <div v-else class='cell'>
                <InputComp v-model='email' clear label='邮箱' />
            </div>
            <div class='cell'>
                <CheckCode v-model='checkCode' clear label='验证码' @verifyCodeSend='verifyCodeSendHandler' />
            </div>
            <div class='cell'>
                <van-checkbox v-model='protocol' shape='square'>
                    开户注意事项
                </van-checkbox>
            </div>
            <div class='cell'>
                <van-button
                    block
                    class='registerBtn'
                    :color='$store.state.style.primary'
                    :disabled='loading'
                    type='primary'
                    @click='registerHandler'
                >
                    提交
                </van-button>
            </div>
        </form>
        <div class='switchType'>
            <a v-if="openType === 'email'" href='javascript:;' @click="openType = 'mobile'">
                手机号注册
            </a>
            <a v-else href='javascript:;' @click="openType = 'email'">
                邮箱注册
            </a>
        </div>
        <Loading :show='loading' />
    </div>
</template>

<script>
import Schema from 'async-validator'
import Top from '@m/layout/top'
import VueSelect from '@m/components/select'
import Loading from '@m/components/loading'
import CheckCode from '@m/components/form/checkCode'
import InputComp from '@m/components/form/input'
import MobileInput from '@m/components/form/mobileInput'
import { getDevice, getQueryVariable } from '@/utils/util'
import { register, openAccount } from '@/api/user'
import { verifyCodeSend } from '@/api/base'
import { useStore } from 'vuex'
import { reactive, toRefs, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import Rule, { checkCustomerExistRule } from './rule'
export default {
    components: {
        Top,
        MobileInput,
        InputComp,
        CheckCode,
        Loading,
        VueSelect
    },
    setup () {
        let delayer = null
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            options: [{ country: 'Canada', code: 'CA' }],
            zone: '+86',
            loading: false,
            checkCode: '',
            mobile: '',
            openType: 'mobile', // mobile 手机号开户， email 邮箱开户
            accountType: 'CFD账户',
            accountTypeList: [{ name: 'CFD账户' }],
            currency: 'USD',
            currencyList: [
                { name: '美元账户', value: 'USD' },
                { name: '人民币', value: 'CNY' }
            ],
            protocol: true
        })
        let token = ''
        store.dispatch('getListByParentCode')
        // 手机号输入框离开焦点
        const onMobileBlur = () => {
            const validator = new Schema(checkCustomerExistRule)
            const params = {
                type: state.openType === 'email' ? 1 : 2, // 1邮箱，2手机号码，3客户账号
                loginName: state.openType === 'email' ? state.email : state.mobile,
                phoneArea: state.openType === 'mobile' ? String(state.zone) : '',
            }
            delayer = setTimeout(() => {
                validator.validate(params, { first: true }, (errors, fields) => {
                    if (errors) {
                        Toast(errors[0].message)
                    }
                })
            }, 100)
        }
        const registerSubmit = (params) => {
            state.loading = true
            register(params).finally(() => {
                state.loading = false
            }).then(res => {
                // state.loading = false
                if (res.check()) {
                    // 注册成功
                    sessionStorage.setItem('RegisterParams', JSON.stringify({ ...params, openType: state.openType }))
                    sessionStorage.setItem('RegisterData', JSON.stringify(res))
                    router.replace({ name: 'RegisterSuccess' })
                } else {
                    res.toast()
                }
            })
        }
        // 提交注册
        const registerHandler = () => {
            clearTimeout(delayer)
            const params = {
                type: state.openType === 'email' ? 1 : 2,
                loginName: state.openType === 'email' ? state.email : state.mobile,
                phoneArea: state.openType === 'mobile' ? String(state.zone) : '',
                registerSource: getDevice(),
                verifyCode: state.checkCode,
                currency: state.currency,
                tradeType: 1,
                token,
                utmSource: getQueryVariable('utm_source'),
                utmMedium: getQueryVariable('utm_medium'),
                utmCampaign: getQueryVariable('utm_campaign'),
                utmContent: getQueryVariable('utm_content'),
                utmTerm: getQueryVariable('utm_term'),
            }
            const validator = new Schema(Rule)
            validator.validate(params, { first: true }, (errors, fields) => {
                if (errors) {
                    return Toast(errors[0].message)
                }
                registerSubmit(params)
            })
        }
        // 发送验证码
        const verifyCodeSendHandler = (callback) => {
            const verifyParams = {
                type: state.openType === 'mobile' ? 2 : 1,
                loginName: state.openType === 'mobile' ? state.mobile : state.email,
                phoneArea: state.openType === 'mobile' ? String(state.zone) : undefined,
            }
            const validator = new Schema(checkCustomerExistRule)
            validator.validate(verifyParams).then(res => {
                const params = {
                    bizType: state.openType === 'mobile' ? 'SMS_REGISTER_VERIFICATION_CODE' : 'EMAIL_REGISTER_VERIFICATION_CODE',
                    toUser: state.openType === 'mobile' ? String(state.zone * 1) + ' ' + state.mobile : state.email,
                }
                verifyCodeSend(params).then(res => {
                    if (res.check()) {
                        token = res.data.token
                        callback && callback()
                    }
                })
            }).catch(({ errors, fields }) => {
                if (errors) {
                    Toast(errors[0].message)
                }
            })
        }
        return {
            ...toRefs(state),
            registerHandler,
            onMobileBlur,
            verifyCodeSendHandler,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.register {
    position: relative;
    height: 100%;
}
.loginBtn {
    position: absolute;
    top: 0;
    right: rem(30px);
    height: rem(90px);
    color: var(--white);
    line-height: rem(90px);
}
.banner {
    margin-top: rem(20px);
    padding: 0 rem(30px);
    img {
        display: block;
        width: 100%;
    }
}
.cell {
    display: flex;
    justify-content: space-between;
    margin: rem(40px) rem(30px);
    div {
        flex: 1;
    }
    .zone {
        flex: none;
        width: rem(200px);
        margin-right: rem(20px);
    }
    &.openType {
        justify-content: center;
        &>div {
            flex: none;
            margin: 0 1em;
        }
        a {
            color: var(--color);
        }
    }
    .openTypeAcitve {
        a {
            color: var(--primary);
        }
    }
}
.openTypeWrapper {
    :deep(.van-tabs__nav--card) {
        margin: 0;
        overflow: hidden;
        border-radius: rem(10px);
    }
}
.input {
    display: block;
    width: 100%;
    height: rem(75px);
    padding: 0 5px;
    font-size: rem(30px);
    line-height: 1;
    border: 1px solid var(--bdColor);
    border-radius: rem(10px);
}
.registerBtn {
    margin-top: rem(80px);
    border-radius: rem(50px);
}
.switchType {
    margin-top: rem(30px);
    text-align: center;
    a {
        color: var(--primary);
    }
}
</style>
