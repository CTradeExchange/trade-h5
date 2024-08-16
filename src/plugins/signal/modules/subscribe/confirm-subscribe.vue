<template>
    <van-popup
        v-model:show='show'
        class='confirmSubscribeDialog'
        :close-on-click-overlay='false'
        closeable
        round
        teleport='body'
        @close='onClose'
    >
        <template #default>
            <p class='title'>
                <strong>{{ goOn ? $t('signal.subscribe.subscribeConfirmTitle2'): $t('signal.subscribe.subscribeConfirmTitle') }}</strong>
            </p>
            <div class='items'>
                <div class='row'>
                    <span class='label'>
                        {{ $t('signal.detail.indicatorName') }}
                    </span>
                    <span class='value primary-color'>
                        {{ payload.i }}
                    </span>
                </div>
                <div class='row'>
                    <span class='label'>
                        {{ $t('signal.timePeriod') }}
                    </span>
                    <span class='value primary-color'>
                        {{ period }}
                    </span>
                </div>
                <div class='row'>
                    <span class='label'>
                        {{ $t('signal.detail.product') }}
                    </span>
                    <span class='value'>
                        <symbol-icon class='symbol-icon primary-color' :symbol-code='payload.sy' />
                    </span>
                </div>
            </div>
            <div class='footer-desc'>
                {{ $t('signal.subscribe.subscribeConfirmDesc') }}
            </div>
            <div class='footer-block'>
                <button
                    class='btn btn-cancel'
                    @click='onClose'
                >
                    {{ $t('common.cancel') }}
                </button>
                <button
                    class='btn'
                    data-ga-signal='signal_subConfirmPopup_subBtn_cl'
                    @click='onCallback'
                >
                    {{ $t('signal.subscribe.subscribe') }}
                </button>
            </div>
        </template>
    </van-popup>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import symbolIcon from '@/plugins/signal/components/product-icon.vue'

export default {
    components: {
        symbolIcon
    },
    props: {
        payload: {
            type: Object,
            default: () => {}
        },
        goOn: Boolean, // 是否继续文案
    },
    emits: ['close', 'callback'],
    setup (props, { emit }) {
        const store = useStore()
        // state
        const state = reactive({
            // 是否显示弹窗
            show: true
        })

        const period = computed(() => {
            return store.getters['_signal/getPeriodName'](props.payload.pe)
        })

        const onClose = () => {
            state.show = false
            emit('close')
        }

        // 按钮回调
        const onCallback = () => {
            state.show = false
            emit('callback')
        }

        return {
            ...toRefs(state),
            onClose,
            onCallback,
            period
        }
    }
}
</script>

<style lang="scss">
.confirmSubscribeDialog {
    width: rem(660px);
    padding: rem(50px);
    background: var(--contentColor);
    border-radius: rem(12px);
    .primary-color {
        color: var(--primary) !important;
    }
    .title {
        display: flex;
        justify-content: center;
        margin-bottom: rem(32px);
        font-size: rem(38px);
        font-weight: bold;
        color: var(--color);
        text-align: center;
        padding: 0 15px;
    }
    .items {
        line-height: rem(42px);
        font-size: rem(28px);
        .row {
            display: flex;
            justify-content: space-between;
            .label {
                color: var(--minorColor);
            }
            .value {
                text-align: right;
                word-break: break-all;
                max-width: rem(420px);
                color: var(--color);
            }
        }
    }
    .footer-desc {
        margin: 20px 0;
        font-size: 14px;
    }
    .footer-block {
        display: flex;
        .btn {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: rem(96px);
            margin-top: rem(20px);
            font-size: rem(30px);
            border-radius: rem(10px);
            transition: ease-in-out 0.15s;
            border: 1px solid var(--primary);
            background-color: var(--primary);
            color: #FFF;
            cursor: pointer;
            &.btn-cancel {
                background-color: transparent;
                color: var(--primary);
                margin-right: 15px;
            }
        }
    }
}
.pc {
    .confirmSubscribeDialog {
        width: 420px;
    }
    &.light {
        .footer-block {
            @include hover();
        }
    }
    &.night {
        .footer-block .btn {
            &:hover {
                opacity: 0.8;
            }
        }
    }
}

</style>
