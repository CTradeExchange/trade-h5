<template>
    <van-popup
        v-model:show='visible'
        class='signalDetailPopup'
        :close-on-click-overlay='false'
        round
    >
        <LayoutTop
            :custom-back='true'
            icon='icon_icon_close_big'
            :title='$t("signal.detail.detail")'
            @back='handleBack'
        />
        <div class='signal-detail-popup'>
            <div class='list'>
                <div class='item'>
                    <van-cell :title='$t("signal.detail.time")' title-class='title-time' :value='signalTime' />
                    <van-cell class='van-cell-primary' :title="$t('signal.detail.indicatorName')" :value='signal.i' />
                    <van-cell :title="$t('signal.timePeriod')" :value='period' />
                    <van-cell class='van-cell-primary' :title="$t('signal.detail.signal')" :value='signalName' />
                    <van-cell :title="$t('signal.detail.desc')" :value='signalDesc' />
                    <van-cell :title="$t('signal.detail.signalSource')" value='Quotap' />
                </div>
                <a class='more-item' :href='teachURL' target='_blank'>
                    <span class='more-text'>
                        {{ $t('signal.detail.indicatorTeach', [signal.i]) }}
                    </span>
                    <van-icon name='arrow' />
                </a>
            </div>
            <div class='list'>
                <div class='item'>
                    <van-cell :title="$t('signal.tradeRecommend')">
                        <template #value>
                            <signal-direction :direction='signal.a' />
                        </template>
                    </van-cell>
                    <van-cell :title="$t('signal.detail.product')">
                        <template #value>
                            <symbol-icon class='symbol-icon' :symbol-code='signal.sy' />
                        </template>
                    </van-cell>
                    <van-cell :title="$t('signal.detail.triggerPrice')" :value='pr' />
                    <van-cell :title="$t('signal.detail.newPrice')" :value="product.cur_price || '--'" :value-class='product.cur_color' />
                    <van-cell :title="$t('signal.detail.productType')" :value='productCateName' />
                    <van-cell title='&nbsp;' />
                </div>
                <div class='more-item' @click='handleMore'>
                    <span class='more-text'>
                        {{ $t('signal.detail.moreSignal', [signal.i]) }}
                    </span>
                    <van-icon name='arrow' />
                </div>
            </div>
        </div>
    </van-popup>
</template>

<script>
import { Dialog } from 'vant'
import { useI18n } from 'vue-i18n'
import { computed, toRefs, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { useStore } from 'vuex'
import { toFixed } from '@/utils/calculation'
import signalHook from '@/plugins/signal/hooks/signal'
import symbolIcon from '@/plugins/signal/components/product-icon.vue'
import signalDirection from '@/plugins/signal/components/signal-direction.vue'
export default {
    components: {
        symbolIcon,
        signalDirection
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        signal: {
            type: Object,
            default: () => {}
        }
    },
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })

        const visible = computed({
            get: () => props.modelValue,
            set: val => emit('update:modelValue', val)
        })
        const state = reactive({
            signalTime: '',
        })

        const { jumpSignalTab, getAcademyIndicatorUrl } = signalHook()

        const signalName = computed(() => {
            return store.getters['_signal/getSignalName'](props.signal.si)
        })
        const signalDesc = computed(() => {
            return store.getters['_signal/getSignalDesc'](props.signal)
        })
        const action = computed(() => {
            return store.getters['_signal/getActionName'](props.signal.a)
        })
        const period = computed(() => {
            return store.getters['_signal/getPeriodName'](props.signal.pe)
        })
        const product = computed(() => {
            return store.getters['_signal/getSignalProduct'](props.signal?.sy)
        })
        const productCateName = computed(() => {
            return store.getters['_signal/getProductCateName'](props.signal?.sc)
        })
        const pr = computed(() => {
            // 触发价
            const { symbolDigits } = product.value
            return (props.signal.pr && symbolDigits) ? toFixed(props.signal.pr, symbolDigits) : props.signal.pr
        })

        const validSymbol = computed(() => {
            return store.getters['_quote/userProductCategoryKeys']
        })

        const goTrade = (direction) => {
            if (product.value?.symbolKey && validSymbol.value.includes(product.value.symbolKey)) {
                router.push({
                    path: '/order',
                    query: {
                        symbolId: product.value.symbolId,
                        direction,
                        tradeType: product.value.tradeType
                    }
                })
            } else {
                Dialog.alert({
                    message: t('signal.noTradeProduct')
                })
            }
        }

        const handleMore = () => {
            jumpSignalTab('indicator', {
                i: props.signal.i
            })
        }

        const getDetail = () => {
            state.signalTime = dayjs(props.signal.t).format('YYYY-MM-DD HH:mm:ss')
        }

        // 指标教学
        const teachURL = computed(() => getAcademyIndicatorUrl(props.signal?.i))

        const handleBack = () => {
            visible.value = false
        }

        onMounted(() => {
            getDetail()
        })

        onUnmounted(() => {
            handleBack()
        })

        return {
            ...toRefs(state),
            visible,
            signalName,
            signalDesc,
            action,
            period,
            product,
            productCateName,
            pr,
            handleMore,
            goTrade,
            handleBack,
            teachURL,
        }
    }
}
</script>

<style lang="scss" scoped>
.signalDetailPopup {
    .topNav {
        height: 1.4rem;
        :deep {
            .backIcon {
                display: block;
                margin-top: 4px;
                margin-left: 10px;
            }
        }
    }
}
.signal-detail-popup {
    width: 680px;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    padding: 14px 20px;
    background: var(--contentColor);
    .list {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        &:last-child {
            border-left: 1px solid var(--lineColor);
        }
        .title-time {
            flex: 0.7;
        }
        .more-item {
            display: flex;
            margin: 20px;
            padding: 10px 15px;
            border: 1px solid var(--lineColor);
            cursor: pointer;
            border-radius: 4px;
            color: var(--minoColor);
            span {
                flex: 1;
            }
            &:hover {
                border-color: var(--placeholdColor);
            }
        }
    }
    :deep {
        .van-cell {
            &:hover {
                background-color: var(--bgColor);
            }
            .van-cell__value {
                font-weight: bold;
            }
        }
        .van-cell-primary {
            .van-cell__value {
                color: var(--primary);
            }
        }
        .symbol-name {
            justify-content: flex-end;
        }
        .title-time {
            flex: 0.7;
        }
    }
}
</style>
