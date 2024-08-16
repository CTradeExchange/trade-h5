<template>
    <div class='tg-confirm'>
        <div class='subscribe-title'>
            <van-icon class='mr-4 cursor-pointer' name='down' style='transform: rotate(90deg)' @click='handleClose' />
            <span>
                {{ $t('signal.common.tgPush') }}
            </span>
        </div>

        <div class='px-3 pt-5 tg-confirm-container'>
            <div class='section-status'>
                <van-icon name='warning-o' size='40' />
                <div class='text-xl font-bold my-3 text-center'>
                    {{ $t('signal.followTelegram.importantReminder') }}
                </div>
            </div>
            <div class='content'>
                <p>1、{{ $t('signal.subscribe.tgNotice1') }}</p>
                <img
                    :src="
                        isPC
                            ? '/images/signal/telegram-subscribe-bot.png?date=1231231231'
                            : '/images/signal/telegram-subscribe-bot-mobile.png?date=1231231231'
                    "
                />
                <p>2、{{ $t('signal.subscribe.tgNotice2') }}</p>
            </div>
        </div>
        <div class='option'>
            <van-button block :loading='loading' :loading-text="$t('signal.subscribe.goOn')" type='primary' @click='handleJump'>
                <span>{{ $t('signal.subscribe.goOn') }}</span>
            </van-button>
        </div>
    </div>
</template>

<script>
import { computed, onMounted, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { Toast } from 'vant'

export default {
    emits: ['close'],
    setup (props, { emit }) {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })

        // tg绑定信息
        const tgInfo = computed(() => {
            return store.state._signal.tgInfo
        })
        const isPC = window.isPC

        const state = reactive({
            loading: false,
            link: '', // 可用链接
        })

        onMounted(() => {
            state.loading = true
            store
                .dispatch('_signal/queryBotInfo')
                .then((res) => {
                    state.loading = false
                    if (res?.check() && res.data?.link) {
                        state.link = res.data.link
                    }
                })
                .catch(async (err) => {
                    // 重复绑定
                    if (err.data?.message === 'E007') {
                        await store.dispatch('_signal/queryTGInfo')
                    } else {
                        Toast(t('signal.subscribeMsg.E000'))
                    }
                    state.loading = false
                })
        })

        // 跳转专属tg bot
        const handleJump = () => {
            if (tgInfo.value.link || state.link) {
                window.open(tgInfo.value.link || state.link)
                emit('close')
            } else {
                Toast(t('signal.subscribeMsg.E000'))
            }
        }

        const handleClose = () => {
            emit('close')
        }

        return {
            isPC,
            tgInfo,
            handleJump,
            handleClose,
            ...toRefs(state),
        }
    },
}
</script>

<style lang="scss" scoped>
.tg-confirm {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    background-color: var(--contentColor);
    z-index: 2;
    .tg-confirm-container {
        overflow-y: auto;
        @include scroll-bar-vertical;
    }
    .subscribe-title {
        font-size: 20px;
        font-weight: 700;
        color: var(--color);
        padding: 16px 12px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--lineColor);
        background-color: var(--contentColor);
        top: 0;
        right: 0;
        left: 0;
        z-index: 2;
    }
    .section-status {
        text-align: center;
        font-size: 18px;
        .van-icon {
            color: var(--primary);
        }
        p {
            margin: 12px 0 16px;
        }
    }
    .content {
        p {
            font-size: 13px;
            color: var(--minorcolor);
            line-height: 24px;
            margin-bottom: 5px;
        }
        img {
            max-width: 100%;
            margin: 10px 0;
            display: block;
        }
    }
    .option {
        margin: 20px 12px;
        :deep {
            .van-loading {
                margin-right: 3px;
            }
        }
    }
}
.tg-subscribe-link {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
.tg-subscribe-span {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    .icon_telegram_outline {
        line-height: normal;
        font-size: 20px;
        margin-right: 3px;
    }
}
.h5 {
    .tg-confirm {
        position: fixed;
        .tg-confirm-container {
            height: 100%;
        }
    }
    .subscribe-title {
        border: none;
        position: fixed;
    }
    .section-status {
        margin-top: 55px;
    }
    .content {
        margin-bottom: 100px;
    }
    .option {
        position: fixed;
        bottom: 0;
        width: 100%;
        left: 0;
        padding: 12px;
        background: var(--contentColor);
        margin: 0;
    }
}
</style>
