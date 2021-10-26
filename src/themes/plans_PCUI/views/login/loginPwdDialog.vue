<template>
    <van-popup v-model:show='visible' :close-on-click-overlay='false' :style="{ 'border-radius':'8px','background-color': $style.bgColor }">
        <section class='popContainer'>
            <a class='noTip' href='javascript:;' @click='noTip'>
                {{ $t('login.neverTip') }}
            </a>
            <div class='containerBox'>
                <p class='iconPwd'>
                    <span class='icon_password'></span>
                </p>
                <p class='tipContent'>
                    {{ $t('login.pwdTips') }}
                </p>
            </div>
            <div class='btnBox'>
                <button class='btn' @click='loginPwdSet'>
                    {{ $t('login.goSet') }}
                </button>
                <button class='btn muted' @click='loginPwdSetNext'>
                    {{ $t('login.nextTime') }}
                </button>
            </div>
        </section>
    </van-popup>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { localSet } from '@/utils/util'
import LoginHook from './loginHook'
export default {
    props: {
        modelValue: {
            type: Boolean,
            default: true
        },
    },
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const router = useRouter()
        const { loginToPath } = LoginHook()

        const visible = computed({
            get: () => props.modelValue,
            set: val => emit('update:modelValue', val)
        })

        // 设置登录密码
        const loginPwdSet = () => {
            emit('update:modelValue', false)
            router.push({
                name: 'SetLoginPwd'
            })
        }
        // 下次设置登录密码
        const loginPwdSetNext = () => {
            emit('update:modelValue', false)
            loginToPath()
        }
        // 设置登录密码不再提醒
        const noTip = () => {
            localSet('loginPwdIgnore', true)
            emit('update:modelValue', false)
            loginToPath()
        }

        return {
            visible,
            loginPwdSet,
            loginPwdSetNext,
            noTip,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

</style>
