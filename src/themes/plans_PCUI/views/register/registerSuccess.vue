<template>
    <router-view />
    <div class='pageWrap'>
        <topNav class='header' />
        <div class='container'>
            <div class='content'>
                <section class='registerSuccess'>
                    <div class='icon'>
                        <img alt='' src='/images/registerSuccess.png' />
                    </div>
                    <div class='container'>
                        <h2>{{ $t('register.openSuccess') }}</h2>
                        <p>
                            {{ $t('common.customerNo') + $t('common.colon') }}<span class='accountNo'>
                                {{ accountNo }}
                            </span>
                        </p>
                    </div>
                </section>
                <p class='tips' style='margin-top: 29px;'>
                    {{ $t('register.tips1') }}
                </p>
                <p class='tips tips1'>
                    {{ $t('register.tips2_1') }}
                </p>
                <p class='tips tips1'>
                    {{ $t('register.tips3') }}
                </p>
                <div class='btnBox'>
                    <button class='highBtn' @click='toExperience'>
                        {{ $t('register.letsGo') }}
                    </button>
                    <!-- <button class='highBtn' @click='toDesposit'>
                {{ $t('register.goDeposit') }}
            </button> -->
                </div>
                <p class='tips tips1' style='color: #B5B5B5;'>
                    {{ $t('register.tips4') }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs, onMounted, mounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getDevice, setToken, sessionGet, sessionRemove } from '@/utils/util'
import topNav from '@planspc/layout/topNav'
import { toast } from 'vue3-toastify'

export default {
    name: 'RegisterSuccess',
    components: {
        topNav,
    },
    setup () {
        const RegisterData = JSON.parse(sessionStorage.getItem('RegisterData')) ?? {}
        const RegisterParams = JSON.parse(sessionStorage.getItem('RegisterParams')) ?? {}
        const store = useStore()
        const router = useRouter()
        const onceState = reactive({
            accountNo: RegisterData.data?.customerNo
        })
        const inletRegister = JSON.parse(sessionGet('inletRegister'))

        /* window.dataLayer = window.dataLayer || []
        if (typeof window.dataLayer !== 'undefined') {
            // const isEmail = this.customerInfo.email && this.customerInfo.email.includes('@')
            // const signUpMethod = isEmail ? 'email' : 'phone'
            // Push the data to dataLayer
            window.dataLayer.push({
                'event': 'detect_user_registerSuccess',
                'account_Number': RegisterData.data?.customerNo,
                // 'Sign_up_method': signUpMethod,
                // 'Sign_up_phone': this.customInfo.phone,
                // 'Sign_up_email': this.customerInfo.email,
            })
        } */

        const token = RegisterData.data?.token
        if (token) setToken(token)
        const toExperience = () => {
            sessionRemove('inletRegister')
            return router.replace({ name: 'Home' })
        }
        const toDesposit = () => {
            sessionRemove('inletRegister')
            return router.replace({ name: 'Deposit' })
        }
        const toAsset = () => {
            sessionRemove('inletRegister')
            return router.replace({ name: 'Assets' })
        }
        onMounted(() => {
            // if (!inletRegister) {
            //     router.replace('/register')
            // }
            toast.success('注册成功了')
        })

        return {
            ...onceState,
            toExperience,
            toDesposit,
            toAsset
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    position: relative;
    display: flex;
    flex-flow: column;
    height: 100%;
    background: var(--assistColor);
    .container {
        display: flex;
        justify-content: center;
        overflow: auto;
        .content {
            height: max-content;
            margin: 40px 0;
            width: 520px;
            padding: 60px;
            background-color: var(--contentColor);
            border-radius: 10px;
        }
    }
    .registerSuccess {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .container {
            flex-direction: column;
        }
        .icon {
            img{
                width: 89px;
                height: 89px;
            }

        }
        h2 {
            margin-top: 39px;
            margin-bottom: 24px;
            text-align: center;
            font-family: Poppins;
            font-size: 32px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
        }
        .accountNo {
            color: var(--primary);
        }
    }
    .tips {
        font-family: Poppins;
        font-size: 13px;
        font-style: normal;
        line-height: normal;
        color: var(--mainColor);
        text-align: start;
    }

    .tips1{
      text-align: justify !important;
    }
    .btnBox {
        display: flex;
        margin: 24px 0;
        text-align: center;
        .btn,
        .highBtn {
            @include active();
            flex: 1;
            height: 48px;
            color: var(--primary);
            line-height: 1.5;
            background: #F3F8FE;
            border-radius: 10px;
            cursor: pointer;
        }
        .highBtn {
            color: #FFF;
            background: var(--primary);
        }
        .smallRow {
            font-size: rem(20px);
            i {
                color: #FFFC00;
            }
        }
    }
}

</style>
