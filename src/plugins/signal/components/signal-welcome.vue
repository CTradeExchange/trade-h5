<template>
    <div v-if='isPC' class='signal-welcome'>
        <h3 class='title'>
            {{ title }}
        </h3>
        <text-ellipsis :collapse-text="$t('common.shrink')" :content='text' :expand-text="$t('common.expand')" :rows='2' />
    </div>
    <div v-if='!isPC && !hideSignalWelcome' class='signal-welcome'>
        <h3 class='title'>
            {{ title }}
        </h3>
        <div class='text'>
            <p>
                <span>{{ text }}</span>
                <span class='not' @click='onNotTip'>
                    {{ $t('common.noLongerPrompt') }}
                </span>
            </p>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { localGet, localSet } from '@/utils/util'
import textEllipsis from '@/components/textEllipsis/index.js'
import SignalEvent from '@/plugins/signal/utils/signalEvent'

export default {
    components: {
        textEllipsis
    },
    setup () {
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            title: t('signal.subscribe.welcomeTitle'),
            text: t('signal.subscribe.welcomeDesc'),
            // 是否隐藏信号欢迎语
            hideSignalWelcome: !!localGet('hideSignalWelcome')
        })

        // 点击不再提示
        const onNotTip = () => {
            state.hideSignalWelcome = true
            localSet('hideSignalWelcome', true)
            // dom变化，触发信号列表顶部刷新事件
            SignalEvent.emit('hideSignalWelcome', true)
        }

        return {
            ...toRefs(state),
            isPC: window.isPC,
            onNotTip
        }
    }
}
</script>

<style lang="scss" scoped>
.signal-welcome {
    margin: 30px auto;
    .title {
        font-weight: normal;
        color: var(--mainColor);
    }
    .text {
        color: var(--color);
    }
}
.h5 {
    .signal-welcome {
        margin: 0 auto;
        padding: 15px;
        .title {
            font-size: 18px;
        }
        .text {
            margin-top: 6px;
            font-size: 13px;
        }
        .not {
            text-decoration: underline;
            text-underline-offset: 3px;
            color: var(--primary);
        }
    }
}
.pc {
    .signal-welcome {
        .title {
            font-size: 26px;
        }
        &:deep {
            .text-ellipsis {
                margin-top: 12px;
                font-size: 16px;
            }
        }
    }
}
</style>
