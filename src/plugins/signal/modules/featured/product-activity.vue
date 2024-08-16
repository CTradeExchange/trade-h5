<template>
    <div class='module-case'>
        <titleSection
            v-if='showTitle'
            :desc='$t("signal.activity.productDesc")'
            :title="$t('signal.activity.product')"
            @handleMore='handleMore'
        />
        <div class='activity-list'>
            <div class='signal-item signal-item-th'>
                <div class='col col-th'>
                    {{ $t('signal.common.product') }}
                </div>
                <div class='col col-th'>
                    {{ $t('signal.signalTime') }}
                </div>
                <div class='col col-th'>
                    {{ $t('signal.tradeRecommend') }}
                </div>
            </div>
            <skeleton v-if='skeletonShow' />
            <div
                v-for='(item, index) in list'
                v-else-if='list.length'
                :key='index'
                class='signal-item'
                @click='handleClick(item)'
            >
                <div class='col'>
                    <product-icon :symbol-code='item.sy' />
                </div>
                <div class='col'>
                    <span>{{ $t('signal.common.time', [item.times]) }}</span>
                </div>
                <div class='col'>
                    <signal-direction :direction='item.a' />
                    <van-icon class='arrow' name='arrow' />
                </div>
            </div>
            <none-data v-else />
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { toRefs, reactive, onMounted, onUnmounted } from 'vue'
import titleSection from '@/plugins/signal/components/title-section'
import noneData from '@/plugins/signal/components/none-data'
import skeleton from '@/plugins/signal/components/skeleton'
import { analyzeQuotapIndicator } from '@/plugins/signal/api'
import { getRelativeTime } from '@/plugins/signal/utils/getRelativeTime'
import { Dialog } from 'vant'
import signalDirection from '@/plugins/signal/components/signal-direction.vue'
import productIcon from '@/plugins/signal/components/product-icon.vue'

export default {
    components: {
        titleSection,
        skeleton,
        noneData,
        signalDirection,
        productIcon
    },
    props: {
        showTitle: {
            type: Boolean,
            default: true,
        },
        // 信号长度
        limit: {
            type: Number,
            default: 5,
        }
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })

        const state = reactive({
            // 定时器
            timer: null,
            skeletonShow: true,
            list: [],
        })

        const loadData = () => {
            return analyzeQuotapIndicator({
                type: 'sy'
            }).then((res) => {
                state.skeletonShow = false
                if (res.check()) {
                    const list = (res.data.items || [])
                    state.list = props.limit ? list.slice(0, props.limit) : list
                }
            }).catch(() => {
                state.skeletonShow = false
            })
        }

        const poll = () => {
            loadData().finally(() => {
                state.timer = setTimeout(() => {
                    clearTimeout(state.timer)
                    poll()
                }, 60000)
            })
        }

        onMounted(() => {
            poll()
        })

        onUnmounted(() => {
            state.timer && clearTimeout(state.timer)
        })

        const handleMore = () => {
            router.push('/signalFeatured?type=sy')
        }
        const handleClick = (item) => {
            const product = store.getters['_signal/getSignalProduct'](item.sy)
            if (product?.symbolKey) {
                router.push({ path: window.isPC ? '/order' : '/product', query: { symbolId: product.symbolId, tradeType: product.tradeType } })
            } else {
                Dialog.alert({
                    message: t('signal.noTradeProduct')
                })
            }
        }

        return {
            ...toRefs(state),
            handleMore,
            handleClick,
            getRelativeTime,
            isPC: window.isPC
        }
    }
}
</script>

<style lang='scss' scoped>
@import '@/plugins/signal/style/signal.scss';
.activity-list {
    .signal-item {
        .col {
            &:nth-child(2) {
                justify-content: center;
            }
        }
    }
}
</style>
