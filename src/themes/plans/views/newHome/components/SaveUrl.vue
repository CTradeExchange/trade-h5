<template>
    <div v-if="downLoadShow" class="save-url-body">
        <div class="save-url-box">
            <van-icon
                name="clear"
                color="#C3C3C3"
                size="16px"
                :style="{ marginTop: '-2px' }"
                @click="close"
            />
            <img src="/images/logo-t.png" alt="">
            <div>
                <p>{{ $t("common.downLoadTitle") }}</p>
                <p>{{ $t("common.downLoadLabel") }}</p>
            </div>
            <div class="add_button_tohome" @click="openUrl">{{ $t("common.downLoadBtn") }}</div>
        </div>
        <Loading :show='loading' />
    </div>
</template>

<script>
import { Toast } from 'vant';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { firebaseAnalytics } from '@/utils/firebase';
import { reactive, toRefs, computed, watch } from 'vue';
import { getIosOrAndroid, openUrlSchemes, parseJSON, sessionGet, sessionSet } from '@/utils/util';
export default {
    setup() {
        const store = useStore()
        const { env } = getIosOrAndroid()
        // const local = sessionGet('pwaHide')
        const local = sessionGet('downLoadHide')
        const { t } = useI18n({ useScope: 'global' })
        const deferredPrompt = window['deferredPrompt']

        const openState = computed(() => {
            const config = store.state._base.newsSysConfig || []
            const { Value } = config && config.find((o) => o.Key === 'webDrainageApp') || {}
            const { state } = parseJSON(Value) || {}
            return state === 1
        })

        const state = reactive({
            show: (deferredPrompt || env === 'ios') && !local,
            downLoadShow: !local,
            loading: false
        })

        watch(() => openState.value, (val) => {
            state.downLoadShow = val
        }, {
            immediate: true
        })

        const toDesk = () => {
            if (!deferredPrompt) {
                if (env !== 'ios') return

            }
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    Toast(t("bank.submitSuccessTips"))
                }
                // window['deferredPrompt'] = null;
            });
        }

        const openUrl = () => {
            state.loading = true
            openUrlSchemes();
            firebaseAnalytics('click_smart_app_banner')
            setTimeout(() => {
                state.loading = false
                if (!document.hidden){
                    if (env === 'ios') {
                        location.href = 'https://apps.apple.com/app/headline-net/id1639509598'
                    } else {
                        location.href = 'https://play.google.com/store/apps/details?id=com.mc900.mc900&pli=1'
                    }
                }
            }, 3000)
        }

        const close = () => {
            // sessionSet('pwaHide', Date.now())
            sessionSet('downLoadHide', Date.now())
            state.show = false
            state.downLoadShow = false
        }

        return {
            env,
            toDesk,
            close,
            openUrl,
            deferredPrompt,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scope>
@import '@/sass/mixin.scss';
.save-url-body {
    width: 100%;
    height: rem(110px);
    position: relative;
}
.save-url-box {
    width: 100%;
    height: rem(110px);
    position: fixed;
    z-index: 1;
    left: 0;
    background: #fff;
    border-bottom: 1px solid #F3F3F3;
    display: flex;
    align-items: center;
    padding: 0 rem(24px);
    overflow: hidden;
    & > img {
        width: rem(72px);
        height: rem(72px);
        margin: 0 rem(24px);
    }
    & > div:first-of-type {
        flex: 1;
        width: 100%;
        height: rem(72px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: rem(24px);
        color: #000000;
        line-height: 1.5;
        padding-right: rem(24px);
        & > p {
            @include ellipsisLn(1);
        }
        & > p:first-of-type {
            font-size: rem(28px);
            font-weight: bold;
        }
    }
    & > div:last-of-type {
        width: rem(112px);
        height: rem(62px);
        border-radius: rem(16px);
        background: var(--primary);
        font-size: rem(28px);
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
.add_button_tohome {
    display: none;
}
</style>
