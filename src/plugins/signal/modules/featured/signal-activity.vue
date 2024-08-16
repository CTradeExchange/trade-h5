<template>
    <div class='module-case'>
        <titleSection
            v-if='showTitle'
            :desc='$t("signal.activity.signalDesc")'
            :title='$t("signal.activity.signal")'
            @handleMore='handleMore'
        />
        <div class='activity-list'>
            <div class='signal-item signal-item-th'>
                <div class='col col-th'>
                    {{ $t('signal.detail.signal') }}
                </div>
                <div class='col col-th'>
                    {{ $t('signal.coverProduct') }}
                </div>
                <div class='col col-th'>
                    {{ $t('signal.signalTime') }}
                </div>
            </div>
            <skeleton v-if='skeletonShow' />
            <div v-for='(item, index) in list' v-else-if='list.length' :key='index' class='signal-item' @click='handleClick(item)'>
                <div class='col'>
                    <span>{{ getSignalName(item.si) }}</span>
                </div>
                <div class='col'>
                    <span>{{ $t('signal.productsNumber', [item.count]) }}</span>
                </div>
                <div class='col'>
                    <span>
                        <span>{{ $t('signal.common.time', [item.times]) }}</span>
                    </span>
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
import { toRefs, reactive, onMounted, onUnmounted } from 'vue'
import titleSection from '@/plugins/signal/components/title-section'
import noneData from '@/plugins/signal/components/none-data'
import skeleton from '@/plugins/signal/components/skeleton'
import { analyzeQuotapIndicator } from '@/plugins/signal/api'
import signalHook from '@/plugins/signal/hooks/signal'

export default {
    components: {
        titleSection,
        skeleton,
        noneData,
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
        const { jumpSignalTab } = signalHook()

        const state = reactive({
            // 定时器
            timer: null,
            skeletonShow: true,
            list: [],
        })

        const loadData = () => {
            return analyzeQuotapIndicator({
                type: 'si'
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
            router.push('/signalFeatured?type=si')
        }
        const handleClick = (item) => {
            jumpSignalTab('signal', {
                si: item.si
            })
        }
        // 获取信号名称
        const getSignalName = (si) => {
            return store.getters['_signal/getSignalName'](si)
        }

        return {
            ...toRefs(state),
            handleMore,
            handleClick,
            getSignalName
        }
    }
}
</script>

<style lang='scss' scoped>
@import '@/plugins/signal/style/signal.scss';
.activity-list {
    .col {
        &:nth-child(2) {
            flex: 0.8;
        }
    }
}

@media (min-width: 768px) {
    .activity-list {
        .col {
            &:nth-child(2) {
                flex: 1;
                justify-content: center;
            }
        }
    }
}
</style>
