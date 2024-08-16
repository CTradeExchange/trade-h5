<template>
    <div class='page-wrap'>
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
        <p class='tips'>
            {{ $t('register.tips1') }}
        </p>
        <p class='tips '>
            {{ $t('register.tips2_1') }}
        </p>
        <p class='tips '>
            {{ $t('register.tips3') }}
        </p>
        <!--
        <p class='tips'>
            {{ $t('register.tips1') }}
        </p>
        -->
        <div class='btnBox'>
            <button class='highBtn' @click='toExperience'>
                {{ $t('register.letsGo') }}
            </button>
            <!-- <button class='highBtn' @click='toDesposit'>
                {{ $t('register.goDeposit') }}
            </button> -->
        </div>
        <p class='tips tips1'>
            {{ $t('register.tips4') }}
        </p>
    </div>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getDevice, setToken, sessionGet, sessionRemove } from '@/utils/util'
export default {
    setup () {
        const RegisterData = JSON.parse(sessionStorage.getItem('RegisterData')) ?? {}
        const RegisterParams = JSON.parse(sessionStorage.getItem('RegisterParams')) ?? {}
        const store = useStore()
        const router = useRouter()
        const inletRegister = JSON.parse(sessionGet('inletRegister'))
        const onceState = reactive({
            accountNo: RegisterData.data?.customerNo
        })
        window.dataLayer = window.dataLayer || []
        if (typeof window.dataLayer !== 'undefined') {
            // Push the data to dataLayer
            window.dataLayer.push({
                'event': 'detect_user_registerSuccess',
                'account_Number': RegisterData.data?.customerNo,
            })
        }
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
            if (!inletRegister) {
                router.replace('/register')
            }
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
.page-wrap {
    height: 100%;
    background-color: var(--bgColor);
    .registerSuccess {
        padding: rem(80px) rem(40px) rem(58px) rem(40px);
        .icon {
            color: var(--success);
            font-size: rem(120px);
            text-align: center;
        }
        .container{
            text-align: center;
            h2 {
                margin: rem(15px) 0 rem(20px);
                color: var(--mainColor);
                text-align: center;
                font-family: Poppins;
                font-size: rem(52px);
                font-style: normal;
                font-weight: 600;
                line-height: normal;
            }
        }

        .accountNo {
            color: var(--primary);
        }
    }
    .tips {
        color: var(--mainColor);
        font-family: Poppins;
        font-size: 13px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        font-size: rem(26px);
        text-align: start;
        padding: 0 rem(40px);
    }

    .tips1{
      color: #B5B5B5;
    }
    .btnBox {
        display: flex;
        justify-content: center;
        margin: rem(40px) rem(40px) rem(48px) rem(40px);
        text-align: center;
        .btn,
        .highBtn {
            @include active();
            flex: 1;
            height: rem(100px);
            color: var(--primary);
            line-height: 1.5;
            background: #F3F8FE;
            border-radius: rem(10px);
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
