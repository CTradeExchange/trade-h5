<template>
    <div class='module-case module-case-padding'>
        <titleSection
            v-if='showTitle'
            :desc="$t('signal.activity.indicatorDesc')"
            :title="$t('signal.activity.indicator')"
            @handleMore='handleMore'
        />
        <skeleton v-if='skeletonShow' />
        <none-data v-else-if='list.length === 0' />
        <div v-else ref='chartRef' class='indicators-dom'></div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { toRefs, reactive, onMounted, onUnmounted, ref, watch, computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import skeleton from '@/plugins/signal/components/skeleton'
import titleSection from '@/plugins/signal/components/title-section'
import { analyzeQuotapIndicator } from '@/plugins/signal/api'
import signalHook from '@/plugins/signal/hooks/signal'
import { indicatorActivity } from '@/plugins/signal/hooks/charts'
import noneData from '@/plugins/signal/components/none-data.vue'

export default {
    components: {
        titleSection,
        skeleton,
        noneData
    },
    props: {
        showTitle: {
            type: Boolean,
            default: true,
        },
        limit: {
            type: Number,
            default: 6
        }
    },
    setup (props) {
        const router = useRouter()
        const store = useStore()
        const chartRef = ref(null)
        const { initChart } = indicatorActivity()
        const { jumpSignalTab } = signalHook()

        const state = reactive({
            // 定时器
            timer: null,
            skeletonShow: true,
            list: [],
        })

        const style = computed(() => store.state.style)

        const loadData = () => {
            return analyzeQuotapIndicator({
                type: 'i'
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

        // 点击柱状图跳转
        const handleItem = (i) => {
            jumpSignalTab('indicator', { i })
        }

        // 监听数据 初始化echart
        watch([() => style.value, () => state.list], async () => {
            const data = {
                yData: [],
                xData: []
            }
            state.list.forEach((item) => {
                data.xData.push(item.i)
                data.yData.push(item.times)
            })
            // 避免echart读取不到宽度
            await nextTick()
            if (data.xData.length) {
                initChart(chartRef.value, [data.xData, data.yData], {
                    handleItem
                })
            }
        })

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
            router.push('/signalFeatured?type=i')
        }

        return {
            ...toRefs(state),
            chartRef,
            handleMore,
        }
    }
}
</script>

<style lang='scss' scoped>
@import '@/plugins/signal/style/signal.scss';
.indicators-dom {
    width: 100%;
    height: 275px;
}
.module-case {
    .none-data {
        padding-top: 48px;
        height: 320px;
    }
}
</style>
