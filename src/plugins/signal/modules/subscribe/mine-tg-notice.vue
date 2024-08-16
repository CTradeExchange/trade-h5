<template>
    <div v-if='visible && !isScribeTg' class='mine-notice'>
        <div class='box'>
            <i class='icon icon_dengpao'></i>
            <p>
                <span>{{ $t('signal.subscribe.mineNotice') }}</span>
                <tg-subscribe data-ga-signal='signal_signalsMySignalsHint_tgWord_cl' :is-link='true'>
                    {{ $t('signal.subscribe.mineNotice1') }}
                </tg-subscribe>
                <span>{{ $t('signal.subscribe.mineNotice2') }}</span>
                <span class='nolonger' @click='handleNolonger'>
                    {{ $t('common.noLongerPrompt') }}
                </span>
            </p>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import { useStore } from 'vuex'
import { localGet, localSet } from '@/utils/util'
import tgSubscribe from './tg-subscribe.vue'

export default {
    components: {
        tgSubscribe
    },
    setup (props) {
        const store = useStore()
        const state = reactive({
            visible: localGet('showMineTgNotice') !== '1', // 是否显示我的信号
            isScribeTg: false // 是否已经订阅tg
        })

        const handleNolonger = () => {
            state.visible = false
            localSet('showMineTgNotice', '1')
        }

        onMounted(() => {
            state.isScribeTg = store.state._signal.tgInfo.link
        })

        return {
            handleNolonger,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>

@keyframes warn {
    0% {
        transform: scale(0.5);
        opacity: 1;
    }
    30% {
        opacity: 1;
    }
    100% {
        transform: scale(1.4);
        opacity: 0;
    }
}
.mine-notice {
    background: var(--contentColor);
    padding: 8px;
    @media screen and (max-width: 768px) {
        margin-bottom: 0;
    }
    .box {
        padding: 8px;
        border-radius: 4px;
        background: var(--primaryBg);
        display: flex;
        align-items: center;
        flex: 1;
        .icon {
            margin-right: 4px;
            font-size: 22px;
            color: var(--primary);
            animation: warn 1.5s ease-out 0s 2;
            align-self: flex-start;
            height: 24px;
        }
        p {
            word-break: break-word;
            line-height: 24px;
        }
        :deep {
            .tg-subscribe-link {
                color: var(--primary);
                text-decoration: underline;
                text-underline-offset: 4px;
                cursor: pointer;
            }
        }
    }
    .nolonger {
        text-decoration: underline;
        text-underline-offset: 4px;
        cursor: pointer;
    }
}

</style>
