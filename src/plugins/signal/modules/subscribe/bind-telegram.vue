<template>
    <div class='bind-telegram p-5'>
        <div class='text-center text-lg'>
            <van-icon class='text-warn' name='warning-o' size='40' />
            <div class='text-xl font-bold my-3 text-center'>
                {{ $t('signal.followTelegram.importantReminder') }}
            </div>
        </div>
        <div class='text-center text-sm pt-3 pb-4'>
            <p>{{ $t('signal.followTelegram.notBind') }}</p>
        </div>
        <div class='option relative'>
            <div ref='telegramRef' class='telegram'></div>
            <van-button block :loading='state.loading' :loading-text="$t('signal.subscribe.goOn')" type='primary'>
                <span>{{ $t('signal.subscribe.goOn') }}</span>
            </van-button>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { bindThirdAccount } from '@/api/user'

const telegramRef = ref(null)
const store = useStore()
const state = reactive({
    userId: '',
    thirdSource: '',
    loading: false,
})

const appId = computed(() => store.state._base.thirdLoginConfig.find((el) => el.thirdSource === 'telegram')?.clientId)

const onTelegramAuth = (res, extra) => {
    state.loading = true
    bindThirdAccount({
        thirdIntactMsg: JSON.stringify(res),
        thirdLoginSource: 'telegram',
        thirdUserId: res.id,
    })
        .catch(() => {
            state.loading = false
        })
        .finally(() => {
            store.dispatch('_user/findThirdAccountInfo').then(res => {
                state.loading = false
            })
        })
}

const renderBtn = () => {
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://telegram.org/js/telegram-widget.js?19'
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-telegram-login', appId.value)
    script.setAttribute('data-request-access', 'write')
    window.onTelegramAuth = onTelegramAuth
    script.setAttribute('data-onauth', 'window.onTelegramAuth(user)')
    telegramRef.value && telegramRef.value.appendChild(script)
    script.onload = function () {
        const iframe = document.querySelector('iframe[src*="oauth.telegram.org"]')
        // 初始化tg组件判断
        if (iframe) {
            iframe.onload = () => {
                state.loading = false
            }
        }
    }
}

watchEffect(() => {
    if (appId.value) {
        state.loading = true
        renderBtn()
    }
})
</script>

<style scoped lang="scss">
.bind-telegram {
    .option {
        overflow: hidden;
    }
    .telegram {
        display: flex;
        justify-content: center;
        overflow: hidden;
        opacity: 0.00001;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        cursor: pointer;
        z-index: 2;
        transform: scale(2);
        :deep {
            iframe {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>
